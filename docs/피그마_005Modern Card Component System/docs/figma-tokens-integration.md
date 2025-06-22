# Figma 토큰 연동 가이드

## 🎨 디자인 시스템 Figma 토큰 연동이란?

Figma Variables(토큰)와 개발 코드 간의 자동 동기화 시스템입니다. 디자이너가 Figma에서 색상, 간격, 타이포그래피를 수정하면 개발 코드에 자동으로 반영되어 디자인-개발 간 일관성을 보장합니다.

## 🔄 현재 상황 및 문제점

### 문제점
```tsx
// 🚫 문제: 하드코딩된 색상값
const gameStyles = {
  roulette: {
    accentColor: '#7b29cd', // 하드코딩
    neonColor: 'rgba(123, 41, 205, 0.3)' // 하드코딩
  }
};

// 🚫 문제: 컴포넌트마다 다른 색상 정의
<div style={{ borderColor: `${mission.color}20` }} />
```

### 해결책
```tsx
// ✅ 해결: CSS Variables 사용
const gameStyles = {
  roulette: {
    accentColor: 'var(--game-roulette-color)',
    neonColor: 'var(--game-roulette-glow)'
  }
};

// ✅ 해결: 일관된 토큰 사용
<div className="border-game-roulette/20" />
```

## 🛠️ Figma Variables 설정

### 1. Figma에서 Variables 생성

```figma-variables
// Color Variables 생성 경로:
// Figma → Assets 패널 → Variables 탭 → + 버튼

🎨 Neon Purple Collection
├── Purple/Primary → #7b29cd
├── Purple/Secondary → #870dd1  
├── Purple/Accent1 → #5b30f6
└── Purple/Accent2 → #8054f2

🌙 Cosmic Background Collection
├── Background/Dark1 → #1a1a1a
├── Background/Dark2 → #2d2d2d
└── Background/Dark3 → #333333

📏 Spacing Collection
├── Card/Padding → 24px
├── Card/Gap → 16px
├── Card/Gap-Large → 24px
└── Card/Border-Radius → 16px

📐 Card Dimensions Collection
├── Height/Base → 320px
├── Height/Game → 380px
├── Height/Mission → 280px
└── Height/Reward → 380px
```

### 2. Variables에 모드 설정

```figma-modes
Mode: Light (기본값)
- Purple/Primary: #7b29cd
- Background/Dark1: #f8f9fa (라이트모드용)

Mode: Dark
- Purple/Primary: #7b29cd (동일)
- Background/Dark1: #1a1a1a (다크모드용)
```

## 🔌 토큰 연동 워크플로우

### 방법 1: Figma Variables → CSS (수동)

1. **Figma에서 Variables Export**
   ```
   Figma → Assets → Variables → ⚙️ → Export Variables
   ```

2. **Export 형식 선택**
   ```json
   {
     "Purple": {
       "Primary": {
         "value": "#7b29cd",
         "type": "color"
       }
     }
   }
   ```

3. **CSS Variables로 변환**
   ```css
   :root {
     --purple-primary: #7b29cd;
   }
   ```

### 방법 2: Figma Tokens Studio 플러그인 (권장)

1. **플러그인 설치**
   ```
   Figma → Plugins → Browse plugins → "Figma Tokens"
   ```

2. **토큰 설정**
   ```json
   {
     "neon": {
       "purple": {
         "1": {
           "value": "#7b29cd",
           "type": "color"
         }
       }
     }
   }
   ```

3. **GitHub 연동 설정**
   ```
   Tokens Studio → Settings → Sync → GitHub
   Repository: your-repo/design-tokens
   Branch: main
   Path: tokens/
   ```

### 방법 3: Style Dictionary 사용 (고급)

1. **설치**
   ```bash
   npm install style-dictionary
   ```

2. **config.json 설정**
   ```json
   {
     "source": ["tokens/**/*.json"],
     "platforms": {
       "css": {
         "buildPath": "styles/",
         "files": [{
           "destination": "tokens.css",
           "format": "css/variables"
         }]
       }
     }
   }
   ```

3. **자동 빌드**
   ```bash
   npx style-dictionary build
   ```

## 💻 코드 적용 가이드

### 1. 기존 컴포넌트 리팩토링

**Before (하드코딩):**
```tsx
const gameStyles = {
  roulette: {
    gradient: 'from-[#7b29cd] to-[#870dd1]',
    accentColor: '#7b29cd',
    neonColor: 'rgba(123, 41, 205, 0.3)'
  }
};
```

**After (토큰 사용):**
```tsx
const gameStyles = {
  roulette: {
    gradient: 'from-game-roulette to-neon-purple-2',
    accentColor: 'var(--game-roulette-color)',
    neonColor: 'var(--game-roulette-glow)'
  }
};
```

### 2. Tailwind 클래스 활용

**CSS Variables를 Tailwind로 매핑:**
```css
@theme inline {
  --color-game-roulette: var(--neon-purple-1);
  --color-game-slots: var(--neon-purple-2);
  --color-game-rps: var(--neon-purple-3);
  --color-game-gacha: var(--neon-purple-4);
}
```

**컴포넌트에서 사용:**
```tsx
// ✅ Tailwind 클래스로 깔끔하게
<div className="bg-game-roulette/20 border-game-roulette/30">

// ✅ CSS Variables로 동적 스타일
<div style={{ 
  borderColor: 'var(--game-roulette-color)',
  boxShadow: '0 0 10px var(--game-roulette-glow)'
}}>
```

### 3. TypeScript 타입 안전성

```typescript
// design-tokens.d.ts
export interface DesignTokens {
  colors: {
    neon: {
      purple: {
        1: string;
        2: string;
        3: string;
        4: string;
      };
    };
    game: {
      roulette: string;
      slots: string;
      rps: string;
      gacha: string;
    };
  };
  spacing: {
    card: {
      padding: string;
      gap: string;
    };
  };
}

// 토큰 사용 시 타입 체크
const useGameColor = (gameType: keyof DesignTokens['colors']['game']) => {
  return `var(--game-${gameType}-color)`;
};
```

## 🚀 자동화 설정

### GitHub Actions 워크플로우

```yaml
# .github/workflows/design-tokens.yml
name: Design Tokens Sync

on:
  push:
    paths:
      - 'tokens/**'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install dependencies
        run: npm install
        
      - name: Build design tokens
        run: npm run build:tokens
        
      - name: Commit generated files
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add styles/tokens.css
          git commit -m "Update design tokens" || exit 0
          git push
```

### npm 스크립트

```json
{
  "scripts": {
    "build:tokens": "style-dictionary build",
    "watch:tokens": "style-dictionary build --watch",
    "sync:figma": "figma-tokens --config tokens.config.js"
  }
}
```

## 📋 마이그레이션 체크리스트

### Phase 1: 기반 구축
- [x] CSS Variables를 globals.css에 추가
- [x] Tailwind 색상 매핑 설정
- [ ] 기존 하드코딩 색상 식별
- [ ] 토큰 명명 규칙 확정

### Phase 2: 컴포넌트 리팩토링
- [ ] CardBase 컴포넌트 토큰 적용
- [ ] CardGame 컴포넌트 토큰 적용
- [ ] CardMission 컴포넌트 토큰 적용
- [ ] CardReward 컴포넌트 토큰 적용
- [ ] App.tsx 메인 컴포넌트 토큰 적용

### Phase 3: Figma 연동
- [ ] Figma Variables 설정
- [ ] Tokens Studio 플러그인 설치
- [ ] 토큰 Export/Import 테스트
- [ ] 자동화 워크플로우 구축

### Phase 4: 고도화
- [ ] Style Dictionary 설정
- [ ] TypeScript 타입 정의
- [ ] 자동 빌드 파이프라인
- [ ] 문서화 자동 생성

## 🎯 토큰 명명 규칙

### 색상 토큰
```
구조: {category}-{variant}-{state?}
예시:
- neon-purple-1 (카테고리-색상-번호)
- game-roulette-hover (카테고리-타입-상태)
- cosmic-text-primary (카테고리-용도-우선순위)
```

### 크기 토큰
```
구조: {component}-{property}-{variant?}
예시:
- card-height-base (컴포넌트-속성-변형)
- image-height-standard (컴포넌트-속성-기본)
- cosmic-padding (카테고리-속성)
```

### 애니메이션 토큰
```
구조: {category}-{timing}-{variant?}
예시:
- cosmic-transition-fast (카테고리-속성-속도)
- neon-glow-duration (카테고리-효과-속성)
```

## ⚡ 성능 최적화

### CSS Variables vs Tailwind 클래스 선택 기준

```tsx
// ✅ 정적 값 → Tailwind 클래스 사용
<div className="bg-game-roulette text-cosmic-text-primary">

// ✅ 동적 값 → CSS Variables 사용  
<div style={{ 
  backgroundColor: `var(--game-${gameType}-color)`,
  boxShadow: `0 0 10px var(--game-${gameType}-glow)`
}}>

// ❌ 피해야 할 패턴 (런타임 스타일 생성)
<div className={`bg-[${gameColor}]`}>
```

### Bundle Size 최적화

```typescript
// 토큰 Tree-shaking을 위한 구조
export const tokens = {
  colors: {
    // 오직 사용되는 토큰만 번들에 포함
    game: () => import('./tokens/game-colors.json'),
    neon: () => import('./tokens/neon-colors.json')
  }
} as const;
```

## 🔍 디버깅 & 테스트

### 토큰 일관성 검사

```typescript
// 토큰 유효성 검사 유틸리티
const validateTokens = () => {
  const computedStyle = getComputedStyle(document.documentElement);
  
  const requiredTokens = [
    '--neon-purple-1',
    '--game-roulette-color',
    '--cosmic-card-bg'
  ];
  
  requiredTokens.forEach(token => {
    const value = computedStyle.getPropertyValue(token);
    if (!value) {
      console.error(`Missing token: ${token}`);
    }
  });
};
```

### Visual Regression Testing

```typescript
// Storybook을 이용한 토큰 변경 감지
export default {
  title: 'Design Tokens/Colors',
  parameters: {
    chromatic: { 
      diffThreshold: 0.2,
      // 토큰 변경 시 자동 스크린샷 비교
    }
  }
};
```

## 📚 참고 자료

- [Figma Variables 공식 문서](https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma)
- [Tokens Studio for Figma](https://tokens.studio/)
- [Style Dictionary 가이드](https://amzn.github.io/style-dictionary/)
- [Design Tokens W3C 스펙](https://design-tokens.github.io/community-group/format/)

---

> 💡 **다음 단계**: 현재 하드코딩된 색상들을 CSS Variables로 교체하는 작업을 시작하세요. 한 번에 모든 컴포넌트를 변경하지 말고, CardBase부터 단계적으로 적용하는 것을 권장합니다.