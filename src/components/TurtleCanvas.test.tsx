import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TurtleCanvas } from './TurtleCanvas';
import type { DrawSegment, TurtleState } from '../domain/turtle';
import { getMockCanvasContext } from '../test/setup';

describe('TurtleCanvas', () => {
  it('draws canvas with grid, segment path, and turtle state', () => {
    const contextMock = getMockCanvasContext();

    const segments: DrawSegment[] = [
      {
        from: { x: -10, y: 5 },
        to: { x: 20, y: 15 },
        color: '#1f7a5c',
      },
    ];
    const turtle: TurtleState = {
      x: 20,
      y: 15,
      heading: 90,
      penColor: '#1f7a5c',
    };

    render(<TurtleCanvas segments={segments} turtle={turtle} animate={false} />);

    const canvas = screen.getByTestId('turtle-canvas');
    expect(canvas).toBeInTheDocument();
    expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalled();

    expect(contextMock.lineTo).toHaveBeenCalledWith(760 / 2 + 20, 560 / 2 + 15);
    expect(contextMock.ellipse).toHaveBeenCalled();
  });
});
