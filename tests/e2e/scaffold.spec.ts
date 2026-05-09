import { expect, test } from '@playwright/test';

test('renders the turtle geometry scaffold', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'Turtle Geometry Canvas' }),
  ).toBeVisible();
  await expect(page.getByText('캔버스 준비 중')).toBeVisible();
});
