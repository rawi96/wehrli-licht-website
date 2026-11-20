import { test as base } from '@playwright/test';
import { smokeFixtures, type SmokeFixtures } from '@smartive/utils/testing/playwright';

export { expect } from '@playwright/test';

/**
 * Every test fails on browser errors: console errors and warnings, uncaught exceptions and failed requests to the
 * website. Third-party requests (Google Tag, Calendly, Google Maps) are blocked, so tests send no hits and their noise
 * does not count; images from DatoCMS are allowed.
 */
export const test = base.extend<SmokeFixtures>({
  ...smokeFixtures({
    allowHosts: ['*.datocms-assets.com'],
  }),
});
