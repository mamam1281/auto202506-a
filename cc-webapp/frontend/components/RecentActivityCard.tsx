import { BaseCard } from './Basecard';
import { Clock, Play, Trophy, MessageSquare } from 'lucide-react';

interface Activity {
  id: string;
  type: 'game' | 'achievement' | 'message';
  title: string;
  description: string;
  timestamp: string;
}

interface RecentActivityCardProps {
  activities: Activity[];
}

export function RecentActivityCard({ activities }: RecentActivityCardProps) {
  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'game':
        return <Play className="w-4 h-4 text-chart-1" />;
      case 'achievement':
        return <Trophy className="w-4 h-4 text-chart-5" />;
      case 'message':
        return <MessageSquare className="w-4 h-4 text-chart-2" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <BaseCard className="w-full max-w-sm">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-card-foreground">최근 활동</h3>
        </div>

        <div className="space-y-3 max-h-48 overflow-y-auto">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex-shrink-0 mt-1">
                {getIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-card-foreground truncate">{activity.title}</h4>
                <p className="text-muted-foreground truncate">{activity.description}</p>
                <p className="text-muted-foreground text-xs mt-1">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
        
        {activities.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            최근 활동이 없습니다
          </div>
        )}
      </div>
    </BaseCard>
  );
}