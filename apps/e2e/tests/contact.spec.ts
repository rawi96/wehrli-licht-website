import { expect, test } from './support/fixtures';
import { openFirstProduct } from './support/shop';

// The contact form validates in the browser; nothing is sent (that would e-mail the shop).

test('the question link of a product opens the contact form with the product', async ({ page }) => {
  const productName = await openFirstProduct(page);

  await page.getByRole('link', { name: 'Schreiben Sie uns' }).click();

  await expect(page).toHaveURL(/#kontaktformular$/);
  await expect.poll(() => page.getByLabel('Nachricht *').inputValue()).toContain(productName);
});

test('the contact form shows errors for missing fields', async ({ page }) => {
  await openFirstProduct(page);
  await page.getByRole('link', { name: 'Schreiben Sie uns' }).click();

  await page.getByLabel('Nachricht *').fill('');
  await page.getByRole('button', { name: 'Anfrage senden' }).click();

  await expect(page.getByLabel('Name *')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByLabel('Nachricht *')).toHaveAttribute('aria-invalid', 'true');
});
