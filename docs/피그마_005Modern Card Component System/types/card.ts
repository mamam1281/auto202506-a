export interface BaseCardProps {
  title: string;
  description?: string;
  image?: string;
  className?: string;
  onClick?: () => void;
}

export interface GameCardProps extends BaseCardProps {
  gameType: 'roulette' | 'slots' | 'rps' | 'gacha';
  isNew?: boolean;
  badge?: string;
  onPlay?: () => void;
}

export interface MissionCardProps extends BaseCardProps {
  progress: number;
  reward: string;
  deadline?: string;
  onStart?: () => void;
}

export interface RewardCardProps extends BaseCardProps {
  rewardType: 'tokens' | 'points' | 'items';
  amount: number;
  claimable?: boolean;
  onClaim?: () => void;
}