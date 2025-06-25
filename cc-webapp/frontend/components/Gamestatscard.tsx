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
    <BaseCard variant="info" className="w-full max-w-sm">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-chart-1" />
          <h3 className="text-card-foreground">게임 통계</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-muted-foreground">플레이 횟수</div>
            <div className="text-lg text-card-foreground">{gamesPlayed}</div>
          </div>
          
          <div className="space-y-1">
            <div className="text-muted-foreground">승률</div>
            <div className="text-lg text-chart-2">{winRate}%</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-chart-5" />
              <span className="text-muted-foreground">최고 점수</span>
            </div>
            <span className="text-chart-5">{bestScore.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-chart-1" />
              <span className="text-muted-foreground">총 플레이 시간</span>
            </div>
            <span className="text-chart-1">{totalPlayTime}</span>
          </div>
        </div>
      </div>
    </BaseCard>
  );
}