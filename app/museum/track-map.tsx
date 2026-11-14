'use client';

import { useEffect, useMemo, useRef, type CSSProperties } from 'react';
import { museumCopy, type Language } from './languages';
import type { Track } from './routes';
import SourceLink from './source-link';
import styles from './museum.module.css';

// Space around the track, as a share of its longest side.
const MARGIN_SHARE = 0.07;
const SIZE = 1000;
const GROW_MS = 9000;
// The mission fog covers the page for about this long when a story opens.
const AFTER_FOG_MS = 1700;

function buildLayout(track: Track) {
  const all = track.chains.flatMap((chain) => chain.pts);
  const xs = all.map((p) => p[0]);
  const ys = all.map((p) => p[1]);
  const longest = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
  const margin = longest * MARGIN_SHARE;
  const minX = Math.min(...xs) - margin;
  const maxX = Math.max(...xs) + margin;
  const minY = Math.min(...ys) - margin;
  const maxY = Math.max(...ys) + margin;
  const scale = SIZE / Math.max(maxX - minX, maxY - minY);
  const place = ([x, y]: [number, number]) => ({ x: (x - minX) * scale, y: (maxY - y) * scale });

  const chains = track.chains.map((chain) => {
    const points = chain.pts.map(place);
    let length = 0;
    for (let i = 1; i < points.length; i += 1) {
      length += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
    }
    return {
      from: chain.from,
      to: chain.to,
      length,
      d: points.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(''),
    };
  });

  return {
    chains,
    width: (maxX - minX) * scale,
    height: (maxY - minY) * scale,
    start: place([0, 0]),
    end: place(track.final.point),
    barX: (maxX - minX) * scale * 0.06,
    barY: (maxY - minY) * scale - (maxY - minY) * scale * 0.035,
    barLength: 1000 * scale,
  };
}

// The track grows outward from the landing site by distance along the wheel tracks.
// The source map shows where the rover went, not in which order, so nothing here
// pretends to replay a drive.
export default function TrackMap({ track, language, playKey, world, sourceUrl, lroKm, lroSource }: {
  track: Track;
  language: Language;
  playKey: number;
  world: 'moon' | 'mars';
  sourceUrl?: string;
  lroKm?: number;
  lroSource?: string;
}) {
  const labels = museumCopy[language];
  const layout = useMemo(() => buildLayout(track), [track]);
  const locale = language === 'en' ? 'en-US' : 'ru-RU';
  const format = useMemo(() => new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }), [locale]);
  const exact = useMemo(() => new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), [locale]);

  const root = useRef<HTMLDivElement>(null);
  const grown = useRef<(SVGPathElement | null)[]>([]);
  const endLabel = useRef<SVGTextElement>(null);
  const endMark = useRef<SVGGElement>(null);
  const kmText = useRef<HTMLSpanElement>(null);
  const slider = useRef<HTMLInputElement>(null);
  const frame = useRef(0);
  const timer = useRef(0);

  function show(progress: number) {
    const reach = progress * track.reachM;
    layout.chains.forEach((chain, index) => {
      const share = Math.min(1, Math.max(0, (reach - chain.from) / Math.max(1, chain.to - chain.from)));
      grown.current[index]?.style.setProperty('stroke-dasharray', `${(share * chain.length).toFixed(1)} ${(chain.length + 10).toFixed(1)}`);
    });
    if (kmText.current) kmText.current.textContent = format.format(reach / 1000);
    if (slider.current) {
      slider.current.value = String(Math.round(progress * 1000));
      slider.current.style.setProperty('--progress', `${progress * 100}%`);
    }
    const arrived = reach >= track.final.atM - 1;
    endLabel.current?.setAttribute('data-visible', String(arrived));
    endMark.current?.setAttribute('data-visible', String(arrived));
  }

  function stop() {
    cancelAnimationFrame(frame.current);
    window.clearTimeout(timer.current);
  }

  function play() {
    stop();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      show(1);
      return;
    }
    show(0);
    timer.current = window.setTimeout(() => {
      const started = performance.now();
      const tick = (now: number) => {
        // The story is closed or hidden: nothing to animate.
        if (!root.current || root.current.offsetParent === null) return;
        const t = Math.min(1, (now - started) / GROW_MS);
        show(t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2);
        if (t < 1) frame.current = requestAnimationFrame(tick);
      };
      frame.current = requestAnimationFrame(tick);
    }, AFTER_FOG_MS);
  }

  // Restart whenever a story is opened.
  useEffect(() => {
    play();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playKey, track]);

  // Keep the counter in the right number format after a language change.
  useEffect(() => {
    show(Number(slider.current?.value ?? 0) / 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [format]);

  const allPaths = layout.chains.map((chain) => chain.d).join('');

  return (
    <div ref={root} className={styles.route} data-world={world}>
      <p className={styles.visuallyHidden}>
        {`${labels.trackLabel}: ${format.format(track.reachM / 1000)} ${labels.km}. ${lroKm ? `${labels.trackLro}: ${exact.format(lroKm)} ${labels.km}` : ''}`}
      </p>
      <svg className={styles.routeMap} viewBox={`0 0 ${layout.width.toFixed(1)} ${layout.height.toFixed(1)}`}
        style={{ '--ar': layout.width / layout.height } as CSSProperties} aria-hidden="true">
        <path className={styles.routeAhead} d={allPaths} />
        {layout.chains.map((chain, index) => (
          <path key={index} ref={(element) => { grown.current[index] = element; }}
            className={styles.routeDrawn} d={chain.d} />
        ))}
        <circle className={styles.routeStart} cx={layout.start.x} cy={layout.start.y} r="6" />
        <text className={styles.routeNote} x={layout.start.x - 18} y={layout.start.y + 10} textAnchor="end">{labels.routeStart}</text>
        <g ref={endMark} className={styles.routeEndMark} data-visible="false">
          <circle className={styles.routePulse} cx={layout.end.x} cy={layout.end.y} r="9" />
          <circle cx={layout.end.x} cy={layout.end.y} r="6" fill="#fff" />
        </g>
        <text ref={endLabel} className={styles.routeNote} data-visible="false"
          x={layout.end.x} y={layout.end.y - 26} textAnchor="middle">{labels.finalPosition}</text>
        <path className={styles.routeScale} d={`M${layout.barX} ${layout.barY}h${layout.barLength}`} />
        <text className={styles.routeNote} x={layout.barX} y={layout.barY - 12}>{`1 ${labels.km}`}</text>
      </svg>

      <div className={styles.routeStats} aria-hidden="true">
        <p className={styles.routeLabel}>{labels.trackLabel}</p>
        <p className={styles.routeKm}><span ref={kmText}>0,0</span> <small>{labels.km}</small></p>
      </div>
      {lroKm && (
        <p className={styles.routeOdometer}>
          {lroSource
            ? <SourceLink href={lroSource} variant="quiet">{`${labels.trackLro}: ${exact.format(lroKm)} ${labels.km}`}</SourceLink>
            : `${labels.trackLro}: ${exact.format(lroKm)} ${labels.km}`}
        </p>
      )}

      <div className={styles.routeControls}>
        <input ref={slider} type="range" min="0" max="1000" defaultValue="0" aria-label={labels.trackLabel}
          onChange={(event) => { stop(); show(Number(event.target.value) / 1000); }} />
        <button type="button" onClick={play}>{labels.replay}</button>
      </div>
      {sourceUrl && <p className={styles.routeCredit}><SourceLink href={sourceUrl} variant="quiet">{labels.trackNote}</SourceLink></p>}
    </div>
  );
}
