import { expect, test } from '@playwright/test';

test('renders the turtle geometry canvas', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'Turtle Geometry Canvas' }),
  ).toBeVisible();
  await expect(page.getByTestId('turtle-canvas')).toBeVisible();
});
