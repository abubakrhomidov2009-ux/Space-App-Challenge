'use client';

import MissionContent from './mission-content';
import { useState, type RefObject } from 'react';
import { museumCopy, type Language } from './languages';
import LanguageSettings from './language-settings';
import type { missions, MissionId } from './missions';
import RouteMap from './route-map';
import TrackMap from './track-map';
import { isWideRoute, type Route, type Track } from './routes';
import styles from './museum.module.css';

export default function MissionDialog({
  photoReady,
  photoFailed,
  mission,
  route,
  routeSource,
  odometerSource,
  track,
  trackSource,
  trackLroKm,
  routeRun,
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
  route?: Route;
  routeSource?: string;
  odometerSource?: string;
  track?: Track;
  trackSource?: string;
  trackLroKm?: number;
  routeRun: number;
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
    <dialog ref={dialog} className={styles.mission} data-closing={closing} data-revealing={photoReady && fogClosed} tabIndex={-1}
      aria-labelledby="mission-title" onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}>
      <div className={styles.missionPanel} data-route={Boolean(route || track)} data-wide={Boolean(route && isWideRoute(route))} data-world={mission.world} onAnimationEnd={(event) => {
        if (event.target !== event.currentTarget) return;
        if (closing) {
          setFogClosed(false);
          onExit();
        }
      }}>
        <button className={styles.missionBack} onClick={onClose}>
          <svg className={styles.missionBackIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor"
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M13 8H3m4.5-4.5L3 8l4.5 4.5" />
          </svg>
          {labels.back}
        </button>
        <LanguageSettings language={language} onChange={onLanguageChange} />
        <MissionContent mission={mission} language={language} photoFailed={photoFailed}>
          {track && (
            <TrackMap track={track} language={language} playKey={routeRun} world={mission.world as 'moon' | 'mars'}
              sourceUrl={trackSource} lroKm={trackLroKm}
              lroSource={'distance' in mission.sources ? mission.sources.distance : undefined} />
          )}
          {route && (
            <RouteMap route={route} language={language} playKey={routeRun}
              world={mission.world as 'moon' | 'mars'} sourceUrl={routeSource} odometerSource={odometerSource} />
          )}
        </MissionContent>
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
