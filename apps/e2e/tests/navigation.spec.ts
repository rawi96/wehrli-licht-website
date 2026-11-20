import { expect, test } from './support/fixtures';

// Runs on desktop and on a phone (playwright.config.ts): the main navigation, the mobile menu and the 404 page.

test('the main navigation leads to the shop', async ({ page, isMobile }) => {
  await page.goto('/');

  if (isMobile) {
    await page.getByRole('button', { name: 'Menu öffnen' }).click();
    const menu = page.getByRole('dialog');
    await expect(menu.getByRole('button', { name: 'Menu schliessen' })).toBeVisible();
    await menu.getByRole('link', { name: 'Shop', exact: true }).click();
  } else {
    await page.getByRole('navigation', { name: 'Hauptnavigation' }).getByRole('link', { name: 'Shop', exact: true }).click();
  }

  await expect(page).toHaveURL(/\/shop$/);
  await expect(page.locator('h1').first()).toBeVisible();
});

test('a missing page shows the 404 page with links back', async ({ page, smoke }) => {
  const response = await page.goto('/diese-seite-gibt-es-nicht');

  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Zur Startseite' })).toHaveAttribute('href', '/');
  // The 404 response of the page itself is expected.
  smoke.issues = smoke.issues.filter((issue) => !issue.text.includes('diese-seite-gibt-es-nicht'));
});
