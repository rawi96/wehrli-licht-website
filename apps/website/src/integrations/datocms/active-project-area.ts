import 'server-only';
import type { ProjectArea } from '@/domain/content/project';
import { cache } from 'react';

/**
 * The project area whose page is rendered in this request (/projekte/<slug>), read by the projects overview block
 * so the area page is the overview page with that area's chip active. Request-scoped through React's cache.
 */
const store = cache((): { area: ProjectArea | null } => ({ area: null }));

export const setActiveProjectArea = (area: ProjectArea): void => {
  store().area = area;
};

export const getActiveProjectArea = (): ProjectArea | null => store().area;
