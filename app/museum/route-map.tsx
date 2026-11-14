'use client';

import { useEffect, useMemo, useRef, type CSSProperties } from 'react';
import { museumCopy, type Language } from './languages';
import type { Route } from './routes';
import SourceLink from './source-link';
import styles from './museum.module.css';

// Space around the line, as a share of the route's longest side.
const MARGIN_SHARE = 0.07;
const SIZE = 1000;
const DRIVE_MS = 9000;
// The mission fog covers the page for about this long when a story opens.
const AFTER_FOG_MS = 1700;

function buildLayout(route: Route) {
  const xs = route.points.map((p) => p[0]);
  const ys = route.points.map((p) => p[1]);
  const longest = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
  const margin = longest * MARGIN_SHARE;
  const minX = Math.min(...xs) - margin;
  const maxX = Math.max(...xs) + margin;
  const minY = Math.min(...ys) - margin;
  const maxY = Math.max(...ys) + margin;
  const scale = SIZE / Math.max(maxX - minX, maxY - minY);
  const width = (maxX - minX) * scale;
  const height = (maxY - minY) * scale;
  const points = route.points.map(([x, y, sol, km]) => ({ x: (x - minX) * scale, y: (maxY - y) * scale, sol, km }));

  // Length of the drawn line up to each point, for the "drawn so far" dash.
  const along = [0];
  for (let i = 1; i < points.length; i += 1) {
    along.push(along[i - 1] + Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y));
  }
  return {
    width, height, points, along, total: along.at(-1) ?? 0,
    d: points.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(''),
    barX: width * 0.05, barY: height - height * 0.04, barLength: 5000 * scale,
  };
}

export default function RouteMap({ route, language, playKey, world, sourceUrl, odometerSource }: {
  route: Route;
  language: Language;
  playKey: number;
  world: 'moon' | 'mars';
  sourceUrl?: string;
  odometerSource?: string;
}) {
  const labels = museumCopy[language];
  const layout = useMemo(() => buildLayout(route), [route]);
  const format = useMemo(
    () => new Intl.NumberFormat(language === 'en' ? 'en-US' : 'ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
    [language],
  );

  const exact = useMemo(
    () => new Intl.NumberFormat(language === 'en' ? 'en-US' : 'ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    [language],
  );

  const root = useRef<HTMLDivElement>(null);
  const trail = useRef<SVGPathElement>(null);
  const rover = useRef<SVGGElement>(null);
  const endLabel = useRef<SVGTextElement>(null);
  const kmText = useRef<HTMLSpanElement>(null);
  const solText = useRef<HTMLSpanElement>(null);
  const slider = useRef<HTMLInputElement>(null);
  const frame = useRef(0);
  const timer = useRef(0);

  function show(progress: number) {
    const { points, along, total } = layout;
    const km = progress * route.totalKm;
    let low = 0;
    let high = points.length - 1;
    while (low < high - 1) {
      const middle = (low + high) >> 1;
      if (points[middle].km <= km) low = middle; else high = middle;
    }
    const next = Math.min(low + 1, points.length - 1);
    const a = points[low];
    const b = points[next];
    const span = b.km - a.km;
    const f = span > 0 ? Math.min(1, Math.max(0, (km - a.km) / span)) : 0;
    const x = a.x + (b.x - a.x) * f;
    const y = a.y + (b.y - a.y) * f;
    const drawn = along[low] + (along[next] - along[low]) * f;

    trail.current?.style.setProperty('stroke-dasharray', `${drawn.toFixed(1)} ${(total + 10).toFixed(1)}`);
    rover.current?.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
    if (kmText.current) kmText.current.textContent = format.format(km);
    if (solText.current) solText.current.textContent = String(Math.round(a.sol + (b.sol - a.sol) * f));
    if (slider.current) {
      slider.current.value = String(Math.round(progress * 1000));
      slider.current.style.setProperty('--progress', `${progress * 100}%`);
    }
    endLabel.current?.setAttribute('data-visible', String(progress > 0.995));
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
        const t = Math.min(1, (now - started) / DRIVE_MS);
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
  }, [playKey, route]);

  // Keep the counters in the right number format after a language change.
  useEffect(() => {
    show(Number(slider.current?.value ?? 0) / 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [format]);

  const { points } = layout;
  const start = points[0];
  const end = points[points.length - 1];

  return (
    <div ref={root} className={styles.route} data-world={world}>
      <p className={styles.visuallyHidden}>
        {`${labels.routeLabel}: ${format.format(route.totalKm)} ${labels.km}, ${labels.sol} ${route.lastSol}`}
      </p>
      <svg className={styles.routeMap} viewBox={`0 0 ${layout.width.toFixed(1)} ${layout.height.toFixed(1)}`}
        style={{ '--ar': layout.width / layout.height } as CSSProperties} aria-hidden="true">
        <path className={styles.routeAhead} d={layout.d} />
        <path ref={trail} className={styles.routeDrawn} d={layout.d} />
        <circle className={styles.routeStart} cx={start.x} cy={start.y} r="6" />
        <text className={styles.routeNote} x={start.x + 18} y={start.y + 10}>{labels.routeStart}</text>
        <text ref={endLabel} className={styles.routeNote} data-visible="false" x={end.x - 18} y={end.y + 10} textAnchor="end">
          {labels.routeEnd}
        </text>
        <g ref={rover} className={styles.routeRover}>
          <circle className={styles.routePulse} r="9" />
          <circle r="6" />
        </g>
        <path className={styles.routeScale} d={`M${layout.barX} ${layout.barY}h${layout.barLength}`} />
        <text className={styles.routeNote} x={layout.barX} y={layout.barY - 12}>{`5 ${labels.km}`}</text>
      </svg>

      <div className={styles.routeStats} aria-hidden="true">
        <p className={styles.routeLabel}>{labels.routeLabel}</p>
        <p className={styles.routeKm}><span ref={kmText}>0,0</span> <small>{labels.km}</small></p>
        <p className={styles.routeSub}>{labels.of} {format.format(route.totalKm)} {labels.km}</p>
        <p className={styles.routeSol}>{labels.sol} <span ref={solText}>1</span> / {route.lastSol}</p>
      </div>

      <div className={styles.routeControls}>
        <input ref={slider} type="range" min="0" max="1000" defaultValue="0" aria-label={labels.scrub}
          onChange={(event) => { stop(); show(Number(event.target.value) / 1000); }} />
        <button type="button" onClick={play}>{labels.replay}</button>
      </div>
      {route.odometerKm && (
        <p className={styles.routeOdometer}>
          {odometerSource
            ? <SourceLink href={odometerSource} variant="quiet">{`${labels.routeOdometer}: ${exact.format(route.odometerKm)} ${labels.km}`}</SourceLink>
            : `${labels.routeOdometer}: ${exact.format(route.odometerKm)} ${labels.km}`}
        </p>
      )}
      {sourceUrl && <p className={styles.routeCredit}><SourceLink href={sourceUrl} variant="quiet">{labels.routeSource}</SourceLink></p>}
    </div>
  );
}
