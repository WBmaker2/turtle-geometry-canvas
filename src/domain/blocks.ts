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
  return blocks.map((block) => {
    switch (block.kind) {
      case 'move':
        return { type: 'move', distance: block.distance };
      case 'turn':
        return {
          type: 'turn',
          direction: block.direction,
          degrees: block.degrees,
        };
      case 'penColor':
        return { type: 'penColor', color: block.color };
      case 'repeatPolygon':
        return {
          type: 'repeat',
          times: block.times,
          commands: [
            { type: 'move', distance: block.distance },
            { type: 'turn', direction: block.direction, degrees: block.turnDegrees },
          ],
        };
      default:
        return assertNever(block);
    }
  });
}

function assertNever(block: never): never {
  throw new Error(`Unhandled block kind: ${(block as { kind?: string }).kind}`);
}
