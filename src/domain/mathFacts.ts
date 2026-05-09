export type RegularPolygonFacts = {
  sides: number;
  exteriorAngle: number;
  interiorAngle: number;
  interiorAngleSum: number;
};

export function getRegularPolygonFacts(sides: number): RegularPolygonFacts {
  if (!Number.isInteger(sides) || sides < 3) {
    throw new Error(
      '정다각형의 변의 수는 3 이상의 정수여야 합니다.',
    );
  }

  const exteriorAngle = 360 / sides;
  const interiorAngle = 180 - exteriorAngle;
  const interiorAngleSum = (sides - 2) * 180;

  return {
    sides,
    exteriorAngle,
    interiorAngle,
    interiorAngleSum,
  };
}
