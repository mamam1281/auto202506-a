import { BaseCard } from './Basecard';
import Button from './Button';
import { Bell, Settings } from 'lucide-react';

interface NotificationCardProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  onDismiss?: () => void;
}

export function NotificationCard({ 
  title, 
  description, 
  actionText = "확인",
  onAction,
  onDismiss
}: NotificationCardProps) {
  return (
    <BaseCard className="w-full max-w-sm">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-chart-5/20">
            <Bell className="w-5 h-5 text-chart-5" />
          </div>
          <div className="flex-1">
            <h4 className="text-card-foreground">{title}</h4>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={onAction}
            size="sm"
            variant="primary"
            className="flex-1"
          >
            {actionText}
          </Button>
          {onDismiss && (
            <Button 
              onClick={onDismiss}
              size="sm"
              variant="outline"
            >
              무시
            </Button>
          )}
        </div>
      </div>
    </BaseCard>
  );
}