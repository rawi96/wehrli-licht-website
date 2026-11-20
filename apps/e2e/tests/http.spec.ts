// Plain `test` from Playwright: no browser, only HTTP requests.
import { expect, test } from '@playwright/test';
import { checkUrls, fetchSitemapRoutes, formatUrlCheckFailures } from '@smartive/utils/testing';

test('every URL of the sitemap answers 200', async ({ baseURL }) => {
  if (!baseURL) {
    throw new Error('use.baseURL is not set in the Playwright config');
  }

  // The whole sitemap (pages, categories, products) takes longer than Playwright's 30 s default.
  test.setTimeout(5 * 60_000);

  const results = await checkUrls(await fetchSitemapRoutes({ baseURL }), { baseURL });

  expect(formatUrlCheckFailures(results)).toBe('');
});

test('robots.txt, the Google Shopping feed and llms.txt are served', async ({ request }) => {
  for (const path of ['/robots.txt', '/feed/google-shopping.xml', '/llms.txt']) {
    const response = await request.get(path);

    expect(response.status(), path).toBe(200);
  }
});

test('an unknown path answers 404', async ({ request }) => {
  const response = await request.get('/diese-seite-gibt-es-nicht');

  expect(response.status()).toBe(404);
});
