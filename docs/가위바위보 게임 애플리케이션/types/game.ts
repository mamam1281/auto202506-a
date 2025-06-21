export type Choice = 'rock' | 'paper' | 'scissors';
export type GameResult = 'win' | 'lose' | 'draw' | null;

export interface GameScore {
  player: number;
  ai: number;
  draws: number;
}

export interface GameState {
  playerChoice: Choice | null;
  aiChoice: Choice | null;
  result: GameResult;
  isPlaying: boolean;
  score: GameScore;
  gameHistory: GameRound[];
}

export interface GameRound {
  id: string;
  playerChoice: Choice;
  aiChoice: Choice;
  result: GameResult;
  timestamp: number;
}

export interface ChoiceConfig {
  emoji: string;
  label: string;
  accentColor: string;
  lightColor: string;
  shadowColor: string;
}

export interface GameSettings {
  soundEnabled: boolean;
  animationsEnabled: boolean;
  theme: 'dark' | 'light' | 'auto';
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GameStats {
  totalGames: number;
  winRate: number;
  longestWinStreak: number;
  currentWinStreak: number;
  favoriteChoice: Choice | null;
  averageGameTime: number;
}

// 이벤트 타입
export interface GameEvents {
  onGameStart: () => void;
  onGameEnd: (result: GameResult) => void;
  onChoiceSelected: (choice: Choice) => void;
  onScoreUpdate: (score: GameScore) => void;
  onGameReset: () => void;
}

// 컴포넌트 Props 타입들
export interface ChoiceButtonsProps {
  onChoice: (choice: Choice) => void;
  selectedChoice: Choice | null;
  disabled: boolean;
  config?: Record<Choice, ChoiceConfig>;
}

export interface OpponentDisplayProps {
  choice: Choice | null;
  isThinking: boolean;
  difficulty?: GameSettings['difficulty'];
}

export interface ResultScreenProps {
  result: GameResult;
  playerChoice: Choice;
  aiChoice: Choice;
  onPlayAgain: () => void;
  onResetScore: () => void;
  score: GameScore;
  gameStats?: GameStats;
}

export interface ParticleSystemProps {
  isActive: boolean;
  intensity?: 'low' | 'medium' | 'high';
  colors?: string[];
}

// 사운드 관련 타입
export interface SoundConfig {
  volume: number;
  enabled: boolean;
  sounds: {
    click: string;
    win: string;
    lose: string;
    draw: string;
    selection: string;
    countdown: string;
  };
}

// 애니메이션 설정 타입
export interface AnimationConfig {
  duration: {
    short: number;
    medium: number;
    long: number;
  };
  easing: {
    bounce: string;
    smooth: string;
    sharp: string;
  };
  spring: {
    stiffness: number;
    damping: number;
  };
}

// API 관련 타입 (확장 가능)
export interface GameSession {
  id: string;
  userId?: string;
  startTime: number;
  endTime?: number;
  rounds: GameRound[];
  finalScore: GameScore;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  winRate: number;
  totalGames: number;
  highestStreak: number;
  createdAt: number;
}

// 에러 타입
export interface GameError {
  code: string;
  message: string;
  details?: unknown;
}

// 유틸리티 타입
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;