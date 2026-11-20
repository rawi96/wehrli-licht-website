import { defineConfig, devices } from '@playwright/test';

const ci = !!process.env.CI;
// Not 3000, so reuseExistingServer never picks up a running `next dev`.
const PORT = 3333;
const baseURL = process.env.BASE_URL ?? `http://localhost:${PORT}`;

/**
 * End-to-end tests of the built website. Locally and in CI they start the production build (`pnpm build` first, turbo
 * does that for `pnpm e2e`); with BASE_URL set (e.g. a Vercel preview) they run against that deployment instead.
 * The DatoCMS content is live, so the tests check behaviour and structure, never today's texts.
 */
export default defineConfig({
  testDir: 'tests',
  // Reads the sitemap of the running website once, so pages.spec.ts can create one test per route.
  globalSetup: './global-setup.ts',
  fullyParallel: true,
  forbidOnly: ci,
  // A retry would hide a flaky page; the report still shows it as flaky.
  retries: ci ? 1 : 0,
  workers: ci ? 2 : 4,
  reporter: ci
    ? [['list'], ['junit', { outputFile: 'test-results/junit.xml' }], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    locale: 'de-CH',
    timezoneId: 'Europe/Zurich',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } } },
    // Flows whose UI differs on phones (the mobile menu); pages and HTTP checks run once, on desktop.
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'] },
      testMatch: /navigation\.spec\.ts/,
    },
  ],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: `pnpm --filter @wehrli/website start -p ${PORT}`,
        url: `${baseURL}/sitemap.xml`,
        timeout: 60_000,
        reuseExistingServer: !ci,
      },
});
