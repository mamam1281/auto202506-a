# 반응형 브레이크포인트

## Tailwind CSS 브레이크포인트 시스템

### 기본 브레이크포인트
```css
/* Mobile First 접근법 */
:root {
  --breakpoint-sm: 640px;   /* 작은 태블릿 */
  --breakpoint-md: 768px;   /* 태블릿 */
  --breakpoint-lg: 1024px;  /* 작은 데스크톱 */
  --breakpoint-xl: 1280px;  /* 데스크톱 */
  --breakpoint-2xl: 1536px; /* 큰 데스크톱 */
}
```

### 디바이스별 분류
```typescript
const deviceBreakpoints = {
  mobile: {
    min: 0,
    max: 639,
    description: "모바일 폰"
  },
  
  tablet: {
    min: 640,
    max: 1023,
    description: "태블릿 및 작은 랩톱"
  },
  
  desktop: {
    min: 1024,
    max: Infinity,
    description: "데스크톱 및 큰 화면"
  }
} as const;
```

## 카드 레이아웃 그리드 시스템

### 그리드 컬럼 설정
```css
/* 기본 카드 (CardBase) - 코스믹 허브 */
.cosmic-hub-grid {
  /* Mobile: 1열 */
  grid-template-columns: 1fr;
  
  /* Tablet (md): 2열 */
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  /* Desktop (lg): 3열 */
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* 게임 카드 (CardGame) - 네온 게임 아레나 */
.game-arena-grid {
  /* Mobile: 1열 */
  grid-template-columns: 1fr;
  
  /* Small Tablet (sm): 2열 */
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  /* Desktop (lg): 4열 */
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* 미션 카드 (CardMission) - 코스믹 미션 */
.mission-grid {
  /* Mobile: 1열 */
  grid-template-columns: 1fr;
  
  /* Tablet (md): 2열 */
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  /* Desktop (lg): 3열 */
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### 컨테이너 최대 너비
```css
.container {
  width: 100%;
  max-width: 1280px; /* max-w-7xl */
  margin: 0 auto;
  padding: 0 1rem; /* px-4 */
}

@media (min-width: 640px) {
  .container {
    padding: 0 1.5rem; /* sm:px-6 */
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 0 2rem; /* lg:px-8 */
  }
}
```

## 컴포넌트별 반응형 설정

### 카드 크기 조정
```css
/* 카드 기본 설정 */
.neon-card {
  /* Mobile */
  min-height: 280px;
  padding: 1rem; /* p-4 */
  
  /* Tablet */
  @media (min-width: 768px) {
    min-height: 320px;
    padding: 1.5rem; /* p-6 */
  }
  
  /* Desktop */
  @media (min-width: 1024px) {
    min-height: 380px;
  }
}

/* 게임 카드 특별 설정 */
.game-card {
  min-height: 360px;
  
  @media (min-width: 768px) {
    min-height: 380px;
  }
  
  @media (min-width: 1024px) {
    min-height: 400px;
  }
}
```

### 이미지 높이 조정
```css
.card-image {
  /* Mobile */
  height: 120px; /* h-30 */
  
  /* Tablet */
  @media (min-width: 640px) {
    height: 128px; /* h-32 */
  }
  
  /* Desktop */
  @media (min-width: 1024px) {
    height: 160px; /* h-40 */
  }
}

/* 베이스 카드 이미지 (더 큰 사이즈) */
.base-card-image {
  height: 140px;
  
  @media (min-width: 640px) {
    height: 160px; /* h-40 */
  }
}
```

### 타이포그래피 스케일
```css
/* 메인 헤더 */
.main-title {
  /* Mobile */
  font-size: 1.875rem; /* text-3xl */
  
  /* Tablet */
  @media (min-width: 640px) {
    font-size: 2.25rem; /* sm:text-4xl */
  }
  
  /* Desktop */
  @media (min-width: 1024px) {
    font-size: 3rem; /* lg:text-5xl */
  }
}

/* 섹션 헤더 */
.section-title {
  /* Mobile */
  font-size: 1.25rem; /* text-xl */
  
  /* Tablet */
  @media (min-width: 640px) {
    font-size: 1.5rem; /* sm:text-2xl */
  }
}

/* 카드 제목 */
.card-title {
  font-size: 1.125rem; /* text-lg */
  
  @media (min-width: 768px) {
    font-size: 1.25rem; /* md:text-xl */
  }
}

/* 설명 텍스트 */
.description-text {
  /* Mobile */
  font-size: 0.875rem; /* text-sm */
  
  /* Desktop */
  @media (min-width: 1024px) {
    font-size: 1rem; /* lg:text-base */
  }
}
```

### 간격 시스템
```css
/* 섹션 간 마진 */
.section-spacing {
  /* Mobile */
  margin-bottom: 2rem; /* mb-8 */
  
  /* Tablet */
  @media (min-width: 640px) {
    margin-bottom: 3rem; /* sm:mb-12 */
  }
}

/* 카드 그리드 갭 */
.card-grid-gap {
  /* Mobile */
  gap: 1rem; /* gap-4 */
  
  /* Tablet */
  @media (min-width: 640px) {
    gap: 1.5rem; /* sm:gap-6 */
  }
}

/* 헤더 하단 마진 */
.header-spacing {
  /* Mobile */
  margin-bottom: 1rem; /* mb-4 */
  
  /* Tablet */
  @media (min-width: 640px) {
    margin-bottom: 1.5rem; /* sm:mb-6 */
  }
}
```

## 애니메이션 반응형 설정

### 모바일 최적화 애니메이션
```typescript
const responsiveMotion = {
  // 모바일: 간소화된 애니메이션
  mobile: {
    scale: { duration: 0.2 },
    opacity: { duration: 0.3 },
    translateY: { distance: 10, duration: 0.4 }
  },
  
  // 태블릿: 중간 수준 애니메이션
  tablet: {
    scale: { duration: 0.3 },
    opacity: { duration: 0.4 },
    translateY: { distance: 15, duration: 0.5 }
  },
  
  // 데스크톱: 풀 애니메이션
  desktop: {
    scale: { duration: 0.4 },
    opacity: { duration: 0.6 },
    translateY: { distance: 20, duration: 0.6 }
  }
} as const;
```

### 터치 최적화
```css
/* 터치 타겟 크기 */
.touch-target {
  min-height: 44px; /* 최소 터치 영역 */
  min-width: 44px;
}

/* 모바일에서 호버 효과 제거 */
@media (hover: none) {
  .card:hover {
    transform: none;
    box-shadow: inherit;
  }
}

/* 터치 디바이스 감지 */
@media (hover: hover) and (pointer: fine) {
  /* 마우스/트랙패드가 있는 디바이스에서만 호버 효과 */
  .card:hover {
    transform: translateY(-4px) scale(1.01);
  }
}
```

### 성능 최적화
```typescript
// 모바일에서 파티클 수 감소
const getParticleCount = () => {
  if (window.innerWidth < 768) return 4; // 모바일
  if (window.innerWidth < 1024) return 6; // 태블릿
  return 8; // 데스크톱
};

// 애니메이션 성능 설정
const performanceSettings = {
  mobile: {
    willChange: 'transform',
    enableHardwareAcceleration: true,
    reducedMotion: true
  },
  desktop: {
    willChange: 'auto',
    enableHardwareAcceleration: true,
    reducedMotion: false
  }
} as const;
```

### 사용 예시
```tsx
// 반응형 그리드 클래스
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
  {gameCards.map(card => (
    <CardGame key={card.id} {...card} />
  ))}
</div>

// 반응형 텍스트 클래스
<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
  NEON COSMIC DASHBOARD
</h1>

// 반응형 마진/패딩
<section className="mb-8 sm:mb-12 px-4 sm:px-6 lg:px-8">
  <h2 className="text-xl sm:text-2xl mb-4 sm:mb-6">
    네온 게임 아레나
  </h2>
</section>
```