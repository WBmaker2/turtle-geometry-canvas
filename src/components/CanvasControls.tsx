import { useState } from 'react';
import { Download, Play, RotateCcw, Trash2 } from 'lucide-react';

type CanvasControlsProps = {
  drawingSpeed: number;
  speedOptions: readonly number[];
  onSetDrawingSpeed: (speed: number) => void;
  onSetColor: (color: string) => void;
  onRun: () => void;
  onSavePng: () => void;
  onReset: () => void;
  onClear: () => void;
};

function formatSpeed(speed: number) {
  return `${speed}배`;
}

export function CanvasControls({
  drawingSpeed,
  speedOptions,
  onSetDrawingSpeed,
  onSetColor,
  onRun,
  onSavePng,
  onReset,
  onClear,
}: CanvasControlsProps) {
  const [selectedColor, setSelectedColor] = useState('#1f7a5c');
  const selectedSpeedIndex = Math.max(
    0,
    speedOptions.findIndex((speed) => speed === drawingSpeed),
  );

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    onSetColor(color);
  };

  return (
    <section className="canvas-controls" aria-label="캔버스 실행 설정">
      <section className="canvas-control-section canvas-control-section--speed">
        <h2>그리기 속도</h2>
        <label className="speed-control" htmlFor="drawing-speed">
          <span>현재 속도</span>
          <strong>{formatSpeed(drawingSpeed)}</strong>
        </label>
        <input
          id="drawing-speed"
          className="speed-slider"
          type="range"
          min={0}
          max={speedOptions.length - 1}
          step={1}
          value={selectedSpeedIndex}
          aria-label="그리기 속도"
          aria-valuetext={formatSpeed(drawingSpeed)}
          onChange={(event) =>
            onSetDrawingSpeed(
              speedOptions[Number(event.currentTarget.value)] ?? drawingSpeed,
            )
          }
        />
        <div className="speed-labels" aria-hidden="true">
          {speedOptions.map((speed) => (
            <span key={speed}>{formatSpeed(speed)}</span>
          ))}
        </div>
      </section>

      <section className="canvas-control-section canvas-control-section--color">
        <h2>색상 지정</h2>
        <label className="color-control" htmlFor="pen-color">
          펜 색상
          <input
            id="pen-color"
            type="color"
            value={selectedColor}
            onChange={(event) => handleColorChange(event.currentTarget.value)}
          />
        </label>
      </section>

      <section className="canvas-control-section canvas-control-section--actions">
        <h2>실행</h2>
        <div className="action-row">
          <button type="button" className="primary-action" onClick={onRun}>
            <Play aria-hidden="true" />
            실행
          </button>
          <button type="button" onClick={onSavePng}>
            <Download aria-hidden="true" />
            PNG 저장
          </button>
          <button type="button" onClick={onReset}>
            <RotateCcw aria-hidden="true" />
            초기화
          </button>
          <button type="button" className="secondary-action" onClick={onClear}>
            <Trash2 aria-hidden="true" />
            명령 삭제
          </button>
        </div>
      </section>
    </section>
  );
}
