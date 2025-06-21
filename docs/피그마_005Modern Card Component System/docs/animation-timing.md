# 애니메이션 타이밍 함수

## Framer Motion 설정값

### 기본 이징 함수
```typescript
const easingFunctions = {
  // 기본 이징
  easeInOut: "easeInOut",
  easeOut: "easeOut",
  easeIn: "easeIn",
  linear: "linear",
  
  // 커스텀 베지어
  smoothEntry: [0.25, 0.46, 0.45, 0.94],
  smoothExit: [0.55, 0.06, 0.55, 0.06],
  bounce: [0.68, -0.55, 0.265, 1.55],
} as const;
```

### 카드 상태 전환 타이밍
```typescript
const cardAnimationDurations = {
  // 호버 상태 전환
  hover: {
    duration: 0.3,
    ease: "easeOut"
  },
  
  // 클릭 피드백
  tap: {
    duration: 0.1,
    ease: "easeInOut"
  },
  
  // 레이아웃 변경
  layout: {
    duration: 0.4,
    ease: "easeInOut"
  },
  
  // 컨텐츠 등장
  contentReveal: {
    duration: 0.6,
    ease: "easeOut"
  }
} as const;
```

### 네온 글로우 애니메이션
```typescript
const neonGlowAnimations = {
  // 기본 펄스
  pulse: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut",
    repeatType: "reverse" as const
  },
  
  // 빠른 펄스 (클레임 가능한 상태)
  claimablePulse: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut",
    repeatType: "reverse" as const
  },
  
  // 로테이션 글로우
  rotatingGlow: {
    duration: 8,
    repeat: Infinity,
    ease: "linear"
  },
  
  // 숨쉬는 효과
  breathing: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
    repeatType: "reverse" as const
  }
} as const;
```

### 파티클 애니메이션
```typescript
const particleAnimations = {
  // 배경 파티클
  backgroundParticle: {
    duration: 12, // 기본 12초, 랜덤 추가
    randomDuration: 6, // +0~6초
    repeat: Infinity,
    ease: "easeInOut"
  },
  
  // 리워드 파티클
  rewardParticle: {
    duration: 8, // 기본 8초, 인덱스별 추가
    indexMultiplier: 2, // +i*2초
    repeat: Infinity,
    ease: "easeInOut"
  },
  
  // 스파클 효과
  sparkle: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut"
  }
} as const;
```

### 프로그레스 바 애니메이션
```typescript
const progressAnimations = {
  // 메인 진행률 애니메이션
  fill: {
    duration: 1.5,
    ease: "easeOut",
    delay: 0.3
  },
  
  // 펄스 인디케이터
  pulse: {
    duration: 1.5,
    repeat: Infinity,
    ease: "easeInOut",
    delay: 1.5
  },
  
  // 완료 애니메이션
  completion: {
    duration: 2,
    ease: "easeOut",
    delay: 0.8
  }
} as const;
```

### 스태거 애니메이션
```typescript
const staggerAnimations = {
  // 카드 그리드 등장
  cardGrid: {
    staggerChildren: 0.15,
    delayChildren: 0.1
  },
  
  // 리스트 아이템
  listItems: {
    staggerChildren: 0.1,
    delayChildren: 0.05
  },
  
  // 컨텐츠 섹션
  contentSections: {
    staggerChildren: 0.2,
    delayChildren: 0.1
  }
} as const;
```

### 스프링 애니메이션
```typescript
const springAnimations = {
  // 부드러운 스프링
  gentle: {
    type: "spring" as const,
    stiffness: 300,
    damping: 30
  },
  
  // 탄성 스프링
  bouncy: {
    type: "spring" as const,
    stiffness: 400,
    damping: 10
  },
  
  // 빠른 스프링
  snappy: {
    type: "spring" as const,
    stiffness: 500,
    damping: 40
  }
} as const;
```

### 라이트 스위프 애니메이션
```typescript
const lightSweepAnimations = {
  // 카드 상단 스위프
  topSweep: {
    duration: 6,
    repeat: Infinity,
    ease: "linear",
    keyframes: {
      x: ['-100%', '100%'],
      opacity: [0, 0.6, 0]
    }
  },
  
  // 빠른 스위프
  quickSweep: {
    duration: 5,
    repeat: Infinity,
    ease: "linear",
    keyframes: {
      x: ['-100%', '100%'],
      opacity: [0, 0.5, 0]
    }
  }
} as const;
```

### 게임별 커스텀 애니메이션
```typescript
const gameAnimations = {
  roulette: {
    iconBob: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
      keyframes: {
        x: [0, 1, 0]
      }
    }
  },
  
  slots: {
    sparkle: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
      keyframes: {
        scale: [1, 1.05, 1],
        rotate: [0, 3, -3, 0]
      }
    }
  },
  
  rps: {
    energy: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  
  gacha: {
    mystery: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
} as const;
```

### 반응형 애니메이션 설정
```typescript
const responsiveAnimations = {
  // 모바일에서 애니메이션 간소화
  mobile: {
    reducedMotion: true,
    simplifiedTransitions: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  
  // 데스크톱 풀 애니메이션
  desktop: {
    fullMotion: true,
    enhancedTransitions: {
      duration: 0.4,
      ease: "easeInOut"
    }
  }
} as const;
```

### 사용 예시
```typescript
// 카드 상태 변형
const cardVariants = {
  default: { 
    scale: 1, 
    y: 0,
    transition: cardAnimationDurations.hover
  },
  hover: { 
    scale: 1.01, 
    y: -3,
    transition: cardAnimationDurations.hover
  }
};

// 네온 글로우 애니메이션
<motion.div
  animate={{
    boxShadow: [
      '0 0 5px rgba(123, 41, 205, 0.2)',
      '0 0 10px rgba(123, 41, 205, 0.4)',
      '0 0 5px rgba(123, 41, 205, 0.2)'
    ]
  }}
  transition={neonGlowAnimations.pulse}
/>
```