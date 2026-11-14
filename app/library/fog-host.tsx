'use client';

import { useSyncExternalStore } from 'react';
import Fog from './fog';
import { getFog, subscribeFog } from './fog-store';

const idle = { state: 'idle', world: 'space' } as const;

export default function FogHost() {
  const { state, world } = useSyncExternalStore(subscribeFog, getFog, () => idle);
  return <Fog world={world} state={state} />;
}
