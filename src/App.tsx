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

const DRAWING_SPEEDS = [0.25, 0.5, 1, 2, 4, 8] as const;

function getInitialSquareChallenge(challenges: Challenge[]) {
  return challenges.find(({ id }) => id === 'square') ?? challenges[0];
}

function cloneBlocks(blocks: ProgramBlock[]) {
  return blocks.map((block) => ({ ...block }));
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

const freeDrawChallenge: Challenge = {
  id: 'free-draw',
  kind: 'exploration',
  title: '자유 도형 그리기',
  question:
    '이동거리와 회전각을 직접 정해 나만의 도형 명령을 차례대로 만들어 봅시다.',
  sidesLabel: '직접 설계',
  blocks: [],
  reflection:
    '명령을 하나씩 추가하며 각도와 거리가 도형의 모양을 어떻게 바꾸는지 관찰합니다.',
};

export default function App() {
  const initialChallenge = getInitialSquareChallenge(challenges);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(
    initialChallenge.id,
  );
  const [blocks, setBlocks] = useState<ProgramBlock[]>(
    cloneBlocks(initialChallenge.blocks),
  );
  const [executedBlocks, setExecutedBlocks] = useState<ProgramBlock[]>([]);
  const [drawingSpeed, setDrawingSpeed] = useState<number>(1);

  const selectedChallenge = useMemo(
    () =>
      selectedChallengeId === freeDrawChallenge.id
        ? freeDrawChallenge
        : challenges.find(({ id }) => id === selectedChallengeId) ?? initialChallenge,
    [selectedChallengeId],
  );

  const expandedCommands = useMemo(
    () => expandBlocks(executedBlocks),
    [executedBlocks],
  );
  const programResult = useMemo(
    () => runTurtleProgram(expandedCommands),
    [expandedCommands],
  );
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

  const startFreeDraw = () => {
    setSelectedChallengeId(freeDrawChallenge.id);
    setBlocks([]);
    setExecutedBlocks([]);
  };

  const addMoveBlock = (distance: number) => {
    setBlocks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        kind: 'move',
        distance: clamp(Math.round(distance), 1, 240),
      },
    ]);
  };

  const addTurnBlock = (degrees: number, direction: 'left' | 'right') => {
    setBlocks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        kind: 'turn',
        direction,
        degrees: clamp(Math.round(degrees), 0, 360),
      },
    ]);
  };

  const addRepeatBlock = (
    times: number,
    distance: number,
    turnDegrees: number,
    direction: 'left' | 'right',
  ) => {
    setBlocks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        kind: 'repeatPolygon',
        times: clamp(Math.round(times), 1, 24),
        distance: clamp(Math.round(distance), 1, 240),
        turnDegrees: clamp(Math.round(turnDegrees), 0, 360),
        direction,
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
        onStartFreeDraw={startFreeDraw}
        onAddMove={addMoveBlock}
        onAddTurn={addTurnBlock}
        onAddRepeat={addRepeatBlock}
        onSetColor={applyColor}
        drawingSpeed={drawingSpeed}
        speedOptions={DRAWING_SPEEDS}
        onSetDrawingSpeed={setDrawingSpeed}
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
            animationSpeed={drawingSpeed}
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
