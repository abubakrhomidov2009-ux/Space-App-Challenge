import type { Language } from './languages';
import type { MissionId } from './missions';
import { standingLabel, timeline } from './timeline';
import styles from './museum.module.css';

export default function MissionStatus({ id, language }: { id: MissionId; language: Language }) {
  const { standing } = timeline[id];
  return (
    <span className={styles.missionStatus} data-standing={standing}>
      {standingLabel(standing, language)}
    </span>
  );
}
