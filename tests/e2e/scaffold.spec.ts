import { type Locator, expect, test } from '@playwright/test';

async function countSegmentColorPixels(
  canvas: Locator,
  expectedColor: { r: number; g: number; b: number; a: number },
  tolerance = 18,
) {
  return canvas.evaluate(
    (element, params) => {
      const canvasElement = element as HTMLCanvasElement;
      const context = canvasElement.getContext('2d');
      if (!context) {
        return 0;
      }

      const imageData = context.getImageData(
        0,
        0,
        canvasElement.width,
        canvasElement.height,
      ).data;

      let count = 0;
      for (let i = 0; i < imageData.length; i += 4) {
        const red = imageData[i];
        const green = imageData[i + 1];
        const blue = imageData[i + 2];
        const alpha = imageData[i + 3];

        if (alpha < 10) {
          continue;
        }

        const match =
          Math.abs(red - params.expectedColor.r) <= params.tolerance &&
          Math.abs(green - params.expectedColor.g) <= params.tolerance &&
          Math.abs(blue - params.expectedColor.b) <= params.tolerance &&
          Math.abs(alpha - params.expectedColor.a) <= params.tolerance;

        if (match) {
          count += 1;
        }
      }

      return count;
    },
    { expectedColor, tolerance },
  );
}

test('runs square challenge and paints segment pixels', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'Turtle Geometry Canvas' }),
  ).toBeVisible();
  const canvas = page.getByTestId('turtle-canvas');

  await page.getByRole('button', { name: '정사각형 불러오기' }).click();

  const beforePixels = await countSegmentColorPixels(canvas, {
    r: 31,
    g: 122,
    b: 92,
    a: 255,
  });

  await page.getByRole('button', { name: '실행' }).click();

  await expect(page.getByRole('status')).toContainText('선분 4개');

  await expect(canvas).toBeVisible();

  await expect
    .poll(
      () =>
        countSegmentColorPixels(canvas, {
          r: 31,
          g: 122,
          b: 92,
          a: 255,
        }),
      { timeout: 7000 },
    )
    .toBeGreaterThan(beforePixels + 300);
});
