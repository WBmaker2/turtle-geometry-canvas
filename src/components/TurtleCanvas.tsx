import { type MutableRefObject, type Ref, useEffect, useRef } from 'react';

import type { DrawSegment, TurtleState } from '../domain/turtle';

const CANVAS_WIDTH = 760;
const CANVAS_HEIGHT = 560;
const GRID_SPACING = 20;

type TurtleCanvasProps = {
  segments: DrawSegment[];
  turtle: TurtleState;
  animationSpeed?: number;
  animate?: boolean;
  canvasRef?: Ref<HTMLCanvasElement>;
};

function toCanvasPoint(point: { x: number; y: number }) {
  return {
    x: CANVAS_WIDTH / 2 + point.x,
    y: CANVAS_HEIGHT / 2 + point.y,
  };
}

function getSegmentLength(segment: DrawSegment) {
  return Math.hypot(segment.to.x - segment.from.x, segment.to.y - segment.from.y);
}

function getSegmentHeading(segment: DrawSegment) {
  return (
    (Math.atan2(segment.to.y - segment.from.y, segment.to.x - segment.from.x) *
      180) /
    Math.PI
  );
}

function getTotalLength(segments: DrawSegment[]) {
  return segments.reduce((total, segment) => total + getSegmentLength(segment), 0);
}

function drawGrid(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#fbfdfb';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

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
}

function drawLineSegment(
  ctx: CanvasRenderingContext2D,
  segment: DrawSegment,
  toPoint: { x: number; y: number },
) {
  const from = toCanvasPoint(segment.from);
  const to = toCanvasPoint(toPoint);

  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.strokeStyle = segment.color;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
}

function getAnimatedTurtleState(
  segments: DrawSegment[],
  finalTurtle: TurtleState,
  visibleDistance: number,
): TurtleState {
  if (segments.length === 0) {
    return finalTurtle;
  }

  const totalLength = getTotalLength(segments);
  if (visibleDistance >= totalLength) {
    return finalTurtle;
  }

  if (visibleDistance <= 0) {
    const firstSegment = segments[0];
    return {
      x: firstSegment.from.x,
      y: firstSegment.from.y,
      heading: getSegmentHeading(firstSegment),
      penColor: firstSegment.color,
    };
  }

  let remaining = visibleDistance;
  let lastState: TurtleState = {
    x: segments[0].from.x,
    y: segments[0].from.y,
    heading: getSegmentHeading(segments[0]),
    penColor: segments[0].color,
  };

  for (const segment of segments) {
    const segmentLength = getSegmentLength(segment);
    const heading = getSegmentHeading(segment);

    if (remaining >= segmentLength) {
      remaining -= segmentLength;
      lastState = {
        x: segment.to.x,
        y: segment.to.y,
        heading,
        penColor: segment.color,
      };
      continue;
    }

    const ratio = segmentLength === 0 ? 1 : remaining / segmentLength;
    return {
      x: segment.from.x + (segment.to.x - segment.from.x) * ratio,
      y: segment.from.y + (segment.to.y - segment.from.y) * ratio,
      heading,
      penColor: segment.color,
    };
  }

  return lastState;
}

function drawVisibleSegments(
  ctx: CanvasRenderingContext2D,
  segments: DrawSegment[],
  visibleDistance: number,
) {
  let remaining = visibleDistance;

  for (const segment of segments) {
    if (remaining <= 0) {
      return;
    }

    const segmentLength = getSegmentLength(segment);
    if (remaining >= segmentLength) {
      drawLineSegment(ctx, segment, segment.to);
      remaining -= segmentLength;
      continue;
    }

    const ratio = segmentLength === 0 ? 1 : remaining / segmentLength;
    drawLineSegment(ctx, segment, {
      x: segment.from.x + (segment.to.x - segment.from.x) * ratio,
      y: segment.from.y + (segment.to.y - segment.from.y) * ratio,
    });
    return;
  }
}

function drawTurtleGlyph(ctx: CanvasRenderingContext2D, turtle: TurtleState) {
  const turtlePoint = toCanvasPoint(turtle);
  const headingRadians = (turtle.heading * Math.PI) / 180;

  ctx.save();
  ctx.translate(turtlePoint.x, turtlePoint.y);
  ctx.rotate(headingRadians);
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#155f46';

  ctx.fillStyle = '#74b16b';
  for (const [x, y, rotate] of [
    [-6, -8, -0.45],
    [-6, 8, 0.45],
    [6, -8, 0.45],
    [6, 8, -0.45],
  ] as const) {
    ctx.beginPath();
    ctx.ellipse(x, y, 4, 3, rotate, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  ctx.fillStyle = '#7fc47a';
  ctx.beginPath();
  ctx.ellipse(14, 0, 6, 4.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = turtle.penColor;
  ctx.beginPath();
  ctx.ellipse(0, 0, 13, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(0, 0, 8, 6, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#16352f';
  ctx.beginPath();
  ctx.arc(16, -1.5, 1, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawScene(
  ctx: CanvasRenderingContext2D,
  segments: DrawSegment[],
  finalTurtle: TurtleState,
  visibleDistance: number,
) {
  drawGrid(ctx);
  drawVisibleSegments(ctx, segments, visibleDistance);
  drawTurtleGlyph(
    ctx,
    getAnimatedTurtleState(segments, finalTurtle, visibleDistance),
  );
}

export function TurtleCanvas({
  segments,
  turtle,
  animationSpeed = 1,
  animate = true,
  canvasRef,
}: TurtleCanvasProps) {
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

    const totalLength = getTotalLength(segments);
    if (!animate || totalLength === 0) {
      drawScene(ctx, segments, turtle, totalLength);
      return;
    }

    drawScene(ctx, segments, turtle, 0);

    const pixelsPerSecond = 180 * animationSpeed;
    const durationMs = Math.max(180, (totalLength / pixelsPerSecond) * 1000);
    let animationFrame = 0;
    const startTime = performance.now();
    const requestFrame =
      window.requestAnimationFrame?.bind(window) ??
      ((callback: FrameRequestCallback) =>
        window.setTimeout(() => callback(performance.now()), 16));
    const cancelFrame =
      window.cancelAnimationFrame?.bind(window) ?? window.clearTimeout.bind(window);

    const drawFrame = (timestamp: number) => {
      const progress = Math.min((timestamp - startTime) / durationMs, 1);
      drawScene(ctx, segments, turtle, totalLength * progress);

      if (progress < 1) {
        animationFrame = requestFrame(drawFrame);
      }
    };

    animationFrame = requestFrame(drawFrame);

    return () => {
      cancelFrame(animationFrame);
    };
  }, [segments, turtle, animationSpeed, animate]);

  return (
    <canvas
      ref={attachCanvasRef}
      className="turtle-canvas"
      aria-label="거북이가 움직이며 지나간 선이 그려지는 캔버스"
      data-testid="turtle-canvas"
    />
  );
}
