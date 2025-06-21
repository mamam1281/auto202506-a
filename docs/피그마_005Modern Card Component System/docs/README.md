# 네온 코스믹 카드 시스템 - 개발 문서

## 📋 문서 목록

이 디렉토리는 네온 코스믹 카드 시스템의 종합적인 개발 문서를 포함합니다.

### 🎨 [CSS Variables 목록](./css-variables.md)
- 네온 보라색 색상 팔레트
- 디자인 토큰 정의
- 그림자 & 글로우 효과
- 크기 및 간격 시스템
- 게임 타입별 색상 매핑

### ⚡ [애니메이션 타이밍 함수](./animation-timing.md)
- Framer Motion 설정값
- 카드 상태 전환 타이밍
- 네온 글로우 애니메이션
- 파티클 시스템 설정
- 반응형 애니메이션 최적화

### 📱 [반응형 브레이크포인트](./responsive-breakpoints.md)
- Tailwind CSS 브레이크포인트
- 디바이스별 그리드 레이아웃
- 반응형 타이포그래피
- 터치 최적화 설정
- 성능 최적화 가이드

### 🔧 [컴포넌트 Props 정의](./component-props.md)
- TypeScript 인터페이스
- 4가지 카드 컴포넌트 Props
- 사용법 및 예시 코드
- Props 유효성 검사
- 접근성 고려사항

### 🔄 [상태 전환 다이어그램](./state-transitions.md)
- 카드 인터랙션 상태 흐름
- 애니메이션 상태 관리
- 사용자 인터랙션 플로우
- 에러 상태 처리
- 성능 최적화 상태

## 🚀 빠른 시작

### 1. 카드 컴포넌트 사용하기

```tsx
import { CardBase, CardGame, CardMission, CardReward } from './components';

// 기본 카드
<CardBase
  title="네온 포털"
  description="보라색 차원으로 들어가세요"
  image="https://example.com/image.jpg"
  onClick={() => console.log('클릭됨')}
/>

// 게임 카드
<CardGame
  title="네온 룰렛"
  description="운명의 바퀴를 돌리세요"
  gameType="roulette"
  onPlay={() => console.log('게임 시작')}
/>
```

### 2. 색상 시스템 적용하기

```css
/* CSS Variables 사용 */
.custom-card {
  background: var(--card-bg);
  border: 1px solid var(--neon-border-1);
  box-shadow: var(--shadow-default);
}

.custom-card:hover {
  box-shadow: var(--shadow-hover);
}
```

### 3. 애니메이션 설정하기

```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
>
  카드 컨텐츠
</motion.div>
```

## 📁 프로젝트 구조

```
├── components/
│   ├── CardBase.tsx        # 기본 카드 컴포넌트
│   ├── CardGame.tsx        # 게임 카드 컴포넌트
│   ├── CardMission.tsx     # 미션 카드 컴포넌트
│   └── CardReward.tsx      # 리워드 카드 컴포넌트
├── types/
│   └── card.ts            # 카드 타입 정의
├── styles/
│   └── globals.css        # 전역 스타일 및 CSS Variables
└── docs/                  # 개발 문서 (현재 위치)
    ├── css-variables.md
    ├── animation-timing.md
    ├── responsive-breakpoints.md
    ├── component-props.md
    └── state-transitions.md
```

## 🎯 주요 특징

### ✨ 네온 디자인 시스템
- 4가지 보라색 네온 색상 팔레트
- 동적 글로우 및 펄스 효과
- 게임 타입별 고유 색상 테마

### 🎮 4가지 카드 타입
- **CardBase**: 기본 정보 표시용
- **CardGame**: 게임별 특화 카드 (룰렛, 슬롯, RPS, 가챠)
- **CardMission**: 진행률 추적 미션 카드
- **CardReward**: 수령 가능한 리워드 카드

### 📱 완전 반응형
- Mobile-first 디자인 접근법
- 터치 최적화 인터랙션
- 성능 최적화된 애니메이션

### ⚡ 고성능 애니메이션
- Framer Motion 기반
- GPU 가속 활용
- 모션 감소 설정 지원

## 🛠️ 개발 가이드라인

### 코드 스타일
- TypeScript 엄격 모드 사용
- React 함수형 컴포넌트
- Tailwind CSS 유틸리티 우선
- Framer Motion 애니메이션

### 성능 최적화
- React.memo로 불필요한 리렌더링 방지
- useCallback으로 함수 메모이제이션
- Intersection Observer로 뷰포트 최적화
- 모바일에서 파티클 수 감소

### 접근성
- 키보드 탐색 지원
- 스크린 리더 호환성
- 색상 대비 접근성 기준 준수
- 모션 감소 옵션 제공

## 🔧 개발 도구

### 필수 의존성
```json
{
  "react": "^19.0.0",
  "framer-motion": "^12.16.0",
  "lucide-react": "^0.511.0",
  "tailwindcss": "^4.1.8",
  "typescript": "^5.0.0"
}
```

### 개발 환경 설정
```bash
# 프로젝트 설치
npm install

# 개발 서버 시작
npm run dev

# 타입 체크
npm run type-check

# 린트 검사
npm run lint
```

## 📈 성능 메트릭

### 목표 성능 지표
- **FCP (First Contentful Paint)**: < 1.5초
- **LCP (Largest Contentful Paint)**: < 2.5초
- **CLS (Cumulative Layout Shift)**: < 0.1
- **애니메이션 FPS**: 60fps 유지

### 번들 크기 최적화
- 컴포넌트별 코드 스플리팅
- 이미지 지연 로딩
- CSS 최적화
- 트리 쉐이킹

## 🎨 디자인 토큰 요약

| 카테고리 | 변수명 | 값 |
|---------|--------|-----|
| 주색상 | `--neon-purple-1` | `#7b29cd` |
| 보조색상 | `--neon-purple-2` | `#870dd1` |
| 악센트1 | `--neon-purple-3` | `#5b30f6` |
| 악센트2 | `--neon-purple-4` | `#8054f2` |
| 카드 높이 | `--card-min-height-base` | `320px` |
| 애니메이션 | `--transition-default` | `0.3s ease` |

## 🤝 기여 가이드

### 새로운 카드 타입 추가
1. `types/card.ts`에 인터페이스 정의
2. `components/` 디렉토리에 컴포넌트 생성
3. 스타일 가이드 준수
4. Props 문서 업데이트
5. 테스트 케이스 작성

### 색상 팔레트 확장
1. `docs/css-variables.md` 참조
2. 새로운 색상 변수 정의
3. 컴포넌트 스타일 매핑 업데이트
4. 접근성 대비 검증

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

---

> 💡 **팁**: 각 문서의 예시 코드를 복사하여 바로 사용할 수 있습니다. 문제가 발생하면 [Issues](../issues)에 신고해주세요.