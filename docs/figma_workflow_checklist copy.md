# 🎯 Figma 작업 워크플로우

## 📅 **Day 1-2: 프로젝트 셋업**

### **Figma 파일 구조 생성**
- [ ] 새 Figma 팀/프로젝트 생성: "CCF2P Game Platform"
- [ ] 메인 파일 생성: "UI Design System"
- [ ] 페이지 구조 설정:
  - [ ] 🎨 Design System
  - [ ] 🧩 Components
  - [ ] 📱 Mobile Screens
  - [ ] 💻 Desktop Screens
  - [ ] 🎮 Game Modules
  - [ ] 🔞 Adult Content
  - [ ] 🔗 Prototypes

### **팀 협업 설정**
- [ ] 개발팀 멤버 초대 (View 권한)
- [ ] 코멘트 시스템 활성화
- [ ] 버전 관리 설정 (Auto-save)

---

## 📅 **Day 3-5: Design System 구축**

### **색상 시스템 구축 (통합 가이드 기준)**
```
1. 네온 퍼플/그라데이션 시스템
- [x] --color-neon-purple-primary: #6366f1
- [x] --color-neon-purple-light: #8b5cf6
- [x] --color-neon-purple-dark: #4338ca
- [x] --color-neon-glow: rgba(99, 102, 241, 0.5)

2. 슬레이트 기반 다크 테마
- [x] --color-slate-900: #0f172a (배경)
- [x] --color-slate-800: #1e293b (카드 배경)
- [x] --color-slate-700: #334155 (버튼 배경)
- [x] --color-slate-600: #475569 (테두리)
- [x] --color-slate-400: #94a3b8 (보조 텍스트)
- [x] --color-slate-200: #e2e8f0 (주요 텍스트)

3. 상태별 색상
- [x] --color-success: #10b981 (성공)
- [x] --color-warning: #f59e0b (경고) 
- [x] --color-error: #ef4444 (오류)
- [x] --color-info: #3b82f6 (정보)

4. 그라데이션
- [x] --gradient-neon: linear-gradient(135deg, #6366f1, #8b5cf6)
- [x] --gradient-gold: linear-gradient(135deg, #fbbf24, #f59e0b)
```

### **타이포그래피 설정 (통합 가이드 기준)**
```
1. Font Family
- [x] --font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif
- [x] --font-family-mono: 'Fira Code', 'Monaco', 'Consolas', monospace

2. Font Sizes & Line Heights
- [x] --font-size-xs: 12px / --line-height-xs: 16px
- [x] --font-size-sm: 14px / --line-height-sm: 20px  
- [x] --font-size-base: 16px / --line-height-base: 24px
- [x] --font-size-lg: 18px / --line-height-lg: 28px
- [x] --font-size-xl: 20px / --line-height-xl: 28px
- [x] --font-size-2xl: 24px / --line-height-2xl: 32px
- [x] --font-size-3xl: 30px / --line-height-3xl: 36px

3. Font Weights
- [x] --font-weight-normal: 400
- [x] --font-weight-medium: 500
- [x] --font-weight-semibold: 600
- [x] --font-weight-bold: 700
```

### **간격 시스템 & 그리드 (통합 가이드 기준)**
```
1. Grid System (8px 기반)
- [x] --grid-base: 8px
- [x] --grid-0-5: 2px
- [x] --grid-1: 4px
- [x] --grid-2: 8px
- [x] --grid-3: 12px
- [x] --grid-4: 16px
- [x] --grid-5: 20px
- [x] --grid-6: 24px
- [x] --grid-8: 32px
- [x] --grid-10: 40px
- [x] --grid-12: 48px
- [x] --grid-16: 64px

2. Component Padding
- [x] --padding-xs: var(--grid-1) (4px)
- [x] --padding-sm: var(--grid-2) (8px)
- [x] --padding-md: var(--grid-4) (16px)
- [x] --padding-lg: var(--grid-6) (24px)
- [x] --padding-xl: var(--grid-8) (32px)

3. Auto Layout 가이드라인
- [x] 최소 터치 영역: 44px x 44px
- [x] 카드 간격: var(--grid-6) (24px)
- [x] 섹션 간격: var(--grid-8) (32px)
```

---

## 📅 **Day 6-8: 기본 컴포넌트 제작**

### **Button Components (통합 가이드 기준)**
```
Button Variants:
- [x] primary (네온 퍼플 그라데이션)
- [x] secondary (슬레이트 배경)
- [x] outline (테두리만)
- [x] ghost (배경 없음)
- [x] gradient (네온/골드 그라데이션)
- [x] success/warning/error (상태별)

Button Sizes:
- [x] xs: height 28px, padding 8px 12px
- [x] sm: height 32px, padding 8px 16px  
- [x] md: height 40px, padding 12px 20px
- [x] lg: height 48px, padding 16px 24px
- [x] xl: height 56px, padding 20px 28px

Button States (각 variant별):
- [x] default (기본 상태)
- [x] hover (호버 상태 - scale 1.02)
- [x] active (클릭 상태 - scale 0.98)
- [x] disabled (비활성 상태)
- [x] loading (로딩 스피너)

Properties 설정:
- [x] variant: primary/secondary/outline/ghost/gradient/success/warning/error
- [x] size: xs/sm/md/lg/xl
- [x] state: default/hover/active/disabled/loading
- [x] icon: boolean (아이콘 표시 여부)
- [x] iconPosition: left/right
```

### **Input Components (통합 가이드 기준)**
```
Input Variants:
- [x] text (기본 텍스트 입력)
- [x] password (비밀번호, 토글 아이콘)
- [x] search (검색, 검색 아이콘)
- [x] number (숫자, 모노스페이스 폰트)

Input Sizes:
- [x] sm: height 32px, padding 8px 12px
- [x] md: height 40px, padding 12px 16px
- [x] lg: height 48px, padding 16px 20px

Input States:
- [x] default (기본 상태)
- [x] focus (포커스 - 네온 테두리)
- [x] error (오류 - 빨간 테두리)
- [x] disabled (비활성)
- [x] success (성공 - 초록 테두리)

Input Features:
- [x] label (라벨 텍스트)
- [x] placeholder (플레이스홀더)
- [x] helperText (도움말 텍스트)
- [x] errorText (오류 메시지)
- [x] leftIcon (왼쪽 아이콘)
- [x] rightIcon (오른쪽 아이콘)

Properties:
- [x] variant: text/password/search/number
- [x] size: sm/md/lg
- [x] state: default/focus/error/disabled/success
- [x] leftIcon: boolean
- [x] rightIcon: boolean
- [x] required: boolean
```

### **Card Components (통합 가이드 기준)**
```
Card Types:
- [x] CardBase (기본 카드 - 범용)
- [x] CardGame (게임용 카드 - 게임 썸네일/정보)
- [x] CardMission (미션 카드 - 목표/보상)
- [x] CardReward (보상 카드 - 아이템/토큰)

Card States:
- [x] default (기본 상태)
- [x] hover (호버 - 살짝 떠오르는 효과)
- [x] active (선택됨 - 네온 테두리)
- [x] disabled (비활성 - 흐려짐)
- [x] loading (로딩 - 스켈레톤 UI)

Card Features:
- [x] header (제목 영역)
- [x] content (내용 영역)
- [x] footer (하단 액션 영역)
- [x] thumbnail (썸네일 이미지)
- [x] badge (상태 배지)
- [x] progress (진행률 바)

Card Sizes:
- [x] sm: 280px width, auto height
- [x] md: 320px width, auto height
- [x] lg: 400px width, auto height
- [x] full: 100% width, auto height

Properties:
- [x] type: base/game/mission/reward
- [x] size: sm/md/lg/full
- [x] state: default/hover/active/disabled/loading
- [x] showThumbnail: boolean
- [x] showBadge: boolean
- [x] showProgress: boolean
```

---

## 📅 **Day 9-12: 게임 UI 전용 컴포넌트**

### **Token Balance Widget**
```
컴포넌트 생성: token-balance
- [x] 토큰 아이콘 (Auto Layout)
- [x] 수치 텍스트 (Monospace)
- [x] 변화 인디케이터 (+/-)
- [x] 경고 상태 (부족 시 주황색)

Properties:
- [x] Amount: 숫자 값
- [x] Status: Normal/Warning/Critical
- [x] Change: None/Increase/Decrease
```

### **CJ AI Chat Bubble**
```
컴포넌트 생성: cj-chat
- [x] AI 아바타 (원형, 애니메이션)
- [x] 채팅 버블 (동적 크기)
- [x] 타이핑 인디케이터
- [x] 음성 토글 버튼

Properties:
- [x] State: Idle/Typing/Speaking
- [x] Message: Text Content
- [x] Avatar: Mood State
```

### **게임별 컴포넌트**

#### **슬롯 머신**
```
컴포넌트 생성: slot-machine
- [ ] slot-reel (3개 릴)
- [ ] slot-symbol (심볼 세트)
- [ ] spin-button (메인 스핀)
- [ ] bet-control (베팅 조절)

Properties:
- [ ] State: Idle/Spinning/Result
- [ ] Symbols: [7, BAR, Cherry, Bell, Diamond]
- [ ] Bet Amount: 숫자
```

#### **룰렛**
```
컴포넌트 생성: roulette-wheel
- [ ] wheel-base (36숫자 + 0)
- [ ] betting-table (베팅 영역)
- [ ] ball-indicator (볼 위치)
- [ ] history-display (결과 히스토리)

Properties:
- [ ] State: Idle/Spinning/Result
- [ ] Selected Number: 0-36
- [ ] Bet Areas: Array
```

#### **가챠**
```
컴포넌트 생성: gacha-box
- [ ] gacha-container (3D 박스)
- [ ] pull-button (큰 버튼)
- [ ] ticket-counter (티켓 수량)
- [ ] result-modal (결과 표시)

Properties:
- [ ] State: Ready/Pulling/Reveal
- [ ] Tier: Common/Rare/Epic/Legendary
- [ ] Tickets: 숫자
```

#### **가위바위보**
```
컴포넌트 생성: rps-game
- [ ] choice-buttons (3개 선택)
- [ ] opponent-display (AI 상대)
- [ ] result-screen (승부 결과)

Properties:
- [ ] Player Choice: Rock/Paper/Scissors
- [ ] AI Choice: Rock/Paper/Scissors
- [ ] Result: Win/Lose/Draw
```

---

## 📅 **Day 13-15: 화면 디자인 (Mobile)**

### ✅ **메인 화면들**

#### **온보딩 플로우**
```
Frame 생성: 375 x 812 (iPhone 13)
- [ ] onboarding-01-invite (초대 코드)
- [ ] onboarding-02-login (로그인)
- [ ] onboarding-03-welcome (환영)
- [ ] onboarding-04-tutorial (튜토리얼)

체크사항:
- [ ] CJ AI 첫 등장 연출
- [ ] VIP 희소성 강조
- [ ] 입력 필드 포커스 상태
- [ ] 로딩 애니메이션 계획
```

#### **대시보드**
```
Frame: dashboard-main
- [ ] 상단 토큰 잔고 (고정)
- [ ] CJ AI 채팅 (우하단 고정)
- [ ] 게임 카드 그리드 (4개)
- [ ] 미션 카드 섹션
- [ ] Flash Offer 배너 (조건부)

체크사항:
- [ ] 스크롤 영역 정의
- [ ] 고정 요소 위치
- [ ] 카드 간 간격 (24px)
- [ ] 안전 영역 (Safe Area) 고려
```

#### **게임 화면들**
```
각 게임별 전용 화면:
- [ ] game-slot-main
- [ ] game-roulette-main  
- [ ] game-gacha-main
- [ ] game-rps-main

공통 요소:
- [ ] 뒤로가기 버튼 (좌상단)
- [ ] 토큰 잔고 (우상단)
- [ ] CJ AI 채팅 (최소화 가능)
- [ ] 게임 특화 UI
```

### ✅ **성인 콘텐츠 화면**
```
Frame: adult-content
- [ ] 연령 인증 모달
- [ ] Stage 언락 스와이프 (3개)
- [ ] VIP 콘텐츠 뷰어
- [ ] 언락 성공 애니메이션

체크사항:
- [ ] 블러 처리된 프리뷰
- [ ] 토큰 비용 명확 표시
- [ ] VIP 배지 표시
- [ ] 스와이프 인디케이터
```

---

## 📅 **Day 16-18: 상호작용 & 프로토타입**

### **마이크로 인터랙션 정의 (통합 가이드 기준)**

#### **애니메이션 타이밍 함수**
```
Easing Functions:
- [ ] --ease-out-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94)
- [ ] --ease-in-quick: cubic-bezier(0.4, 0, 1, 1)
- [ ] --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55)
- [ ] --ease-elastic: cubic-bezier(0.25, 0.46, 0.45, 0.94)

Duration Presets:
- [ ] --duration-instant: 0.1s
- [ ] --duration-fast: 0.2s
- [ ] --duration-normal: 0.3s
- [ ] --duration-slow: 0.5s
- [ ] --duration-slower: 0.8s
```

#### **Button Interactions (통합 가이드 기준)**
```
기본 상호작용:
- [ ] entrance: opacity 0→1, y 20px→0 (0.5s, ease-out-smooth)
- [ ] exit: opacity 1→0, scale 1→0.95 (0.2s, ease-in-quick)
- [ ] hover: scale 1→1.02 (0.2s, ease-out-smooth)
- [ ] press: scale 1→0.98 (0.1s, ease-in-quick)
- [ ] release: scale 0.98→1 (0.1s, ease-out-smooth)

특수 버튼:
- [ ] Spin Button: 
  - pulse: scale 1→1.05→1 (2s loop, ease-bounce)
  - glow: box-shadow 0→강함→0 (2s loop)
- [ ] CTA Button: 
  - glow: box-shadow glow effect (지속)
  - shine: pseudo-element 슬라이드 (3s loop)
```

#### **Card Interactions (통합 가이드 기준)**
```
카드 애니메이션:
- [ ] hover: 
  - transform: translateY(0→-4px) (0.3s, ease-out-smooth)
  - box-shadow: 증가 (0.3s, ease-out-smooth)
- [ ] active:
  - transform: scale(1→0.98) (0.2s, ease-in-quick)
  - border: 네온 테두리 나타남
- [ ] loading:
  - 스켈레톤: opacity 0.3→1→0.3 (1.5s loop, ease-in-out)
```

#### **Page Transitions (통합 가이드 기준)**
```
화면 전환 애니메이션:
- [ ] 슬라이드 인/아웃: 300ms ease-out
- [ ] 모달 등장: Scale up 250ms + Fade in
- [ ] 카드 플립: 3D rotation 400ms
```

### ✅ **프로토타입 플로우 생성**

#### **메인 사용자 여정**
```
프로토타입 연결:
- [ ] 온보딩 → 대시보드
- [ ] 대시보드 → 각 게임
- [ ] 게임 → 결과 → 대시보드
- [ ] 토큰 부족 → 본사 사이트 CTA
- [ ] 언락 → 성인 콘텐츠 뷰어

인터랙션 타입:
- [ ] On Tap: 기본 탭 이벤트
- [ ] On Hover: 데스크톱 호버
- [ ] On Drag: 스와이프 제스처
- [ ] After Delay: 자동 전환
```

---

## 📅 **Day 19-20: 반응형 & 최적화**

### ✅ **태블릿 버전 (768px)**
```
프레임 추가: iPad Pro
- [ ] 사이드 네비게이션
- [ ] 카드 2열 그리드
- [ ] 멀티 패널 레이아웃
- [ ] 확장된 CJ AI 채팅

체크사항:
- [ ] 터치 영역 44px 이상
- [ ] 가로 모드 고려
- [ ] Split View 대응
```

### ✅ **데스크톱 버전 (1024px+)**
```
프레임 추가: Desktop
- [ ] 대시보드 뷰 (한 화면에 모든 정보)
- [ ] 멀티 윈도우 (여러 게임 동시)
- [ ] 고급 애니메이션
- [ ] 키보드 단축키 표시

체크사항:
- [ ] 마우스 호버 상태
- [ ] 키보드 네비게이션
- [ ] 큰 화면 활용도
```

---

## 📅 **Day 21: 최종 검토 & 전달**

### ✅ **품질 검증**

#### **디자인 시스템 검증**
- [ ] 모든 컴포넌트가 Properties로 제어 가능한가?
- [ ] 색상이 접근성 기준 4.5:1 이상인가?
- [ ] 폰트 크기가 모바일에서 읽기 쉬운가? (최소 14px)

#### **사용자 경험 검증**
- [ ] 핵심 액션(스핀, 베팅)이 3탭 이내인가?
- [ ] 오류 상황에 대한 피드백이 있는가?
- [ ] 로딩 상태가 모든 화면에 정의되었는가?

#### **기술 구현 검증**
- [ ] 모든 애니메이션이 실제 구현 가능한가?
- [ ] 이미지 최적화가 고려되었는가?
- [ ] API 데이터 표시 영역이 동적인가?

### ✅ **개발팀 전달 준비**

#### **Assets 익스포트**
```
필요한 에셋들:
- [ ] 모든 아이콘 (SVG, 24px/48px)
- [ ] 게임 심볼 이미지 (PNG, @1x/@2x/@3x)
- [ ] 배경 이미지 (WebP 포맷)
- [ ] 로고 및 브랜딩 (다양한 크기)

Figma 익스포트 설정:
- [ ] SVG: 아이콘, 일러스트
- [ ] PNG: 사진, 복잡한 그래픽 (@2x)
- [ ] WebP: 배경, 대용량 이미지
```

#### **스타일 가이드 문서화**
```
개발용 스펙 문서:
- [ ] CSS Variables 목록
- [ ] 애니메이션 타이밍 함수
- [ ] 반응형 브레이크포인트
- [ ] 컴포넌트 Props 정의
- [ ] 상태 전환 다이어그램
```

#### **프로토타입 공유**
```
공유 설정:
- [ ] 퍼블릭 링크 생성 (비밀번호 설정)
- [ ] 모바일 미리보기 활성화
- [ ] 코멘트 권한 부여
- [ ] 버전 히스토리 정리
```

---

## 🔄 **지속적인 업데이트 워크플로우**

### ✅ **주간 검토 사이클**
- [ ] **월요일**: 개발팀 피드백 수집
- [ ] **화요일**: 디자인 수정 및 개선
- [ ] **수요일**: 새로운 기능 UI 설계
- [ ] **목요일**: 사용자 테스트 결과 반영
- [ ] **금요일**: 다음 주 계획 수립

### ✅ **버전 관리**
- [ ] 주요 변경사항마다 버전 태그
- [ ] 변경 로그 문서화
- [ ] 이전 버전 백업 유지
- [ ] 개발팀과 동기화 확인

---

## 📊 **성과 측정 지표**

### ✅ **디자인 효율성**
- [ ] 컴포넌트 재사용률 (목표: 80% 이상)
- [ ] 디자인 시스템 준수율
- [ ] 개발 전달 후 수정 요청 횟수 (목표: 주 3회 이하)

### ✅ **사용자 피드백**
- [ ] 게임 UI 직관성 점수
- [ ] 토큰 시스템 이해도
- [ ] CJ AI 상호작용 만족도
- [ ] 전체적인 몰입감 평가

---

## 🚨 **주의사항 & 팁**

### ✅ **Figma 작업 팁**
- [ ] **Auto Layout 활용**: 반응형 디자인을 위해 필수
- [ ] **Component 활용**: 일관성과 효율성을 위해 최대한 활용
- [ ] **Naming Convention**: 팀 전체가 이해할 수 있는 명명 규칙
- [ ] **Layer 정리**: 개발자가 이해하기 쉽게 구조화

### ✅ **개발 협업 팁**
- [ ] **정기 미팅**: 주 2회 디자인-개발 동기화
- [ ] **실시간 피드백**: Figma 코멘트 적극 활용
- [ ] **프로토타입 테스트**: 구현 전 인터랙션 검증
- [ ] **점진적 개발**: 우선순위에 따른 단계별 구현

이 체크리스트를 따라 진행하시면 체계적이고 효율적인 Figma UI 디자인 작업이 가능합니다! 🎨✨
