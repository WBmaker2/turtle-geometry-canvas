import { expect, test } from '@playwright/test';

test('renders the turtle geometry canvas', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'Turtle Geometry Canvas' }),
  ).toBeVisible();
  const canvas = page.getByTestId('turtle-canvas');

  await page.getByRole('button', { name: '정사각형 불러오기' }).click();
  await page.getByRole('button', { name: '실행' }).click();

  await expect(page.getByRole('status')).toContainText('선분 4개');

  await expect(canvas).toBeVisible();

  const hasDrawing = await canvas.evaluate((element) => {
    const canvasElement = element as HTMLCanvasElement;
    const context = canvasElement.getContext('2d');
    if (!context) {
      return false;
    }

    const imageData = context.getImageData(
      0,
      0,
      canvasElement.width,
      canvasElement.height,
    ).data;

    for (let i = 0; i < imageData.length; i += 4) {
      const red = imageData[i];
      const green = imageData[i + 1];
      const blue = imageData[i + 2];
      const alpha = imageData[i + 3];

      if (alpha !== 0 && (red !== 251 || green !== 253 || blue !== 251)) {
        return true;
      }
    }

    return false;
  });

  expect(hasDrawing).toBe(true);
});
