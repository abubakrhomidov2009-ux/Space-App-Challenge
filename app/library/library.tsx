'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import LanguageSettings from '../museum/language-settings';
import MissionContent from '../museum/mission-content';
import { museumCopy } from '../museum/languages';
import { missionIds, missions, type MissionId } from '../museum/missions';
import { useLanguage } from '../museum/use-language';
import { categories, categoryIds, type Category } from './categories';
import { libraryCopy } from './labels';
import styles from './library.module.css';

const kinds = ['rover', 'lander', 'combined', 'helicopter', 'hardware', 'orbiter', 'telescope'] as const;

function normalize(value: string) {
  return value.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
}

export default function Library({ mission, category }: { mission?: typeof missions[MissionId]; category?: Category }) {
  const { language, changeLanguage } = useLanguage();
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('');
  const labels = libraryCopy[language];
  const copy = museumCopy[language];

  const categoryName = category === 'space' ? labels.space : category ? copy[category] : labels.title;
  const categoryMissions = missionIds.filter((id) => missions[id].world === category);
  const searchTerm = normalize(query);
  const matches = categoryMissions.filter((id) => {
    const entry = missions[id];
    return (!kind || kind === entry.kind)
      && Object.values(entry.copy).some(({ name }) => normalize(name).includes(searchTerm));
  });

  return (
    <main key={mission?.image ?? category ?? 'library'} className={styles.library}>
      <header className={styles.header}>
        <Link href={mission ? `/library/${mission.world}` : category ? '/library' : '/'}>
          <i className="nav-arrow nav-arrow-left" aria-hidden="true" /> {mission ? (mission.world === 'space' ? labels.space : copy[mission.world]) : category ? labels.title : labels.home}
        </Link>
        <LanguageSettings language={language} onChange={changeLanguage} />
      </header>
      {mission ? (
        <section className={styles.detail} aria-labelledby="mission-title">
          <MissionContent mission={mission} language={language} heading="h1" />
        </section>
      ) : !category ? (
        <>
          <h1>{labels.title}</h1>
          <ul className={styles.categories}>
            {categoryIds.map((id) => (
              <li key={id}>
                <Link href={`/library/${id}`} className={styles.category} data-category={id}>
                  <Image src={categories[id]} fill alt=""
                    sizes="(max-width: 740px) 95vw, 33vw" />
                  <span>{id === 'space' ? labels.space : copy[id]} <i className="nav-arrow" aria-hidden="true" /></span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <h1>{categoryName}</h1>
          {category === 'space' && <p className={styles.description}>{labels.spaceDescription} · <a href="https://www.eso.org/public/images/eso1907a/">M87* · EHT Collaboration</a></p>}
          <div className={styles.filters}>
            <label>{labels.search}<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
            <label>{labels.type}<select value={kind} onChange={(event) => setKind(event.target.value)}>
              <option value="">{labels.all}</option>
              {kinds.filter((value) => categoryMissions.some((id) => missions[id].kind === value)).map((value) => <option key={value} value={value}>{labels[value]}</option>)}
            </select></label>
          </div>
          <p className={styles.description} role="status">{matches.length ? `${labels.count} · ${matches.length}` : labels.empty}</p>
          {matches.length === 0 && <button className={styles.reset} onClick={() => {
            setQuery('');
            setKind('');
          }}>{labels.reset}</button>}
          <ul className={styles.cards}>
            {matches.map((id) => {
              const entry = missions[id];
              const text = entry.copy[language];
              return (
                <li key={id}>
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
        </>
      )}
    </main>
  );
}
