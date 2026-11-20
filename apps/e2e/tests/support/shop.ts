import { expect, test, type Page } from '@playwright/test';

/** Opens the first product of the catalog (whatever DatoCMS has) and returns its name. */
export const openFirstProduct = (page: Page) =>
  test.step('open the first product of the catalog', async () => {
    await page.goto('/shop/alle-leuchten');
    const firstProduct = page.locator('main a[href^="/shop/produkte/"]').first();
    await expect(firstProduct).toBeVisible();
    await firstProduct.click();
    await expect(page).toHaveURL(/\/shop\/produkte\/[^/]+$/);
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();

    return (await heading.textContent())?.trim() ?? '';
  });

/** The cart dialog. Headless UI's dialog element has no box of its own, so tests look at its title. */
export const cart = (page: Page) => page.getByRole('dialog', { name: 'Warenkorb' });

export const expectCartOpen = (page: Page) =>
  expect(cart(page).getByRole('heading', { name: 'Warenkorb', exact: true })).toBeVisible();
