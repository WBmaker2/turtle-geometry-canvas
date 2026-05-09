import type { TurtleCommand, TurnDirection } from './turtle';

type MoveBlock = Extract<ProgramBlock, { kind: 'move' }>;
type TurnBlock = Extract<ProgramBlock, { kind: 'turn' }>;
type PenColorBlock = Extract<ProgramBlock, { kind: 'penColor' }>;
type RepeatPolygonBlock = Extract<ProgramBlock, { kind: 'repeatPolygon' }>;

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

export type ProgramBlockPatch =
  | (Partial<Omit<MoveBlock, 'id' | 'kind'>> & {
      kind?: 'move';
    })
  | (Partial<Omit<TurnBlock, 'id' | 'kind'>> & {
      kind?: 'turn';
    })
  | (Partial<Omit<PenColorBlock, 'id' | 'kind'>> & {
      kind?: 'penColor';
    })
  | (
      Partial<Omit<RepeatPolygonBlock, 'id' | 'kind'>> & {
        kind?: 'repeatPolygon';
      }
    );

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
