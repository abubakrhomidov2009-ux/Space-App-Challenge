import Image from 'next/image';
import type { ReactNode } from 'react';
import { museumCopy, type Language } from './languages';
import type { missions, MissionId } from './missions';
import SourceLink from './source-link';
import styles from './museum.module.css';

export default function MissionContent({ mission, language, heading: Heading = 'h2', photoFailed = false, children }: {
  mission: typeof missions[MissionId];
  language: Language;
  photoFailed?: boolean;
  heading?: 'h1' | 'h2';
  // Extra blocks that sit beside the story, such as the rover route map.
  children?: ReactNode;
}) {
  const copy = mission.copy[language];
  const labels = museumCopy[language];

  return (
    <>
      <figure className={styles.missionPhoto} data-world={mission.world}>
        {!photoFailed && <Image src={mission.image} fill unoptimized
          alt={mission.imageKind === 'model' ? labels.photoAlt : copy.name} />}
        <figcaption>
          <SourceLink href={mission.sources.photo}>{mission.imageKind === 'model' ? labels.photo : labels[mission.imageKind]}</SourceLink>
        </figcaption>
      </figure>
      <article className={styles.missionCopy}>
        <p className={styles.missionLocation}>{copy.location}</p>
        <Heading id="mission-title">{copy.name}</Heading>
        <p className={styles.missionIntro}>{copy.intro}</p>
        {copy.story.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <p className={styles.missionSources}>
          <SourceLink href={mission.sources.mission}>{labels.mission}</SourceLink>
          <SourceLink href={mission.sources.coordinates}>{mission.siteKind === 'landing' ? labels.landing : mission.siteKind === 'landingRegion' ? labels.landingRegion : mission.siteKind === 'orbit' ? labels.orbit : labels.coordinates}</SourceLink>
        </p>
      </article>
      {children}
    </>
  );
}
