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
];
