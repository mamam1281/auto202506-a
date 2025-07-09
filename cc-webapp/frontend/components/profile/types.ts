export interface User {
  id: string;
  email: string;
  nickname: string;
  rank: 'STANDARD' | 'PREMIUM' | 'VIP' | 'DEV';
  cyberTokens: number;
  accountNumber: string;
  createdAt: string;
  lastLoginAt: string;
  level: number;
  experience: number;
  experienceToNext: number;
  loginStreak: number;
  maxStreak: number;
  lastCheckIn: string | null;
}

export interface ProfileData {
  user: User;
  stats: {
    gamesPlayed: number;
    winRate: number;
    totalPlayTime: number;
  };
}

export interface FlashOffer {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountPrice: number;
  discount: number;
  endTime: string;
  isActive: boolean;
  type: 'TOKEN_BONUS' | 'STAGE_DISCOUNT' | 'SPECIAL_UNLOCK';
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  reward: number;
  type: 'DAILY' | 'WEEKLY' | 'SPECIAL';
  progress: number;
  target: number;
  completed: boolean;
  icon: string;
}

export interface CJMessage {
  id: string;
  message: string;
  emotion: 'excited' | 'encouraging' | 'congratulatory' | 'urgent' | 'friendly';
  timestamp: string;
  actionSuggestion?: {
    text: string;
    action: string;
    params?: any;
  };
}

export const RANK_COLORS = {
  STANDARD: {
    bg: 'bg-blue-500/20',
    text: 'text-blue-400',
    border: 'border-blue-500/30'
  },
  PREMIUM: {
    bg: 'bg-orange-500/20',
    text: 'text-orange-400',
    border: 'border-orange-500/30'
  },
  VIP: {
    bg: 'bg-purple-500/20',
    text: 'text-purple-400',
    border: 'border-purple-500/30'
  },
  DEV: {
    bg: 'bg-green-500/20',
    text: 'text-green-400',
    border: 'border-green-500/30'
  }
} as const;

export const RANK_LABELS = {
  STANDARD: '스탠다드',
  PREMIUM: '프리미엄',
  VIP: 'VIP',
  DEV: '개발자'
} as const;

export const EMOTION_COLORS = {
  excited: 'text-yellow-400',
  encouraging: 'text-blue-400',
  congratulatory: 'text-green-400',
  urgent: 'text-red-400',
  friendly: 'text-purple-400'
} as const;
