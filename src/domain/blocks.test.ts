import { describe, expect, it } from 'vitest';
import { expandBlocks } from './blocks';

describe('expandBlocks', () => {
  it('expands a repeat polygon block into move and turn commands', () => {
    expect(
      expandBlocks([
        {
          id: 'square',
          kind: 'repeatPolygon',
          times: 4,
          distance: 80,
          turnDegrees: 90,
          direction: 'right',
        },
      ]),
    ).toEqual([
      {
        type: 'repeat',
        times: 4,
        commands: [
          { type: 'move', distance: 80 },
          { type: 'turn', direction: 'right', degrees: 90 },
        ],
      },
    ]);
  });

  it('keeps direct commands in order', () => {
    expect(
      expandBlocks([
        { id: 'color', kind: 'penColor', color: '#3b5bdb' },
        { id: 'move', kind: 'move', distance: 50 },
        { id: 'turn', kind: 'turn', direction: 'left', degrees: 72 },
      ]),
    ).toEqual([
      { type: 'penColor', color: '#3b5bdb' },
      { type: 'move', distance: 50 },
      { type: 'turn', direction: 'left', degrees: 72 },
    ]);
  });
});
