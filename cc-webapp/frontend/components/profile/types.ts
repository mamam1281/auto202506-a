// 프로필 관련 모든 타입 정의 통합

export interface UserProfile {
  id: number;
  nickname: string;
  cyber_token_balance: number;
  rank?: string;
  level?: number;
  experience?: number;
  experienceRequired?: number;
  tokens?: number;
  wins?: number;
  loginStreak?: number;
  completedMissions?: number;
}

export interface User extends UserProfile {
  email?: string;
  createdAt?: string;
  lastLogin?: string;
}

// Flash Offer 관련 타입
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

// CJ 챗봇 관련 타입
export type EmotionType = 'excited' | 'encouraging' | 'congratulatory' | 'urgent' | 'friendly';

export interface ActionSuggestion {
  action: string;
  text: string;
  params?: any;
}

export interface CJMessage {
  id: string;
  message: string;
  emotion: EmotionType;
  actionSuggestion?: ActionSuggestion;
  timestamp: Date;
}

export const EMOTION_COLORS: Record<EmotionType, string> = {
  excited: 'text-yellow-400',
  encouraging: 'text-blue-400',
  congratulatory: 'text-green-400',
  urgent: 'text-red-400',
  friendly: 'text-purple-400'
};

export const RANK_LABELS = {
  STANDARD: '스탠다드',
  PREMIUM: '프리미엄',
  VIP: 'VIP',
  DEV: '개발자'
} as const;
  emotion: EmotionType;
  actionSuggestion?: ActionSuggestion;
  timestamp: Date;
}

export const EMOTION_COLORS: Record<EmotionType, string> = {
  excited: 'text-yellow-400',
  encouraging: 'text-blue-400',
  congratulatory: 'text-green-400',
  urgent: 'text-red-400',
  friendly: 'text-purple-400'
};
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

export interface ProfileHeaderProps {
  user: User;
}

export interface ProfileStatsProps {
  user: User;
}

export interface ProfileActionsProps {
  onLogout: () => void;
}

export interface ProfileContainerProps {
  className?: string;
}
