'use client';

import Link from 'next/link';
import MissionDialog from '../../museum/mission-dialog';
import { useMissionDialog } from '../../museum/use-mission-dialog';
import { useEffect, useRef, useState } from 'react';
import LanguageSettings from '../../museum/language-settings';
import { museumCopy } from '../../museum/languages';
import { globeMissionIds, missions, type MissionId } from '../../museum/missions';
import type { Destination, SceneInput, SceneStatus } from '../../museum/scene';
import { useLanguage } from '../../museum/use-language';
import museumStyles from '../../museum/museum.module.css';
import { libraryCopy } from '../labels';
import styles from '../library.module.css';

const destinations = ['moon', 'mars', 'space'] as const;

export default function Globe({ initialWorld }: { initialWorld: Destination }) {
  const { language, changeLanguage } = useLanguage();
  const labels = libraryCopy[language];
  const copy = museumCopy[language];
  const [world, setWorld] = useState(initialWorld);
  const [status, setStatus] = useState<SceneStatus>({ moon: 'loading', mars: 'loading', earth: 'loading', space: 'loading' });
  const [unavailable, setUnavailable] = useState(false);
  const host = useRef<HTMLDivElement>(null);
  const markers = useRef<Partial<Record<MissionId, HTMLButtonElement>>>({});
  const input = useRef<SceneInput>({
    destination: initialWorld, moon: 0, mars: Math.PI * .43, space: 0,
    dragging: false, hovering: false, resumeAt: 0, mission: null, missionCovered: false,
  });
  const rotation = useRef<HTMLDivElement>(null);
  const { openMission, dialogProps } = useMissionDialog(input, rotation);
  const drag = useRef<{ id: number; x: number } | null>(null);

  useEffect(() => {
    const canvasHost = host.current;
    if (!canvasHost) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;

    import('../../museum/scene').then(({ mountScene }) => {
      if (disposed) return;
      cleanup = mountScene(canvasHost, null, null, input.current, markers.current, (destination, phase) => {
        setStatus((previous) => ({ ...previous, [destination]: phase }));
      });
    }).catch(() => {
      if (!disposed) setUnavailable(true);
    });

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  // Hold the idle spin while a point is under the pointer or focused, so it can be clicked.
  // The release is delayed: a coasting globe can slide the point out and back under the cursor.
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

  function open(id: MissionId) {
    // The point hides on open, so its pointerleave may never fire.
    window.clearTimeout(releaseTimer.current);
    input.current.hovering = false;
    openMission(id);
  }

  function rotate(delta: number) {
    input.current[input.current.destination] += delta;
    input.current.resumeAt = performance.now() + 3000;
  }

  const names = { moon: copy.moon, mars: copy.mars, space: labels.space };
  const index = destinations.indexOf(world);
  const previous = destinations[(index + destinations.length - 1) % destinations.length];
  const next = destinations[(index + 1) % destinations.length];

  function switchWorld(direction: -1 | 1) {
    const target = direction === 1 ? next : previous;
    input.current.switchDirection = direction;
    input.current.destination = target;
    setWorld(target);
    window.history.replaceState(null, '', `/library/globe?world=${target}`);
  }

  return (
    <main className={styles.globePage}>
      <header className={styles.globeHeader}>
        <Link href="/"><i className="nav-arrow nav-arrow-left" aria-hidden="true" /> {labels.home}</Link>
        <LanguageSettings language={language} onChange={changeLanguage} />
      </header>
      <MissionDialog {...dialogProps} language={language} onLanguageChange={changeLanguage} />
      <div className={styles.globe}>
        <div ref={host} className={styles.globeCanvas} aria-hidden="true" />
        <div ref={rotation} className={styles.globeDrag} tabIndex={0} role="group" aria-label={names[world]}
          aria-description={labels.drag}
          onKeyDown={(event) => {
            if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
            event.preventDefault();
            rotate(event.key === 'ArrowLeft' ? -.13 : .13);
          }}
          onPointerDown={(event) => {
            if (!event.isPrimary || event.button !== 0) return;
            drag.current = { id: event.pointerId, x: event.clientX };
            input.current.dragging = true;
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (drag.current?.id !== event.pointerId) return;
            rotate((event.clientX - drag.current.x) * .008);
            drag.current.x = event.clientX;
          }}
          onLostPointerCapture={() => {
            drag.current = null;
            input.current.dragging = false;
            input.current.resumeAt = performance.now() + 3000;
          }} />
        {globeMissionIds.map((id) => (
          <button key={id} ref={(element) => {
            if (element) markers.current[id] = element;
            else delete markers.current[id];
          }} hidden
            className={`${museumStyles.marker} ${styles.globeMarker}`}
            aria-label={missions[id].copy[language].name}
            onClick={() => open(id)}
            onPointerEnter={holdRotation} onPointerLeave={releaseRotation}
            onFocus={holdRotation} onBlur={releaseRotation}>
            <span className={museumStyles.markerCore} aria-hidden="true" />
            <span className={museumStyles.markerName} aria-hidden="true">{missions[id].copy[language].name}</span>
          </button>
        ))}
        <button className={`${museumStyles.next} ${styles.previousWorld}`} data-next={previous} data-side="previous"
          aria-label={`← ${copy.show} · ${names[previous]}`} onClick={() => switchWorld(-1)}>
          <span key={previous} className={museumStyles.nextDisc} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12h15M13.5 6.5 19 12l-5.5 5.5" />
            </svg>
          </span>
          <span className={museumStyles.nextName} aria-hidden="true">{names[previous]}</span>
        </button>
        <button className={`${museumStyles.next} ${styles.nextWorld}`} data-next={next} data-side="next"
          aria-label={`→ ${copy.show} · ${names[next]}`} onClick={() => switchWorld(1)}>
          <span key={next} className={museumStyles.nextDisc} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12h15M13.5 6.5 19 12l-5.5 5.5" />
            </svg>
          </span>
          <span className={museumStyles.nextName} aria-hidden="true">{names[next]}</span>
        </button>
        <p className={styles.globeStatus} role="status">
          {unavailable ? copy.unavailable : status[world] === 'error' ? copy.error : status[world] === 'loading' ? copy.loading : names[world]}
        </p>
      </div>
    </main>
  );
}
