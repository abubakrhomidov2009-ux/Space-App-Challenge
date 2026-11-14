// Where the three worlds stand on the library's first screen. The scene draws them there and the
// page lays its labels and hit areas over the same spots, so both read this one function.
export type HubWorld = 'moon' | 'mars' | 'space';
export type HubSlot = { x: number; y: number; r: number };

// x and y are pixels from the centre of the view (y up); r is the planet's radius.
export function hubLayout(width: number, height: number): Record<HubWorld, HubSlot> {
  if (width >= 720 && width > height * 0.9) {
    const r = Math.min(width * 0.125, height * 0.25);
    const gap = Math.min(width * 0.3, r * 2.9);
    const y = -height * 0.03;
    return { moon: { x: -gap, y, r }, mars: { x: 0, y, r }, space: { x: gap, y, r } };
  }
  const r = Math.min(width * 0.25, height * 0.1);
  const step = Math.min(height * 0.25, r * 2.55);
  const shift = -height * 0.04;
  return { moon: { x: 0, y: step + shift, r }, mars: { x: 0, y: shift, r }, space: { x: 0, y: -step + shift, r } };
}
