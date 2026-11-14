import Image from 'next/image';
import { museumCopy, type Language } from './languages';
import type { missions, MissionId } from './missions';
import styles from './museum.module.css';

export default function MissionContent({ mission, language, heading: Heading = 'h2', photoFailed = false }: {
  mission: typeof missions[MissionId];
  language: Language;
  photoFailed?: boolean;
  heading?: 'h1' | 'h2';
}) {
  const copy = mission.copy[language];
  const labels = museumCopy[language];

  return (
    <>
      <figure className={styles.missionPhoto} data-world={mission.world}>
        {!photoFailed && <Image src={mission.image} fill unoptimized
          alt={mission.imageKind === 'model' ? labels.photoAlt : copy.name} />}
        <figcaption><a href={mission.sources.photo}>{mission.imageKind === 'model' ? labels.photo : labels[mission.imageKind]}</a></figcaption>
      </figure>
      <article className={styles.missionCopy}>
        <p className={styles.missionLocation}>{copy.location}</p>
        <Heading id="mission-title">{copy.name}</Heading>
        <p className={styles.missionIntro}>{copy.intro}</p>
        {copy.story.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <p className={styles.missionSources}>
          <a href={mission.sources.mission}>{labels.mission}</a>
          <a href={mission.sources.coordinates}>{mission.siteKind === 'landing' ? labels.landing : labels.coordinates}</a>
        </p>
      </article>
    </>
  );
}
