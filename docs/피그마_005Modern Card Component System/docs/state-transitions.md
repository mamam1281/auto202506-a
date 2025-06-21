# 상태 전환 다이어그램

## 카드 인터랙션 상태 흐름

### 기본 카드 상태 전환

```mermaid
graph LR
    A[Default] --> B[Hover]
    B --> A
    B --> C[Active]
    C --> B
    C --> A
    A --> C
    
    D[Loading] --> A
    A --> E[Disabled]
    E --> A
```

#### 상태 정의
```typescript
type CardState = 'default' | 'hover' | 'active' | 'loading' | 'disabled';

interface CardStateConfig {
  default: {
    scale: 1;
    y: 0;
    opacity: 1;
    transition: { duration: 0.3 }
  };
  hover: {
    scale: 1.01;
    y: -3;
    opacity: 1;
    transition: { duration: 0.3 }
  };
  active: {
    scale: 0.99;
    y: 0;
    opacity: 1;
    transition: { duration: 0.1 }
  };
  loading: {
    scale: 1;
    y: 0;
    opacity: 0.7;
    transition: { duration: 0.5 }
  };
  disabled: {
    scale: 1;
    y: 0;
    opacity: 0.5;
    transition: { duration: 0.3 }
  };
}
```

### 게임 카드 상태 전환

```mermaid
graph TD
    A[Idle] --> B[Hover]
    B --> A
    B --> C[Pressed]
    C --> D[Playing]
    D --> E[Success]
    D --> F[Error]
    E --> A
    F --> A
    
    G[New Badge] --> A
    H[Loading] --> A
```

#### 게임 상태 로직
```typescript
type GameState = 'idle' | 'hover' | 'pressed' | 'playing' | 'success' | 'error';

const gameStateTransitions = {
  idle: ['hover', 'pressed'],
  hover: ['idle', 'pressed'],
  pressed: ['playing'],
  playing: ['success', 'error'],
  success: ['idle'],
  error: ['idle']
} as const;

// 상태 전환 함수
const transitionGameState = (
  currentState: GameState, 
  targetState: GameState
): boolean => {
  return gameStateTransitions[currentState].includes(targetState);
};
```

### 미션 카드 진행률 상태

```mermaid
graph LR
    A[Not Started<br/>0%] --> B[In Progress<br/>1-49%]
    B --> C[Half Complete<br/>50-79%]
    C --> D[Nearly Done<br/>80-99%]
    D --> E[Complete<br/>100%]
    
    F[Expired] --> A
    A --> F
    B --> F
    C --> F
    D --> F
```

#### 미션 진행률 상태
```typescript
type MissionProgressState = 'notStarted' | 'inProgress' | 'halfComplete' | 'nearlyDone' | 'complete' | 'expired';

const getMissionState = (progress: number, deadline?: Date): MissionProgressState => {
  if (deadline && deadline < new Date()) return 'expired';
  if (progress === 0) return 'notStarted';
  if (progress < 50) return 'inProgress';
  if (progress < 80) return 'halfComplete';
  if (progress < 100) return 'nearlyDone';
  return 'complete';
};

// 진행률별 색상 매핑
const progressStateColors = {
  notStarted: '#7b29cd',
  inProgress: '#7b29cd',
  halfComplete: '#870dd1',
  nearlyDone: '#8054f2',
  complete: '#8054f2',
  expired: '#6b7280'
} as const;
```

### 리워드 카드 수령 상태

```mermaid
graph TD
    A[Not Available] --> B[Available]
    B --> C[Claiming]
    C --> D[Claimed]
    C --> E[Error]
    E --> B
    
    F[Expired] --> A
    B --> F
```

#### 리워드 상태 관리
```typescript
type RewardState = 'notAvailable' | 'available' | 'claiming' | 'claimed' | 'error' | 'expired';

interface RewardStateConfig {
  notAvailable: {
    claimable: false;
    buttonText: 'Not Available';
    buttonDisabled: true;
  };
  available: {
    claimable: true;
    buttonText: 'Claim Reward';
    buttonDisabled: false;
    showPulse: true;
  };
  claiming: {
    claimable: false;
    buttonText: 'Claiming...';
    buttonDisabled: true;
    showSpinner: true;
  };
  claimed: {
    claimable: false;
    buttonText: 'Claimed';
    buttonDisabled: true;
    showCheckmark: true;
  };
  error: {
    claimable: true;
    buttonText: 'Try Again';
    buttonDisabled: false;
    showError: true;
  };
  expired: {
    claimable: false;
    buttonText: 'Expired';
    buttonDisabled: true;
  };
}
```

## 애니메이션 상태 전환

### 네온 글로우 애니메이션 상태

```mermaid
graph LR
    A[Dim] --> B[Bright]
    B --> A
    
    C[Idle] --> D[Pulsing]
    D --> C
    
    E[Static] --> F[Rotating]
    F --> E
```

#### 글로우 애니메이션 제어
```typescript
type GlowState = 'dim' | 'bright' | 'pulsing' | 'rotating' | 'static';

const glowAnimations = {
  dim: {
    opacity: [0.2, 0.4, 0.2],
    transition: { duration: 4, repeat: Infinity }
  },
  bright: {
    opacity: [0.4, 0.8, 0.4],
    transition: { duration: 2, repeat: Infinity }
  },
  pulsing: {
    scale: [1, 1.05, 1],
    opacity: [0.3, 0.7, 0.3],
    transition: { duration: 3, repeat: Infinity }
  },
  rotating: {
    rotate: [0, 360],
    transition: { duration: 8, repeat: Infinity, ease: 'linear' }
  },
  static: {
    opacity: 0.5,
    scale: 1,
    rotate: 0
  }
} as const;
```

### 파티클 시스템 상태

```mermaid
graph TD
    A[Spawning] --> B[Active]
    B --> C[Fading]
    C --> D[Destroyed]
    D --> A
    
    E[Paused] --> B
    B --> E
```

#### 파티클 라이프사이클
```typescript
type ParticleState = 'spawning' | 'active' | 'fading' | 'destroyed' | 'paused';

interface ParticleConfig {
  spawning: {
    opacity: 0;
    scale: 0;
    duration: 0.3;
  };
  active: {
    opacity: 0.6;
    scale: 1;
    duration: 6; // 메인 애니메이션 시간
  };
  fading: {
    opacity: 0;
    scale: 0;
    duration: 0.5;
  };
  destroyed: {
    display: 'none';
  };
  paused: {
    animationPlayState: 'paused';
  };
}
```

## 사용자 인터랙션 플로우

### 게임 플레이 플로우

```mermaid
sequenceDiagram
    participant U as User
    participant C as Card
    participant G as Game
    participant S as System
    
    U->>C: Hover over card
    C->>C: Transition to hover state
    U->>C: Click play button
    C->>C: Transition to active state
    C->>G: Trigger onPlay event
    G->>S: Start game session
    S-->>G: Game started
    G-->>C: Update to playing state
    C->>C: Show playing animation
```

### 미션 진행 플로우

```mermaid
sequenceDiagram
    participant U as User
    participant M as Mission Card
    participant P as Progress System
    participant R as Reward System
    
    U->>M: View mission
    M->>P: Check current progress
    P-->>M: Return progress (60%)
    M->>M: Update progress bar
    U->>M: Click start button
    M->>P: Begin mission tracking
    P-->>M: Progress updated (70%)
    M->>M: Animate progress change
    P-->>M: Mission completed (100%)
    M->>R: Trigger reward
    M->>M: Show completion state
```

### 리워드 수령 플로우

```mermaid
sequenceDiagram
    participant U as User
    participant R as Reward Card
    participant A as API
    participant I as Inventory
    
    U->>R: View claimable reward
    R->>R: Show pulsing animation
    U->>R: Click claim button
    R->>R: Transition to claiming state
    R->>A: Send claim request
    A-->>R: Claim successful
    R->>I: Add to inventory
    R->>R: Transition to claimed state
    R->>R: Show success animation
```

## 에러 상태 처리

### 네트워크 에러 상태

```mermaid
graph TD
    A[Normal Operation] --> B[Network Error]
    B --> C[Retry State]
    C --> D[Success]
    C --> E[Max Retries]
    D --> A
    E --> F[Failed State]
    F --> G[Manual Retry]
    G --> C
```

#### 에러 상태 구성
```typescript
type ErrorState = 'none' | 'network' | 'timeout' | 'server' | 'validation' | 'unknown';

interface ErrorStateConfig {
  none: {
    showError: false;
    retryable: false;
  };
  network: {
    showError: true;
    message: '네트워크 연결을 확인해주세요';
    retryable: true;
    retryDelay: 3000;
  };
  timeout: {
    showError: true;
    message: '요청 시간이 초과되었습니다';
    retryable: true;
    retryDelay: 5000;
  };
  server: {
    showError: true;
    message: '서버 오류가 발생했습니다';
    retryable: true;
    retryDelay: 10000;
  };
  validation: {
    showError: true;
    message: '입력값을 확인해주세요';
    retryable: false;
  };
  unknown: {
    showError: true;
    message: '알 수 없는 오류가 발생했습니다';
    retryable: true;
    retryDelay: 5000;
  };
}
```

## 성능 최적화 상태

### 렌더링 최적화 상태

```mermaid
graph LR
    A[Visible] --> B[Hidden]
    B --> A
    
    C[Active] --> D[Inactive]
    D --> C
    
    E[Animated] --> F[Static]
    F --> E
```

#### 성능 상태 관리
```typescript
interface PerformanceState {
  visible: boolean;
  active: boolean;
  animated: boolean;
  reducedMotion: boolean;
}

// 뷰포트 기반 최적화
const useViewportOptimization = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    
    return () => observer.disconnect();
  }, []);
  
  return isVisible;
};

// 모션 감소 설정 감지
const useReducedMotion = () => {
  const [reducedMotion, setReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return reducedMotion;
};
```

## 상태 디버깅 도구

### 개발 모드 상태 추적
```typescript
const useStateDebugger = (componentName: string, state: any) => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.group(`${componentName} State Change`);
      console.log('Previous State:', state);
      console.log('Timestamp:', new Date().toISOString());
      console.groupEnd();
    }
  }, [componentName, state]);
};

// 상태 전환 로깅
const logStateTransition = (
  component: string, 
  from: string, 
  to: string
) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔄 ${component}: ${from} → ${to}`);
  }
};
```