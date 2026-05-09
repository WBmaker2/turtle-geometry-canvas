import type { ProgramBlock } from '../domain/blocks';

type ChallengeBase = {
  id: string;
  title: string;
  question: string;
  sidesLabel: string;
  blocks: ProgramBlock[];
  reflection: string;
};

export type RegularChallenge = ChallengeBase & {
  kind: 'regular';
  sides: number;
};

export type ExplorationChallenge = ChallengeBase & {
  kind: 'exploration';
};

export type Challenge = RegularChallenge | ExplorationChallenge;

export const challenges: Challenge[] = [
  {
    id: 'triangle',
    kind: 'regular',
    sides: 3,
    title: '정삼각형 여행',
    question: '3번 반복할 때 거북이는 몇 도씩 돌아야 처음 자리로 돌아올까요?',
    sidesLabel: '3개의 변',
    blocks: [
      {
        id: 'trianglePolygon',
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
    kind: 'regular',
    sides: 4,
    title: '정사각형 여행',
    question: '4번 반복할 때 회전 각도는 왜 90도일까요?',
    sidesLabel: '4개의 변',
    blocks: [
      {
        id: 'squarePolygon',
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
    kind: 'regular',
    sides: 5,
    title: '정오각형 여행',
    question: '5번 반복해서 닫힌 도형을 만들려면 몇 도씩 돌아야 할까요?',
    sidesLabel: '5개의 변',
    blocks: [
      {
        id: 'pentagonPolygon',
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
    id: 'hexagon',
    kind: 'regular',
    sides: 6,
    title: '정육각형 여행',
    question: '6번 반복하면서 닫힌 도형이 될 각도는 몇 도일까요?',
    sidesLabel: '6개의 변',
    blocks: [
      {
        id: 'hexagonPolygon',
        kind: 'repeatPolygon',
        times: 6,
        distance: 80,
        turnDegrees: 60,
        direction: 'right',
      },
    ],
    reflection: '외각 60도와 내각 120도의 관계를 확인합니다.',
  },
  {
    id: 'octagon',
    kind: 'regular',
    sides: 8,
    title: '정팔각형 여행',
    question: '8번 반복할 때 각 회전은 몇 도여야 할까요?',
    sidesLabel: '8개의 변',
    blocks: [
      {
        id: 'octagonPolygon',
        kind: 'repeatPolygon',
        times: 8,
        distance: 65,
        turnDegrees: 45,
        direction: 'right',
      },
    ],
    reflection: '외각 45도와 내각 135도의 관계를 찾아봅니다.',
  },
  {
    id: 'star',
    kind: 'exploration',
    title: '별 모양 도전',
    question: '정다각형이 아닌 별 모양은 어떤 회전 규칙으로 생길까요?',
    sidesLabel: '5번 꺾기',
    blocks: [
      {
        id: 'starPolygon',
        kind: 'repeatPolygon',
        times: 5,
        distance: 140,
        turnDegrees: 144,
        direction: 'right',
      },
    ],
    reflection: '정다각형 규칙을 벗어나면 선이 건너뛰며 별 모양이 됩니다.',
  },
  {
    id: 'spiral',
    kind: 'exploration',
    title: '나선 도전',
    question: '거리를 점점 늘리면 나선처럼 보일까요?',
    sidesLabel: '점진적 이동',
    blocks: [
      { id: 'spiral-move-1', kind: 'move', distance: 28 },
      { id: 'spiral-turn-1', kind: 'turn', direction: 'right', degrees: 25 },
      { id: 'spiral-move-2', kind: 'move', distance: 34 },
      { id: 'spiral-turn-2', kind: 'turn', direction: 'right', degrees: 25 },
      { id: 'spiral-move-3', kind: 'move', distance: 40 },
      { id: 'spiral-turn-3', kind: 'turn', direction: 'right', degrees: 25 },
      { id: 'spiral-move-4', kind: 'move', distance: 46 },
      { id: 'spiral-turn-4', kind: 'turn', direction: 'right', degrees: 25 },
      { id: 'spiral-move-5', kind: 'move', distance: 52 },
      { id: 'spiral-turn-5', kind: 'turn', direction: 'right', degrees: 25 },
      { id: 'spiral-move-6', kind: 'move', distance: 58 },
      { id: 'spiral-turn-6', kind: 'turn', direction: 'right', degrees: 25 },
      { id: 'spiral-move-7', kind: 'move', distance: 64 },
      { id: 'spiral-turn-7', kind: 'turn', direction: 'right', degrees: 25 },
    ],
    reflection: '이동 거리를 늘리면 바퀴자국처럼 감기는 나선형 경로를 만들 수 있습니다.',
  },
  {
    id: 'flower',
    kind: 'exploration',
    title: '꽃 모양 도전',
    question: '반복 횟수를 바꿔 꽃잎 비슷한 궤적을 만들 수 있나요?',
    sidesLabel: '12번 반복',
    blocks: [
      {
        id: 'flowerPolygon',
        kind: 'repeatPolygon',
        times: 12,
        distance: 95,
        turnDegrees: 150,
        direction: 'right',
      },
    ],
    reflection: '일반 정다각형과 다른 회전량을 쓰면 교차하는 꽃잎형태가 나타납니다.',
  },
];
