# Turtle Geometry Canvas
[![Deploy GitHub Pages](https://github.com/wbmaker2/turtle-geometry-canvas/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/wbmaker2/turtle-geometry-canvas/actions/workflows/deploy-pages.yml)

## 배포 링크

- **앱 주소**: https://wbmaker2.github.io/turtle-geometry-canvas/
- **GitHub 저장소**: https://github.com/wbmaker2/turtle-geometry-canvas
- **공개 QA 근거**: [docs/ops/2026-05-09-public-pages-qa.md](docs/ops/2026-05-09-public-pages-qa.md)

Turtle Geometry Canvas는 5~6학년을 대상으로 정다각형의 외각·내각 개념을 체험형 블록 코딩으로 익히는 수학/실과 융합 수업용 웹앱입니다.  
거북이에게 `앞으로 이동`, `회전`, `반복`, `색상 변경` 명령을 조합하게 하여 도형을 직접 그리고, 실행 결과를 보며 각도와 규칙을 탐색합니다. `자유 도형 그리기`에서는 이동거리와 회전각을 입력해 학생이 직접 명령을 쌓을 수 있고, 거북이가 이동하며 선을 그리는 속도를 조절할 수 있습니다.

## 실행 방법

```bash
npm install
npm run dev
```

## 테스트 방법

```bash
npm run test
npm run build
npm run e2e
```

## 수업 흐름 예시

1. 교사는 과제(예: 삼각형/사각형/오각형)를 불러옵니다.  
2. 학생이 제시된 블록을 그대로 실행해 도형을 그립니다.  
3. `실행` 후 실제 그림에서 한 바퀴 도는 각도를 확인하고, 외각(`360 / 변 수`)을 계산해 봅니다.  
4. 내각은 `180 - 외각`으로 연결해 예측값을 토의합니다.  
5. 내각의 합(`(변 수 - 2) × 180`)이 각도 반복 실험 결과와 일치하는지 비교합니다.  
6. 추가 실습으로 `정육각형 여행`, `정팔각형 여행`, `나선 도전`, `꽃 모양 도전`, `자유 도형 그리기`도 함께 진행합니다.

### 수업 자료
- [학생 활동지](docs/student-worksheet.md)

## 개인정보 및 로그인

- 로그인 기능이 없습니다.  
- 개인 계정/개인정보를 수집하지 않습니다.
