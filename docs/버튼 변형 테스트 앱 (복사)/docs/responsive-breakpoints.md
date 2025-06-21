# 반응형 브레이크포인트 & 레이아웃 시스템

## 📱 브레이크포인트 정의

### 기본 브레이크포인트 (모바일 우선)
```css
/* CSS Variables */
--mobile-max: 640px;       /* 모바일 최대 너비 */
--tablet-max: 1024px;      /* 태블릿 최대 너비 */
--desktop-min: 1025px;     /* 데스크톱 시작 너비 */

/* Tailwind 호환 브레이크포인트 */
/* sm: 640px 이상 */
/* md: 768px 이상 */
/* lg: 1024px 이상 */
/* xl: 1280px 이상 */
/* 2xl: 1536px 이상 */
```

### 디바이스별 타겟 해상도
```css
/* 모바일 */
@media (max-width: 640px) {
  /* iPhone SE: 375px */
  /* iPhone 12/13/14: 390px */
  /* iPhone 12/13/14 Pro Max: 428px */
  /* Samsung Galaxy S21: 384px */
}

/* 태블릿 */
@media (min-width: 641px) and (max-width: 1024px) {
  /* iPad: 768px */
  /* iPad Air: 820px */
  /* iPad Pro: 1024px */
}

/* 데스크톱 */
@media (min-width: 1025px) {
  /* Laptop: 1366px */
  /* Desktop: 1920px */
  /* 4K: 3840px */
}
```

## 🏗️ 레이아웃 시스템

### 컨테이너 시스템
```css
.container-responsive {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-2);  /* 16px */
}

@media (min-width: 640px) {
  .container-responsive {
    padding: 0 var(--spacing-3);  /* 24px */
  }
}

@media (min-width: 1024px) {
  .container-responsive {
    padding: 0 var(--spacing-4);  /* 32px */
  }
}
```

### 그리드 시스템 (8px 기반)
```css
/* 기본 그리드 */
.grid-responsive {
  display: grid;
  gap: var(--spacing-2);  /* 16px */
}

/* 모바일: 1열 */
@media (max-width: 640px) {
  .grid-responsive {
    grid-template-columns: 1fr;
    gap: var(--spacing-1);  /* 8px */
  }
}

/* 태블릿: 2열 */
@media (min-width: 641px) and (max-width: 1024px) {
  .grid-responsive {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-2);  /* 16px */
  }
}

/* 데스크톱: 3~4열 */
@media (min-width: 1025px) {
  .grid-responsive {
    grid-template-columns: repeat(4, 1fr);
    gap: var(--spacing-3);  /* 24px */
  }
}
```

## 🎯 컴포넌트별 반응형 설정

### 버튼 시스템
```tsx
// 반응형 버튼 크기
const responsiveButtonSize = {
  base: 'sm',      // 모바일 기본
  sm: 'md',        // 640px 이상
  lg: 'lg'         // 1024px 이상
};

<Button 
  size={{ base: 'sm', sm: 'md', lg: 'lg' }}
  className="w-full sm:w-auto"  // 모바일에서는 full width
>
  반응형 버튼
</Button>
```

### 인풋 시스템
```tsx
// 반응형 인풋 레이아웃
<div className="grid grid-cols-1 md:grid-cols-2 gap-grid-2">
  <Input size={{ base: 'md', lg: 'lg' }} />
  <Input size={{ base: 'md', lg: 'lg' }} />
</div>
```

### 타이포그래피 반응형
```css
/* CSS Clamp를 활용한 유동적 크기 조정 */
h1 { font-size: clamp(1.5rem, 4vw, 2.5rem); }    /* 24px ~ 40px */
h2 { font-size: clamp(1.25rem, 3vw, 2rem); }     /* 20px ~ 32px */
h3 { font-size: clamp(1.125rem, 2.5vw, 1.5rem); } /* 18px ~ 24px */
p { font-size: clamp(0.875rem, 1.5vw, 1rem); }   /* 14px ~ 16px */
```

## 📐 간격 시스템

### 반응형 패딩/마진
```css
/* Tailwind 기반 반응형 유틸리티 */
.p-grid-2 { padding: var(--spacing-2); }           /* 16px */
.p-grid-3 { padding: var(--spacing-3); }           /* 24px */

/* 반응형 클래스 예시 */
.responsive-padding {
  padding: var(--spacing-1);  /* 모바일: 8px */
}

@media (min-width: 640px) {
  .responsive-padding {
    padding: var(--spacing-2);  /* 태블릿: 16px */
  }
}

@media (min-width: 1024px) {
  .responsive-padding {
    padding: var(--spacing-3);  /* 데스크톱: 24px */
  }
}
```

### 사용 예시
```tsx
<section className="p-grid-1 md:p-grid-2 lg:p-grid-3">
  {/* 모바일: 8px, 태블릿: 16px, 데스크톱: 24px */}
</section>
```

## 🔧 레이아웃 패턴

### 1. 카드 그리드 레이아웃
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-grid-2">
  {cards.map(card => (
    <Card key={card.id} className="h-full" />
  ))}
</div>
```

### 2. 사이드바 레이아웃
```tsx
<div className="flex flex-col lg:flex-row gap-grid-3">
  <aside className="lg:w-64 lg:flex-shrink-0">
    {/* 사이드바 */}
  </aside>
  <main className="flex-1 min-w-0">
    {/* 메인 콘텐츠 */}
  </main>
</div>
```

### 3. 히어로 섹션
```tsx
<section className="py-grid-8 lg:py-grid-12 px-grid-2 lg:px-grid-4">
  <div className="container-responsive">
    <div className="text-center lg:text-left">
      <h1 className="mb-grid-2 lg:mb-grid-3">타이틀</h1>
      <p className="mb-grid-3 lg:mb-grid-4">설명</p>
      <div className="flex flex-col sm:flex-row gap-grid-2 justify-center lg:justify-start">
        <Button>주요 액션</Button>
        <Button variant="outline">보조 액션</Button>
      </div>
    </div>
  </div>
</section>
```

## 📱 모바일 최적화

### 터치 친화적 설계
```css
/* 최소 터치 타겟 크기 */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}

/* 터치 하이라이트 제거 */
.touch-optimized {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
```

### Safe Area 지원
```css
/* iOS Safe Area 대응 */
.safe-area-container {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

### 스크롤 최적화
```css
/* 부드러운 스크롤 */
html {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;  /* iOS 관성 스크롤 */
}

/* 가로 스크롤 방지 */
body {
  overflow-x: hidden;
}
```

## 🎨 실전 예시

### 반응형 폼 레이아웃
```tsx
<form className="space-y-grid-2 lg:space-y-grid-3">
  {/* 모바일: 세로 배치, 데스크톱: 가로 배치 */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-grid-2">
    <Input label="이름" fullWidth />
    <Input label="이메일" type="email" fullWidth />
  </div>
  
  <Input label="주소" fullWidth />
  
  {/* 버튼 그룹 */}
  <div className="flex flex-col sm:flex-row gap-grid-2 pt-grid-2">
    <Button 
      variant="primary" 
      size="lg" 
      fullWidth 
      className="sm:flex-1"
    >
      제출
    </Button>
    <Button 
      variant="outline" 
      size="lg" 
      fullWidth 
      className="sm:flex-1"
    >
      취소
    </Button>
  </div>
</form>
```

### 반응형 네비게이션
```tsx
<nav className="flex flex-col md:flex-row md:items-center gap-grid-2 md:gap-grid-4">
  <div className="flex items-center justify-between">
    <Logo />
    <Button 
      variant="text" 
      size="sm" 
      icon={<Menu />} 
      iconOnly 
      className="md:hidden"
    />
  </div>
  
  <div className="hidden md:flex md:items-center md:gap-grid-3 md:ml-auto">
    <NavLink href="/about">소개</NavLink>
    <NavLink href="/services">서비스</NavLink>
    <NavLink href="/contact">연락처</NavLink>
    <Button variant="primary" size="sm">로그인</Button>
  </div>
</nav>
```

## 🔍 디버깅 도구

### 브레이크포인트 표시기 (개발용)
```tsx
const BreakpointIndicator = () => (
  <div className="fixed top-4 right-4 z-50 px-2 py-1 bg-black text-white text-xs rounded">
    <span className="block sm:hidden">XS</span>
    <span className="hidden sm:block md:hidden">SM</span>
    <span className="hidden md:block lg:hidden">MD</span>
    <span className="hidden lg:block xl:hidden">LG</span>
    <span className="hidden xl:block">XL</span>
  </div>
);
```

### 그리드 오버레이 (개발용)
```css
.debug-grid {
  background-image: 
    linear-gradient(rgba(255, 0, 0, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 0, 0, 0.1) 1px, transparent 1px);
  background-size: 8px 8px;
}
```