import type { MissionId } from '../missions';
import { opportunityRoute } from './opportunity';
import { lunokhodTrack } from './lunokhod';
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

// A track redrawn from a map: it shows where a rover went but not in which order,
// so it is drawn outward from the landing site instead of as a drive.
export type Track = typeof lunokhodTrack;

export const tracks: Partial<Record<MissionId, Track>> = {
  lunokhod: lunokhodTrack,
};

export const trackSources: Partial<Record<MissionId, string>> = {
  lunokhod: 'https://planetarynames.wr.usgs.gov/images/Lunar/Lunokhod-1_traverse_map_Luna_17.pdf',
};

// Length of the traverse measured from LRO images (Karachevtseva et al., 2013), in km.
export const trackLroKm: Partial<Record<MissionId, number>> = {
  lunokhod: 9.93,
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

// Everything a story needs to draw its rover route or track, in one place,
// so the home page, the globe and the library show the same maps.
export function missionExtras(id: MissionId) {
  return {
    route: routes[id],
    routeSource: routeSources[id],
    odometerSource: odometerSources[id],
    track: tracks[id],
    trackSource: trackSources[id],
    trackLroKm: trackLroKm[id],
  };
}
