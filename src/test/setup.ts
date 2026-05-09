import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, vi } from 'vitest';

type MockCanvasContext = {
  setTransform: ReturnType<typeof vi.fn>;
  fillRect: ReturnType<typeof vi.fn>;
  beginPath: ReturnType<typeof vi.fn>;
  moveTo: ReturnType<typeof vi.fn>;
  lineTo: ReturnType<typeof vi.fn>;
  stroke: ReturnType<typeof vi.fn>;
  save: ReturnType<typeof vi.fn>;
  translate: ReturnType<typeof vi.fn>;
  rotate: ReturnType<typeof vi.fn>;
  closePath: ReturnType<typeof vi.fn>;
  fill: ReturnType<typeof vi.fn>;
  clearRect: ReturnType<typeof vi.fn>;
  rect: ReturnType<typeof vi.fn>;
  restore: ReturnType<typeof vi.fn>;
  strokeStyle: string;
  lineWidth: number;
  lineCap: string;
  lineJoin: string;
};

let mockCanvasContext: MockCanvasContext;

function createMockCanvasContext(): MockCanvasContext {
  return {
    setTransform: vi.fn(),
    fillRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    save: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    closePath: vi.fn(),
    fill: vi.fn(),
    clearRect: vi.fn(),
    rect: vi.fn(),
    restore: vi.fn(),
    strokeStyle: '#1f7a5c',
    lineWidth: 1,
    lineCap: 'round',
    lineJoin: 'round',
  };
}

export function getMockCanvasContext(): CanvasRenderingContext2D {
  return mockCanvasContext as unknown as CanvasRenderingContext2D;
}

beforeEach(() => {
  mockCanvasContext = createMockCanvasContext();
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
    mockCanvasContext as unknown as CanvasRenderingContext2D,
  );
});

afterEach(() => {
  vi.restoreAllMocks();
});
