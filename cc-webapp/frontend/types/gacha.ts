export type GachaTier = 'common' | 'rare' | 'epic' | 'legendary';

export type GachaState = 'ready' | 'pulling' | 'reveal';

export interface GachaResult {
  id: string;
  name: string;
  tier: GachaTier;
  description: string;
  image?: string;
}

export interface GachaProps {
  tickets: number;
  onPull: () => Promise<GachaResult>;
  onTicketUpdate: (newCount: number) => void;
  className?: string;
}

// Updated tier configuration with new color palette
export const TIER_CONFIG = {
  common: {
    name: '일반',
    probability: 60,
    color: 'text-gacha-common', // Updated to use CSS var placeholder
    bgColor: 'bg-gacha-common/20',
    borderColor: 'border-gacha-common/40',
    glowColor: 'var(--gacha-common-glow)', // Updated to use CSS var placeholder
    gradientFrom: 'var(--gacha-common-gradient-from)', // Updated
    gradientTo: 'var(--gacha-common-gradient-to)', // Updated
  },
  rare: {
    name: '레어',
    probability: 25,
    color: 'text-gacha-rare',
    bgColor: 'bg-gacha-rare/20',
    borderColor: 'border-gacha-rare/40',
    glowColor: 'var(--gacha-rare-glow)',
    gradientFrom: 'var(--gacha-rare-gradient-from)',
    gradientTo: 'var(--gacha-rare-gradient-to)',
  },
  epic: {
    name: '에픽',
    probability: 12,
    color: 'text-gacha-epic',
    bgColor: 'bg-gacha-epic/20',
    borderColor: 'border-gacha-epic/40',
    glowColor: 'var(--gacha-epic-glow)',
    gradientFrom: 'var(--gacha-epic-gradient-from)',
    gradientTo: 'var(--gacha-epic-gradient-to)',
  },
  legendary: {
    name: '전설',
    probability: 3,
    color: 'text-gacha-legendary',
    bgColor: 'bg-gacha-legendary/20',
    borderColor: 'border-gacha-legendary/40',
    glowColor: 'var(--gacha-legendary-glow)',
    gradientFrom: 'var(--gacha-legendary-gradient-from)',
    gradientTo: 'var(--gacha-legendary-gradient-to)',
  }
} as const;

// Modern particle effect configurations
export const PARTICLE_CONFIGS = {
  common: {
    count: 8,
    colors: ['var(--gacha-common-glow)', 'var(--gacha-common-particle-alt)'], // Updated
    size: { min: 2, max: 4 },
    speed: { min: 0.8, max: 1.2 },
  },
  rare: {
    count: 12,
    colors: ['var(--gacha-rare-glow)', 'var(--gacha-rare-particle-alt)'],
    size: { min: 3, max: 6 },
    speed: { min: 1.0, max: 1.5 },
  },
  epic: {
    count: 16,
    colors: ['var(--gacha-epic-glow)', 'var(--gacha-epic-particle-alt1)', 'var(--gacha-epic-particle-alt2)'],
    size: { min: 4, max: 8 },
    speed: { min: 1.2, max: 1.8 },
  },
  legendary: {
    count: 24,
    colors: ['var(--gacha-legendary-glow)', 'var(--gacha-legendary-particle-alt)'],
    size: { min: 6, max: 12 },
    speed: { min: 1.5, max: 2.5 },
  }
} as const;

// Modern animation presets
export const ANIMATION_PRESETS = {
  micro: {
    duration: 0.2,
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // This is a type of 'easeOutBack'
  },
  smooth: {
    duration: 0.4,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // This is a type of 'easeOutQuad'
  },
  bounce: { // This is more like a spring, Framer Motion's spring physics are better for this
    type: "spring",
    stiffness: 300,
    damping: 15,
    duration: 0.6, // Duration is indicative for spring
  },
  morphing: { // Good for layout changes or complex transitions
    duration: 0.8,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)', // Material Design standard easing
  }
} as const;

// Pity system configuration (as per prompt)
export const PITY_MAX_PULLS = 90;

// Sample items for local simulation (can be expanded or moved to a different file)
export const SAMPLE_ITEMS: Omit<GachaResult, 'id'>[] = [
  // Common items (60%)
  { name: '기본 검', tier: 'common', description: '평범한 검입니다.', image: '⚔️' },
  { name: '나무 방패', tier: 'common', description: '나무로 만든 방패입니다.', image: '🛡️' },
  { name: '가죽 갑옷', tier: 'common', description: '가죽으로 만든 갑옷입니다.', image: '🎽' },
  { name: '체력 물약', tier: 'common', description: '체력을 회복하는 물약입니다.', image: '🧪' },

  // Rare items (25%)
  { name: '강철 검', tier: 'rare', description: '강철로 제련된 검입니다.', image: '⚔️' },
  { name: '마법 반지', tier: 'rare', description: '마법이 깃든 반지입니다.', image: '💍' },
  { name: '은 갑옷', tier: 'rare', description: '은으로 만든 갑옷입니다.', image: '🎽' },

  // Epic items (12%)
  { name: '용의 검', tier: 'epic', description: '용의 힘이 깃든 전설의 검입니다.', image: '🗡️' },
  { name: '마법사의 지팡이', tier: 'epic', description: '강력한 마법을 사용할 수 있는 지팡이입니다.', image: '🪄' },
  { name: '황금 갑옷', tier: 'epic', description: '황금으로 제작된 고급 갑옷입니다.', image: '👑' },

  // Legendary items (3%)
  { name: '신의 검', tier: 'legendary', description: '신이 내린 최강의 검입니다.', image: '⚡' },
  { name: '불멸의 왕관', tier: 'legendary', description: '불멸의 힘을 주는 왕관입니다.', image: '👑' },
];
