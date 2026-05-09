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

type PanelColor = string;

function getChallengeButtonLabel(challenge: Challenge) {
  const hasTravelSuffix = challenge.title.endsWith(' 여행');
  const baseTitle = hasTravelSuffix ? challenge.title.slice(0, -3) : challenge.title;

  return `${baseTitle} 불러오기`;
}

function getBlockLabel(block: ProgramBlock) {
  if (block.kind === 'move') {
    return `앞으로 ${block.distance}px 이동`;
  }

  if (block.kind === 'turn') {
    const direction = block.direction === 'left' ? '왼쪽' : '오른쪽';
    return `${direction} ${block.degrees}도 회전`;
  }

  if (block.kind === 'penColor') {
    return `펜 색상 ${block.color}`;
  }

  return `${block.times}번 반복: 앞으로 ${block.distance}px, ${block.turnDegrees}도 회전`;
}

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
  const [selectedColor, setSelectedColor] = useState<PanelColor>('#1f7a5c');

  return (
    <section className="control-panel" aria-label="블록 코딩 명령 패널">
      <header className="panel-heading">
        <p className="eyebrow">수학 / 실과 융합</p>
        <h1>Turtle Geometry Canvas</h1>
        <p className="intro-text">
          거북이 블록으로 선을 그리고 각도를 조절해 정다각형의 성질을 실험해
          봅시다.
        </p>
      </header>

      <section className="panel-section">
        <h2>도전 불러오기</h2>
        <div className="button-row">
          {challenges.map((challenge) => (
            <button
              key={challenge.id}
              type="button"
              onClick={() => onLoadChallenge(challenge.id)}
            >
              {getChallengeButtonLabel(challenge)}
            </button>
          ))}
        </div>
      </section>

      <section className="panel-section">
        <h2>현재 명령</h2>
        <ul className="command-list" aria-label="현재 블록 목록">
          {blocks.map((block) => (
            <li key={block.id} className="command-row">
              {getBlockLabel(block)}
            </li>
          ))}
          {blocks.length === 0 && <li className="command-row empty">명령이 없습니다.</li>}
        </ul>
      </section>

      <section className="panel-section">
        <h2>명령 추가</h2>
        <div className="button-row">
          <button type="button" onClick={onAddMove}>
            <SquarePlus aria-hidden="true" />
            앞으로 이동 추가
          </button>
          <button type="button" onClick={onAddTurn}>
            <RotateCcw aria-hidden="true" />
            오른쪽 회전 추가
          </button>
        </div>
      </section>

      <section className="panel-section">
        <h2>색상 지정</h2>
        <label className="color-control" htmlFor="pen-color">
          펜 색상
          <input
            id="pen-color"
            type="color"
            value={selectedColor}
            onChange={(event) => setSelectedColor(event.currentTarget.value)}
          />
        </label>
        <div className="action-row">
          <button
            type="button"
            className="secondary-action"
            onClick={() => onSetColor(selectedColor)}
          >
            <Palette aria-hidden="true" />
            색상 적용
          </button>
        </div>
      </section>

      <section className="panel-section">
        <h2>실행</h2>
        <div className="action-row">
          <button type="button" className="primary-action" onClick={onRun}>
            <Play aria-hidden="true" />
            실행
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
