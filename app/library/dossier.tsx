import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { museumCopy, type Language } from '../museum/languages';
import { missionIds, missions, type MissionId } from '../museum/missions';
import SourceLink from '../museum/source-link';
import { libraryCopy } from './labels';
import styles from './dossier.module.css';

const words = {
  ru: { world: 'Мир', kind: 'Тип аппарата', place: 'Место', coordinates: 'Координаты', next: 'Дальше' },
  en: { world: 'World', kind: 'Spacecraft type', place: 'Location', coordinates: 'Coordinates', next: 'Next' },
  tg: { world: 'Ҷаҳон', kind: 'Навъи дастгоҳ', place: 'Макон', coordinates: 'Координатҳо', next: 'Минбаъд' },
} as const;

function formatCoordinates(mission: typeof missions[MissionId]) {
  if (!('latitude' in mission) || !('longitude' in mission)) return '';
  const lat = mission.latitude as number;
  const lon = mission.longitude as number;
  return `${Math.abs(lat).toFixed(2)}° ${lat < 0 ? 'S' : 'N'}, ${Math.abs(lon).toFixed(2)}° ${lon < 0 ? 'W' : 'E'}`;
}

// A mission's page in the library: a full-width photograph with the name set over it, the story in
// a narrow column beside a short fact sheet, then the map or track, the sources and the next story.
export default function Dossier({ id, language, children }: { id: MissionId; language: Language; children?: ReactNode }) {
  const mission = missions[id];
  const text = mission.copy[language];
  const labels = museumCopy[language];
  const library = libraryCopy[language];
  const word = words[language];
  const worldName = mission.world === 'space' ? library.space : labels[mission.world];
  const coordinates = formatCoordinates(mission);
  const siblings = missionIds.filter((other) => missions[other].world === mission.world);
  const next = siblings[(siblings.indexOf(id) + 1) % siblings.length];
  const photoLabel = mission.imageKind === 'model' ? labels.photo : labels[mission.imageKind];
  const siteLabel = mission.siteKind === 'landing' ? labels.landing
    : mission.siteKind === 'landingRegion' ? labels.landingRegion
    : mission.siteKind === 'orbit' ? labels.orbit : labels.coordinates;

  return (
    <article className={styles.dossier} data-world={mission.world}>
      <header className={styles.hero}>
        <Image className={styles.photo} src={mission.image} fill unoptimized priority
          alt={mission.imageKind === 'model' ? labels.photoAlt : text.name} />
        <div className={styles.heroText}>
          <p className={styles.place}>{text.location}</p>
          <h1 id="mission-title">{text.name}</h1>
        </div>
        <div className={styles.credit}><SourceLink href={mission.sources.photo}>{photoLabel}</SourceLink></div>
      </header>

      <div className={styles.body}>
        <div className={styles.story}>
          <p className={styles.lead}>{text.intro}</p>
          {text.story.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        <aside className={styles.facts} aria-label={word.kind}>
          <dl>
            <div><dt>{word.world}</dt><dd>{worldName}</dd></div>
            <div><dt>{word.kind}</dt><dd>{library[mission.kind]}</dd></div>
            <div><dt>{word.place}</dt><dd>{text.location}</dd></div>
            {coordinates && <div><dt>{word.coordinates}</dt><dd>{coordinates}</dd></div>}
          </dl>
        </aside>
      </div>

      {children && <div className={styles.exhibit}>{children}</div>}

      <footer className={styles.end}>
        <p className={styles.sources}>
          <SourceLink href={mission.sources.mission}>{labels.mission}</SourceLink>
          <SourceLink href={mission.sources.coordinates}>{siteLabel}</SourceLink>
        </p>
        {next !== id && (
          <Link className={styles.next} href={`/library/${next}`}>
            <small>{word.next}</small>
            <span>{missions[next].copy[language].name}</span>
          </Link>
        )}
      </footer>
    </article>
  );
}
