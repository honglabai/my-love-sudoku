# 내사랑 스도쿠 (My Love Sudoku)

> **한 칸씩 풀고, 한 단계씩 성장하는 스도쿠**  
> 5개 월드 · 50개 정규 스테이지 · 3단계 별점 · RPG형 레벨업 및 업적 시스템

---

## 🌟 주요 특징

1. **5개 월드 & 50개 정규 스테이지 (유일해 100% 검증 완료)**
   - **월드 1: 첫걸음 (1~10단계)** - 스도쿠 입문 및 기본 규칙 체득 (초보자 튜토리얼 가이드 제공)
   - **월드 2: 논리의 길 (11~20단계)** - 후보 숫자 메모와 논리 추론
   - **월드 3: 도전의 탑 (21~30단계)** - 복합적인 논리 기법
   - **월드 4: 전문가의 성 (31~40단계)** - 다단계 추론 퍼즐
   - **월드 5: 마스터 리그 (41~50단계)** - 최고 난이도 정복
   - 각 월드의 마지막 스테이지(10, 20, 30, 40, 50)는 **특별 보스 도전 스테이지**로 구성
   - 모든 50개 퍼즐은 백트래킹 솔버를 통해 **정확히 단 하나의 정답(Unique Solution)**만 존재함이 자동 검증되었습니다.

2. **RPG형 성장 & 별점 보상 시스템 (중복 지급 방지 트랜잭션)**
   - **별점 시스템**:
     - ★★★: 실수 0회, 힌트 0회
     - ★★: 실수 2회 이하, 힌트 1회 이하
     - ★: 그 외 모든 정상 클리어
   - **경험치 공식**:
     - 첫 클리어 XP: `80 + 20 × (월드 번호 - 1) + 20 × (획득 별 수 - 1)`
     - 재도전 시 기본 XP는 중복 지급되지 않으며, 이전 최고 별점을 갱신한 경우에만 별점 차액 XP(`20 × (새 별 - 기존 별)`) 지급
   - **레벨업 공식**:
     - 다음 레벨 필요 XP: `100 + 40 × (현재 레벨 - 1)`
     - 잔여 경험치 이월(Rollover) 및 다중 레벨업(Multi Level-Up) 지원
   - **11종 업적 배지 & 칭호 장착**:
     - '스도쿠 입문자', '완벽한 추론가', '첫 월드 정복자', '독립적인 해결사', '스도쿠 마스터' 등

3. **순수 TypeScript 스도쿠 코어 엔진**
   - UI 라이브러리에 전혀 의존하지 않는 순수 함수 모듈 (`src/domain/sudoku/`)
   - 백트래킹 및 MRV (Minimum Remaining Values) 휴리스틱 솔버
   - 실시간 충돌 검사 (`getConflicts`), 후보 숫자 계산 (`getCandidates`), 완성 검사 (`isSolved`)

4. **논리형 힌트 및 초보자 가이드**
   - **Naked Single**: 특정 칸에 다른 8개 숫자가 올 수 없어 오직 하나의 숫자만 가능한 경우 감지
   - **Hidden Single**: 특정 행, 열, 3×3 박스 내에서 해당 숫자가 들어갈 수 있는 칸이 단 하나뿐인 경우 감지
   - 논리적 추론 과정 상세 설명 모달 제공 및 힌트 적용 기능

5. **모바일 우선 UI/UX & PC 키보드 완벽 지원**
   - 320px 최소 화면 폭에서도 화면 잘림 없는 반응형 보드 레이아웃
   - 터치 친화적 대형 키패드 및 남은 숫자 카운트 배지
   - PC 키보드 지원: 숫자 1~9, 방향키(셀 이동), Backspace/Delete(지우기), N(메모 모드 토글), H(힌트), U/Ctrl+Z(실행 취소), Ctrl+Y(다시 실행), Space/Esc(일시정지)
   - 웹 오디오 API 기반 자체 효과음 합성 엔진 (외부 오디오 파일 없이 100% 동작)

6. **버전 관리형 자동 저장 & PWA 오프라인 실행**
   - localStorage 기반 버전 관리 (`SaveDataV1`), 손상 데이터 복구 및 안전 초기화
   - 플레이 중 실시간 자동 저장 및 홈 화면 "이어하기" 원터치 지원
   - Service Worker & Web App Manifest 기반 오프라인 PWA 설치 지원

---

## 🚀 실행 및 빌드 방법

### 방법 1. 서브디렉터리에서 직접 실행
```bash
cd my-love-sudoku
npm install

# 개발 서버 실행 (기본 http://localhost:5173)
npm run dev

# 자동 테스트 90개 실행
npm test

# 프로덕션 빌드 (TypeScript 컴파일 + Vite 번들링)
npm run build
```

### 방법 2. 프로젝트 루트(`cording`)에서 실행
```bash
# 개발 서버 실행
npm run sudoku:dev

# 전체 테스트 90개 실행
npm run sudoku:test

# 프로덕션 빌드
npm run sudoku:build
```

---

## 🧪 테스트 검증 결과

- **총 테스트 슈트**: 8개 파일 통과 (100%)
- **총 테스트 케이스**: 90개 테스트 통과 (100%)
  1. `sudoku-engine.test.ts`: 유효/무효 보드, 후보수, 백트래킹 솔버, 유일해, 다중해, 미완성, 완성 판정 (10개)
  2. `puzzle-stages.test.ts`: 50스테이지 구조, 5개 월드 분할, 보스/튜토리얼 플래그 (6개)
  3. `all-50-stages.test.ts`: **1번부터 50번까지 전체 50개 스테이지의 유일해 전수 검증** (51개)
  4. `game-reducer.test.ts`: 고정셀 보호, 입력/삭제, 메모 토글, Undo/Redo, 일시정지, 클리어 판정 (6개)
  5. `progression.test.ts`: 별점/XP 계산, 레벨업 이월, 중복 보상 방지 트랜잭션, 스테이지 해금 (7개)
  6. `hint.test.ts`: Naked Single, Hidden Single 논리 힌트 감지 및 설명 정확성 (3개)
  7. `storage.test.ts`: 저장/복원, 마이그레이션, 손상 데이터 복구, 데이터 초기화 (5개)
  8. `achievements.test.ts`: 업적 달성 판정, 중복 방지, 칭호 획득 (2개)

---

## 📁 프로젝트 구조

```
my-love-sudoku/
├── index.html                 # 앱 진입 HTML 및 PWA 메타태그
├── public/
│   ├── icon.svg               # 내사랑 스도쿠 벡터 아이콘
│   ├── manifest.json          # PWA 웹 앱 매니페스트
│   └── sw.js                  # 오프라인 캐싱 서비스 워커
├── src/
│   ├── app/
│   │   ├── App.tsx            # 메인 앱 라우터 & 전역 데이터 관리
│   │   ├── HomePage.tsx       # 홈 화면 (레벨, 진행률, 이어하기, 메인 액션)
│   │   ├── StageMapPage.tsx   # 5개 월드 50스테이지 지도
│   │   ├── GamePage.tsx       # 9x9 스도쿠 플레이 화면 (키패드, 메모, 힌트)
│   │   ├── ResultPage.tsx     # 스테이지 클리어 연출, 별점, XP, 레벨업
│   │   ├── ProfilePage.tsx    # 플레이어 프로필, 칭호 장착, 11종 업적
│   │   └── SettingsPage.tsx   # 효과음, 다크모드, 오류표시, 모션감소
│   ├── audio/
│   │   └── sound.ts           # Web Audio API 자체 신디사이저
│   ├── components/            # Button, Card, ProgressBar, Badge, Modal, StarRating 등
│   ├── domain/sudoku/         # 스도쿠 순수 엔진 (types, engine, generator)
│   ├── features/
│   │   ├── game/              # useReducer 기반 게임 상태 및 Undo/Redo
│   │   ├── progression/       # 별점, XP, 레벨업, 스테이지 해금
│   │   ├── stages/            # 50개 검증된 스테이지 데이터셋
│   │   ├── achievements/      # 11종 업적 정의 및 평가기
│   │   ├── hint/              # Naked/Hidden Single 논리 힌트 엔진
│   │   └── tutorial/          # 1~3단계 초보자 튜토리얼 오버레이
│   ├── storage/
│   │   └── storage.ts         # 버전 관리형 localStorage 영구 저장소
│   └── styles/
│       └── index.css          # Tailwind CSS 및 커스텀 애니메이션
└── tests/                     # 90개 자동화 단위 및 전수 검증 테스트
```
