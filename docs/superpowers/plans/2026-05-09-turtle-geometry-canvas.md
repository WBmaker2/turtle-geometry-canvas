# Turtle Geometry Canvas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 5~6학년 학생이 블록 코딩 명령으로 거북이를 움직이며 정다각형의 외각, 내각, 반복 구조를 실험하는 교육용 웹앱을 만든다.

**Architecture:** 순수 TypeScript 도형 엔진이 명령 블록을 선분과 거북이 상태로 변환하고, React UI가 명령 편집, 수학 미션, 실행 결과를 관리한다. Canvas 렌더링은 도형 엔진의 결과만 받아 그리며, 핵심 수학 로직은 Vitest로 먼저 보호한다.

**Tech Stack:** Vite, React, TypeScript, HTML5 Canvas, Vitest, Testing Library, Playwright, lucide-react

---

## Current Repository State

- `cwd`: `/Users/kimhongnyeon/Dev/codex/turtle-geometry-canvas`
- 현재 파일 없음
- 현재 Git 저장소 아님
- 구현 시작 시 `git init` 후 첫 커밋부터 쌓는다.

## Product Scope

- 첫 화면은 제품 소개가 아니라 실제 블록 코딩 캔버스다.
- UI 언어는 한국어 존댓말보다 교실 활동 문장에 맞춘 간결한 한국어를 쓴다.
- 핵심 학습 흐름은 `예상하기 -> 명령 만들기 -> 실행하기 -> 결과 관찰하기 -> 내각/외각 연결하기`다.
- 저장, 로그인, 공유 편집, 서버 동기화는 첫 버전에 넣지 않는다.
- 개인정보를 입력받지 않는다.

## File Structure

- Create: `package.json` - scripts, dependencies, devDependencies
- Create: `index.html` - Vite entry
- Create: `tsconfig.json` - app TypeScript config
- Create: `tsconfig.node.json` - Vite config TypeScript config
- Create: `vite.config.ts` - Vite, React, Vitest config
- Create: `.gitignore` - node, dist, coverage, Playwright output
- Create: `src/vite-env.d.ts` - Vite type reference
- Create: `src/main.tsx` - React mount
- Create: `src/App.tsx` - app shell and state orchestration
- Create: `src/App.test.tsx` - main learning flow tests
- Create: `src/index.css` - global CSS variables and base layout
- Create: `src/App.css` - page, panel, control, responsive styling
- Create: `src/domain/turtle.ts` - turtle state, command execution, segment generation
- Create: `src/domain/turtle.test.ts` - geometry engine tests
- Create: `src/domain/blocks.ts` - classroom block model and expansion
- Create: `src/domain/blocks.test.ts` - block expansion tests
- Create: `src/domain/mathFacts.ts` - polygon math helper functions
- Create: `src/domain/mathFacts.test.ts` - inner angle and exterior angle tests
- Create: `src/data/challenges.ts` - triangle, square, pentagon, star missions
- Create: `src/components/CommandPanel.tsx` - block add/edit/run/reset controls
- Create: `src/components/TurtleCanvas.tsx` - canvas drawing and turtle glyph
- Create: `src/components/LessonPanel.tsx` - selected mission and math explanation
- Create: `src/components/ReflectionPanel.tsx` - observation prompts and execution summary
- Create: `src/test/setup.ts` - Testing Library setup
- Create: `playwright.config.ts` - local preview E2E config
- Create: `tests/e2e/turtle-canvas.spec.ts` - browser smoke and nonblank canvas check
- Create: `README.md` - run, test, lesson use guide
- Create: `docs/lesson-guide.md` - 40-minute class flow and teacher notes

## Task 1: Project Scaffold

**Files:**
- Create: `.gitignore`
- Create: `package.json`
- Create: `index.html`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `src/vite-env.d.ts`
- Create: `src/test/setup.ts`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/index.css`
- Create: `src/App.css`

- [ ] **Step 1: Initialize Git**

Run:

```bash
git init
```

Expected: `.git/` is created.

- [ ] **Step 2: Create package manifest**

Write `package.json`:

```json
{
  "name": "turtle-geometry-canvas",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run --pool=forks",
    "test:watch": "vitest",
    "e2e": "playwright test"
  },
  "dependencies": {
    "lucide-react": "^0.468.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.49.0",
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.0",
    "@vitejs/plugin-react": "^5.0.0",
    "jsdom": "^25.0.0",
    "typescript": "^5.7.0",
    "vite": "^6.0.0",
    "vitest": "^2.1.0"
  }
}
```

- [ ] **Step 3: Install dependencies**

Run:

```bash
npm install
```

Expected: `node_modules/` and `package-lock.json` are created.

- [ ] **Step 4: Add Vite and TypeScript config**

Write `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    globals: true,
    pool: 'forks',
  },
});
```

Write `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src", "tests", "vite.config.ts", "playwright.config.ts"]
}
```

Write `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts", "playwright.config.ts"]
}
```

- [ ] **Step 5: Add HTML and React shell**

Write `index.html`:

```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="description"
      content="거북이 블록 코딩으로 정다각형의 외각과 내각을 실험하는 수학·실과 융합 캔버스"
    />
    <title>Turtle Geometry Canvas</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Write `src/main.tsx`:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

Write `src/App.tsx`:

```tsx
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
```

Write `src/index.css`:

```css
:root {
  font-family:
    Inter, Pretendard, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  color: #16231f;
  background: #edf6f2;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

button,
input,
select {
  font: inherit;
}
```

Write `src/App.css`:

```css
.app-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(300px, 380px) 1fr;
  gap: 16px;
  padding: 16px;
}

.control-panel,
.canvas-stage {
  border: 1px solid #c8d8d0;
  background: #ffffff;
  border-radius: 8px;
  padding: 16px;
}

.control-panel h1 {
  margin: 0 0 8px;
  font-size: 1.5rem;
}

.control-panel p {
  margin: 0;
  line-height: 1.5;
}

.canvas-stage {
  display: grid;
  min-height: 520px;
}

.canvas-placeholder {
  display: grid;
  place-items: center;
  border: 1px dashed #9ab7aa;
  border-radius: 8px;
  color: #48665b;
}

@media (max-width: 840px) {
  .app-shell {
    grid-template-columns: 1fr;
  }
}
```

Write `.gitignore`:

```gitignore
node_modules/
dist/
coverage/
test-results/
playwright-report/
.DS_Store
```

Write `src/vite-env.d.ts`:

```ts
/// <reference types="vite/client" />
```

Write `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 6: Run baseline checks**

Run:

```bash
npm run test
npm run build
```

Expected: both commands pass.

- [ ] **Step 7: Commit scaffold**

Run:

```bash
git add .
git commit -m "chore: scaffold turtle geometry canvas"
```

Expected: one initial commit is created.

## Task 2: Turtle Geometry Engine

**Files:**
- Create: `src/domain/turtle.ts`
- Create: `src/domain/turtle.test.ts`

- [ ] **Step 1: Write failing geometry tests**

Write `src/domain/turtle.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { runTurtleProgram } from './turtle';

describe('runTurtleProgram', () => {
  it('draws a square from four move and right-turn pairs', () => {
    const result = runTurtleProgram([
      { type: 'move', distance: 100 },
      { type: 'turn', direction: 'right', degrees: 90 },
      { type: 'move', distance: 100 },
      { type: 'turn', direction: 'right', degrees: 90 },
      { type: 'move', distance: 100 },
      { type: 'turn', direction: 'right', degrees: 90 },
      { type: 'move', distance: 100 },
    ]);

    expect(result.segments).toHaveLength(4);
    expect(result.segments[0]).toMatchObject({
      from: { x: 0, y: 0 },
      to: { x: 100, y: 0 },
      color: '#1f7a5c',
    });
    expect(result.finalState.x).toBeCloseTo(0, 5);
    expect(result.finalState.y).toBeCloseTo(0, 5);
  });

  it('keeps pen color on segments after color command changes', () => {
    const result = runTurtleProgram([
      { type: 'penColor', color: '#d94f30' },
      { type: 'move', distance: 60 },
    ]);

    expect(result.segments[0].color).toBe('#d94f30');
  });

  it('supports repeat commands for regular polygons', () => {
    const result = runTurtleProgram([
      {
        type: 'repeat',
        times: 3,
        commands: [
          { type: 'move', distance: 80 },
          { type: 'turn', direction: 'right', degrees: 120 },
        ],
      },
    ]);

    expect(result.segments).toHaveLength(3);
    expect(result.finalState.x).toBeCloseTo(0, 5);
    expect(result.finalState.y).toBeCloseTo(0, 5);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```bash
npm run test -- src/domain/turtle.test.ts
```

Expected: FAIL because `src/domain/turtle.ts` does not exist.

- [ ] **Step 3: Implement turtle engine**

Write `src/domain/turtle.ts`:

```ts
export type TurnDirection = 'left' | 'right';

export type TurtleCommand =
  | { type: 'move'; distance: number }
  | { type: 'turn'; direction: TurnDirection; degrees: number }
  | { type: 'penColor'; color: string }
  | { type: 'repeat'; times: number; commands: TurtleCommand[] };

export type TurtleState = {
  x: number;
  y: number;
  heading: number;
  penColor: string;
};

export type DrawSegment = {
  from: { x: number; y: number };
  to: { x: number; y: number };
  color: string;
};

export type TurtleProgramResult = {
  segments: DrawSegment[];
  finalState: TurtleState;
};

const DEFAULT_STATE: TurtleState = {
  x: 0,
  y: 0,
  heading: 0,
  penColor: '#1f7a5c',
};

export function runTurtleProgram(
  commands: TurtleCommand[],
  initialState: TurtleState = DEFAULT_STATE,
): TurtleProgramResult {
  const segments: DrawSegment[] = [];
  const finalState = commands.reduce(
    (state, command) => executeCommand(command, state, segments),
    { ...initialState },
  );

  return { segments, finalState };
}

function executeCommand(
  command: TurtleCommand,
  state: TurtleState,
  segments: DrawSegment[],
): TurtleState {
  if (command.type === 'move') {
    const radians = (state.heading * Math.PI) / 180;
    const nextState = {
      ...state,
      x: state.x + Math.cos(radians) * command.distance,
      y: state.y + Math.sin(radians) * command.distance,
    };

    segments.push({
      from: { x: state.x, y: state.y },
      to: { x: nextState.x, y: nextState.y },
      color: state.penColor,
    });

    return nextState;
  }

  if (command.type === 'turn') {
    const signedDegrees =
      command.direction === 'right' ? command.degrees : -command.degrees;

    return {
      ...state,
      heading: normalizeDegrees(state.heading + signedDegrees),
    };
  }

  if (command.type === 'penColor') {
    return { ...state, penColor: command.color };
  }

  return Array.from({ length: command.times }).reduce<TurtleState>(
    (repeatState) =>
      command.commands.reduce(
        (innerState, innerCommand) =>
          executeCommand(innerCommand, innerState, segments),
        repeatState,
      ),
    state,
  );
}

function normalizeDegrees(degrees: number) {
  return ((degrees % 360) + 360) % 360;
}
```

- [ ] **Step 4: Run geometry tests**

Run:

```bash
npm run test -- src/domain/turtle.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit engine**

Run:

```bash
git add src/domain/turtle.ts src/domain/turtle.test.ts
git commit -m "feat: add turtle geometry engine"
```

Expected: geometry engine commit is created.

## Task 3: Block Model and Math Facts

**Files:**
- Create: `src/domain/blocks.ts`
- Create: `src/domain/blocks.test.ts`
- Create: `src/domain/mathFacts.ts`
- Create: `src/domain/mathFacts.test.ts`
- Create: `src/data/challenges.ts`

- [ ] **Step 1: Write failing block and math tests**

Write `src/domain/blocks.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { expandBlocks } from './blocks';

describe('expandBlocks', () => {
  it('expands a repeat polygon block into move and turn commands', () => {
    expect(
      expandBlocks([
        {
          id: 'square',
          kind: 'repeatPolygon',
          times: 4,
          distance: 80,
          turnDegrees: 90,
          direction: 'right',
        },
      ]),
    ).toEqual([
      { type: 'repeat', times: 4, commands: [
        { type: 'move', distance: 80 },
        { type: 'turn', direction: 'right', degrees: 90 },
      ] },
    ]);
  });

  it('keeps direct commands in order', () => {
    expect(
      expandBlocks([
        { id: 'color', kind: 'penColor', color: '#3b5bdb' },
        { id: 'move', kind: 'move', distance: 50 },
        { id: 'turn', kind: 'turn', direction: 'left', degrees: 72 },
      ]),
    ).toEqual([
      { type: 'penColor', color: '#3b5bdb' },
      { type: 'move', distance: 50 },
      { type: 'turn', direction: 'left', degrees: 72 },
    ]);
  });
});
```

Write `src/domain/mathFacts.test.ts`:

```ts
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
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```bash
npm run test -- src/domain/blocks.test.ts src/domain/mathFacts.test.ts
```

Expected: FAIL because implementation files do not exist.

- [ ] **Step 3: Implement block expansion**

Write `src/domain/blocks.ts`:

```ts
import type { TurtleCommand, TurnDirection } from './turtle';

export type ProgramBlock =
  | { id: string; kind: 'move'; distance: number }
  | {
      id: string;
      kind: 'turn';
      direction: TurnDirection;
      degrees: number;
    }
  | { id: string; kind: 'penColor'; color: string }
  | {
      id: string;
      kind: 'repeatPolygon';
      times: number;
      distance: number;
      turnDegrees: number;
      direction: TurnDirection;
    };

export function expandBlocks(blocks: ProgramBlock[]): TurtleCommand[] {
  return blocks.map((block) => {
    if (block.kind === 'move') {
      return { type: 'move', distance: block.distance };
    }

    if (block.kind === 'turn') {
      return {
        type: 'turn',
        direction: block.direction,
        degrees: block.degrees,
      };
    }

    if (block.kind === 'penColor') {
      return { type: 'penColor', color: block.color };
    }

    return {
      type: 'repeat',
      times: block.times,
      commands: [
        { type: 'move', distance: block.distance },
        {
          type: 'turn',
          direction: block.direction,
          degrees: block.turnDegrees,
        },
      ],
    };
  });
}
```

- [ ] **Step 4: Implement math facts**

Write `src/domain/mathFacts.ts`:

```ts
export type RegularPolygonFacts = {
  sides: number;
  exteriorAngle: number;
  interiorAngle: number;
  interiorAngleSum: number;
};

export function getRegularPolygonFacts(sides: number): RegularPolygonFacts {
  if (!Number.isInteger(sides) || sides < 3) {
    throw new Error('정다각형의 변의 수는 3 이상의 정수여야 합니다.');
  }

  const exteriorAngle = 360 / sides;

  return {
    sides,
    exteriorAngle,
    interiorAngle: 180 - exteriorAngle,
    interiorAngleSum: (sides - 2) * 180,
  };
}
```

- [ ] **Step 5: Add classroom challenges**

Write `src/data/challenges.ts`:

```ts
import type { ProgramBlock } from '../domain/blocks';

export type Challenge = {
  id: string;
  title: string;
  question: string;
  sidesLabel: string;
  blocks: ProgramBlock[];
  reflection: string;
};

export const challenges: Challenge[] = [
  {
    id: 'triangle',
    title: '정삼각형 여행',
    question: '3번 반복할 때 거북이는 몇 도씩 돌아야 처음 자리로 돌아올까요?',
    sidesLabel: '3개의 변',
    blocks: [
      {
        id: 'triangle-repeat',
        kind: 'repeatPolygon',
        times: 3,
        distance: 120,
        turnDegrees: 120,
        direction: 'right',
      },
    ],
    reflection: '외각 120도와 내각 60도의 관계를 말해 봅니다.',
  },
  {
    id: 'square',
    title: '정사각형 여행',
    question: '4번 반복할 때 회전 각도는 왜 90도일까요?',
    sidesLabel: '4개의 변',
    blocks: [
      {
        id: 'square-repeat',
        kind: 'repeatPolygon',
        times: 4,
        distance: 110,
        turnDegrees: 90,
        direction: 'right',
      },
    ],
    reflection: '외각 90도와 내각 90도가 같은 특별한 경우를 찾습니다.',
  },
  {
    id: 'pentagon',
    title: '정오각형 여행',
    question: '5번 반복해서 닫힌 도형을 만들려면 몇 도씩 돌아야 할까요?',
    sidesLabel: '5개의 변',
    blocks: [
      {
        id: 'pentagon-repeat',
        kind: 'repeatPolygon',
        times: 5,
        distance: 90,
        turnDegrees: 72,
        direction: 'right',
      },
    ],
    reflection: '외각 72도, 내각 108도, 내각의 합 540도를 연결합니다.',
  },
  {
    id: 'star',
    title: '별 모양 도전',
    question: '정다각형이 아닌 별 모양은 어떤 회전 규칙으로 생길까요?',
    sidesLabel: '5번 꺾기',
    blocks: [
      {
        id: 'star-repeat',
        kind: 'repeatPolygon',
        times: 5,
        distance: 140,
        turnDegrees: 144,
        direction: 'right',
      },
    ],
    reflection: '정다각형 규칙을 벗어나면 선이 건너뛰며 별 모양이 됩니다.',
  },
];
```

- [ ] **Step 6: Run block and math tests**

Run:

```bash
npm run test -- src/domain/blocks.test.ts src/domain/mathFacts.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit domain model**

Run:

```bash
git add src/domain src/data
git commit -m "feat: model turtle blocks and polygon facts"
```

Expected: domain model commit is created.

## Task 4: Canvas Rendering

**Files:**
- Create: `src/components/TurtleCanvas.tsx`
- Modify: `src/App.css`

- [ ] **Step 1: Create canvas component**

Write `src/components/TurtleCanvas.tsx`:

```tsx
import { useEffect, useRef } from 'react';
import type { DrawSegment, TurtleState } from '../domain/turtle';

type TurtleCanvasProps = {
  segments: DrawSegment[];
  turtle: TurtleState;
};

const CANVAS_WIDTH = 760;
const CANVAS_HEIGHT = 560;

export function TurtleCanvas({ segments, turtle }: TurtleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (!canvas || !context) {
      return;
    }

    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = CANVAS_WIDTH * pixelRatio;
    canvas.height = CANVAS_HEIGHT * pixelRatio;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    drawBackground(context);
    drawSegments(context, segments);
    drawTurtle(context, turtle);
  }, [segments, turtle]);

  return (
    <canvas
      ref={canvasRef}
      className="turtle-canvas"
      aria-label="거북이가 지나간 선이 그려지는 캔버스"
      data-testid="turtle-canvas"
    />
  );
}

function toCanvasPoint(point: { x: number; y: number }) {
  return {
    x: CANVAS_WIDTH / 2 + point.x,
    y: CANVAS_HEIGHT / 2 + point.y,
  };
}

function drawBackground(context: CanvasRenderingContext2D) {
  context.fillStyle = '#fbfdfb';
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  context.strokeStyle = '#e3eee8';
  context.lineWidth = 1;

  for (let x = 20; x < CANVAS_WIDTH; x += 20) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, CANVAS_HEIGHT);
    context.stroke();
  }

  for (let y = 20; y < CANVAS_HEIGHT; y += 20) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(CANVAS_WIDTH, y);
    context.stroke();
  }
}

function drawSegments(
  context: CanvasRenderingContext2D,
  segments: DrawSegment[],
) {
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.lineWidth = 4;

  segments.forEach((segment) => {
    const from = toCanvasPoint(segment.from);
    const to = toCanvasPoint(segment.to);

    context.strokeStyle = segment.color;
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();
  });
}

function drawTurtle(context: CanvasRenderingContext2D, turtle: TurtleState) {
  const center = toCanvasPoint(turtle);
  context.save();
  context.translate(center.x, center.y);
  context.rotate((turtle.heading * Math.PI) / 180);

  context.fillStyle = '#39a275';
  context.strokeStyle = '#17624a';
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(18, 0);
  context.lineTo(-12, -12);
  context.lineTo(-6, 0);
  context.lineTo(-12, 12);
  context.closePath();
  context.fill();
  context.stroke();

  context.restore();
}
```

- [ ] **Step 2: Add canvas styles**

Append to `src/App.css`:

```css
.turtle-canvas {
  width: 100%;
  aspect-ratio: 19 / 14;
  max-height: calc(100vh - 48px);
  border: 1px solid #b8cdc4;
  border-radius: 8px;
  background: #fbfdfb;
}
```

- [ ] **Step 3: Build to verify component compiles**

Run:

```bash
npm run build
```

Expected: PASS.

- [ ] **Step 4: Commit canvas renderer**

Run:

```bash
git add src/components/TurtleCanvas.tsx src/App.css
git commit -m "feat: render turtle paths on canvas"
```

Expected: canvas renderer commit is created.

## Task 5: Command Panel and App Flow

**Files:**
- Create: `src/components/CommandPanel.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.css`
- Create: `src/App.test.tsx`

- [ ] **Step 1: Write failing app flow test**

Write `src/App.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('loads a square challenge and reports four drawn segments', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '정사각형 불러오기' }));
    await user.click(screen.getByRole('button', { name: '실행' }));

    expect(screen.getByRole('status')).toHaveTextContent('선분 4개');
    expect(screen.getByText('외각 90도')).toBeInTheDocument();
  });

  it('adds a pen color command from the color picker', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '색상 적용' }));

    expect(screen.getByText('펜 색상 #1f7a5c')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify failure**

Run:

```bash
npm run test -- src/App.test.tsx
```

Expected: FAIL because buttons and status do not exist.

- [ ] **Step 3: Implement command panel**

Write `src/components/CommandPanel.tsx`:

```tsx
import { useState } from 'react';
import { Palette, Play, RotateCcw, SquarePlus, Trash2 } from 'lucide-react';
import type { ProgramBlock } from '../domain/blocks';
import type { Challenge } from '../data/challenges';

type CommandPanelProps = {
  blocks: ProgramBlock[];
  challenges: Challenge[];
  onLoadChallenge: (challengeId: string) => void;
  onAddMove: () => void;
  onAddTurn: () => void;
  onSetColor: (color: string) => void;
  onRun: () => void;
  onReset: () => void;
  onClear: () => void;
};

export function CommandPanel({
  blocks,
  challenges,
  onLoadChallenge,
  onAddMove,
  onAddTurn,
  onSetColor,
  onRun,
  onReset,
  onClear,
}: CommandPanelProps) {
  const [selectedColor, setSelectedColor] = useState('#1f7a5c');

  return (
    <section className="control-panel" aria-label="블록 코딩 명령 패널">
      <div className="panel-heading">
        <p className="eyebrow">수학 / 실과 융합</p>
        <h1>Turtle Geometry Canvas</h1>
        <p>반복, 이동, 회전 명령으로 도형의 규칙을 실험합니다.</p>
      </div>

      <div className="button-row" aria-label="도형 예시 불러오기">
        {challenges.map((challenge) => (
          <button
            key={challenge.id}
            type="button"
            onClick={() => onLoadChallenge(challenge.id)}
          >
            {challenge.title.replace(' 여행', '')} 불러오기
          </button>
        ))}
      </div>

      <div className="command-list" aria-label="현재 명령 목록">
        {blocks.map((block, index) => (
          <div className="command-row" key={block.id}>
            <span>{index + 1}</span>
            <strong>{getBlockLabel(block)}</strong>
          </div>
        ))}
      </div>

      <div className="button-row">
        <button type="button" onClick={onAddMove}>
          <SquarePlus size={18} aria-hidden="true" />
          앞으로
        </button>
        <button type="button" onClick={onAddTurn}>
          <SquarePlus size={18} aria-hidden="true" />
          오른쪽 회전
        </button>
      </div>

      <div className="color-control">
        <label htmlFor="pen-color">펜 색상</label>
        <input
          id="pen-color"
          type="color"
          value={selectedColor}
          onChange={(event) => setSelectedColor(event.target.value)}
        />
        <button type="button" onClick={() => onSetColor(selectedColor)}>
          <Palette size={18} aria-hidden="true" />
          색상 적용
        </button>
      </div>

      <div className="action-row">
        <button className="primary-action" type="button" onClick={onRun}>
          <Play size={18} aria-hidden="true" />
          실행
        </button>
        <button type="button" onClick={onReset}>
          <RotateCcw size={18} aria-hidden="true" />
          초기화
        </button>
        <button type="button" onClick={onClear}>
          <Trash2 size={18} aria-hidden="true" />
          명령 삭제
        </button>
      </div>
    </section>
  );
}

function getBlockLabel(block: ProgramBlock) {
  if (block.kind === 'move') {
    return `앞으로 ${block.distance}px 이동`;
  }

  if (block.kind === 'turn') {
    return `${block.direction === 'right' ? '오른쪽' : '왼쪽'} ${block.degrees}도 회전`;
  }

  if (block.kind === 'penColor') {
    return `펜 색상 ${block.color}`;
  }

  return `${block.times}번 반복: 앞으로 ${block.distance}px, ${block.turnDegrees}도 회전`;
}
```

- [ ] **Step 4: Wire app state**

Replace `src/App.tsx`:

```tsx
import { useMemo, useState } from 'react';
import './App.css';
import { CommandPanel } from './components/CommandPanel';
import { TurtleCanvas } from './components/TurtleCanvas';
import { expandBlocks, type ProgramBlock } from './domain/blocks';
import { runTurtleProgram } from './domain/turtle';
import { getRegularPolygonFacts } from './domain/mathFacts';
import { challenges } from './data/challenges';

const initialBlocks: ProgramBlock[] = challenges[1].blocks;

export default function App() {
  const [blocks, setBlocks] = useState<ProgramBlock[]>(initialBlocks);
  const [hasRun, setHasRun] = useState(false);
  const [selectedChallengeId, setSelectedChallengeId] = useState('square');

  const programResult = useMemo(() => {
    if (!hasRun) {
      return runTurtleProgram([]);
    }

    return runTurtleProgram(expandBlocks(blocks));
  }, [blocks, hasRun]);

  const selectedChallenge =
    challenges.find((challenge) => challenge.id === selectedChallengeId) ??
    challenges[1];

  const facts = getRegularPolygonFacts(
    selectedChallenge.id === 'triangle'
      ? 3
      : selectedChallenge.id === 'square'
        ? 4
        : 5,
  );

  function loadChallenge(challengeId: string) {
    const challenge = challenges.find((item) => item.id === challengeId);

    if (!challenge) {
      return;
    }

    setBlocks(challenge.blocks);
    setSelectedChallengeId(challenge.id);
    setHasRun(false);
  }

  return (
    <main className="app-shell">
      <CommandPanel
        blocks={blocks}
        challenges={challenges}
        onLoadChallenge={loadChallenge}
        onAddMove={() =>
          setBlocks((current) => [
            ...current,
            { id: crypto.randomUUID(), kind: 'move', distance: 80 },
          ])
        }
        onAddTurn={() =>
          setBlocks((current) => [
            ...current,
            {
              id: crypto.randomUUID(),
              kind: 'turn',
              direction: 'right',
              degrees: 90,
            },
          ])
        }
        onSetColor={(color) =>
          setBlocks((current) => [
            ...current,
            { id: crypto.randomUUID(), kind: 'penColor', color },
          ])
        }
        onRun={() => setHasRun(true)}
        onReset={() => setHasRun(false)}
        onClear={() => {
          setBlocks([]);
          setHasRun(false);
        }}
      />

      <section className="workspace" aria-label="거북이 도형 작업 공간">
        <div className="canvas-stage">
          <TurtleCanvas
            segments={programResult.segments}
            turtle={programResult.finalState}
          />
        </div>
        <aside className="result-panel" aria-label="실행 결과">
          <h2>{selectedChallenge.title}</h2>
          <p>{selectedChallenge.question}</p>
          <dl>
            <div>
              <dt>외각</dt>
              <dd>외각 {facts.exteriorAngle}도</dd>
            </div>
            <div>
              <dt>내각</dt>
              <dd>{facts.interiorAngle}도</dd>
            </div>
            <div>
              <dt>내각의 합</dt>
              <dd>{facts.interiorAngleSum}도</dd>
            </div>
          </dl>
          <p role="status" aria-live="polite">
            실행 결과: 선분 {programResult.segments.length}개
          </p>
        </aside>
      </section>
    </main>
  );
}
```

- [ ] **Step 5: Add app flow styles**

Append to `src/App.css`:

```css
.panel-heading {
  display: grid;
  gap: 8px;
}

.eyebrow {
  margin: 0;
  color: #2d6f87;
  font-weight: 700;
}

.button-row,
.action-row,
.color-control {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.color-control {
  align-items: center;
}

.color-control input[type="color"] {
  width: 44px;
  height: 40px;
  padding: 2px;
  border: 1px solid #9ab7aa;
  border-radius: 8px;
  background: #ffffff;
}

button {
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px solid #9ab7aa;
  border-radius: 8px;
  background: #f8fbf9;
  color: #17352c;
  cursor: pointer;
}

.primary-action {
  border-color: #17624a;
  background: #1f7a5c;
  color: #ffffff;
}

.command-list {
  display: grid;
  gap: 8px;
  margin-top: 16px;
}

.command-row {
  display: grid;
  grid-template-columns: 32px 1fr;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border: 1px solid #d7e4de;
  border-radius: 8px;
  background: #fbfdfb;
}

.workspace {
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  gap: 12px;
  min-width: 0;
}

.result-panel {
  border: 1px solid #c8d8d0;
  border-radius: 8px;
  background: #ffffff;
  padding: 14px;
}

.result-panel h2,
.result-panel p {
  margin: 0 0 10px;
}

.result-panel dl {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin: 0 0 10px;
}

.result-panel div {
  border: 1px solid #d7e4de;
  border-radius: 8px;
  padding: 8px;
}

.result-panel dt {
  font-size: 0.8rem;
  color: #48665b;
}

.result-panel dd {
  margin: 4px 0 0;
  font-weight: 800;
}
```

- [ ] **Step 6: Run app tests**

Run:

```bash
npm run test -- src/App.test.tsx
```

Expected: PASS.

- [ ] **Step 7: Commit app flow**

Run:

```bash
git add src/App.tsx src/App.css src/App.test.tsx src/components/CommandPanel.tsx
git commit -m "feat: connect command panel to turtle canvas"
```

Expected: app flow commit is created.

## Task 6: Lesson and Reflection Panels

**Files:**
- Create: `src/components/LessonPanel.tsx`
- Create: `src/components/ReflectionPanel.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.css`
- Modify: `src/App.test.tsx`

- [ ] **Step 1: Extend app test for learning prompts**

Add to `src/App.test.tsx`:

```tsx
it('shows lesson prompt and observation prompt', () => {
  render(<App />);

  expect(screen.getByText('오늘의 실험')).toBeInTheDocument();
  expect(screen.getByText('관찰 기록')).toBeInTheDocument();
  expect(screen.getByText(/거북이가 한 바퀴 360도를 나누어 돈다/)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify failure**

Run:

```bash
npm run test -- src/App.test.tsx
```

Expected: FAIL because panels do not exist.

- [ ] **Step 3: Add lesson panel**

Write `src/components/LessonPanel.tsx`:

```tsx
import type { Challenge } from '../data/challenges';
import type { RegularPolygonFacts } from '../domain/mathFacts';

type LessonPanelProps = {
  challenge: Challenge;
  facts: RegularPolygonFacts;
};

export function LessonPanel({ challenge, facts }: LessonPanelProps) {
  return (
    <section className="lesson-panel" aria-label="오늘의 수학 실험">
      <h2>오늘의 실험</h2>
      <p>{challenge.question}</p>
      <p>
        거북이가 한 바퀴 360도를 나누어 돈다고 생각하면 외각은{' '}
        <strong>{facts.exteriorAngle}도</strong>입니다.
      </p>
    </section>
  );
}
```

- [ ] **Step 4: Add reflection panel**

Write `src/components/ReflectionPanel.tsx`:

```tsx
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
      <p>실행 후 그려진 선분은 {segmentCount}개입니다.</p>
      <p>{reflection}</p>
    </section>
  );
}
```

- [ ] **Step 5: Use panels in app**

Modify `src/App.tsx` imports:

```tsx
import { LessonPanel } from './components/LessonPanel';
import { ReflectionPanel } from './components/ReflectionPanel';
```

Inside `<aside className="result-panel" ...>`, place these before the existing `<h2>`:

```tsx
<LessonPanel challenge={selectedChallenge} facts={facts} />
<ReflectionPanel
  segmentCount={programResult.segments.length}
  reflection={selectedChallenge.reflection}
/>
```

- [ ] **Step 6: Add panel styles**

Append to `src/App.css`:

```css
.lesson-panel,
.reflection-panel {
  border: 1px solid #d7e4de;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 10px;
  background: #f8fbf9;
}

.lesson-panel h2,
.reflection-panel h2 {
  margin: 0 0 8px;
  font-size: 1rem;
}
```

- [ ] **Step 7: Run tests**

Run:

```bash
npm run test -- src/App.test.tsx
```

Expected: PASS.

- [ ] **Step 8: Commit learning panels**

Run:

```bash
git add src/App.tsx src/App.css src/App.test.tsx src/components/LessonPanel.tsx src/components/ReflectionPanel.tsx
git commit -m "feat: add polygon lesson and reflection panels"
```

Expected: learning panels commit is created.

## Task 7: Browser E2E and Canvas Smoke

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/turtle-canvas.spec.ts`

- [ ] **Step 1: Add Playwright config**

Write `playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1',
    port: 4173,
    reuseExistingServer: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'] },
    },
  ],
});
```

- [ ] **Step 2: Add E2E smoke test**

Write `tests/e2e/turtle-canvas.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('runs square challenge and paints nonblank canvas', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: '정사각형 불러오기' }).click();
  await page.getByRole('button', { name: '실행' }).click();

  await expect(page.getByRole('status')).toContainText('선분 4개');

  const paintedPixels = await page
    .getByTestId('turtle-canvas')
    .evaluate((canvas: HTMLCanvasElement) => {
      const context = canvas.getContext('2d');

      if (!context) {
        return 0;
      }

      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      let colored = 0;

      for (let index = 0; index < pixels.length; index += 4) {
        const red = pixels[index];
        const green = pixels[index + 1];
        const blue = pixels[index + 2];

        if (red < 245 || green < 245 || blue < 245) {
          colored += 1;
        }
      }

      return colored;
    });

  expect(paintedPixels).toBeGreaterThan(5000);
});
```

- [ ] **Step 3: Build and run E2E**

Run:

```bash
npm run build
npm run e2e
```

Expected: PASS on desktop and mobile projects.

- [ ] **Step 4: Commit browser smoke**

Run:

```bash
git add playwright.config.ts tests/e2e/turtle-canvas.spec.ts
git commit -m "test: add turtle canvas browser smoke"
```

Expected: E2E commit is created.

## Task 8: Classroom Polish and Documentation

**Files:**
- Modify: `src/App.css`
- Create: `README.md`
- Create: `docs/lesson-guide.md`

- [ ] **Step 1: Polish responsive layout**

Update the mobile media query in `src/App.css`:

```css
@media (max-width: 840px) {
  .app-shell {
    grid-template-columns: 1fr;
    padding: 10px;
  }

  .workspace {
    grid-template-rows: auto auto;
  }

  .result-panel dl {
    grid-template-columns: 1fr;
  }

  .button-row,
  .action-row {
    align-items: stretch;
  }

  .button-row button,
  .action-row button {
    flex: 1 1 140px;
  }
}
```

- [ ] **Step 2: Add README**

Write `README.md`:

```md
# Turtle Geometry Canvas

5~6학년 수학(다각형)과 실과(소프트웨어)를 연결한 블록 코딩 캔버스입니다. 학생은 거북이에게 이동, 회전, 반복 명령을 내려 정삼각형, 정사각형, 정오각형, 별 모양을 그리며 외각과 내각의 관계를 관찰합니다.

## Run

```bash
npm install
npm run dev
```

## Test

```bash
npm run test
npm run build
npm run e2e
```

## Class Flow

1. 예시 도형을 불러와 실행합니다.
2. 반복 횟수와 회전 각도를 관찰합니다.
3. 외각은 `360 / 변의 수`로 계산한다는 점을 확인합니다.
4. 내각은 `180 - 외각`, 내각의 합은 `(변의 수 - 2) * 180`으로 연결합니다.
```

- [ ] **Step 3: Add teacher lesson guide**

Write `docs/lesson-guide.md`:

```md
# Turtle Geometry Canvas 수업 활용 안내

## 대상

- 5~6학년군 수학: 다각형
- 5~6학년군 실과: 소프트웨어와 절차적 사고

## 성취기준

- [6수02-04] 다각형의 내각의 크기의 합을 구하고, 정다각형의 성질을 이해한다.
- [6실05-02] 문제를 해결하기 위한 프로그램을 설계하고, 순차, 선택, 반복 등의 구조를 적용하여 프로그래밍한다.

## 40분 수업 흐름

1. 5분: 정사각형 예시를 실행하고 거북이가 90도씩 도는 모습을 관찰합니다.
2. 10분: 정삼각형, 정오각형 예시를 실행하며 외각이 `360 / 변의 수`임을 찾습니다.
3. 10분: 학생이 이동 거리와 회전 각도를 바꿔 닫힌 도형을 만드는 실험을 합니다.
4. 10분: 내각 `180 - 외각`, 내각의 합 `(변의 수 - 2) * 180`을 기록합니다.
5. 5분: 별 모양 도전을 실행하고 정다각형 규칙과 다른 점을 말합니다.

## 교사 관찰 포인트

- 학생이 반복 구조를 사용해 같은 명령을 줄일 수 있는지 확인합니다.
- 학생이 회전 각도를 내각이 아니라 외각으로 입력해야 한다는 점을 설명할 수 있는지 확인합니다.
- 닫힌 도형이 되지 않았을 때 변의 수, 반복 횟수, 회전 각도를 다시 점검하도록 안내합니다.
```

- [ ] **Step 4: Run final verification**

Run:

```bash
npm run test
npm run build
npm run e2e
```

Expected: all checks pass.

- [ ] **Step 5: Commit documentation and polish**

Run:

```bash
git add src/App.css README.md docs/lesson-guide.md
git commit -m "docs: add classroom guide for turtle geometry"
```

Expected: final polish commit is created.

## Final Verification Checklist

- [ ] `npm run test` passes.
- [ ] `npm run build` passes.
- [ ] `npm run e2e` passes for desktop and mobile.
- [ ] In browser, `정사각형 불러오기 -> 실행` draws a nonblank square-like path.
- [ ] In browser, `정삼각형`, `정오각형`, `별 모양` challenge buttons each change the command list.
- [ ] `role="status"` announces the segment count after execution.
- [ ] Mobile viewport has no horizontal page overflow and all buttons remain readable.
- [ ] README and lesson guide match the implemented behavior.

## Self-Review

- Spec coverage: canvas, left command panel, move, rotate, repeat, pen color model, execute, reset, polygon math, classroom guide, and browser smoke are covered.
- Placeholder scan: the plan avoids undefined future work and gives concrete files, commands, expected results, and code snippets.
- Type consistency: `ProgramBlock`, `TurtleCommand`, `runTurtleProgram`, `expandBlocks`, and `getRegularPolygonFacts` names are consistent across tasks.

## Execution Options

Plan complete and saved to `docs/superpowers/plans/2026-05-09-turtle-geometry-canvas.md`.

1. Subagent-Driven (recommended) - dispatch a fresh subagent per task, review between tasks, fast iteration. Per `AGENTS.md`, subagents should use `GPT-5.3-Codex-Spark` when available.
2. Inline Execution - execute tasks in this session using `superpowers:executing-plans`, with checkpoints after each task group.
