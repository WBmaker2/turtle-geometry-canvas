import { useState } from 'react';
import { Download, Palette, Play, RotateCcw, SquarePlus, Trash2 } from 'lucide-react';

import type { ProgramBlock, ProgramBlockPatch } from '../domain/blocks';
import type { Challenge } from '../data/challenges';

type CommandPanelProps = {
  blocks: ProgramBlock[];
  challenges: Challenge[];
  onLoadChallenge: (challengeId: string) => void;
  onAddMove: () => void;
  onAddTurn: () => void;
  onSetColor: (color: string) => void;
  onRun: () => void;
  onSavePng: () => void;
  onReset: () => void;
  onClear: () => void;
  onUpdateBlock: (blockId: string, patch: ProgramBlockPatch) => void;
};

type PanelColor = string;

function getChallengeButtonLabel(challenge: Challenge) {
  const hasTravelSuffix = challenge.title.endsWith(' 여행');
  const baseTitle = hasTravelSuffix ? challenge.title.slice(0, -3) : challenge.title;

  return `${baseTitle} 불러오기`;
}

function parseDirection(value: string): 'left' | 'right' {
  return value === 'left' ? 'left' : 'right';
}

function getBlockTitle(blockKind: ProgramBlock['kind']) {
  if (blockKind === 'move') return '앞으로 이동';
  if (blockKind === 'turn') return '회전';
  if (blockKind === 'repeatPolygon') return '반복';
  return '펜 색상';
}

export function CommandPanel({
  blocks,
  challenges,
  onLoadChallenge,
  onAddMove,
  onAddTurn,
  onSetColor,
  onRun,
  onSavePng,
  onReset,
  onClear,
  onUpdateBlock,
}: CommandPanelProps) {
  const [selectedColor, setSelectedColor] = useState<PanelColor>('#1f7a5c');

  const handleNumberPatch = (
    blockId: string,
    key: 'distance' | 'degrees' | 'times' | 'turnDegrees',
    value: string,
  ) => {
    const trimmed = value.trim();
    if (trimmed === '') {
      return;
    }

    const parsed = Number(trimmed);
    if (Number.isNaN(parsed)) {
      return;
    }

    onUpdateBlock(blockId, { [key]: parsed } as ProgramBlockPatch);
  };

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
            <li key={block.id} className="command-row command-row--editable">
              <p className="block-title" aria-label={`${getBlockTitle(block.kind)} 블록`}>
                {getBlockTitle(block.kind)}
              </p>
              {block.kind === 'move' ? (
                <div className="block-fields">
                  <label htmlFor={`${block.id}-distance`}>이동 거리</label>
                  <input
                    id={`${block.id}-distance`}
                    type="number"
                    min={1}
                    max={240}
                    value={block.distance}
                    onChange={(event) =>
                      handleNumberPatch(block.id, 'distance', event.currentTarget.value)
                    }
                  />
                </div>
              ) : null}

              {block.kind === 'turn' ? (
                <>
                  <div className="block-fields">
                    <label htmlFor={`${block.id}-direction`}>방향</label>
                    <select
                      id={`${block.id}-direction`}
                      value={block.direction}
                      onChange={(event) =>
                        onUpdateBlock(block.id, {
                          direction: parseDirection(event.currentTarget.value),
                        })
                      }
                    >
                      <option value="left">왼쪽</option>
                      <option value="right">오른쪽</option>
                    </select>
                  </div>
                  <div className="block-fields">
                    <label htmlFor={`${block.id}-degrees`}>회전 각도</label>
                    <input
                      id={`${block.id}-degrees`}
                      type="number"
                      min={0}
                      max={360}
                      value={block.degrees}
                      onChange={(event) =>
                        handleNumberPatch(
                          block.id,
                          'degrees',
                          event.currentTarget.value,
                        )
                      }
                    />
                  </div>
                </>
              ) : null}

              {block.kind === 'repeatPolygon' ? (
                <>
                  <div className="block-fields">
                    <label htmlFor={`${block.id}-times`}>반복 횟수</label>
                    <input
                      id={`${block.id}-times`}
                      type="number"
                      min={1}
                      max={24}
                      value={block.times}
                      onChange={(event) =>
                        handleNumberPatch(
                          block.id,
                          'times',
                          event.currentTarget.value,
                        )
                      }
                    />
                  </div>
                  <div className="block-fields">
                    <label htmlFor={`${block.id}-distance`}>이동 거리</label>
                    <input
                      id={`${block.id}-distance`}
                      type="number"
                      min={1}
                      max={240}
                      value={block.distance}
                      onChange={(event) =>
                        handleNumberPatch(
                          block.id,
                          'distance',
                          event.currentTarget.value,
                        )
                      }
                    />
                  </div>
                  <div className="block-fields">
                    <label htmlFor={`${block.id}-turn-degrees`}>회전 각도</label>
                    <input
                      id={`${block.id}-turn-degrees`}
                      type="number"
                      min={0}
                      max={360}
                      value={block.turnDegrees}
                      onChange={(event) =>
                        handleNumberPatch(
                          block.id,
                          'turnDegrees',
                          event.currentTarget.value,
                        )
                      }
                    />
                  </div>
                  <div className="block-fields">
                    <label htmlFor={`${block.id}-direction`}>방향</label>
                    <select
                      id={`${block.id}-direction`}
                      value={block.direction}
                      onChange={(event) =>
                        onUpdateBlock(block.id, {
                          direction: parseDirection(event.currentTarget.value),
                        })
                      }
                    >
                      <option value="left">왼쪽</option>
                      <option value="right">오른쪽</option>
                    </select>
                  </div>
                </>
              ) : null}

              {block.kind === 'penColor' ? (
                <div className="block-fields">
                  <label htmlFor={`${block.id}-color`}>펜 색상</label>
                  <input
                    id={`${block.id}-color`}
                    type="color"
                    value={block.color}
                    onChange={(event) =>
                      onUpdateBlock(block.id, { color: event.currentTarget.value })
                    }
                  />
                </div>
              ) : null}
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
