import { describe, expect, it } from 'vitest';
import { runTurtleProgram } from './turtle';

describe('runTurtleProgram', () => {
  it('draws a square from four move and right-turn pairs', () => {
    const result = runTurtleProgram([
      { type: 'move', distance: 100 },
      { type: 'turn', direction: 'right', degrees: 90 },
      { type: 'move', distance: 100 },
      { type: 'turn', direction: 'right', degrees: 90 },
      { type: 'move', distance: 100 },
      { type: 'turn', direction: 'right', degrees: 90 },
      { type: 'move', distance: 100 },
    ]);

    expect(result.segments).toHaveLength(4);
    expect(result.segments[0]).toMatchObject({
      from: { x: 0, y: 0 },
      to: { x: 100, y: 0 },
      color: '#1f7a5c',
    });
    expect(result.finalState.x).toBeCloseTo(0, 5);
    expect(result.finalState.y).toBeCloseTo(0, 5);
  });

  it('keeps pen color on segments after color command changes', () => {
    const result = runTurtleProgram([
      { type: 'penColor', color: '#d94f30' },
      { type: 'move', distance: 60 },
    ]);

    expect(result.segments[0].color).toBe('#d94f30');
  });

  it('supports repeat commands for regular polygons', () => {
    const result = runTurtleProgram([
      {
        type: 'repeat',
        times: 3,
        commands: [
          { type: 'move', distance: 80 },
          { type: 'turn', direction: 'right', degrees: 120 },
        ],
      },
    ]);

    expect(result.segments).toHaveLength(3);
    expect(result.finalState.x).toBeCloseTo(0, 5);
    expect(result.finalState.y).toBeCloseTo(0, 5);
  });
});
