import { describe, expect, it } from 'vitest';
import { getRegularPolygonFacts } from '../domain/mathFacts';
import { challenges, type Challenge, type RegularChallenge } from './challenges';
import type { ProgramBlock } from '../domain/blocks';

type RepeatPolygonBlock = Extract<
  ProgramBlock,
  { kind: 'repeatPolygon'; times: number; distance: number; turnDegrees: number }
>;

function isRegularChallenge(
  challenge: Challenge,
): challenge is RegularChallenge {
  return challenge.kind === 'regular';
}

describe('challenges data model consistency', () => {
  it('regular challenges expose numeric sides and matching repeat block', () => {
    const regularChallenges = challenges.filter(isRegularChallenge);
    const regularIds = regularChallenges.map((challenge) => challenge.id).sort();

    expect(regularChallenges).toHaveLength(5);
    expect(regularIds).toEqual([
      'hexagon',
      'octagon',
      'pentagon',
      'square',
      'triangle',
    ]);

    for (const challenge of regularChallenges) {
      expect(Number.isInteger(challenge.sides)).toBe(true);
      expect(challenge.sides).toBeGreaterThanOrEqual(3);

      const repeatBlocks = challenge.blocks.filter(
        (block): block is RepeatPolygonBlock => block.kind === 'repeatPolygon',
      );

      expect(repeatBlocks).toHaveLength(1);

      const repeatBlock = repeatBlocks[0];

      expect(repeatBlock.id).toEqual(expect.any(String));
      expect(repeatBlock.times).toEqual(challenge.sides);
      expect(Number.isInteger(repeatBlock.times)).toBe(true);
      expect(repeatBlock.times).toBeGreaterThan(0);
      expect(Number.isFinite(repeatBlock.distance)).toBe(true);
      expect(repeatBlock.distance).toBeGreaterThan(0);
      expect(repeatBlock.turnDegrees).toBe(360 / challenge.sides);

      const facts = getRegularPolygonFacts(challenge.sides);
      expect(facts.exteriorAngle).toBe(repeatBlock.turnDegrees);
      expect(facts.sides).toBe(challenge.sides);
      expect(facts.interiorAngle).toBe(180 - facts.exteriorAngle);
      expect(facts.interiorAngleSum).toBe((facts.sides - 2) * 180);
    }
  });

  it('contains exploration challenge that is not regular polygon math', () => {
    const exploration = challenges.find((challenge) => challenge.kind === 'exploration');
    const explorationIds = challenges
      .filter((challenge) => challenge.kind === 'exploration')
      .map((challenge) => challenge.id);

    expect(exploration).toBeDefined();
    expect(exploration).toHaveProperty('kind', 'exploration');
    expect(exploration).not.toHaveProperty('sides');
    expect(explorationIds).toContain('flower');
    expect(explorationIds).toContain('spiral');
    expect(explorationIds).toContain('star');

    expect(() => getRegularPolygonFacts((exploration as any).sides)).toThrowError(
      '정다각형의 변의 수는 3 이상의 정수여야 합니다.',
    );
  });
});
