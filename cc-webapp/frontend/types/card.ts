export interface BaseCardProps {
  title: string;
  description: string;
  image?: string;
  className?: string;
  onClick?: () => void;
}

export interface GameCardProps extends BaseCardProps {
  gameType: 'slot' | 'roulette' | 'gacha' | 'poker' | 'blackjack';
  minBet?: number;
  maxBet?: number;
  isActive?: boolean;
}

export interface ContentCardProps extends BaseCardProps {
  contentType: 'adult' | 'game' | 'vip';
  isUnlocked?: boolean;
  unlockCost?: number;
  thumbnailUrl?: string;
  stage?: string;
}

export interface VIPCardProps extends BaseCardProps {
  tier: 'basic' | 'premium' | 'vip' | 'whale';
  benefits: string[];
  cost: number;
}
