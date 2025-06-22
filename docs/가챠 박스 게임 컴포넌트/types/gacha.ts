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
    color: 'text-[#a0a0a0]',
    bgColor: 'bg-[#a0a0a0]/20',
    borderColor: 'border-[#a0a0a0]/40',
    glowColor: '#a0a0a0',
    gradientFrom: '#a0a0a0',
    gradientTo: '#e0e0e0',
  },
  rare: {
    name: '레어',
    probability: 25,
    color: 'text-[#135b79]',
    bgColor: 'bg-[#135b79]/20',
    borderColor: 'border-[#135b79]/40',
    glowColor: '#135b79',
    gradientFrom: '#135b79',
    gradientTo: '#10b981',
  },
  epic: {
    name: '에픽',
    probability: 12,
    color: 'text-[#7b29cd]',
    bgColor: 'bg-[#7b29cd]/20',
    borderColor: 'border-[#7b29cd]/40',
    glowColor: '#7b29cd',
    gradientFrom: '#7b29cd',
    gradientTo: '#8054f2',
  },
  legendary: {
    name: '전설',
    probability: 3,
    color: 'text-[#f59e0b]',
    bgColor: 'bg-[#f59e0b]/20',
    borderColor: 'border-[#f59e0b]/40',
    glowColor: '#f59e0b',
    gradientFrom: '#f59e0b',
    gradientTo: '#ff4516',
  }
} as const;

// Modern particle effect configurations
export const PARTICLE_CONFIGS = {
  common: {
    count: 8,
    colors: ['#a0a0a0', '#e0e0e0'],
    size: { min: 2, max: 4 },
    speed: { min: 0.8, max: 1.2 },
  },
  rare: {
    count: 12,
    colors: ['#135b79', '#10b981'],
    size: { min: 3, max: 6 },
    speed: { min: 1.0, max: 1.5 },
  },
  epic: {
    count: 16,
    colors: ['#7b29cd', '#870dd1', '#8054f2'],
    size: { min: 4, max: 8 },
    speed: { min: 1.2, max: 1.8 },
  },
  legendary: {
    count: 24,
    colors: ['#f59e0b', '#ff4516'],
    size: { min: 6, max: 12 },
    speed: { min: 1.5, max: 2.5 },
  }
} as const;

// Modern animation presets
export const ANIMATION_PRESETS = {
  micro: {
    duration: 0.2,
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  smooth: {
    duration: 0.4,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
  bounce: {
    duration: 0.6,
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  morphing: {
    duration: 0.8,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  }
} as const;