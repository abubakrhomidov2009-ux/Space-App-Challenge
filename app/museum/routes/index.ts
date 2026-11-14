import type { MissionId } from '../missions';
import { opportunityRoute } from './opportunity';
import { spiritRoute } from './spirit';

export type Route = {
  // Length of the line through the recorded drive end points.
  totalKm: number;
  // Official wheel odometer reading, when it differs noticeably from the line.
  odometerKm?: number;
  lastSol: number;
  // [metres east, metres north, sol, kilometres driven so far]
  points: [number, number, number, number][];
};

// A route wider than it is tall needs a wider column to stay legible.
export function isWideRoute(route: Route) {
  const xs = route.points.map((p) => p[0]);
  const ys = route.points.map((p) => p[1]);
  return Math.max(...xs) - Math.min(...xs) > Math.max(...ys) - Math.min(...ys);
}

// Routes come from mission data, not from the component that draws them.
export const routes: Partial<Record<MissionId, Route>> = {
  opportunity: opportunityRoute,
  spirit: spiritRoute,
};

// Both tables are published on the same MER Analyst's Notebook page.
const traversePage = 'https://an.rsl.wustl.edu/mera/AN/pages/mer/mer_traverse.htm';

export const routeSources: Partial<Record<MissionId, string>> = {
  opportunity: traversePage,
  spirit: traversePage,
};

// Where the odometer figure comes from.
export const odometerSources: Partial<Record<MissionId, string>> = {
  spirit: 'https://science.nasa.gov/3d-resources/mars-spirit-rover-path/',
};
