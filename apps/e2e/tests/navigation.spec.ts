import { expect, test } from './support/fixtures';

// Runs on desktop and on a phone (playwright.config.ts): the main navigation, the mobile menu and the 404 page.

test('the main navigation leads to the shop', async ({ page, isMobile }) => {
  await page.goto('/');

  // The shop is the last main entry. Its label comes from DatoCMS; with columns it opens a panel that links /shop.
  if (isMobile) {
    await page.getByRole('button', { name: 'Menu öffnen' }).click();
    const menu = page.getByRole('dialog');
    await expect(menu.getByRole('button', { name: 'Menu schliessen' })).toBeVisible();
    if ((await menu.locator('a[href="/shop"]:visible').count()) === 0) {
      await menu.getByRole('button', { expanded: false }).last().click();
    }
    await menu.locator('a[href="/shop"]:visible').first().click();
  } else {
    const navigation = page.getByRole('navigation', { name: 'Hauptnavigation' });
    if ((await navigation.locator('a[href="/shop"]:visible').count()) === 0) {
      await navigation.getByRole('button', { expanded: false }).last().click();
    }
    await navigation.locator('a[href="/shop"]:visible').first().click();
  }

  await expect(page).toHaveURL(/\/shop$/);
  await expect(page.locator('h1').first()).toBeVisible();
});

test('a missing page shows the 404 page with links back', async ({ page, smoke }) => {
  const response = await page.goto('/diese-seite-gibt-es-nicht');

  expect(response?.status()).toBe(404);
  const heading = page.getByRole('heading', { level: 1 });
  await expect(heading).toBeVisible();
  // The home link of the 404 text itself (not the logo); its text is maintained in DatoCMS («Texte & Beschriftungen»).
  const view = page.locator('div').filter({ has: heading }).last();
  const home = view.locator('a[href="/"]');
  await expect(home).toBeVisible();
  await expect(home).not.toHaveText('');
  // The 404 response of the page itself is expected.
  smoke.issues = smoke.issues.filter((issue) => !issue.text.includes('diese-seite-gibt-es-nicht'));
});
