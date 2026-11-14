'use client';

import Image from 'next/image';
import type { RefObject } from 'react';
import { museumCopy, type Language } from './languages';
import LanguageSettings from './language-settings';
import type { missions, MissionId } from './missions';
import RouteMap from './route-map';
import SourceLink from './source-link';
import type { Route } from './routes';
import styles from './museum.module.css';

export default function MissionDialog({
  mission,
  route,
  routeSource,
  routeRun,
  language,
  onLanguageChange,
  dialog,
  closing,
  onClose,
  onExit,
  onReveal,
}: {
  mission: typeof missions[MissionId];
  route?: Route;
  routeSource?: string;
  routeRun: number;
  language: Language;
  onLanguageChange: (language: Language) => void;
  dialog: RefObject<HTMLDialogElement | null>;
  closing: boolean;
  onClose: () => void;
  onExit: () => void;
  onReveal: () => void;
}) {
  const copy = mission.copy[language];
  const labels = museumCopy[language];

  return (
    <dialog ref={dialog} className={styles.mission} data-closing={closing} tabIndex={-1}
      aria-labelledby="mission-title" onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}>
      <div className={styles.missionPanel} data-route={Boolean(route)} data-world={mission.world} onAnimationEnd={(event) => {
        if (event.target !== event.currentTarget) return;
        if (closing) onExit();
        else onReveal();
      }}>
        <button className={styles.missionBack} onClick={onClose}>← {labels.back}</button>
        <LanguageSettings language={language} onChange={onLanguageChange} />
        <figure className={styles.missionPhoto} data-world={mission.world}>
          <Image src={mission.image} fill unoptimized
            alt={mission.imageKind === 'model' ? labels.photoAlt : copy.name} />
          <figcaption>
            <SourceLink href={mission.sources.photo}>{mission.imageKind === 'model' ? labels.photo : labels[mission.imageKind]}</SourceLink>
          </figcaption>
        </figure>
        <article className={styles.missionCopy}>
          <p className={styles.missionLocation}>{copy.location}</p>
          <h2 id="mission-title">{copy.name}</h2>
          <p className={styles.missionIntro}>{copy.intro}</p>
          {copy.story.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <p className={styles.missionSources}>
            <SourceLink href={mission.sources.mission}>{labels.mission}</SourceLink>
            <SourceLink href={mission.sources.coordinates}>{mission.siteKind === 'landing' ? labels.landing : labels.coordinates}</SourceLink>
          </p>
        </article>
        {route && (
          <RouteMap route={route} language={language} playKey={routeRun}
            world={mission.world} sourceUrl={routeSource} />
        )}
      </div>
      <div key={closing ? 'closing' : 'opening'} className={styles.missionFog} data-fog={mission.world} aria-hidden="true" />
    </dialog>
  );
}
