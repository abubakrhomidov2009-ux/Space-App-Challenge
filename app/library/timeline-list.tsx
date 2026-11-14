import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { Language } from '../museum/languages';
import { missions, type MissionId } from '../museum/missions';
import { parse, timeline, year } from '../museum/timeline';
import { libraryCopy } from './labels';
import SilenceCounter from './silence-counter';
import styles from './timeline-list.module.css';

// Missions in the order they arrived. The empty space between them grows with the years between
// the landings, so the long quiet stretches can be seen as well as counted.
export default function TimelineList({ ids, language }: { ids: MissionId[]; language: Language }) {
  const labels = libraryCopy[language];
  const ordered = [...ids].sort((a, b) => parse(timeline[a].arrived).getTime() - parse(timeline[b].arrived).getTime());

  return (
    <ol className={styles.line}>
      {ordered.map((id, index) => {
        const entry = missions[id];
        const text = entry.copy[language];
        const arrived = year(timeline[id].arrived);
        const before = index ? year(timeline[ordered[index - 1]].arrived) : arrived;
        const gap = Math.min(arrived - before, 18);
        return (
          <li key={id} className={styles.item}
            style={{ '--gap': `${(0.9 + gap * 0.32).toFixed(2)}rem`, viewTransitionName: `mission-${id}` } as CSSProperties}>
            <span className={styles.year}>{arrived}</span>
            <Link href={`/library/${id}`} className={styles.card}>
              <span className={styles.cover}>
                <Image src={entry.image} alt="" fill sizes="(max-width: 700px) 90vw, 14rem" />
              </span>
              <span className={styles.copy}>
                <small>{text.location} · {labels[entry.kind]}</small>
                <strong>{text.name}</strong>
                <span className={styles.intro}>{text.intro}</span>
                <SilenceCounter id={id} language={language} />
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
