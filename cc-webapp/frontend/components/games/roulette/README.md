# 🎰 Roulette Components Guide

## 현재 사용 중인 컴포넌트

### `UltraCompactRoulette.tsx` ⭐ **MAIN COMPONENT**
- **설명**: 400x750 모바일에 최적화된 극한 압축 룰렛
- **특징**: 
  - 12숫자 (0-11) 간소화된 룰렛
  - 208px 크기 휠 (가독성 좋음)
  - 압축된 UI 레이아웃
  - 보라색 카지노 테마
  - 완전한 게임 기능

### `SimplifiedRouletteConstants.ts` 📋 **CONSTANTS**
- **설명**: 12숫자 룰렛용 상수 및 유틸 함수
- **포함**: 
  - `SIMPLIFIED_ROULETTE_NUMBERS`: [0,1,2,3,4,5,6,7,8,9,10,11]
  - `getSimplifiedNumberColor()`: 색상 계산
  - `checkSimplifiedWin()`: 승리 판정
  - 타입 정의들

## App.tsx에서 사용법

```tsx
import UltraCompactRoulette from './components/roulette/UltraCompactRoulette';

export default function App() {
  return (
    <div className="min-h-screen vh-optimized">
      <UltraCompactRoulette />
    </div>
  );
}
```

## 게임 특징

### 🎯 베팅 옵션
- **숫자 베팅**: 0-11 (12x 배당)
- **색상 베팅**: 빨강/검정 (2x 배당)
- **칩 선택**: $5, $10, $25, $50

### 🎮 게임 플로우
1. 칩 금액 선택
2. 숫자 또는 색상에 베팅
3. SPIN 버튼으로 게임 시작
4. 휠이 돌아가며 결과 표시
5. 승리 시 잔액 증가 + 축하 애니메이션

### 📱 모바일 최적화
- **화면 크기**: 400x750px 완벽 지원
- **스크롤 없음**: 모든 UI가 한 화면에
- **터치 친화적**: 최소 32px 버튼 크기
- **압축 레이아웃**: space-y-2, 작은 패딩





@import "tailwindcss";

/* 어두운 카지노 분위기의 보라색 기반 프로젝트 컬러 시스템 */
:root {
  /* 어두운 카지노 테마 기본 색상 */
  --background: #0f172a;
  --foreground: #f8fafc;
  --card: #1e293b;
  --card-foreground: #f8fafc;
  --popover: #1e293b;
  --popover-foreground: #f8fafc;
  --primary: #a78bfa;
  --primary-foreground: #1e293b;
  --secondary: #8b5cf6;
  --secondary-foreground: #f8fafc;
  --muted: #334155;
  --muted-foreground: #94a3b8;
  --accent: #7c3aed;
  --accent-foreground: #f8fafc;
  --destructive: #ef4444;
  --destructive-foreground: #f8fafc;
  --border: rgba(167, 139, 250, 0.2);
  --input: rgba(167, 139, 250, 0.1);
  --ring: #a78bfa;
  
  /* 프로젝트 전용 색상 - 어두운 카지노 버전 */
  --primary-dark: #0f172a;
  --primary-medium: #1e293b;
  --accent-purple: #a78bfa;
  --accent-purple-2: #8b5cf6;
  --accent-purple-3: #7c3aed;
  --accent-purple-4: #6d28d9;
  --neutral-light: #475569;
  --neutral-medium: #64748b;
  --neutral-dark: #1e293b;
  --semantic-success: #10b981;
  --semantic-error: #ef4444;
  --semantic-info: #3b82f6;
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  
  /* 밝은 보라색 팔레트 (어두운 배경용) */
  --purple-1: #a78bfa;
  --purple-2: #8b5cf6;
  --purple-3: #7c3aed;
  --purple-4: #6d28d9;
  --purple-light: #c4b5fd;
  --purple-lighter: #e9d5ff;
  
  /* 생동감 있는 칩 색상 */
  --emerald-bright: #10b981;
  --blue-bright: #0ea5e9;
  --amber-bright: #f59e0b;
  --rose-bright: #f43f5e;
  --violet-bright: #8b5cf6;
  
  /* 반지름 */
  --radius: 0.5rem;
}

@layer base {
  * {
    border-color: theme(colors.border);
  }
  
  html {
    scroll-behavior: smooth;
    color-scheme: dark;
  }
  
  body {
    background: linear-gradient(135deg, 
      #0f172a 0%, 
      #1e293b 30%,
      rgba(167, 139, 250, 0.1) 70%,
      rgba(139, 92, 246, 0.05) 100%);
    color: theme(colors.foreground);
    font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    font-feature-settings: "cv11", "ss01";
    font-variation-settings: "opsz" 32;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    min-height: 100vh;
  }
}

@layer utilities {
  /* 어두운 글래스모피즘 효과 */
  .glass-surface {
    background: rgba(30, 41, 59, 0.8);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(167, 139, 250, 0.2);
    box-shadow: 
      0 4px 16px rgba(167, 139, 250, 0.05),
      inset 0 1px 0 rgba(167, 139, 250, 0.1);
  }
  
  .glass-surface-strong {
    background: rgba(30, 41, 59, 0.9);
    backdrop-filter: blur(30px);
    -webkit-backdrop-filter: blur(30px);
    border: 1px solid rgba(167, 139, 250, 0.3);
    box-shadow: 
      0 6px 20px rgba(167, 139, 250, 0.08),
      inset 0 1px 0 rgba(167, 139, 250, 0.15);
  }
  
  .glass-card {
    background: rgba(30, 41, 59, 0.85);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    border: 1px solid rgba(167, 139, 250, 0.25);
    box-shadow: 
      0 5px 18px rgba(167, 139, 250, 0.06),
      inset 0 1px 0 rgba(167, 139, 250, 0.12);
  }
  
  /* 어두운 카지노 배경 그라디언트 */
  .project-gradient {
    background: linear-gradient(135deg, 
      #0f172a 0%, 
      #1e293b 30%,
      rgba(167, 139, 250, 0.08) 70%,
      rgba(139, 92, 246, 0.05) 100%);
  }
  
  .purple-gradient {
    background: linear-gradient(135deg, 
      #a78bfa 0%, 
      #8b5cf6 30%,
      #7c3aed 70%,
      #6d28d9 100%);
  }
  
  .purple-gradient-soft {
    background: linear-gradient(135deg, 
      rgba(167, 139, 250, 0.9) 0%, 
      rgba(139, 92, 246, 0.8) 50%,
      rgba(124, 58, 237, 0.7) 100%);
  }
  
  .accent-gradient {
    background: linear-gradient(135deg, 
      #8b5cf6 0%, 
      #a78bfa 100%);
  }
  
  /* 간소화된 칩 컬러 (글로우 최소화) */
  .chip-gradient-1 {
    background: linear-gradient(135deg, 
      #10b981 0%, 
      #059669 100%);
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.15);
  }
  
  .chip-gradient-2 {
    background: linear-gradient(135deg, 
      #0ea5e9 0%, 
      #0284c7 100%);
    box-shadow: 0 2px 8px rgba(14, 165, 233, 0.15);
  }
  
  .chip-gradient-3 {
    background: linear-gradient(135deg, 
      #f59e0b 0%, 
      #d97706 100%);
    box-shadow: 0 2px 8px rgba(245, 158, 11, 0.15);
  }
  
  .chip-gradient-4 {
    background: linear-gradient(135deg, 
      #f43f5e 0%, 
      #e11d48 100%);
    box-shadow: 0 2px 8px rgba(244, 63, 94, 0.15);
  }
  
  .chip-gradient-5 {
    background: linear-gradient(135deg, 
      #8b5cf6 0%, 
      #7c3aed 100%);
    box-shadow: 0 2px 8px rgba(139, 92, 246, 0.15);
  }
  
  /* 부드러운 호버 효과 (글로우 최소화) */
  .hover-lift {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .hover-lift:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
  
  /* 어두운 배경용 버튼 효과 (글로우 최소화) */
  .btn-primary {
    background: var(--purple-1);
    color: white;
    border: none;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(167, 139, 250, 0.15);
  }
  
  .btn-primary:hover {
    background: var(--purple-2);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(167, 139, 250, 0.2);
  }
  
  .btn-secondary {
    background: var(--purple-3);
    color: white;
    border: none;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(124, 58, 237, 0.15);
  }
  
  .btn-secondary:hover {
    background: var(--purple-4);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.2);
  }
  
  /* 어두운 스크롤바 */
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #a78bfa #1e293b;
  }
  
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #1e293b;
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #a78bfa, #8b5cf6);
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  }
  
  /* 평범한 룰렛 휠 스타일 */
  .simple-roulette-wheel {
    background: conic-gradient(
      from 0deg,
      #dc2626 0deg 30deg,    /* 빨강 (1) */
      #374151 30deg 60deg,   /* 검정 (2) */
      #dc2626 60deg 90deg,   /* 빨강 (3) */
      #374151 90deg 120deg,  /* 검정 (4) */
      #dc2626 120deg 150deg, /* 빨강 (5) */
      #374151 150deg 180deg, /* 검정 (6) */
      #dc2626 180deg 210deg, /* 빨강 (7) */
      #374151 210deg 240deg, /* 검정 (8) */
      #dc2626 240deg 270deg, /* 빨강 (9) */
      #374151 270deg 300deg, /* 검정 (10) */
      #dc2626 300deg 330deg, /* 빨강 (11) */
      #059669 330deg 360deg  /* 그린 (0) */
    );
  }
  
  /* 룰렛 휠 숫자 스타일 */
  .roulette-number {
    color: white;
    font-weight: 900;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
    font-size: 1.5rem;
    line-height: 1;
  }
  
  /* 룰렛 포인터 애니메이션 */
  .roulette-pointer {
    filter: drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1));
  }
  
  /* 최소화된 글로우 효과 (거의 보이지 않게) */
  .purple-glow {
    box-shadow: 0 0 8px rgba(167, 139, 250, 0.2);
  }
  
  .purple-glow-strong {
    box-shadow: 0 0 12px rgba(167, 139, 250, 0.25);
  }
  
  .green-glow {
    box-shadow: 0 0 8px rgba(16, 185, 129, 0.2);
  }
  
  .blue-glow {
    box-shadow: 0 0 8px rgba(14, 165, 233, 0.2);
  }
  
  .orange-glow {
    box-shadow: 0 0 8px rgba(245, 158, 11, 0.2);
  }
  
  .red-glow {
    box-shadow: 0 0 8px rgba(244, 63, 94, 0.2);
  }
  
  /* 애니메이션 */
  .spin-animation {
    animation: smooth-spin 3s cubic-bezier(0.23, 1, 0.32, 1) forwards;
  }
  
  @keyframes smooth-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(var(--spin-degrees)); }
  }
  
  @keyframes purple-pulse {
    0%, 100% { 
      box-shadow: 0 0 6px rgba(167, 139, 250, 0.2);
    }
    50% { 
      box-shadow: 0 0 10px rgba(167, 139, 250, 0.3);
    }
  }
  
  .pulse-purple {
    animation: purple-pulse 2s ease-in-out infinite;
  }
  
  /* 간소화된 펄스 애니메이션 */
  @keyframes subtle-pulse {
    0% { box-shadow: 0 0 6px rgba(167, 139, 250, 0.2); }
    25% { box-shadow: 0 0 7px rgba(16, 185, 129, 0.2); }
    50% { box-shadow: 0 0 8px rgba(14, 165, 233, 0.2); }
    75% { box-shadow: 0 0 7px rgba(245, 158, 11, 0.2); }
    100% { box-shadow: 0 0 6px rgba(167, 139, 250, 0.2); }
  }
  
  .pulse-subtle {
    animation: subtle-pulse 3s ease-in-out infinite;
  }
  
  /* 룰렛 휠 회전 애니메이션 개선 */
  @keyframes roulette-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(var(--final-rotation, 1800deg)); }
  }
  
  .roulette-spinning {
    animation: roulette-spin 3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  }
  
  /* 모바일 최적화 클래스들 */
  .mobile-optimized {
    padding: 1rem;
  }
  
  .mobile-compact {
    padding: 0.75rem;
    gap: 0.75rem;
  }
  
  .mobile-tight {
    padding: 0.5rem;
    gap: 0.5rem;
  }
  
  /* 400x750 모바일 전용 스타일 */
  @media (max-width: 450px) {
    .mobile-optimized {
      padding: 0.75rem;
    }
    
    .glass-surface {
      backdrop-filter: blur(15px);
      -webkit-backdrop-filter: blur(15px);
    }
    
    .roulette-number {
      font-size: 1rem;
    }
    
    /* 컴팩트 룰렛 휠 */
    .compact-roulette-wheel {
      width: 14rem !important;
      height: 14rem !important;
    }
    
    .compact-roulette-wheel .roulette-number {
      font-size: 1rem;
    }
    
    /* 작은 버튼들 */
    .mobile-btn-sm {
      height: 2.5rem;
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
    }
    
    .mobile-btn-xs {
      height: 2rem;
      font-size: 0.625rem;
      padding: 0.125rem 0.25rem;
    }
    
    /* 압축된 카드 */
    .mobile-card-compact {
      padding: 0.5rem;
    }
    
    .mobile-card-tight {
      padding: 0.375rem;
    }
    
    /* 작은 텍스트 */
    .mobile-text-xs {
      font-size: 0.625rem;
    }
    
    .mobile-text-sm {
      font-size: 0.75rem;
    }
    
    /* 압축된 그리드 */
    .mobile-grid-tight {
      gap: 0.25rem;
    }
    
    .mobile-grid-compact {
      gap: 0.5rem;
    }
    
    /* 스페이싱 최소화 */
    .mobile-space-y-1 > * + * {
      margin-top: 0.25rem;
    }
    
    .mobile-space-y-2 > * + * {
      margin-top: 0.5rem;
    }
    
    .mobile-space-y-3 > * + * {
      margin-top: 0.75rem;
    }
  }
  
  /* 세로 길이 최적화 (750px 높이) */
  @media (max-height: 800px) {
    .vh-optimized {
      min-height: 100vh;
      max-height: 100vh;
      overflow-y: auto;
    }
    
    .compact-spacing > * + * {
      margin-top: 0.5rem;
    }
    
    .ultra-compact-spacing > * + * {
      margin-top: 0.25rem;
    }
  }
  
  /* 매우 작은 화면 (400px 이하) */
  @media (max-width: 400px) {
    .mobile-optimized {
      padding: 0.5rem;
    }
    
    .mobile-card-compact {
      padding: 0.375rem;
    }
    
    .mobile-btn-sm {
      height: 2.25rem;
      font-size: 0.625rem;
    }
    
    .compact-roulette-wheel {
      width: 12rem !important;
      height: 12rem !important;
    }
    
    .ultra-compact-text {
      font-size: 0.5rem;
    }
  }
}

@layer base {
  /* 입력 요소 스타일 - 어두운 테마 */
  input, textarea, select {
    background-color: rgba(30, 41, 59, 0.9);
    color: #f8fafc;
    border-color: rgba(167, 139, 250, 0.3);
  }
  
  input::placeholder, textarea::placeholder {
    color: #94a3b8;
  }
  
  input:focus, textarea:focus, select:focus {
    border-color: #a78bfa;
    box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.2);
  }
  
  /* 버튼 기본 스타일 */
  button {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  /* 포커스 스타일 - 밝은 보라색 */
  button:focus-visible,
  input:focus-visible,
  textarea:focus-visible {
    outline: 2px solid #a78bfa;
    outline-offset: 2px;
  }
}

/* 접근성 개선 */
@media (prefers-reduced-motion: reduce) {
  .spin-animation,
  .roulette-spinning,
  .hover-lift,
  .pulse-purple,
  .pulse-subtle,
  button {
    animation: none !important;
    transition: none !important;
  }
}

/* 고대비 모드 지원 */
@media (prefers-contrast: high) {
  .glass-surface,
  .glass-surface-strong,
  .glass-card {
    background: #1e293b;
    border: 2px solid #a78bfa;
  }
  
  .purple-glow,
  .purple-glow-strong {
    box-shadow: none;
    border: 2px solid #a78bfa;
  }
}

/* 밝은 테마 토글 클래스 */
.light-mode {
  background: linear-gradient(135deg, 
    #f8fafc 0%, 
    #e2e8f0 50%, 
    rgba(139, 92, 246, 0.05) 100%) !important;
}

.light-mode .glass-surface {
  background: rgba(255, 255, 255, 0.8) !important;
  color: #1e293b !important;
}

.light-mode .glass-card {
  background: rgba(255, 255, 255, 0.9) !important;
  color: #1e293b !important;
}

.light-mode .text-primary {
  color: #1e293b !important;
}