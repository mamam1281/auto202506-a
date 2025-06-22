export interface User {
  id: number;
  nickname: string;
  inviteCode: string;
  vip: boolean;
  joinDate: string;
  level: number;
  tokens: number;
  achievements: string[];
  avatar?: string;
  email?: string;
  lastLogin?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'dark' | 'light';
  language: 'ko' | 'en';
  notifications: boolean;
  soundEffects: boolean;
  autoLogin: boolean;
}

export interface UserStats {
  gamesPlayed: number;
  totalWins: number;
  totalLoses: number;
  winRate: number;
  highestStreak: number;
  currentStreak: number;
  favoriteGame: string;
  totalPlayTime: number; // in minutes
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: string;
  progress?: {
    current: number;
    target: number;
  };
}

export interface VIPBenefit {
  id: string;
  name: string;
  description: string;
  type: 'token_bonus' | 'exclusive_game' | 'priority_support' | 'special_event';
  value?: number;
  isActive: boolean;
  expiresAt?: string;
}