'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { Language } from './languages';
import { voyagerEvents, voyagerRouteSource } from './routes/voyager';
import SourceLink from './source-link';
import styles from './museum.module.css';

const copy = {
  ru: { title: 'Маршрут «Вояджера-1»', year: 'Год полёта', replay: 'Повторить', source: 'Траектория NASA', note: 'Схема полёта без масштаба. После 2012 года зонд продолжил путь в межзвёздном пространстве.' },
  en: { title: 'Voyager 1’s journey', year: 'Flight year', replay: 'Replay', source: 'NASA trajectory', note: 'Schematic, not to scale. After 2012 the probe continued through interstellar space.' },
  tg: { title: 'Масири «Вояҷер-1»', year: 'Соли парвоз', replay: 'Аз нав', source: 'Масири NASA', note: 'Нақшаи парвоз бе миқёс. Пас аз соли 2012 зонд роҳашро дар фазои байниситоравӣ идома дод.' },
};

const start = voyagerEvents[0].year;
const end = voyagerEvents[voyagerEvents.length - 1].year;
const segments = voyagerEvents.slice(0, -1).map((from, index) => {
  const to = voyagerEvents[index + 1];
  const before = voyagerEvents[index - 1] ?? from;
  const after = voyagerEvents[index + 2] ?? to;
  const first = { x: from.x + (to.x - before.x) / 6, y: from.y + (to.y - before.y) / 6 };
  const second = { x: to.x - (after.x - from.x) / 6, y: to.y - (after.y - from.y) / 6 };
  return { from, to, first, second, path: `M${from.x} ${from.y}C${first.x} ${first.y} ${second.x} ${second.y} ${to.x} ${to.y}` };
});

function smooth(value: number) {
  return value * value * (3 - 2 * value);
}

export default function VoyagerRoute({ language, playKey, delay = 0 }: { language: Language; playKey: number; delay?: number }) {
  const words = copy[language];
  const [year, setYear] = useState<number>(start);
  const [replay, setReplay] = useState(0);
  const frame = useRef(0);
  const timer = useRef(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setYear(end);
      return;
    }

    setYear(start);
    timer.current = window.setTimeout(() => {
      const started = performance.now();
      function animate(now: number) {
        const progress = Math.min(1, (now - started) / 8500);
        const eased = smooth(progress);
        setYear(eased < .4 ? start + 3 * eased / .4 : 1980 + (end - 1980) * (eased - .4) / .6);
        if (progress < 1) frame.current = requestAnimationFrame(animate);
      }
      frame.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      window.clearTimeout(timer.current);
      cancelAnimationFrame(frame.current);
    };
  }, [playKey, replay, delay]);

  const index = voyagerEvents.findLastIndex((event) => event.year <= year);
  const current = voyagerEvents[index];
  const segment = segments[index];
  const t = segment ? (year - segment.from.year) / (segment.to.year - segment.from.year) : 0;
  const lerpPoint = (a: { x: number; y: number }, b: { x: number; y: number }) => ({
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  });
  const first = segment && lerpPoint(segment.from, segment.first);
  const middle = segment && lerpPoint(segment.first, segment.second);
  const last = segment && lerpPoint(segment.second, segment.to);
  const second = first && middle && lerpPoint(first, middle);
  const third = middle && last && lerpPoint(middle, last);
  const point = second && third ? lerpPoint(second, third) : current;
  const partial = segment && first && second
    ? `M${segment.from.x} ${segment.from.y}C${first.x} ${first.y} ${second.x} ${second.y} ${point.x} ${point.y}`
    : undefined;
  const zoom = smooth(Math.max(0, Math.min(1, (year - 1980) / 8)));

  return (
    <section className={styles.voyagerRoute} aria-label={words.title}>
      <h3>{words.title}</h3>
      <svg className={styles.voyagerMap} viewBox={`0 ${35 * zoom} ${200 + 310 * zoom} ${165 - 35 * zoom}`} aria-hidden="true">
        {segments.map(({ path }, segmentIndex) => (
          <g key={path}>
            <path className={styles.voyagerAhead} d={path} vectorEffect="non-scaling-stroke" />
            {segmentIndex <= index && (
              <path className={styles.voyagerDrawn} d={segmentIndex === index ? partial : path}
                vectorEffect="non-scaling-stroke" />
            )}
          </g>
        ))}
        {voyagerEvents.map((event) => (
          <circle key={event.year} cx={event.x} cy={event.y} r={2 + zoom * 2}
            fill={event.year <= year ? '#ddd7ff' : '#827b95'} />
        ))}
        <circle cx={point.x} cy={point.y} r={3 + zoom * 2} fill="white" />
      </svg>
      <label>
        <span>{words.year} · {Math.floor(year)}</span>
        <span className={styles.routeControls}>
          <input type="range" min={start} max={end} step="any" value={year}
            style={{ '--progress': `${(year - start) / (end - start) * 100}%` } as CSSProperties}
            aria-valuetext={String(Math.floor(year))}
          onChange={(event) => {
            window.clearTimeout(timer.current);
            cancelAnimationFrame(frame.current);
            setYear(Number(event.currentTarget.value));
          }} />
        </span>
      </label>
      <div className={styles.voyagerControls}>
        <p>{current[language]}</p>
        <button type="button" onClick={() => setReplay((value) => value + 1)}>{words.replay}</button>
      </div>
      <p>{words.note} <SourceLink href={voyagerRouteSource} variant="quiet">{words.source}</SourceLink></p>
    </section>
  );
}
