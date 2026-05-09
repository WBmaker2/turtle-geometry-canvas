import { type MutableRefObject, type Ref, useEffect, useRef } from 'react';

import type { DrawSegment, TurtleState } from '../domain/turtle';

const CANVAS_WIDTH = 760;
const CANVAS_HEIGHT = 560;
const GRID_SPACING = 20;

type TurtleCanvasProps = {
  segments: DrawSegment[];
  turtle: TurtleState;
  canvasRef?: Ref<HTMLCanvasElement>;
};

function toCanvasPoint(point: { x: number; y: number }) {
  return {
    x: CANVAS_WIDTH / 2 + point.x,
    y: CANVAS_HEIGHT / 2 + point.y,
  };
}

export function TurtleCanvas({ segments, turtle, canvasRef }: TurtleCanvasProps) {
  const internalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const attachCanvasRef = (canvas: HTMLCanvasElement | null) => {
    internalCanvasRef.current = canvas;

    if (typeof canvasRef === 'function') {
      canvasRef(canvas);
      return;
    }

    if (!canvasRef) {
      return;
    }

    if ('current' in canvasRef) {
      (canvasRef as MutableRefObject<HTMLCanvasElement | null>).current = canvas;
    }
  };

  useEffect(() => {
    const canvas = internalCanvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = CANVAS_WIDTH * pixelRatio;
    canvas.height = CANVAS_HEIGHT * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    ctx.fillStyle = '#fbfdfb';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // grid
    ctx.strokeStyle = '#dde7e2';
    ctx.lineWidth = 1;
    for (let x = 0; x <= CANVAS_WIDTH; x += GRID_SPACING) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y <= CANVAS_HEIGHT; y += GRID_SPACING) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }

    // draw segments
    for (const segment of segments) {
      const from = toCanvasPoint(segment.from);
      const to = toCanvasPoint(segment.to);

      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.strokeStyle = segment.color;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }

    // turtle glyph
    const turtlePoint = toCanvasPoint(turtle);
    const headingRadians = (turtle.heading * Math.PI) / 180;
    ctx.save();
    ctx.fillStyle = turtle.penColor;
    ctx.translate(turtlePoint.x, turtlePoint.y);
    ctx.rotate(headingRadians);
    ctx.beginPath();
    ctx.moveTo(12, 0);
    ctx.lineTo(-10, 8);
    ctx.lineTo(-10, -8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }, [segments, turtle]);

  return (
    <canvas
      ref={attachCanvasRef}
      className="turtle-canvas"
      aria-label="거북이가 지나간 선이 그려지는 캔버스"
      data-testid="turtle-canvas"
    />
  );
}
