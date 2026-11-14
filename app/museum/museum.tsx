'use client';

import Image from 'next/image';
import { preload } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import type { Destination, SceneInput, SceneStatus } from './scene';
import MissionDialog from './mission-dialog';
import LanguageSettings from './language-settings';
import { museumCopy, type Language } from './languages';
import { missionIds, missions, type MissionId } from './missions';
import { odometerSources, routes, routeSources } from './routes';
import styles from './museum.module.css';

export default function Museum() {
  const markers = useRef<Partial<Record<MissionId, HTMLButtonElement>>>({});
  const [selectedMission, setSelectedMission] = useState<MissionId>('lunokhod');
  const dialog = useRef<HTMLDialogElement>(null);
  const rotation = useRef<HTMLDivElement>(null);
  const [closing, setClosing] = useState(false);
  // Counts story openings so the route replays each time one opens.
  const [routeRun, setRouteRun] = useState(0);
  const sky = useRef<HTMLDivElement>(null);
  const explore = useRef<HTMLElement>(null);
  const finale = useRef<HTMLElement>(null);
  const input = useRef<SceneInput>({ destination: 'moon', moon: 0, mars: Math.PI * 0.43, dragging: false, hovering: false, resumeAt: 0, mission: null, missionCovered: false });
  const drag = useRef<{ id: number; x: number } | null>(null);
  const [destination, setDestination] = useState<Destination>('moon');
  const [status, setStatus] = useState<SceneStatus>({ moon: 'loading', mars: 'loading', earth: 'loading' });
  const [unavailable, setUnavailable] = useState(false);
  const [language, setLanguage] = useState<Language>('ru');
  const copy = museumCopy[language];
  const nextDestination = destination === 'moon' ? 'mars' : 'moon';

  useEffect(() => {
    try {
      const saved = localStorage.getItem('tmas-language');
      if (saved === 'ru' || saved === 'en' || saved === 'tg') {
        setLanguage(saved);
        document.documentElement.lang = saved;
      }
    } catch {
      // The selector still works with storage disabled.
    }
    return () => { document.documentElement.lang = 'ru'; };
  }, []);

  function changeLanguage(next: Language) {
    setLanguage(next);
    document.documentElement.lang = next;
    try {
      localStorage.setItem('tmas-language', next);
    } catch {
      // The selection still applies for this visit.
    }

  }

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
    };
  }, []);

  function rotate(delta: number) {
    input.current[input.current.destination] += delta;
    input.current.resumeAt = performance.now() + 3000;
  }

  useEffect(() => {
    for (const mission of Object.values(missions)) {
      if (mission.world === destination) preload(mission.image, { as: 'image' });
    }
  }, [destination]);

  // Pause the idle spin while a point is under the pointer or focused,
  // so the target stays still long enough to be clicked.
  // The release is delayed: while the globe coasts to a stop the point can
  // drift out from under the cursor and back, and that must not restart the spin.
  const releaseTimer = useRef<number>(0);

  function holdRotation() {
    window.clearTimeout(releaseTimer.current);
    input.current.hovering = true;
  }

  function releaseRotation() {
    window.clearTimeout(releaseTimer.current);
    releaseTimer.current = window.setTimeout(() => {
      input.current.hovering = false;
      input.current.resumeAt = performance.now() + 400;
    }, 350);
  }

  function openMission(id: MissionId) {
    if (!dialog.current || dialog.current.open) return;
    setSelectedMission(id);
    setRouteRun((count) => count + 1);
    // The marker hides on open, so its pointerleave may never fire.
    window.clearTimeout(releaseTimer.current);
    input.current.hovering = false;
    input.current.mission = id;
    dialog.current.showModal();
    // showModal focuses the first button, which would show a focus ring after a click.
    dialog.current.focus({ preventScroll: true });
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
      <LanguageSettings language={language} onChange={changeLanguage} />
      <MissionDialog mission={missions[selectedMission]} route={routes[selectedMission]} routeSource={routeSources[selectedMission]} odometerSource={odometerSources[selectedMission]} routeRun={routeRun} language={language} onLanguageChange={changeLanguage} dialog={dialog} closing={closing} onClose={closeMission} onReveal={() => { input.current.missionCovered = true; }} onExit={finishMission} />
      {missionIds.map((id) => {
        const name = missions[id].copy[language].name;
        return (
          <button key={id} ref={(element) => {
            if (element) markers.current[id] = element;
            else delete markers.current[id];
          }} hidden className={styles.marker} onClick={() => openMission(id)} aria-label={name}
            onPointerEnter={holdRotation} onPointerLeave={releaseRotation}
            onFocus={holdRotation} onBlur={releaseRotation}>
            <span className={styles.markerCore} aria-hidden="true" />
            <span className={styles.markerName} aria-hidden="true">{name}</span>
          </button>
        );
      })}
      <div ref={sky} className={styles.sky} aria-hidden="true" />
      <section className={styles.hero} aria-labelledby="museum-title">
        <Image className={styles.logo} src="/tmas-logo.jpg" width={480} height={480} priority
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
          <button className={styles.next} data-next={nextDestination} onClick={() => {
            input.current.destination = nextDestination;
            setDestination(nextDestination);
          }} aria-label={`${copy.show} · ${copy[nextDestination]}`}>
            <span key={nextDestination} className={styles.nextDisc} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12h15M13.5 6.5 19 12l-5.5 5.5" />
              </svg>
            </span>
            <span className={styles.nextName} aria-hidden="true">{copy[nextDestination]}</span>
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
