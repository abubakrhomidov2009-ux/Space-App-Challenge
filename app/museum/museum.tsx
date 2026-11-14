'use client';

import Link from 'next/link';
import { useLanguage } from './use-language';
import { libraryCopy } from '../library/labels';
import Image from 'next/image';
import { preload } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import type { Destination, SceneInput, SceneStatus } from './scene';
import MobileMenu from './mobile-menu';
import MissionDialog from './mission-dialog';
import LanguageSettings from './language-settings';
import { museumCopy } from './languages';
import { missionIds, missions, type MissionId } from './missions';
import styles from './museum.module.css';

export default function Museum() {
  const markers = useRef<Partial<Record<MissionId, HTMLButtonElement>>>({});
  const [selectedMission, setSelectedMission] = useState<MissionId>('lunokhod');
  const dialog = useRef<HTMLDialogElement>(null);
  const rotation = useRef<HTMLDivElement>(null);
  const [photoReady, setPhotoReady] = useState(false);
  const [photoFailed, setPhotoFailed] = useState(false);
  const photoRequest = useRef<AbortController | null>(null);
  const [closing, setClosing] = useState(false);
  const sky = useRef<HTMLDivElement>(null);
  const explore = useRef<HTMLElement>(null);
  const finale = useRef<HTMLElement>(null);
  const input = useRef<SceneInput>({ destination: 'moon', moon: 0, mars: Math.PI * 0.43, dragging: false, resumeAt: 0, mission: null, missionCovered: false });
  const drag = useRef<{ id: number; x: number } | null>(null);
  const [destination, setDestination] = useState<Destination>('moon');
  const [status, setStatus] = useState<SceneStatus>({ moon: 'loading', mars: 'loading', earth: 'loading' });
  const [unavailable, setUnavailable] = useState(false);
  const { language, changeLanguage } = useLanguage();
  const copy = museumCopy[language];
  const nextDestination = destination === 'moon' ? 'mars' : 'moon';

  useEffect(() => {
    const host = sky.current;
    const gallery = explore.current;
    const ending = finale.current;
    if (!host || !gallery || !ending) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    import('./scene').then(({ mountScene }) => {
      if (cancelled) return;
      cleanup = mountScene(host, gallery, ending, input.current, markers.current, (planet, phase) => {
        setStatus((previous) => ({ ...previous, [planet]: phase }));
      });
    }).catch(() => {
      if (!cancelled) setUnavailable(true);
    });

    return () => {
      cancelled = true;
      cleanup?.();
      photoRequest.current?.abort();
    };
  }, []);

  function rotate(delta: number) {
    input.current[input.current.destination] += delta;
    input.current.resumeAt = performance.now() + 3000;
  }

  useEffect(() => {
    if (status[destination] === 'loading') return;
    for (const mission of Object.values(missions)) {
      if (mission.world === destination) preload(mission.image, { as: 'image', fetchPriority: 'low' });
    }
  }, [destination, status]);

  function openMission(id: MissionId) {
    if (!dialog.current || dialog.current.open) return;
    const request = new AbortController();
    photoRequest.current = request;
    setSelectedMission(id);
    setPhotoReady(false);
    setPhotoFailed(false);
    const photo = new window.Image();
    photo.src = missions[id].image;
    const timeout = window.setTimeout(() => reveal(false), 8000);

    function reveal(loaded: boolean) {
      window.clearTimeout(timeout);
      if (request.signal.aborted) return;
      request.abort();
      setPhotoFailed(!loaded);
      setPhotoReady(true);
    }

    request.signal.addEventListener('abort', () => window.clearTimeout(timeout), { once: true });
    void photo.decode().then(() => reveal(true), () => reveal(false));
    input.current.mission = id;
    dialog.current.showModal();
  }

  function finishMission() {
    input.current.missionCovered = false;
    input.current.mission = null;
    input.current.resumeAt = performance.now() + 3000;
    dialog.current?.close();
    setClosing(false);
    rotation.current?.focus({ preventScroll: true });
  }

  function closeMission() {
    if (closing) return;
    photoRequest.current?.abort();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finishMission();
      return;
    }
    input.current.missionCovered = false;
    input.current.mission = null;
    input.current.resumeAt = performance.now() + 3000;
    setClosing(true);
  }

  const message = unavailable
    ? copy.unavailable
    : status[destination] === 'loading'
      ? copy.loading
      : status[destination] === 'error' ? copy.error : '';

  return (
    <main className={styles.museum}>
      <header className={styles.heroNav}>
        <nav className={styles.desktopLibrary} aria-label={libraryCopy[language].navigation}>
          <Link href="/library" prefetch={false}>{libraryCopy[language].title}</Link>
          <Link href="/library/globe" prefetch={false}>{libraryCopy[language].globe}</Link>
        </nav>
        <MobileMenu language={language} />
        <LanguageSettings language={language} onChange={changeLanguage} />
      </header>
      <MissionDialog photoReady={photoReady} photoFailed={photoFailed} mission={missions[selectedMission]} language={language} onLanguageChange={changeLanguage} dialog={dialog} closing={closing} onClose={closeMission} onReveal={() => { input.current.missionCovered = true; }} onExit={finishMission} />
      {missionIds.map((id) => {
        const name = missions[id].copy[language].name;
        return (
          <button key={id} ref={(element) => {
            if (element) markers.current[id] = element;
            else delete markers.current[id];
          }} hidden className={styles.marker} onClick={() => openMission(id)} aria-label={name}>
            <span className={styles.markerCore} aria-hidden="true" />
            <span className={styles.markerName} aria-hidden="true">{name}</span>
          </button>
        );
      })}
      <div ref={sky} className={styles.sky} aria-hidden="true" />
      <section className={styles.hero} aria-labelledby="museum-title">
        <Image className={styles.logo} src="/tmas-logo.jpg" width={480} height={480} preload
          alt="TMAS — Museum of Abandoned Space" />
        <h1 id="museum-title">{copy.title}</h1>
        <p>{copy.intro}</p>
      </section>

      <section id="worlds" ref={explore} className={styles.explore} aria-labelledby="world-title">
        <div className={styles.exploreFrame}>
          <h2 id="world-title" className={styles.visuallyHidden} aria-live="polite">{copy[destination]}</h2>
          <div ref={rotation} className={styles.rotation} role="group" tabIndex={message ? -1 : 0}
            aria-label={`${copy[destination]}. ${copy.rotate}`}
            onKeyDown={(event) => {
              if (message || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return;
              event.preventDefault();
              rotate(event.key === 'ArrowLeft' ? -0.13 : 0.13);
            }}
            onPointerDown={(event) => {
              if (message || !event.isPrimary || event.button !== 0) return;
              drag.current = { id: event.pointerId, x: event.clientX };
              input.current.dragging = true;
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={(event) => {
              if (drag.current?.id !== event.pointerId) return;
              rotate((event.clientX - drag.current.x) * 0.008);
              drag.current.x = event.clientX;
            }}
            onLostPointerCapture={() => {
              drag.current = null;
              input.current.dragging = false;
              input.current.resumeAt = performance.now() + 3000;
            }}
          />
          <button className={styles.next} onClick={() => {
            input.current.destination = nextDestination;
            setDestination(nextDestination);
          }} aria-label={`${copy.show} · ${copy[nextDestination]}`}>
            <span><i className="nav-arrow" aria-hidden="true" /></span>
          </button>
          <p className={styles.hint} role="status">{message}</p>
        </div>
      </section>

      <section ref={finale} className={styles.finale} aria-labelledby="earth-title">
        <div className={styles.earthCopy}>
          <h2 id="earth-title">{copy.earthTitle}</h2>
          <p>{copy.earthStory}</p>
          {status.earth === 'error' && <p role="status">{copy.earthError}</p>}
        </div>
      </section>
    </main>
  );
}
