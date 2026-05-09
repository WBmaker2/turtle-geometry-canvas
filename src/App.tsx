import './App.css';

export default function App() {
  return (
    <main className="app-shell">
      <section className="control-panel" aria-label="블록 코딩 명령 패널">
        <h1>Turtle Geometry Canvas</h1>
        <p>거북이 명령을 실행해 정다각형의 외각과 내각을 실험합니다.</p>
      </section>
      <section className="canvas-stage" aria-label="거북이 그리기 캔버스">
        <div className="canvas-placeholder">캔버스 준비 중</div>
      </section>
    </main>
  );
}
