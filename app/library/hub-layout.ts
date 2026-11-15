// The WebGL scene and the hit areas share the same world positions.
export type HubWorld = 'moon' | 'mars' | 'space';
export type HubSlot = { x: number; y: number; r: number };

export function isStackedHub(width: number, height: number) {
  return width < 540 || width <= height * 0.9;
}

// x and y are pixels from the centre of the view (y up); r is the planet's radius.
export function hubLayout(width: number, height: number): Record<HubWorld, HubSlot> {
  const top = Math.min(168, height * 0.45);
  const bottom = 16;
  const rowHeight = (height - top - bottom) / 3;
  const y = (bottom - top) / 2;

  if (!isStackedHub(width, height)) {
    const r = Math.min(width * 0.125, (height - top - bottom) * 0.28);
    const gap = Math.min(width * 0.3, r * 2.9);
    return { moon: { x: -gap, y, r }, mars: { x: 0, y, r }, space: { x: gap, y, r } };
  }

  const r = Math.min(width * 0.16, rowHeight * 0.34);
  const x = -width * 0.23;
  return {
    moon: { x, y: y + rowHeight, r },
    mars: { x, y, r },
    space: { x, y: y - rowHeight, r },
  };
}
