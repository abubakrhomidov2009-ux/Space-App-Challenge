'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { missionIds, missions, type MissionId } from '../museum/missions';
import { museumCopy } from '../museum/languages';
import type { Language } from '../museum/languages';
import type { SceneInput, SceneStatus } from '../museum/scene';
import { hubLayout, type HubWorld } from './hub-layout';
import { libraryCopy } from './labels';
import { setFog } from './fog-store';
import museumStyles from '../museum/museum.module.css';
import styles from './library-hub.module.css';

export type HubControls = { flyTo: (id: MissionId) => void };

const worlds: HubWorld[] = ['moon', 'mars', 'space'];

// The library's first screen: the three worlds, side by side. Choosing one brings it to the middle
// and opens its list. A search result brings its world forward and closes in on the site itself.
export default function LibraryHub({ language, controls }: { language: Language; controls: RefObject<HubControls | null> }) {
  const router = useRouter();
  const root = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const input = useRef<SceneInput>({
    destination: 'moon', moon: 0.4, mars: Math.PI * 0.43, space: 0.2, dragging: false, hovering: false,
    resumeAt: 0, mission: null, missionCovered: false, hub: true, focus: null, hover: null,
  });
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [status, setStatus] = useState<SceneStatus>({ moon: 'loading', mars: 'loading', earth: 'loading', space: 'loading' });
  const [busy, setBusy] = useState<{ world: HubWorld; mission?: MissionId } | null>(null);
  const points = useRef<Partial<Record<MissionId, HTMLButtonElement>>>({});
  const timers = useRef<number[]>([]);
  const pending = useRef<MissionId | null>(null);
  const labels = libraryCopy[language];
  const copy = museumCopy[language];

  useEffect(() => {
    const element = root.current;
    const sky = host.current;
    if (!element || !sky) return;
    const measure = () => setSize({ width: element.clientWidth, height: element.clientHeight });
    measure();
    const watch = new ResizeObserver(measure);
    watch.observe(element);

    let cancelled = false;
    let cleanup: (() => void) | undefined;
    import('../museum/scene').then(({ mountScene }) => {
      if (cancelled) return;
      cleanup = mountScene(sky, null, null, input.current, points.current, (world, phase) => {
        setStatus((previous) => ({ ...previous, [world]: phase }));
      });
    }).catch(() => undefined);

    return () => {
      cancelled = true;
      watch.disconnect();
      cleanup?.();
      for (const timer of timers.current) window.clearTimeout(timer);
    };
  }, []);

  const later = useCallback((callback: () => void, delay: number) => {
    timers.current.push(window.setTimeout(callback, delay));
  }, []);

  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function openWorld(world: HubWorld) {
    if (busy) return;
    const href = `/library/${world}`;
    router.prefetch(href);
    if (reducedMotion()) {
      router.push(href);
      return;
    }
    input.current.focus = world;
    input.current.hover = null;
    setBusy({ world });
    later(() => setFog('close', world), 300);
    later(() => router.push(href), 960);
  }

  const flyTo = useCallback((id: MissionId) => {
    const world = missions[id].world as HubWorld;
    const href = `/library/${id}`;
    router.prefetch(href);
    if (reducedMotion()) {
      router.push(href);
      return;
    }
    input.current.hover = null;
    setBusy({ world, mission: id });
    // The world comes forward, the camera starts to close in on the site, and before the models'
    // detail gives out the fog covers the view and the story opens.
    later(() => { input.current.focus = world; }, 60);
    later(() => { input.current.zoomTo = 0.5; input.current.mission = id; }, 560);
    later(() => setFog('close', world), 1150);
    later(() => router.push(href), 1850);
  }, [router, later]);

  useEffect(() => {
    controls.current = { flyTo: (id) => {
      const world = missions[id].world;
      // Wait for that world's model, so the flight never starts on an empty sky.
      if (status[world] !== 'ready') {
        pending.current = id;
        return;
      }
      flyTo(id);
    } };
    return () => { controls.current = null; };
  }, [controls, flyTo, status]);

  useEffect(() => {
    const id = pending.current;
    if (id && status[missions[id].world] === 'ready') {
      pending.current = null;
      flyTo(id);
    }
  }, [status, flyTo]);

  const layout = size.width ? hubLayout(size.width, size.height) : null;

  return (
    <div ref={root} className={styles.hub} data-busy={busy ? 'true' : undefined}>
      <div ref={host} className={styles.sky} aria-hidden="true" />
      {layout && worlds.map((world) => {
        const slot = layout[world];
        const reach = slot.r * (world === 'space' ? 1.15 : 1);
        const name = world === 'space' ? labels.space : copy[world];
        const count = missionIds.filter((id) => missions[id].world === world).length;
        return (
          <div key={world} className={styles.slot} data-world={world} data-ready={status.moon === 'ready' && status.mars === 'ready' && status.space === 'ready'}
            style={{ left: size.width / 2 + slot.x, top: size.height / 2 - slot.y, width: reach * 2, height: reach * 2 }}>
            <button type="button" className={styles.planet} aria-label={`${name} · ${count}`}
              onClick={() => openWorld(world)}
              onPointerEnter={() => { input.current.hover = world; }}
              onPointerLeave={() => { if (input.current.hover === world) input.current.hover = null; }}
              onFocus={() => { input.current.hover = world; }}
              onBlur={() => { if (input.current.hover === world) input.current.hover = null; }} />
            <span className={styles.name} style={{ top: reach + slot.r + 14 }}>
              <strong>{name}</strong>
              <small>{count}</small>
            </span>
          </div>
        );
      })}
      {missionIds.map((id) => (
        <button key={id} type="button" tabIndex={-1} aria-hidden="true" hidden className={museumStyles.marker}
          style={{ pointerEvents: 'none' }}
          ref={(element) => { if (element) points.current[id] = element; else delete points.current[id]; }}>
          <span className={museumStyles.markerCore} />
        </button>
      ))}
    </div>
  );
}
