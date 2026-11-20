import { gotoAndSettle, readRoutes } from '@smartive/utils/testing/playwright';
import { expect, test } from './support/fixtures';

// Every page of the sitemap renders in the browser without errors (see the smoke fixtures): CMS pages with all their
// blocks, the FAQ, the shop, every category and every product. The routes come from global-setup.ts.
for (const route of readRoutes()) {
  test(`page ${route}`, async ({ page }) => {
    const response = await gotoAndSettle(page, route);

    expect(response?.status()).toBe(200);
    // Layout only; which headings and blocks a page has is up to the editors.
    await expect(page.getByRole('navigation', { name: 'Hauptnavigation' })).toBeVisible();
    // The footer sits inside <main> (no contentinfo role), and blocks may contain <footer>s of their own.
    await expect(page.locator('footer').last()).toBeVisible();
  });
}
