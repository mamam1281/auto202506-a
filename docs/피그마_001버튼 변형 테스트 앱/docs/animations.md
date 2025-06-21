# 애니메이션 & 모션 시스템

## ⚡ 애니메이션 타이밍 함수

### 기본 Easing 함수
```css
/* 상용급 최적화된 cubic-bezier 함수들 */
--ease-out: cubic-bezier(0.4, 0, 0.2, 1);          /* 부드러운 감속 */
--ease-in: cubic-bezier(0.4, 0, 1, 1);             /* 부드러운 가속 */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);       /* 부드러운 가속-감속 */
--ease-linanimations.mdear: linear;                               /* 일정한 속도 */

/* 특별한 효과용 */
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);  /* 바운스 효과 */
--ease-elastic: cubic-bezier(0.175, 0.885, 0.32, 1.275); /* 탄성 효과 */
```

### 지속 시간 (Duration)
```css
--duration-instant: 0ms;        /* 즉시 */
--duration-fast: 150ms;         /* 빠름 (버튼 hover) */
--duration-normal: 200ms;       /* 기본 (대부분의 UI) */
--duration-slow: 300ms;         /* 느림 (복잡한 레이아웃) */
--duration-slower: 500ms;       /* 매우 느림 (페이지 전환) */
```

## 🎭 컴포넌트별 애니메이션

### 버튼 애니메이션
```css
.btn-base {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Framer Motion Variants */
const buttonVariants = {
  default: { scale: 1 },
  hover: { 
    scale: 1.01, 
    transition: { duration: 0.15, ease: 'easeOut' } 
  },
  tap: { 
    scale: 0.99, 
    transition: { duration: 0.1, ease: 'easeInOut' } 
  },
  loading: { 
    scale: 1, 
    transition: { duration: 0.2 } 
  }
};
```

### 인풋 애니메이션
```css
.input-base {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 포커스 상태 */
.input-base:focus {
  transform: scale(1.01);
  transition: transform 0.15s ease-out;
}

/* 그라데이션 언더라인 애니메이션 */
.gradient-underline {
  animation: gradient-expand 0.3s ease-out forwards;
}

@keyframes gradient-expand {
  from { width: 0%; opacity: 0; }
  to { width: 100%; opacity: 1; }
}
```

### 로딩 애니메이션
```css
/* 스피너 애니메이션 */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

/* 진행률 바 애니메이션 */
.progress-bar {
  transition: width 0.1s ease-out;
}
```

## 🎨 상태 전환 애니메이션

### 호버 효과 (상용급 최적화)
```tsx
// 버튼 호버
const hoverAnimation = {
  scale: 1.01,                    /* 미세한 확대 (눈의 피로 최소화) */
  transition: {
    duration: 0.15,               /* 빠른 반응성 */
    ease: 'easeOut'
  }
};

// 그라데이션 버튼 호버
const gradientHover = {
  scale: 1.01,
  filter: 'saturate(1.1) brightness(1.1)',
  transition: { duration: 0.15 }
};
```

### 클릭/탭 효과
```tsx
const tapAnimation = {
  scale: 0.99,                    /* 미세한 축소 */
  transition: {
    duration: 0.1,                /* 즉각적인 피드백 */
    ease: 'easeInOut'
  }
};
```

### 로딩 상태 전환
```tsx
const loadingStates = {
  idle: { opacity: 1, scale: 1 },
  loading: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.2 }
  },
  success: {
    opacity: 1,
    scale: 1.05,
    transition: { 
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};
```

## 🚀 성능 최적화

### GPU 가속 사용
```css
.optimized-animation {
  transform: translateZ(0);           /* GPU 레이어 강제 생성 */
  backface-visibility: hidden;        /* 뒷면 숨김 */
  perspective: 1000px;                /* 3D 가속 활성화 */
  will-change: transform, opacity;    /* 브라우저 최적화 힌트 */
}
```

### 애니메이션 최적화 가이드라인
```css
/* ✅ 권장사항 */
.good-animation {
  /* transform과 opacity만 사용 (리플로우 없음) */
  transition: transform 0.2s ease-out, opacity 0.2s ease-out;
}

/* ❌ 피해야 할 것 */
.bad-animation {
  /* width, height, margin, padding 애니메이션 (리플로우 발생) */
  transition: width 0.2s ease-out, height 0.2s ease-out;
}
```

### 모바일 터치 최적화
```css
.touch-optimized {
  -webkit-tap-highlight-color: transparent;  /* iOS 하이라이트 제거 */
  touch-action: manipulation;                /* 더블탭 줌 방지 */
  user-select: none;                         /* 텍스트 선택 방지 */
}
```

## 🎛️ Framer Motion 설정

### 글로벌 애니메이션 설정
```tsx
import { MotionConfig } from 'framer-motion';

function App() {
  return (
    <MotionConfig 
      transition={{ 
        duration: 0.2, 
        ease: [0.4, 0, 0.2, 1] 
      }}
    >
      {/* 앱 컴포넌트들 */}
    </MotionConfig>
  );
}
```

### 공통 애니메이션 컴포넌트
```tsx
export const FadeIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ 
      duration: 0.3, 
      delay,
      ease: [0.4, 0, 0.2, 1] 
    }}
  >
    {children}
  </motion.div>
);

export const SlideIn = ({ children, direction = 'up' }) => {
  const directions = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
};
```

## 📱 접근성 고려사항

### 모션 감소 설정 지원
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Framer Motion에서 접근성 지원
```tsx
const accessibleAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { 
    duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 0.3 
  }
};
```

## 🎯 사용 예시

### 기본 버튼 애니메이션
```tsx
<motion.button
  className="btn-base"
  whileHover={{ scale: 1.01 }}
  whileTap={{ scale: 0.99 }}
  transition={{ duration: 0.15, ease: 'easeOut' }}
>
  클릭하세요
</motion.button>
```

### 복잡한 상태 전환
```tsx
<motion.div
  animate={isLoading ? 'loading' : 'idle'}
  variants={{
    idle: { opacity: 1, scale: 1 },
    loading: { opacity: 0.7, scale: 0.95 }
  }}
  transition={{ duration: 0.2 }}
>
  {isLoading ? <LoadingSpinner /> : <Content />}
</motion.div>
```