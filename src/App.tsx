import { useMemo, useState } from 'react';

import { TurtleCanvas } from './components/TurtleCanvas';
import { CommandPanel } from './components/CommandPanel';
import { LessonPanel } from './components/LessonPanel';
import { ReflectionPanel } from './components/ReflectionPanel';
import { expandBlocks } from './domain/blocks';
import { getRegularPolygonFacts } from './domain/mathFacts';
import { runTurtleProgram } from './domain/turtle';
import { challenges, type Challenge } from './data/challenges';
import type { ProgramBlock } from './domain/blocks';
import './App.css';

function getInitialSquareChallenge(challenges: Challenge[]) {
  return challenges.find(({ id }) => id === 'square') ?? challenges[0];
}

function cloneBlocks(blocks: ProgramBlock[]) {
  return blocks.map((block) => ({ ...block }));
}

export default function App() {
  const initialChallenge = getInitialSquareChallenge(challenges);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(
    initialChallenge.id,
  );
  const [blocks, setBlocks] = useState<ProgramBlock[]>(
    cloneBlocks(initialChallenge.blocks),
  );
  const [executedBlocks, setExecutedBlocks] = useState<ProgramBlock[]>([]);

  const selectedChallenge = useMemo(
    () => challenges.find(({ id }) => id === selectedChallengeId) ?? initialChallenge,
    [selectedChallengeId],
  );

  const programResult = runTurtleProgram(expandBlocks(executedBlocks));

  const regularFacts =
    selectedChallenge.kind === 'regular'
      ? getRegularPolygonFacts(selectedChallenge.sides)
      : null;

  const loadChallenge = (challengeId: string) => {
    const challenge = challenges.find(({ id }) => id === challengeId);
    if (!challenge) {
      return;
    }

    setSelectedChallengeId(challenge.id);
    setBlocks(cloneBlocks(challenge.blocks));
    setExecutedBlocks([]);
  };

  const addMoveBlock = () => {
    setBlocks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), kind: 'move', distance: 80 },
    ]);
  };

  const addTurnBlock = () => {
    setBlocks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        kind: 'turn',
        direction: 'right',
        degrees: 90,
      },
    ]);
  };

  const applyColor = (color: string) => {
    setBlocks((prev) => [...prev, { id: crypto.randomUUID(), kind: 'penColor', color }]);
  };

  return (
    <main className="app-shell">
      <CommandPanel
        blocks={blocks}
        challenges={challenges}
        onLoadChallenge={loadChallenge}
        onAddMove={addMoveBlock}
        onAddTurn={addTurnBlock}
        onSetColor={applyColor}
        onRun={() => setExecutedBlocks(cloneBlocks(blocks))}
        onReset={() => setExecutedBlocks([])}
        onClear={() => {
          setBlocks([]);
          setExecutedBlocks([]);
        }}
      />

      <section className="workspace" aria-label="거북이 학습 워크스페이스">
        <section className="canvas-stage" aria-label="거북이 그리기 캔버스">
          <TurtleCanvas
            segments={programResult.segments}
            turtle={programResult.finalState}
          />
        </section>

        <section className="result-panel">
          <LessonPanel challenge={selectedChallenge} facts={regularFacts} />
          <ReflectionPanel
            segmentCount={programResult.segments.length}
            reflection={selectedChallenge.reflection}
          />

          <div role="status" aria-live="polite" className="status">
            실행 결과: 선분 {programResult.segments.length}개
          </div>
        </section>
      </section>
    </main>
  );
}
