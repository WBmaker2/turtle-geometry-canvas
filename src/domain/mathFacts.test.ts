import { describe, expect, it } from 'vitest';
import { getRegularPolygonFacts } from './mathFacts';

describe('getRegularPolygonFacts', () => {
  it('calculates exterior angle and interior angle sum', () => {
    expect(getRegularPolygonFacts(5)).toEqual({
      sides: 5,
      exteriorAngle: 72,
      interiorAngle: 108,
      interiorAngleSum: 540,
    });
  });
});
