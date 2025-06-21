# CSS Variables 및 디자인 토큰

## 🎨 컬러 시스템

### 기본 컬러 팔레트
```css
/* 다크 테마 기본 컬러 */
--color-primary-dark-navy: #1a1a1a;        /* 배경 메인 */
--color-primary-charcoal: #2d2d2d;         /* 카드 배경 */
--color-text-primary-white: #FFFFFF;       /* 기본 텍스트 */
--color-text-secondary-gray: #D1D5DB;      /* 보조 텍스트 */

/* 액센트 컬러 */
--color-accent-cyan: #ff4516;              /* 강조 색상 */
--color-accent-warm-amber: #F59E0B;        /* 프라이머리 액션 */

/* 중성 색상 */
--color-neutral-light-gray: #E0E0E0;       /* 밝은 회색 */
--color-neutral-medium-gray: #A0A0A0;      /* 중간 회색 */
--color-neutral-dark-gray: #333333;        /* 어두운 회색 */

/* 시맨틱 컬러 */
--color-semantic-success: #10B981;         /* 성공 상태 */
--color-semantic-error: #B90C29;           /* 에러 상태 */
--color-semantic-info: #135B79;            /* 정보 표시 */
```

### 그라데이션 컬러 (상용급 최적화)
```css
--color-gradient-1: #6B46C1;              /* 그라데이션 시작 */
--color-gradient-2: #7C3AED;              /* 그라데이션 중간1 */
--color-gradient-3: #8B5CF6;              /* 그라데이션 중간2 */
--color-gradient-4: #A78BFA;              /* 그라데이션 끝 */
```

### 적용된 컬러 (Tailwind 호환)
```css
--background: var(--color-primary-dark-navy);
--foreground: var(--color-text-primary-white);
--card: var(--color-primary-charcoal);
--card-foreground: var(--color-text-primary-white);
--primary: var(--color-text-primary-white);
--primary-foreground: var(--color-primary-dark-navy);
--secondary: var(--color-primary-charcoal);
--secondary-foreground: var(--color-text-primary-white);
--muted: var(--color-neutral-dark-gray);
--muted-foreground: var(--color-text-secondary-gray);
--accent: var(--color-accent-cyan);
--accent-foreground: var(--color-text-primary-white);
--destructive: var(--color-semantic-error);
--destructive-foreground: var(--color-text-primary-white);
--border: var(--color-neutral-dark-gray);
--input: var(--color-primary-charcoal);
--ring: var(--color-gradient-2);
```

## 📏 8px 그리드 시스템

### 기본 간격
```css
--spacing-0: 0px;       /* 없음 */
--spacing-1: 8px;       /* 최소 간격 */
--spacing-2: 16px;      /* 기본 간격 */
--spacing-3: 24px;      /* 중간 간격 */
--spacing-4: 32px;      /* 큰 간격 */
--spacing-5: 40px;      /* 매우 큰 간격 */
--spacing-6: 48px;      /* 최대 간격 */
--spacing-8: 64px;      /* 섹션 간격 */
--spacing-10: 80px;     /* 큰 섹션 간격 */
--spacing-12: 96px;     /* 최대 섹션 간격 */
```

### 버튼 전용 변수
```css
--btn-height-sm: var(--spacing-4);         /* 32px */
--btn-height-md: var(--spacing-5);         /* 40px */
--btn-height-lg: var(--spacing-6);         /* 48px */

--btn-padding-sm: var(--spacing-1) var(--spacing-2);    /* 8px 16px */
--btn-padding-md: var(--spacing-2) var(--spacing-3);    /* 16px 24px */
--btn-padding-lg: var(--spacing-2) var(--spacing-4);    /* 16px 32px */
```

### 인풋 전용 변수
```css
--input-height-sm: var(--spacing-4);       /* 32px */
--input-height-md: var(--spacing-5);       /* 40px */  
--input-height-lg: var(--spacing-6);       /* 48px */

--input-padding-sm: var(--spacing-1) var(--spacing-2);  /* 8px 16px */
--input-padding-md: var(--spacing-1) var(--spacing-2);  /* 8px 16px */
--input-padding-lg: var(--spacing-2) var(--spacing-3);  /* 16px 24px */
```

### 아이콘 크기
```css
--icon-sm: 16px;        /* 작은 아이콘 */
--icon-md: 20px;        /* 기본 아이콘 */
--icon-lg: 24px;        /* 큰 아이콘 */
```

## 🎯 타이포그래피

### 폰트 웨이트
```css
--font-weight-normal: 400;      /* 기본 텍스트 */
--font-weight-medium: 500;      /* 강조 텍스트 */
```

### 폰트 패밀리
```css
font-family: 'Exo', 'IBM Plex Sans KR', sans-serif;
```

### 반응형 타이포그래피 (CSS Clamp 사용)
```css
/* 헤딩 */
h1: clamp(1.5rem, 4vw, 2.5rem);        /* 24px ~ 40px */
h2: clamp(1.25rem, 3vw, 2rem);         /* 20px ~ 32px */
h3: clamp(1.125rem, 2.5vw, 1.5rem);    /* 18px ~ 24px */
h4: clamp(1rem, 2vw, 1.25rem);         /* 16px ~ 20px */

/* 본문 */
p: clamp(0.875rem, 1.5vw, 1rem);       /* 14px ~ 16px */
```

## 🔄 테마 및 반응형

### 브레이크포인트
```css
--mobile-max: 640px;       /* 모바일 최대 */
--tablet-max: 1024px;      /* 태블릿 최대 */
--desktop-min: 1025px;     /* 데스크톱 시작 */
```

### 반지름 (Border Radius)
```css
--radius: 0.625rem;                     /* 10px - 기본 */
--radius-sm: calc(var(--radius) - 4px); /* 6px - 작음 */
--radius-md: calc(var(--radius) - 2px); /* 8px - 중간 */
--radius-lg: var(--radius);             /* 10px - 큼 */
--radius-xl: calc(var(--radius) + 4px); /* 14px - 매우 큼 */
```

## 📱 모바일 최적화

### Safe Area 지원
```css
.safe-top { padding-top: env(safe-area-inset-top); }
.safe-bottom { padding-bottom: env(safe-area-inset-bottom); }
.safe-left { padding-left: env(safe-area-inset-left); }
.safe-right { padding-right: env(safe-area-inset-right); }
```

### 터치 최적화
```css
.touch-target {
  min-height: 44px;    /* iOS 권장 최소 터치 타겟 */
  min-width: 44px;
}
```

## 🎨 사용 예시

### Tailwind 클래스와 CSS Variables 조합
```tsx
// 기본 사용법
<div className="bg-[var(--color-primary-charcoal)] text-[var(--color-text-primary-white)]">

// 그리드 시스템 사용
<div className="p-grid-2 m-grid-1 gap-grid-3">

// 반응형 컨테이너
<div className="container-responsive">
```

### CSS에서 직접 사용
```css
.custom-component {
  background-color: var(--color-primary-charcoal);
  color: var(--color-text-primary-white);
  padding: var(--spacing-2);
  border-radius: var(--radius-md);
  box-shadow: 0 4px 6px var(--color-neutral-dark-gray);
}
```