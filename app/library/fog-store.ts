// The fog lives in the library layout, so it stays mounted while the page under it changes.
// That is what lets it close on one page and open on the next without a gap between them.
export type FogState = 'idle' | 'close' | 'open';
type Fog = { state: FogState; world: string };

let current: Fog = { state: 'idle', world: 'space' };
const listeners = new Set<() => void>();

export function getFog() {
  return current;
}

export function setFog(state: FogState, world = current.world) {
  current = { state, world };
  for (const listener of listeners) listener();
}

export function subscribeFog(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
