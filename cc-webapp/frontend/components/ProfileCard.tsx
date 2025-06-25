import { BaseCard } from './Basecard';
import { Settings, Eye } from 'lucide-react';
import Button from './Button';
import { ImageWithFallback } from './ImageWithFallback';

interface ProfileCardProps {
  name: string;
  username: string;
  avatarUrl?: string;
  level: number;
  experiencePoints: number;
  maxExperience: number;
  onViewProfile?: () => void;
  onSettings?: () => void;
}

export function ProfileCard({ 
  name, 
  username, 
  avatarUrl, 
  level, 
  experiencePoints, 
  maxExperience,
  onViewProfile,
  onSettings
}: ProfileCardProps) {
  const progressPercentage = (experiencePoints / maxExperience) * 100;

  return (
    <BaseCard className="w-full max-w-sm min-h-[320px]">
      <div className="p-4 space-y-6 flex flex-col justify-between h-full">
        <div className="flex items-center gap-3">
          <div className="relative">
            <ImageWithFallback
              src={avatarUrl || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face`}
              alt={name}
              className="w-12 h-12 rounded-full object-cover border-2 border-chart-5/30"
            />
            <div className="absolute -bottom-1 -right-1 bg-chart-5 text-chart-5-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs">
              {level}
            </div>
          </div>
          
          <div className="flex-1">
            <h4 className="text-base font-medium text-[var(--color-text-primary)]">{name}</h4>
            <p className="text-sm text-[var(--color-text-secondary)]">@{username}</p>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={onSettings}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">레벨 {level}</span>
            <span className="text-muted-foreground">{experiencePoints}/{maxExperience} XP</span>
          </div>
          
          <div className="w-full bg-border rounded-full h-2">
            <div 
              className="bg-chart-5 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <Button 
          onClick={onViewProfile}
          size="sm"
          variant="secondary"
          className="w-full"
        >
          <Eye className="w-4 h-4 mr-2" />
          프로필 보기
        </Button>
      </div>
    </BaseCard>
  );
}