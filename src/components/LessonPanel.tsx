import type { Challenge } from '../data/challenges';
import type { RegularPolygonFacts } from '../domain/mathFacts';

type LessonPanelProps = {
  challenge: Challenge;
  facts: RegularPolygonFacts | null;
};

export function LessonPanel({ challenge, facts }: LessonPanelProps) {
  return (
    <section className="lesson-panel" aria-label="오늘의 수학 실험">
      <h2>오늘의 실험</h2>
      <p>{challenge.question}</p>

      {facts ? (
        <p>{`거북이가 한 바퀴 360도를 나누어 돈다고 생각하면 외각은 ${facts.exteriorAngle}도입니다.`}</p>
      ) : (
        <p>탐색 과제에서는 도형의 규칙을 바꿔가며 결과가 어떻게 달라지는지 직접 관찰해 봅니다.</p>
      )}

      {facts ? (
        <dl className="math-facts" aria-label="정다각형 수학 공식">
          <dt>외각</dt>
          <dd>{`${facts.exteriorAngle}도`}</dd>
          <dt>내각</dt>
          <dd>{`${facts.interiorAngle}도`}</dd>
          <dt>내각의 합</dt>
          <dd>{`${facts.interiorAngleSum}도`}</dd>
        </dl>
      ) : null}
    </section>
  );
}
