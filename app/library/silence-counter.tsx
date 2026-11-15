'use client';

import { useEffect, useState } from 'react';
import type { Language } from '../museum/languages';
import type { MissionId } from '../museum/missions';
import { elapsed, hasTime, timeline, unitWords } from '../museum/timeline';
import MissionStatus from '../museum/mission-status';
import styles from './silence-counter.module.css';

const two = (value: number) => String(value).padStart(2, '0');

// How long a spacecraft has stood in its state: whole years and days, and a running clock when the
// primary source gives the moment itself. Computed in the visitor's browser, so it is always now.
export default function SilenceCounter({ id, language, label = true }: { id: MissionId; language: Language; label?: boolean }) {
  const chapter = timeline[id];
  // A contact that was lost or a work that ended with no date given has nothing to count from.
  const undated = (chapter.standing === 'lost' || chapter.standing === 'ended' || chapter.standing === 'left') && !chapter.since;
  const from = chapter.since ?? chapter.arrived;
  const exact = hasTime(from);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), exact ? 1000 : 60000);
    return () => window.clearInterval(timer);
  }, [exact]);

  const value = now && !undated ? elapsed(from, now) : null;
  const words = value ? unitWords(language, value) : null;

  return (
    <span className={styles.counter}>
      {label && <MissionStatus id={id} language={language} />}
      <span className={styles.value} aria-live="off">
        {value && words ? (
          <>
            <b>{value.years}</b> {words.years} <b>{value.days}</b> {words.days}
            {exact && <span className={styles.clock}> {two(value.hours)}:{two(value.minutes)}:{two(value.seconds)}</span>}
          </>
        ) : undated ? '' : ' '}
      </span>
    </span>
  );
}
