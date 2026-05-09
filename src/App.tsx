import { useMemo, useRef, useState } from 'react';

import { TurtleCanvas } from './components/TurtleCanvas';
import { CommandPanel } from './components/CommandPanel';
import { LessonPanel } from './components/LessonPanel';
import { ReflectionPanel } from './components/ReflectionPanel';
import { expandBlocks } from './domain/blocks';
import type { ProgramBlockPatch } from './domain/blocks';
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

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

  const updateBlock = (blockId: string, patch: ProgramBlockPatch) => {
    setBlocks((prev) =>
      prev.map((block) => {
        if (block.id !== blockId) {
          return block;
        }

        if (block.kind === 'move') {
          const next = { ...block };
          const movePatch = patch as Partial<{ distance?: number }>;
          if (
            typeof movePatch.distance === 'number' &&
            Number.isFinite(movePatch.distance)
          ) {
            next.distance = clamp(Math.round(movePatch.distance), 1, 240);
          }
          return next;
        }

        if (block.kind === 'turn') {
          const next = { ...block };
          const turnPatch = patch as Partial<{ direction?: string; degrees?: number }>;
          if (turnPatch.direction === 'left' || turnPatch.direction === 'right') {
            next.direction = turnPatch.direction;
          }

          if (
            typeof turnPatch.degrees === 'number' &&
            Number.isFinite(turnPatch.degrees)
          ) {
            next.degrees = clamp(Math.round(turnPatch.degrees), 0, 360);
          }
          return next;
        }

        if (block.kind === 'penColor') {
          const next = { ...block };
          const colorPatch = patch as Partial<{ color?: string }>;
          if (typeof colorPatch.color === 'string') {
            next.color = colorPatch.color;
          }
          return next;
        }

        if (block.kind === 'repeatPolygon') {
          const next = { ...block };
          const repeatPatch = patch as Partial<{
            times?: number;
            distance?: number;
            turnDegrees?: number;
            direction?: string;
          }>;

          if ('times' in patch) {
            if (
              typeof repeatPatch.times === 'number' &&
              Number.isFinite(repeatPatch.times)
            ) {
              next.times = clamp(Math.round(repeatPatch.times), 1, 24);
            }
          }

          if ('distance' in repeatPatch) {
            if (
              typeof repeatPatch.distance === 'number' &&
              Number.isFinite(repeatPatch.distance)
            ) {
              next.distance = clamp(Math.round(repeatPatch.distance), 1, 240);
            }
          }

          if ('turnDegrees' in repeatPatch) {
            if (
              typeof repeatPatch.turnDegrees === 'number' &&
              Number.isFinite(repeatPatch.turnDegrees)
            ) {
              next.turnDegrees = clamp(Math.round(repeatPatch.turnDegrees), 0, 360);
            }
          }

          if ('direction' in repeatPatch) {
            if (repeatPatch.direction === 'left' || repeatPatch.direction === 'right') {
              next.direction = repeatPatch.direction;
            }
          }
          return next;
        }

        return block;
      }),
    );
  };

  const saveCanvasAsPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const imageUrl = canvas.toDataURL('image/png');
    const anchor = document.createElement('a');
    anchor.href = imageUrl;
    anchor.download = 'turtle-geometry-canvas.png';

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
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
        onSavePng={saveCanvasAsPng}
        onReset={() => setExecutedBlocks([])}
        onClear={() => {
          setBlocks([]);
          setExecutedBlocks([]);
        }}
        onUpdateBlock={updateBlock}
      />

      <section className="workspace" aria-label="거북이 학습 워크스페이스">
        <section className="canvas-stage" aria-label="거북이 그리기 캔버스">
          <TurtleCanvas
            segments={programResult.segments}
            turtle={programResult.finalState}
            canvasRef={canvasRef}
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
