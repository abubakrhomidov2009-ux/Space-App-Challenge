import type { MissionId } from '../missions';
import { opportunityRoute } from './opportunity';

export type Route = typeof opportunityRoute;

// Routes come from mission data, not from the component that draws them.
export const routes: Partial<Record<MissionId, Route>> = {
  opportunity: opportunityRoute,
};

export const routeSources: Partial<Record<MissionId, string>> = {
  opportunity: 'https://an.rsl.wustl.edu/mera/AN/pages/mer/mer_traverse.htm',
};
