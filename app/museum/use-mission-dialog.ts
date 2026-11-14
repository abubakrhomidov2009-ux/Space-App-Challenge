import { useEffect, useRef, useState, type RefObject } from 'react';
import { missions, type MissionId } from './missions';
import type { SceneInput } from './scene';

export function useMissionDialog(input: RefObject<SceneInput>, rotation: RefObject<HTMLDivElement | null>) {
  const [selectedMission, setSelectedMission] = useState<MissionId>('lunokhod');
  const dialog = useRef<HTMLDialogElement>(null);
  const [photoReady, setPhotoReady] = useState(false);
  const [photoFailed, setPhotoFailed] = useState(false);
  const photoRequest = useRef<AbortController | null>(null);
  const [closing, setClosing] = useState(false);
  // Counts story openings so a rover route replays each time one opens.
  const [routeRun, setRouteRun] = useState(0);

  useEffect(() => () => photoRequest.current?.abort(), []);

  function openMission(id: MissionId) {
    if (!dialog.current || dialog.current.open) return;
    const request = new AbortController();
    photoRequest.current = request;
    setSelectedMission(id);
    setRouteRun((count) => count + 1);
    setPhotoReady(false);
    setPhotoFailed(false);
    const photo = new window.Image();
    photo.src = missions[id].image;
    const timeout = window.setTimeout(() => reveal(false), 8000);

    function reveal(loaded: boolean) {
      window.clearTimeout(timeout);
      if (request.signal.aborted) return;
      request.abort();
      setPhotoFailed(!loaded);
      setPhotoReady(true);
    }

    request.signal.addEventListener('abort', () => window.clearTimeout(timeout), { once: true });
    void photo.decode().then(() => reveal(true), () => reveal(false));
    input.current.mission = id;
    dialog.current.showModal();
    // showModal focuses the first button, which would show a focus ring after a click.
    dialog.current.focus({ preventScroll: true });
  }

  function finishMission() {
    input.current.missionCovered = false;
    input.current.mission = null;
    input.current.resumeAt = performance.now() + 3000;
    dialog.current?.close();
    setClosing(false);
    rotation.current?.focus({ preventScroll: true });
  }

  function closeMission() {
    if (closing) return;
    photoRequest.current?.abort();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finishMission();
      return;
    }
    input.current.missionCovered = false;
    input.current.mission = null;
    input.current.resumeAt = performance.now() + 3000;
    setClosing(true);
  }

  return {
    selectedMission,
    openMission,
    dialogProps: {
      dialog, photoReady, photoFailed, mission: missions[selectedMission], closing, routeRun,
      onClose: closeMission, onExit: finishMission,
      onReveal: () => { input.current.missionCovered = true; },
    },
  };
}
