'use client';

import MissionContent from './mission-content';
import { useState, type RefObject } from 'react';
import { museumCopy, type Language } from './languages';
import LanguageSettings from './language-settings';
import type { missions, MissionId } from './missions';
import styles from './museum.module.css';

export default function MissionDialog({
  photoReady,
  photoFailed,
  mission,
  language,
  onLanguageChange,
  dialog,
  closing,
  onClose,
  onExit,
  onReveal,
}: {
  photoReady: boolean;
  photoFailed: boolean;
  mission: typeof missions[MissionId];
  language: Language;
  onLanguageChange: (language: Language) => void;
  dialog: RefObject<HTMLDialogElement | null>;
  closing: boolean;
  onClose: () => void;
  onExit: () => void;
  onReveal: () => void;
}) {
  const [fogClosed, setFogClosed] = useState(false);
  const labels = museumCopy[language];

  return (
    <dialog ref={dialog} className={styles.mission} data-closing={closing} data-revealing={photoReady && fogClosed}
      aria-labelledby="mission-title" onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}>
      <div className={styles.missionPanel} onAnimationEnd={(event) => {
        if (event.target !== event.currentTarget) return;
        if (closing) {
          setFogClosed(false);
          onExit();
        }
      }}>
        <button className={styles.missionBack} onClick={onClose}><i className="nav-arrow nav-arrow-left" aria-hidden="true" /> {labels.back}</button>
        <LanguageSettings language={language} onChange={onLanguageChange} />
        <MissionContent mission={mission} language={language} photoFailed={photoFailed} />
      </div>
      <div key={closing ? 'closing' : 'opening'} className={styles.missionFog} data-fog={mission.world} aria-hidden="true"
        onAnimationEnd={(event) => {
          if (!closing && event.target === event.currentTarget && !event.nativeEvent.pseudoElement) {
            setFogClosed(true);
            onReveal();
          }
        }} />
    </dialog>
  );
}
