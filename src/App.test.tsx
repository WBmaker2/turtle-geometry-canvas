import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import App from './App';

function mockCanvasContext() {
  const contextMock = {
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
  } as unknown as CanvasRenderingContext2D;

  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(contextMock);
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('App', () => {
  it('loads the square challenge and runs geometry facts after execute', async () => {
    mockCanvasContext();
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: '정사각형 불러오기' }));
    await user.click(screen.getByRole('button', { name: '실행' }));

    expect(screen.getByRole('status')).toHaveTextContent('실행 결과: 선분 4개');
    expect(screen.getByLabelText('정다각형 수학 공식')).toHaveTextContent(/외각\s*90도/);
  });

  it('adds a color command when 색상 적용 is clicked', async () => {
    mockCanvasContext();
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: '색상 적용' }));
    expect(screen.getByText('펜 색상 #1f7a5c')).toBeInTheDocument();
  });
});
