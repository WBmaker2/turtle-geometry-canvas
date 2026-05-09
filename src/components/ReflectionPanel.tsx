type ReflectionPanelProps = {
  segmentCount: number;
  reflection: string;
};

export function ReflectionPanel({
  segmentCount,
  reflection,
}: ReflectionPanelProps) {
  return (
    <section className="reflection-panel" aria-label="관찰 기록">
      <h2>관찰 기록</h2>
      <p>{`실행 후 그려진 선분은 ${segmentCount}개입니다.`}</p>
      <p>{reflection}</p>
    </section>
  );
}
