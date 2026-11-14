'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import LanguageSettings from '../../museum/language-settings';
import { museumCopy } from '../../museum/languages';
import { missionIds, missions, type MissionId } from '../../museum/missions';
import type { Destination, SceneInput, SceneStatus } from '../../museum/scene';
import { useLanguage } from '../../museum/use-language';
import museumStyles from '../../museum/museum.module.css';
import { libraryCopy } from '../labels';
import styles from '../library.module.css';

export default function Globe({ initialWorld }: { initialWorld: Destination }) {
  const { language, changeLanguage } = useLanguage();
  const labels = libraryCopy[language];
  const copy = museumCopy[language];
  const router = useRouter();
  const [world, setWorld] = useState(initialWorld);
  const [status, setStatus] = useState<SceneStatus>({ moon: 'loading', mars: 'loading', earth: 'loading' });
  const [unavailable, setUnavailable] = useState(false);
  const host = useRef<HTMLDivElement>(null);
  const markers = useRef<Partial<Record<MissionId, HTMLButtonElement>>>({});
  const input = useRef<SceneInput>({
    destination: initialWorld, moon: 0, mars: Math.PI * .43,
    dragging: false, resumeAt: 0, mission: null, missionCovered: false,
  });
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

  function rotate(delta: number) {
    input.current[input.current.destination] += delta;
    input.current.resumeAt = performance.now() + 3000;
  }

  const next = world === 'moon' ? 'mars' : 'moon';

  function switchWorld(direction: -1 | 1) {
    input.current.switchDirection = direction;
    input.current.destination = next;
    setWorld(next);
    window.history.replaceState(null, '', `/library/globe?world=${next}`);
  }

  return (
    <main className={styles.globePage}>
      <header className={styles.globeHeader}>
        <Link href="/"><i className="nav-arrow nav-arrow-left" aria-hidden="true" /> {labels.home}</Link>
        <LanguageSettings language={language} onChange={changeLanguage} />
      </header>
      <div className={styles.globe}>
        <div ref={host} className={styles.globeCanvas} aria-hidden="true" />
        <div className={styles.globeDrag} tabIndex={0} role="group" aria-label={copy[world]}
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
        {missionIds.map((id) => (
          <button key={id} ref={(element) => {
            if (element) markers.current[id] = element;
            else delete markers.current[id];
          }} hidden
            className={`${museumStyles.marker} ${styles.globeMarker}`}
            aria-label={missions[id].copy[language].name}
            onClick={() => router.push(`/library/${id}`)}>
            <span className={museumStyles.markerCore} aria-hidden="true" />
            <span className={museumStyles.markerName} aria-hidden="true">{missions[id].copy[language].name}</span>
          </button>
        ))}
        <button className={`${museumStyles.next} ${styles.previousWorld}`}
          aria-label={`← ${copy.show} · ${copy[next]}`} onClick={() => switchWorld(-1)}>
          <span><i className="nav-arrow nav-arrow-left" aria-hidden="true" /></span>
        </button>
        <button className={`${museumStyles.next} ${styles.nextWorld}`}
          aria-label={`→ ${copy.show} · ${copy[next]}`} onClick={() => switchWorld(1)}>
          <span><i className="nav-arrow" aria-hidden="true" /></span>
        </button>
        <p className={styles.globeStatus} role="status">
          {unavailable ? copy.unavailable : status[world] === 'error' ? copy.error : status[world] === 'loading' ? copy.loading : copy[world]}
        </p>
      </div>
    </main>
  );
}
