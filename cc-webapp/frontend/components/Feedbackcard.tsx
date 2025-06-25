import { BaseCard } from './Basecard';
import { Check, X, AlertCircle } from 'lucide-react';

interface FeedbackCardProps {
  type: 'success' | 'error' | 'warning';
  title: string;
  message: string;
  onDismiss?: () => void;
}

export function FeedbackCard({ type, title, message, onDismiss }: FeedbackCardProps) {
  const iconMap = {
    success: <Check className="w-5 h-5 text-[var(--color-success)]" />,
    error: <X className="w-5 h-5 text-[var(--color-error)]" />,
    warning: <AlertCircle className="w-5 h-5 text-[var(--color-accent-amber)]" />
  };

  const variantMap = {
    success: 'success' as const,
    error: 'error' as const,
    warning: 'accent' as const
  };

  return (
    <BaseCard variant={variantMap[type]} className="w-full max-w-sm min-h-[200px]">
      <div className="flex items-start justify-between p-4 h-full">
        <div className="flex items-start gap-3 flex-1">
          <div className="flex-shrink-0 mt-0.5">
            {iconMap[type]}
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-medium text-[var(--color-text-primary)]">{title}</h4>
            <p className="text-[var(--muted-foreground)] text-sm">{message}</p>
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 p-1 rounded-md hover:bg-[var(--muted)]/50 transition-colors"
          >
            <X className="w-4 h-4 text-[var(--muted-foreground)]" />
          </button>
        )}
      </div>
    </BaseCard>
  );
}