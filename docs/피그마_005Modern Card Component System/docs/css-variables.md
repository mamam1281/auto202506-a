# CSS Variables 목록

## 네온 카드 시스템 디자인 토큰

### 색상 팔레트

#### 주요 보라색 팔레트
```css
:root {
  /* 네온 퍼플 - 메인 색상 */
  --neon-purple-1: #7b29cd;
  --neon-purple-2: #870dd1;
  --neon-purple-3: #5b30f6;
  --neon-purple-4: #8054f2;
  
  /* 네온 그라데이션 */
  --neon-gradient-1: linear-gradient(45deg, #7b29cd, #870dd1);
  --neon-gradient-2: linear-gradient(45deg, #870dd1, #5b30f6);
  --neon-gradient-3: linear-gradient(45deg, #5b30f6, #8054f2);
  --neon-gradient-4: linear-gradient(45deg, #8054f2, #7b29cd);
}
```

#### 투명도 변형
```css
:root {
  /* 네온 글로우 효과 (30% 투명도) */
  --neon-glow-1: rgba(123, 41, 205, 0.3);
  --neon-glow-2: rgba(135, 13, 209, 0.3);
  --neon-glow-3: rgba(91, 48, 246, 0.3);
  --neon-glow-4: rgba(128, 84, 242, 0.3);
  
  /* 배경 오버레이 (15% 투명도) */
  --neon-bg-1: rgba(123, 41, 205, 0.15);
  --neon-bg-2: rgba(135, 13, 209, 0.15);
  --neon-bg-3: rgba(91, 48, 246, 0.15);
  --neon-bg-4: rgba(128, 84, 242, 0.15);
  
  /* 테두리 색상 (20-30% 투명도) */
  --neon-border-1: rgba(123, 41, 205, 0.2);
  --neon-border-2: rgba(135, 13, 209, 0.2);
  --neon-border-3: rgba(91, 48, 246, 0.2);
  --neon-border-4: rgba(128, 84, 242, 0.2);
}
```

### 다크모드 베이스 색상
```css
:root {
  /* 배경 그라데이션 */
  --bg-dark-1: #1a1a1a;
  --bg-dark-2: #2d2d2d;
  --bg-gradient: linear-gradient(to bottom right, #1a1a1a, #2d2d2d, #1a1a1a);
  
  /* 카드 배경 */
  --card-bg: linear-gradient(to bottom right, #1a1a1a, #2d2d2d);
  --card-border: #333333;
  
  /* 텍스트 색상 */
  --text-primary: #ffffff;
  --text-secondary: #D1D5DB;
  --text-muted: #a0a0a0;
}
```

### 그림자 & 글로우 효과
```css
:root {
  /* 카드 그림자 */
  --shadow-default: 0 2px 10px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(123, 41, 205, 0.15);
  --shadow-hover: 0 8px 20px rgba(123, 41, 205, 0.2), 0 0 0 1px rgba(123, 41, 205, 0.25), 0 0 10px rgba(123, 41, 205, 0.15);
  --shadow-active: 0 4px 15px rgba(135, 13, 209, 0.3), 0 0 0 2px rgba(135, 13, 209, 0.35);
  
  /* 네온 글로우 */
  --glow-subtle: 0 0 5px rgba(123, 41, 205, 0.2);
  --glow-medium: 0 0 10px rgba(123, 41, 205, 0.4);
  --glow-strong: 0 0 15px rgba(123, 41, 205, 0.6);
  
  /* 텍스트 그림자 */
  --text-glow: 0 0 8px rgba(123, 41, 205, 0.3);
}
```

### 크기 & 간격
```css
:root {
  /* 카드 크기 */
  --card-min-height-base: 320px;
  --card-min-height-game: 380px;
  --card-min-height-mission: 280px;
  --card-min-height-reward: 380px;
  
  /* 이미지 높이 */
  --image-height-base: 160px;  /* h-40 */
  --image-height-game: 128px;  /* h-32 */
  --image-height-mission: 128px;  /* h-32 */
  --image-height-reward: 128px;  /* h-32 */
  
  /* 패딩 & 마진 */
  --card-padding: 24px;  /* p-6 */
  --card-gap: 16px;      /* gap-4 */
  --card-gap-lg: 24px;   /* gap-6 */
  
  /* 보더 라디우스 */
  --radius-card: 16px;   /* rounded-2xl */
  --radius-image: 12px;  /* rounded-xl */
  --radius-button: 12px; /* rounded-xl */
  --radius-badge: 9999px; /* rounded-full */
  
  /* 아이콘 크기 */
  --icon-sm: 12px;
  --icon-md: 16px;
  --icon-lg: 20px;
  --icon-xl: 32px;
}
```

### Z-Index 레이어
```css
:root {
  --z-background: 0;
  --z-card: 10;
  --z-overlay: 20;
  --z-modal: 30;
  --z-tooltip: 40;
  --z-particle: 5;
}
```

### 게임 타입별 색상 매핑
```css
:root {
  /* Roulette */
  --game-roulette-color: var(--neon-purple-1);
  --game-roulette-glow: var(--neon-glow-1);
  --game-roulette-bg: var(--neon-bg-1);
  
  /* Slots */
  --game-slots-color: var(--neon-purple-2);
  --game-slots-glow: var(--neon-glow-2);
  --game-slots-bg: var(--neon-bg-2);
  
  /* Rock Paper Scissors */
  --game-rps-color: var(--neon-purple-3);
  --game-rps-glow: var(--neon-glow-3);
  --game-rps-bg: var(--neon-bg-3);
  
  /* Gacha */
  --game-gacha-color: var(--neon-purple-4);
  --game-gacha-glow: var(--neon-glow-4);
  --game-gacha-bg: var(--neon-bg-4);
}
```

### 사용 예시
```css
.neon-card {
  background: var(--card-bg);
  border: 1px solid var(--neon-border-1);
  border-radius: var(--radius-card);
  padding: var(--card-padding);
  box-shadow: var(--shadow-default);
  min-height: var(--card-min-height-base);
}

.neon-card:hover {
  box-shadow: var(--shadow-hover);
}

.neon-text {
  color: var(--text-primary);
  text-shadow: var(--text-glow);
}
```