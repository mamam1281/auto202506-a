# 컴포넌트 Props 정의

## TypeScript 인터페이스 및 사용법

### 기본 카드 Props (BaseCardProps)

```typescript
interface BaseCardProps {
  /** 카드 제목 */
  title: string;
  
  /** 카드 설명 텍스트 (선택적) */
  description?: string;
  
  /** 이미지 URL (선택적) */
  image?: string;
  
  /** 추가 CSS 클래스명 */
  className?: string;
  
  /** 클릭 이벤트 핸들러 (선택적) */
  onClick?: () => void;
}
```

#### 사용 예시
```tsx
<CardBase
  title="네온 포털"
  description="보라색 차원으로 들어가 코스믹 게임 에너지의 비밀을 발견하세요."
  image="https://images.unsplash.com/photo-1560472354-b33ff0c44a43"
  onClick={() => console.log('네온 포털 열림!')}
  className="custom-card-style"
/>
```

### 게임 카드 Props (GameCardProps)

```typescript
type GameType = 'roulette' | 'slots' | 'rps' | 'gacha';

interface GameCardProps {
  /** 게임 제목 */
  title: string;
  
  /** 게임 설명 */
  description: string;
  
  /** 게임 이미지 URL (선택적) */
  image?: string;
  
  /** 게임 타입 (4가지 중 선택) */
  gameType: GameType;
  
  /** 새로운 게임 여부 (선택적, 기본값: false) */
  isNew?: boolean;
  
  /** 배지 텍스트 (선택적, isNew가 true면 'NEW' 표시) */
  badge?: string;
  
  /** 게임 시작 이벤트 핸들러 */
  onPlay: () => void;
  
  /** 추가 CSS 클래스명 */
  className?: string;
}
```

#### 게임 타입별 스타일 매핑
```typescript
const gameStyles: Record<GameType, GameStyle> = {
  roulette: {
    gradient: 'from-[#7b29cd] to-[#870dd1]',
    accentColor: '#7b29cd',
    icon: '🎯',
    neonColor: 'rgba(123, 41, 205, 0.3)'
  },
  slots: {
    gradient: 'from-[#870dd1] to-[#5b30f6]',
    accentColor: '#870dd1',
    icon: '✨',
    neonColor: 'rgba(135, 13, 209, 0.3)'
  },
  rps: {
    gradient: 'from-[#5b30f6] to-[#8054f2]',
    accentColor: '#5b30f6',
    icon: '⚡',
    neonColor: 'rgba(91, 48, 246, 0.3)'
  },
  gacha: {
    gradient: 'from-[#8054f2] to-[#7b29cd]',
    accentColor: '#8054f2',
    icon: '🎁',
    neonColor: 'rgba(128, 84, 242, 0.3)'
  }
};
```

#### 사용 예시
```tsx
<CardGame
  title="네온 룰렛"
  description="네온 코스모스에서 보라색 운명의 바퀴를 돌리세요"
  image="https://images.unsplash.com/photo-1518611012118-696072aa579a"
  gameType="roulette"
  isNew={true}
  badge="HOT"
  onPlay={() => handlePlayGame('roulette')}
/>
```

### 미션 카드 Props (MissionCardProps)

```typescript
type CardState = 'default' | 'hover' | 'active';

interface MissionCardProps {
  /** 미션 제목 */
  title: string;
  
  /** 미션 설명 */
  description: string;
  
  /** 미션 이미지 URL (선택적) */
  image?: string;
  
  /** 진행률 (0-100) */
  progress: number;
  
  /** 보상 내용 */
  reward: string;
  
  /** 마감일 (선택적) */
  deadline?: string;
  
  /** 카드 상태 (선택적, 기본값: 'default') */
  state?: CardState;
  
  /** 컨텐츠 표시 여부 (선택적, 기본값: true) */
  content?: boolean;
  
  /** 시작 버튼 클릭 핸들러 (선택적) */
  onStart?: () => void;
  
  /** 추가 CSS 클래스명 */
  className?: string;
}
```

#### 진행률별 색상 로직
```typescript
const getProgressColor = (progress: number): string => {
  if (progress >= 80) return '#8054f2'; // 완료 임박
  if (progress >= 50) return '#870dd1'; // 진행 중
  return '#7b29cd'; // 시작 단계
};

const getProgressNeon = (progress: number): string => {
  if (progress >= 80) return 'rgba(128, 84, 242, 0.3)';
  if (progress >= 50) return 'rgba(135, 13, 209, 0.3)';
  return 'rgba(123, 41, 205, 0.3)';
};
```

#### 사용 예시
```tsx
<CardMission
  title="퍼플 챔피언"
  description="5게임을 승리해서 보라색 크라운 업적을 잠금해제하세요"
  progress={60}
  reward="Purple Crown Badge"
  deadline="3일 남음"
  onStart={() => console.log('미션 시작')}
  state="default"
  content={true}
/>
```

### 리워드 카드 Props (RewardCardProps)

```typescript
type RewardType = 'tokens' | 'points' | 'items';

interface RewardCardProps {
  /** 리워드 제목 */
  title: string;
  
  /** 리워드 설명 */
  description: string;
  
  /** 리워드 이미지 URL (선택적) */
  image?: string;
  
  /** 리워드 타입 */
  rewardType: RewardType;
  
  /** 리워드 수량 */
  amount: number;
  
  /** 수령 가능 여부 (선택적, 기본값: false) */
  claimable?: boolean;
  
  /** 카드 상태 (선택적, 기본값: 'default') */
  state?: CardState;
  
  /** 컨텐츠 표시 여부 (선택적, 기본값: true) */
  content?: boolean;
  
  /** 수령 버튼 클릭 핸들러 (선택적) */
  onClaim?: () => void;
  
  /** 추가 CSS 클래스명 */
  className?: string;
}
```

#### 리워드 타입별 스타일 매핑
```typescript
const rewardTypeStyles: Record<RewardType, RewardStyle> = {
  tokens: {
    icon: Coins,
    color: '#7b29cd',
    gradient: 'from-[#7b29cd] to-[#870dd1]',
    bgColor: 'rgba(123, 41, 205, 0.15)',
    neonColor: 'rgba(123, 41, 205, 0.3)'
  },
  points: {
    icon: Star,
    color: '#870dd1',
    gradient: 'from-[#870dd1] to-[#5b30f6]',
    bgColor: 'rgba(135, 13, 209, 0.15)',
    neonColor: 'rgba(135, 13, 209, 0.3)'
  },
  items: {
    icon: Gift,
    color: '#8054f2',
    gradient: 'from-[#8054f2] to-[#5b30f6]',
    bgColor: 'rgba(128, 84, 242, 0.15)',
    neonColor: 'rgba(128, 84, 242, 0.3)'
  }
};
```

#### 사용 예시
```tsx
<CardReward
  title="Daily Bonus"
  description="매일 로그인하여 토큰을 수집하세요"
  rewardType="tokens"
  amount={1000}
  claimable={true}
  onClaim={() => console.log('리워드 수령')}
  image="https://images.unsplash.com/photo-1234567890"
/>
```

## 공통 Props 패턴

### 이벤트 핸들러 명명 규칙
```typescript
interface EventHandlers {
  /** 클릭 이벤트 */
  onClick?: () => void;
  
  /** 게임 플레이 이벤트 */
  onPlay?: () => void;
  
  /** 미션 시작 이벤트 */
  onStart?: () => void;
  
  /** 리워드 수령 이벤트 */
  onClaim?: () => void;
  
  /** 호버 이벤트 */
  onHover?: () => void;
  
  /** 포커스 이벤트 */
  onFocus?: () => void;
}
```

### 선택적 Props 기본값
```typescript
const defaultProps = {
  className: '',
  content: true,
  state: 'default' as CardState,
  isNew: false,
  claimable: false
} as const;
```

### Props 유효성 검사
```typescript
// 진행률 유효성 검사
const validateProgress = (progress: number): boolean => {
  return progress >= 0 && progress <= 100;
};

// 리워드 수량 유효성 검사
const validateAmount = (amount: number): boolean => {
  return amount > 0 && Number.isInteger(amount);
};

// 게임 타입 유효성 검사
const validateGameType = (gameType: string): gameType is GameType => {
  return ['roulette', 'slots', 'rps', 'gacha'].includes(gameType);
};
```

## 컴포넌트 사용 가이드라인

### 1. 필수 Props
- 모든 카드 컴포넌트는 `title`이 필수입니다
- `GameCard`는 `onPlay` 핸들러가 필수입니다
- `RewardCard`는 `rewardType`과 `amount`가 필수입니다

### 2. 이미지 최적화
```typescript
// 권장 이미지 크기
const imageSpecs = {
  width: 400,
  height: 300,
  format: 'webp',
  quality: 80
} as const;

// Unsplash URL 생성 헬퍼
const createUnsplashUrl = (imageId: string) => 
  `https://images.unsplash.com/photo-${imageId}?w=400&h=300&fit=crop`;
```

### 3. 접근성 고려사항
```typescript
interface AccessibilityProps {
  /** 스크린 리더용 레이블 */
  'aria-label'?: string;
  
  /** 추가 설명 */
  'aria-describedby'?: string;
  
  /** 키보드 탐색 순서 */
  tabIndex?: number;
  
  /** 포커스 가능 여부 */
  focusable?: boolean;
}
```

### 4. 성능 최적화
```typescript
// React.memo를 사용한 최적화
const CardGame = React.memo<GameCardProps>(({ 
  title, 
  description, 
  gameType, 
  onPlay 
}) => {
  // 컴포넌트 구현
});

// useCallback을 사용한 핸들러 최적화
const handleGamePlay = useCallback((gameType: GameType) => {
  console.log(`${gameType} 게임을 시작합니다!`);
}, []);
```