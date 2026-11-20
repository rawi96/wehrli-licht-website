import { cart, expectCartOpen, openFirstProduct } from './support/shop';
import { expect, test } from './support/fixtures';

// The shop flow up to the payment step, with whatever products are in DatoCMS: no order is placed (that would send
// e-mails or open Stripe).

test('a visitor adds a product to the cart and goes to the checkout', async ({ page }) => {
  const productName = await openFirstProduct(page);

  await test.step('add it to the cart', async () => {
    await page.getByRole('button', { name: 'Zum Warenkorb hinzufügen' }).click();
    await expectCartOpen(page);
    await expect(cart(page).getByRole('link', { name: productName })).toBeVisible();
  });

  await test.step('change the quantity', async () => {
    const quantity = cart(page).getByRole('combobox').first();
    await quantity.selectOption('3');
    await expect(quantity).toHaveValue('3');
  });

  await test.step('go to the checkout and through the shipping step', async () => {
    await cart(page).getByRole('button', { name: 'Zur Kasse' }).click();
    await expect(page).toHaveURL(/\/shop\/checkout(\?step=shipping)?$/);
    await expect(page.getByRole('radio')).toHaveCount(2);
    await page.getByRole('radio').last().check();
    await page.getByRole('button', { name: 'Weiter' }).click();
  });

  await test.step('the details step asks for the address and validates it', async () => {
    await expect(page.getByLabel('Vorname')).toBeVisible();
    await page.getByRole('button', { name: 'Weiter' }).click();
    // The browser's validation keeps the visitor on the step while required fields are empty.
    await expect(page.getByLabel('Vorname')).toBeVisible();
  });
});

test('the cart survives a reload and a product can be removed', async ({ page }) => {
  await openFirstProduct(page);
  await page.getByRole('button', { name: 'Zum Warenkorb hinzufügen' }).click();
  await expectCartOpen(page);

  await page.reload();
  await page
    .getByRole('button', { name: /Warenkorb, 1 Artikel/ })
    .first()
    .click();
  await expect(cart(page).getByRole('button', { name: 'Entfernen' })).toHaveCount(1);

  await cart(page).getByRole('button', { name: 'Entfernen' }).click();
  await expect(cart(page).getByRole('button', { name: 'Entfernen' })).toHaveCount(0);
});

test('the catalog search filters the products', async ({ page }) => {
  await page.goto('/shop/alle-leuchten');
  const products = page.locator('main a[href^="/shop/produkte/"]');
  const total = await products.count();
  expect(total).toBeGreaterThan(0);

  await page.getByRole('searchbox').fill('zzzz-keine-leuchte');
  await expect(products).toHaveCount(0);

  await page.getByRole('searchbox').fill('');
  await expect(products).toHaveCount(total);
});
