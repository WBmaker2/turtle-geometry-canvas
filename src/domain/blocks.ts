import type { TurtleCommand, TurnDirection } from './turtle';

export type ProgramBlock =
  | {
      id: string;
      kind: 'move';
      distance: number;
    }
  | {
      id: string;
      kind: 'turn';
      direction: TurnDirection;
      degrees: number;
    }
  | {
      id: string;
      kind: 'penColor';
      color: string;
    }
  | {
      id: string;
      kind: 'repeatPolygon';
      times: number;
      distance: number;
      turnDegrees: number;
      direction: TurnDirection;
    };

export function expandBlocks(blocks: ProgramBlock[]): TurtleCommand[] {
  return blocks.map((block): TurtleCommand => {
    if (block.kind === 'move') {
      return { type: 'move', distance: block.distance };
    }

    if (block.kind === 'turn') {
      return {
        type: 'turn',
        direction: block.direction,
        degrees: block.degrees,
      };
    }

    if (block.kind === 'penColor') {
      return { type: 'penColor', color: block.color };
    }

    return {
      type: 'repeat',
      times: block.times,
      commands: [
        { type: 'move', distance: block.distance },
        { type: 'turn', direction: block.direction, degrees: block.turnDegrees },
      ],
    };
  });
}
