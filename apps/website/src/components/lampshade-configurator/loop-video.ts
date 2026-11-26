import type { LoopVideoSource } from '@wehrli/design-system';

/**
 * The short loop of the 3D configurator shown in every configurator teaser (home page, shop, configurator page).
 * Served with the website (public/videos, cached for a year) rather than from DatoCMS: DatoCMS streams videos via
 * Mux, which counts against the plan's video quota. A new clip gets a new version in its file name.
 */
export const CONFIGURATOR_LOOP_VIDEO: LoopVideoSource[] = [
  { src: '/videos/lampenschirm-konfigurator-3d-loop-v1.webm', type: 'video/webm' },
  { src: '/videos/lampenschirm-konfigurator-3d-loop-v1.mp4', type: 'video/mp4' },
];
