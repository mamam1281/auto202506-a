// 슬롯 머신 게임 타입 정의

export type SlotMachineState = 'idle' | 'spinning' | 'stopping' | 'result' | 'celebrating';

export interface GameState {
  reels: string[];
  isSpinning: boolean;
  credits: number;
  betAmount: number;
  totalWins: number;
  consecutiveLosses: number;
  consecutiveSpins: number;
  lastWin?: {
    amount: number;
    type: string;
    timestamp: number;
  };
  jackpotAmount: number;
  spinCount: number;
  winHistory: Array<{
    amount: number;
    type: string;
    timestamp: number;
  }>;
}

export interface SlotReelProps {
  symbol: string;
  isSpinning: boolean;
  delay: number;
  isWinning?: boolean;
}

export interface BetControlProps {
  betAmount: number;
  setBetAmount: (amount: number) => void;
  maxBet: number;
  disabled?: boolean;
}

export interface SpinButtonProps {
  onSpin: () => void;
  disabled: boolean;
  isSpinning: boolean;
}

export interface SlotMachineProps {
  initialCredits?: number;
  onGameStateChange?: (state: GameState) => void;
  soundEnabled?: boolean;
  autoPlay?: boolean;
  autoPlayDelay?: number;
}

export interface WinResult {
  isWin: boolean;
  payout: number;
  winType?: string;
  winningPositions?: number[];
}

export interface SlotMachineStats {
  totalSpins: number;
  totalWins: number;
  totalPayout: number;
  biggestWin: number;
  winPercentage: number;
  currentStreak: number;
}
