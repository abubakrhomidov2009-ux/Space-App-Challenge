'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { flushSync } from 'react-dom';
import LanguageSettings from '../museum/language-settings';
import RouteMap from '../museum/route-map';
import TrackMap from '../museum/track-map';
import { missionExtras } from '../museum/routes';
import { museumCopy } from '../museum/languages';
import { missionIds, missions, type MissionId } from '../museum/missions';
import { useLanguage } from '../museum/use-language';
import { categories, categoryIds, type Category } from './categories';
import { libraryCopy } from './labels';
import MissionSearch from './mission-search';
import Dossier from './dossier';
import TimelineList from './timeline-list';
import LibraryHub, { type HubControls } from './library-hub';
import { getFog, setFog } from './fog-store';
import styles from './library.module.css';

const kinds = ['rover', 'lander', 'combined', 'helicopter', 'hardware', 'orbiter', 'telescope'] as const;

// Reorder the list as one smooth motion where the browser supports it; otherwise just update.
// Only the grid is reordered this way: the timeline's cards are large, and snapshotting them all
// at once makes the page stutter, so there the list is simply replaced and its cards ease in.
function morph(update: () => void, animate = true) {
  const doc = document as Document & { startViewTransition?: (callback: () => void) => unknown };
  if (!animate || !doc.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    update();
    return;
  }
  doc.startViewTransition(() => flushSync(update));
}

const views = {
  ru: { label: 'Вид', timeline: 'Лента', grid: 'Сетка' },
  en: { label: 'View', timeline: 'Timeline', grid: 'Grid' },
  tg: { label: 'Намуд', timeline: 'Лента', grid: 'Тӯр' },
} as const;

function normalize(value: string) {
  return value.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
}

export default function Library({ mission, category }: { mission?: typeof missions[MissionId]; category?: Category }) {
  const { language, changeLanguage } = useLanguage();
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [kind, setKind] = useState('');
  const [view, setView] = useState<'timeline' | 'grid'>('timeline');
  const [searchOpen, setSearchOpen] = useState(false);
  const hub = useRef<HubControls | null>(null);
  // Arriving from the entrance flight, the fog that covered the view now clears. It is the same
  // fog element, kept in the layout, so there is no frame between closing and opening.
  useLayoutEffect(() => {
    const { state } = getFog();
    if (state === 'idle') return;
    if (state === 'close') setFog('open');
    const timer = window.setTimeout(() => setFog('idle'), 1000);
    return () => window.clearTimeout(timer);
  }, []);
  const labels = libraryCopy[language];
  const copy = museumCopy[language];

  // The mission arrives as a copy from the server page, so match it by its image.
  const missionId = mission ? missionIds.find((id) => missions[id].image === mission.image) : undefined;
  const extras = missionId ? missionExtras(missionId) : undefined;

  const categoryName = category === 'space' ? labels.space : category ? copy[category] : labels.title;
  const categoryMissions = missionIds.filter((id) => missions[id].world === category);
  const searchTerm = normalize(search);
  const matches = categoryMissions.filter((id) => {
    const entry = missions[id];
    return (!kind || kind === entry.kind)
      && Object.values(entry.copy).some(({ name }) => normalize(name).includes(searchTerm));
  });

  // Typing settles for a moment before the list reorders, so it does not shuffle on every key.
  useEffect(() => {
    if (query === search) return;
    const timer = window.setTimeout(() => morph(() => setSearch(query), view === 'grid'), 160);
    return () => window.clearTimeout(timer);
  }, [query, search, view]);

  // Ctrl+K, or / outside a text field, opens the quick search from any library page.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing = target?.matches('input, textarea, select, [contenteditable]');
      if ((event.key.toLowerCase() === 'k' && (event.ctrlKey || event.metaKey)) || (event.key === '/' && !typing)) {
        event.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const kindOptions = kinds.filter((value) => categoryMissions.some((id) => missions[id].kind === value));

  if (!mission && !category) {
    return (
      <>
        <MissionSearch language={language} open={searchOpen} onClose={() => setSearchOpen(false)}
          onFly={(id) => hub.current?.flyTo(id)} />
        <LibraryHub language={language} controls={hub} />
        <header className={styles.header}>
          <Link href="/"><i className="nav-arrow nav-arrow-left" aria-hidden="true" /> {labels.home}</Link>
          <LanguageSettings language={language} onChange={changeLanguage} />
        </header>
        <div className={styles.hubTitle}>
          <h1>{labels.title}</h1>
          <button type="button" className={styles.quickSearch} onClick={() => setSearchOpen(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" />
            </svg>
            <span>{labels.search}</span>
            <kbd>Ctrl K</kbd>
          </button>
        </div>
      </>
    );
  }

  return (
    <>
    <div className={styles.sky} aria-hidden="true" />
    <MissionSearch language={language} open={searchOpen} onClose={() => setSearchOpen(false)} />
    <main key={mission?.image ?? category ?? 'library'} className={styles.library}>
      <header className={styles.header}>
        <Link href={mission ? `/library/${mission.world}` : category ? '/library' : '/'}>
          <i className="nav-arrow nav-arrow-left" aria-hidden="true" /> {mission ? (mission.world === 'space' ? labels.space : copy[mission.world]) : category ? labels.title : labels.home}
        </Link>
        <LanguageSettings language={language} onChange={changeLanguage} />
      </header>
      {mission && missionId ? (
        <Dossier id={missionId} language={language}>
          {extras?.track && (
            <TrackMap track={extras.track} language={language} playKey={0} world={mission.world as 'moon' | 'mars'}
              sourceUrl={extras.trackSource} lroKm={extras.trackLroKm}
              lroSource={'distance' in mission.sources ? mission.sources.distance : undefined} />
          )}
          {extras?.route && (
            <RouteMap route={extras.route} language={language} playKey={0} world={mission.world as 'moon' | 'mars'}
              sourceUrl={extras.routeSource} odometerSource={extras.odometerSource} />
          )}
        </Dossier>
      ) : !category ? (
        <>
          <h1>{labels.title}</h1>
          <button type="button" className={styles.quickSearch} onClick={() => setSearchOpen(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" />
            </svg>
            <span>{labels.search}</span>
            <kbd>Ctrl K</kbd>
          </button>
          <ul className={styles.categories}>
            {categoryIds.map((id, index) => (
              <li key={id}>
                <Link href={`/library/${id}`} className={styles.category} data-category={id}
                  style={{ '--i': index } as CSSProperties}>
                  <Image src={categories[id]} fill alt=""
                    sizes="(max-width: 740px) 95vw, 33vw" />
                  <span className={styles.categoryName}>
                    <span>{id === 'space' ? labels.space : copy[id]}</span>
                    <small>{missionIds.filter((mission) => missions[mission].world === id).length}</small>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <h1>{categoryName}</h1>
          {category === 'space' && <p className={styles.description}>{labels.spaceDescription} · <a href="https://www.eso.org/public/images/eso1907a/">M87* · EHT Collaboration</a></p>}
          <div className={styles.bar} role="search">
            <label className={styles.search}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" />
              </svg>
              <input type="search" value={query} placeholder={labels.search} aria-label={labels.search}
                onChange={(event) => setQuery(event.target.value)} />
            </label>
            <div className={styles.kinds} role="group" aria-label={labels.type}>
              {['', ...kindOptions].map((value) => (
                <button key={value || 'all'} type="button" aria-pressed={kind === value}
                  onClick={() => morph(() => setKind(value), view === 'grid')}>{value ? labels[value as typeof kinds[number]] : labels.all}</button>
              ))}
            </div>
            <div className={styles.kinds} role="group" aria-label={views[language].label}>
              {(['timeline', 'grid'] as const).map((value) => (
                <button key={value} type="button" aria-pressed={view === value}
                  onClick={() => setView(value)}>{views[language][value]}</button>
              ))}
            </div>
          </div>
          <p className={styles.count} role="status">{matches.length ? <>{labels.count} · <b>{matches.length}</b></> : labels.empty}</p>
          {matches.length === 0 && <button className={styles.reset} onClick={() => {
            setQuery('');
            morph(() => { setSearch(''); setKind(''); }, view === 'grid');
          }}>{labels.reset}</button>}
          {view === 'timeline' ? <TimelineList key="timeline" ids={matches} language={language} /> : (
          <ul key="grid" className={styles.cards}>
            {matches.map((id, index) => {
              const entry = missions[id];
              const text = entry.copy[language];
              return (
                <li key={id} className={styles.card} style={{ '--i': index, viewTransitionName: `mission-${id}` } as CSSProperties}>
                  <Link href={`/library/${id}`}>
                    <div className={styles.cover}>
                      <Image src={entry.image} alt="" fill sizes="(max-width: 560px) 95vw, (max-width: 900px) 45vw, 32vw" />
                    </div>
                    <div className={styles.cardCopy}>
                      <p>{text.location} · {labels[entry.kind]}</p>
                      <h2>{text.name}</h2>
                      <p>{text.intro}</p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
          )}
        </>
      )}
    </main>
    </>
  );
}
