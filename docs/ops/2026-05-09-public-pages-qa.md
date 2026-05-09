# 2026-05-09 공개 페이지 QA

## 대상
- Live URL: https://wbmaker2.github.io/turtle-geometry-canvas/
- Repo URL: https://github.com/WBmaker2/turtle-geometry-canvas
- QA Date: 2026-05-09

## HTTP 응답 확인
- Playwright live page navigation 기준 모든 확인 viewport에서 HTTP 200 수신.
- 배포 URL의 HTML/asset 응답은 이전 배포 확인 단계에서 200 OK로 확인됨.

## Live Playwright QA 결과

| Viewport | HTTP | Status Text | Segment Pixels Before | Segment Pixels After | Increase | Horizontal Overflow | Screenshot |
| --- | --- | --- | ---: | ---: | ---: | --- | --- |
| Desktop 1440x900 | 200 | `실행 결과: 선분 4개` | 156 | 1866 | +1710 | 없음 | [desktop](assets/turtle-geometry-desktop.png) |
| Tablet 900x1100 | 200 | `실행 결과: 선분 4개` | 156 | 1866 | +1710 | 없음 | [tablet](assets/turtle-geometry-tablet.png) |
| Mobile 390x844 | 200 | `실행 결과: 선분 4개` | 664 | 7491 | +6827 | 없음 | [mobile](assets/turtle-geometry-mobile.png) |

검증 순서:

1. Live URL 접속 후 `Turtle Geometry Canvas` heading 확인.
2. `정사각형 불러오기` 클릭.
3. 실행 전 기본 선분 색상(`#1f7a5c`) 픽셀 수 측정.
4. `실행` 클릭.
5. `role="status"` 텍스트가 `실행 결과: 선분 4개`인지 확인.
6. 실행 후 기본 선분 색상 픽셀 수가 의미 있게 증가했는지 확인.
7. `document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1`로 가로 오버플로우 없음 확인.

## E2E 결과
- 실행: `npm run e2e`
- 결과: `2 passed`
- 검증 포인트:
  - `정사각형 불러오기` 후 `실행` 버튼 클릭
  - 상태 텍스트에 `선분 4개` 포함 확인
  - 캔버스 표시 확인
  - 선분 색상 픽셀 카운트 기준 기본 선분이 그려지는지(`before` 대비 `after` 증가) 확인
- 테스트 프로젝트:
  - chromium
  - mobile (Pixel 7 설정)

## 화면 스크린샷 링크
- [Desktop 1440x900](assets/turtle-geometry-desktop.png)
- [Tablet 900x1100](assets/turtle-geometry-tablet.png)
- [Mobile 390x844](assets/turtle-geometry-mobile.png)

## 추가 확인 항목(요청 항목 대비)
- `선분 4개`: live QA와 local e2e 모두 확인.
- 캔버스 노출: live QA와 local e2e 모두 확인.
- 기본 색상 픽셀 증가: live QA에서 각 viewport별로 확인.
- 좌우 오버플로우: live QA에서 각 viewport별로 없음 확인.
