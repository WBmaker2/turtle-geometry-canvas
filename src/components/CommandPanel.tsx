import { useState } from 'react';
import {
  MoveRight,
  PencilLine,
  RotateCcw,
  Repeat,
} from 'lucide-react';

import type { ProgramBlock, ProgramBlockPatch } from '../domain/blocks';
import type { Challenge } from '../data/challenges';

type CommandPanelProps = {
  blocks: ProgramBlock[];
  challenges: Challenge[];
  onLoadChallenge: (challengeId: string) => void;
  onStartFreeDraw: () => void;
  onAddMove: (distance: number) => void;
  onAddTurn: (degrees: number, direction: 'left' | 'right') => void;
  onAddRepeat: (
    times: number,
    distance: number,
    turnDegrees: number,
    direction: 'left' | 'right',
  ) => void;
  onUpdateBlock: (blockId: string, patch: ProgramBlockPatch) => void;
};

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
  onStartFreeDraw,
  onAddMove,
  onAddTurn,
  onAddRepeat,
  onUpdateBlock,
}: CommandPanelProps) {
  const [newMoveDistance, setNewMoveDistance] = useState(80);
  const [newTurnDegrees, setNewTurnDegrees] = useState(90);
  const [newTurnDirection, setNewTurnDirection] = useState<'left' | 'right'>('right');
  const [newRepeatTimes, setNewRepeatTimes] = useState(3);
  const [newRepeatDistance, setNewRepeatDistance] = useState(80);
  const [newRepeatTurnDegrees, setNewRepeatTurnDegrees] = useState(120);
  const [newRepeatDirection, setNewRepeatDirection] = useState<'left' | 'right'>(
    'right',
  );

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

  const parseNumberInput = (value: string, fallback: number) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
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
        <button
          type="button"
          className="wide-action"
          onClick={onStartFreeDraw}
        >
          <PencilLine aria-hidden="true" />
          자유 도형 그리기
        </button>
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

      <section className="panel-section command-section">
        <h2>현재 명령</h2>
        <ul className="command-list" aria-label="현재 블록 목록">
          {blocks.map((block) => (
            <li
              key={block.id}
              className={`command-row command-row--editable command-row--${block.kind}`}
            >
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
                <div className="turn-field-row">
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
                </div>
              ) : null}

              {block.kind === 'repeatPolygon' ? (
                <div className="repeat-block">
                  <div className="repeat-count-row">
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
                  </div>

                  <div className="repeat-inner">
                    <p className="repeat-inner-title">반복 안의 명령</p>
                    <div className="repeat-step-grid">
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
                      <div className="turn-field-row">
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
                          <label htmlFor={`${block.id}-turn-degrees`}>
                            회전 각도
                          </label>
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
                      </div>
                    </div>
                  </div>
                </div>
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
        <div className="command-builder" role="group" aria-label="새 명령 만들기">
          <div className="builder-row" role="group" aria-label="이동 명령 만들기">
            <label htmlFor="new-move-distance">이동거리</label>
            <input
              id="new-move-distance"
              type="number"
              min={1}
              max={240}
              value={newMoveDistance}
              onChange={(event) =>
                setNewMoveDistance(
                  parseNumberInput(event.currentTarget.value, newMoveDistance),
                )
              }
            />
            <button type="button" onClick={() => onAddMove(newMoveDistance)}>
              <MoveRight aria-hidden="true" />
              이동 추가
            </button>
          </div>

          <div
            className="builder-row builder-row--turn"
            role="group"
            aria-label="회전 명령 만들기"
          >
            <label htmlFor="new-turn-direction">방향</label>
            <select
              id="new-turn-direction"
              value={newTurnDirection}
              onChange={(event) =>
                setNewTurnDirection(parseDirection(event.currentTarget.value))
              }
            >
              <option value="left">왼쪽</option>
              <option value="right">오른쪽</option>
            </select>
            <label htmlFor="new-turn-degrees">회전 각도</label>
            <input
              id="new-turn-degrees"
              type="number"
              min={0}
              max={360}
              value={newTurnDegrees}
              onChange={(event) =>
                setNewTurnDegrees(
                  parseNumberInput(event.currentTarget.value, newTurnDegrees),
                )
              }
            />
            <button
              type="button"
              onClick={() => onAddTurn(newTurnDegrees, newTurnDirection)}
            >
              <RotateCcw aria-hidden="true" />
              회전 추가
            </button>
          </div>

          <div
            className="builder-row builder-row--repeat"
            role="group"
            aria-label="반복 명령 만들기"
          >
            <label htmlFor="new-repeat-times">반복 횟수</label>
            <input
              id="new-repeat-times"
              type="number"
              min={1}
              max={24}
              value={newRepeatTimes}
              onChange={(event) =>
                setNewRepeatTimes(
                  parseNumberInput(event.currentTarget.value, newRepeatTimes),
                )
              }
            />
            <label htmlFor="new-repeat-distance">이동거리</label>
            <input
              id="new-repeat-distance"
              type="number"
              min={1}
              max={240}
              value={newRepeatDistance}
              onChange={(event) =>
                setNewRepeatDistance(
                  parseNumberInput(event.currentTarget.value, newRepeatDistance),
                )
              }
            />
            <label htmlFor="new-repeat-direction">방향</label>
            <select
              id="new-repeat-direction"
              value={newRepeatDirection}
              onChange={(event) =>
                setNewRepeatDirection(parseDirection(event.currentTarget.value))
              }
            >
              <option value="left">왼쪽</option>
              <option value="right">오른쪽</option>
            </select>
            <label htmlFor="new-repeat-turn-degrees">회전 각도</label>
            <input
              id="new-repeat-turn-degrees"
              type="number"
              min={0}
              max={360}
              value={newRepeatTurnDegrees}
              onChange={(event) =>
                setNewRepeatTurnDegrees(
                  parseNumberInput(
                    event.currentTarget.value,
                    newRepeatTurnDegrees,
                  ),
                )
              }
            />
            <button
              type="button"
              onClick={() =>
                onAddRepeat(
                  newRepeatTimes,
                  newRepeatDistance,
                  newRepeatTurnDegrees,
                  newRepeatDirection,
                )
              }
            >
              <Repeat aria-hidden="true" />
              반복 추가
            </button>
          </div>
        </div>
      </section>

    </section>
  );
}
