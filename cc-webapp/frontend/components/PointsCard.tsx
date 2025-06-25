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
    <BaseCard variant="accent" className="w-full max-w-sm">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-chart-5" />
            <h3 className="text-card-foreground">포인트</h3>
          </div>
          <div className="text-muted-foreground">#{rank}</div>
        </div>

        <div className="space-y-2">
          <div className="text-2xl text-chart-5">
            {currentPoints.toLocaleString()}P
          </div>
          
          <div className="flex items-center gap-2">
            <TrendingUp className={`w-4 h-4 ${isPositive ? 'text-chart-2' : 'text-destructive'}`} />
            <span className={`${isPositive ? 'text-chart-2' : 'text-destructive'}`}>
              {isPositive ? '+' : ''}{weeklyChange}P
            </span>
            <span className="text-muted-foreground">이번 주</span>
          </div>
        </div>

        {nextReward && (
          <div className="p-3 rounded-lg bg-card border border-border">
            <div className="text-muted-foreground">다음 보상</div>
            <div className="text-card-foreground">{nextReward}</div>
          </div>
        )}
      </div>
    </BaseCard>
  );
}