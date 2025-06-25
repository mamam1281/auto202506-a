import { BaseCard } from './Basecard';
import { Gamepad2, Trophy, TrendingUp } from 'lucide-react';

interface GameStatsCardProps {
  gamesPlayed: number;
  winRate: number;
  bestScore: number;
  totalPlayTime: string;
}

export function GameStatsCard({ gamesPlayed, winRate, bestScore, totalPlayTime }: GameStatsCardProps) {
  return (
    <BaseCard variant="info" className="w-full max-w-sm min-h-[350px]">
      <div className="p-4 space-y-6 flex flex-col justify-between h-full">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-[var(--color-info)]" />
          <h3 className="text-base font-medium text-[var(--color-text-primary)]">게임 통계</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-[var(--muted-foreground)] text-sm">플레이 횟수</div>
            <div className="text-lg font-semibold text-[var(--foreground)]">{gamesPlayed}</div>
          </div>
          
          <div className="space-y-1">
            <div className="text-[var(--muted-foreground)] text-sm">승률</div>
            <div className="text-lg font-semibold text-[var(--color-success)]">{winRate}%</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--card)] border border-[var(--border)]">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[var(--color-accent-amber)]" />
              <span className="text-[var(--muted-foreground)] text-sm">최고 점수</span>
            </div>
            <span className="text-[var(--color-accent-amber)] font-medium">{bestScore.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--card)] border border-[var(--border)]">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[var(--color-info)]" />
              <span className="text-[var(--muted-foreground)] text-sm">총 플레이 시간</span>
            </div>
            <span className="text-[var(--color-info)] font-medium">{totalPlayTime}</span>
          </div>
        </div>
      </div>
    </BaseCard>
  );
}