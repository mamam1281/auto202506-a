import { BaseCard } from './Basecard';
import Button from './Button';
import { Bell, X } from 'lucide-react';

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
    <BaseCard className="w-full max-w-sm min-h-[250px]">
      <div className="p-4 space-y-6 flex flex-col justify-between h-full">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-[var(--color-accent-amber)]/20 flex-shrink-0">
            <Bell className="w-5 h-5 text-[var(--color-accent-amber)]" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-base font-medium text-[var(--color-text-primary)] mb-2">{title}</h4>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{description}</p>
          </div>
          <button
            onClick={onDismiss}
            className="flex-shrink-0 p-1 rounded-md hover:bg-[var(--color-neutral-dark)]/50 transition-colors"
          >
            <X className="w-4 h-4 text-[var(--color-text-secondary)]" />
          </button>
        </div>
        
        {onAction && (
          <div className="flex gap-2 mt-auto">
            <Button 
              onClick={onAction}
              variant="primary"
              size="sm"
              className="flex-1"
            >
              {actionText}
            </Button>
          </div>
        )}
      </div>
    </BaseCard>
  );
}