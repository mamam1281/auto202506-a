import { BaseCard } from './Basecard';
import { TrendingUp, Star } from 'lucide-react';

interface PointsCardProps {
  currentPoints: number;
  weeklyChange: number;
  rank: number;
  nextReward?: string;
}

export function PointsCard({ currentPoints, weeklyChange, rank, nextReward }: PointsCardProps) {
  const isPositive = weeklyChange >= 0;

  return (
    <BaseCard variant="accent" className="w-full max-w-sm min-h-[300px]">
      <div className="p-4 space-y-6 flex flex-col justify-between h-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-[var(--color-accent-amber)]" />
            <h3 className="text-base font-medium text-[var(--color-text-primary)]">포인트</h3>
          </div>
          <div className="text-[var(--color-text-secondary)] text-sm">#{rank}</div>
        </div>

        <div className="space-y-2">
          <div className="text-2xl font-bold text-[var(--color-accent-amber)]">
            {currentPoints.toLocaleString()}P
          </div>
          
          <div className="flex items-center gap-2">
            <TrendingUp className={`w-4 h-4 ${isPositive ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'}`} />
            <span className={`text-sm font-medium ${isPositive ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'}`}>
              {isPositive ? '+' : ''}{weeklyChange}P
            </span>
            <span className="text-[var(--color-text-secondary)] text-sm">이번 주</span>
          </div>
        </div>

        {nextReward && (
          <div className="p-3 rounded-lg bg-[var(--card)] border border-[var(--border)]">
            <div className="text-[var(--muted-foreground)] text-xs">다음 보상</div>
            <div className="text-[var(--foreground)] text-sm font-medium mt-1">{nextReward}</div>
          </div>
        )}
      </div>
    </BaseCard>
  );
}