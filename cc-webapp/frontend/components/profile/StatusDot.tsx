'use client';

interface StatusDotProps {
  status: 'online' | 'away' | 'busy' | 'offline';
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
  showLabel?: boolean;
}

export default function StatusDot({ 
  status, 
  size = 'md',
  showPulse = true,
  showLabel = false 
}: StatusDotProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const statusConfig = {
    online: {
      color: 'bg-green-500',
      label: '온라인',
      pulse: showPulse
    },
    away: {
      color: 'bg-yellow-500',
      label: '자리비움',
      pulse: false
    },
    busy: {
      color: 'bg-red-500', 
      label: '바쁨',
      pulse: false
    },
    offline: {
      color: 'bg-gray-500',
      label: '오프라인',
      pulse: false
    }
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className={`
          ${sizeClasses[size]}
          ${config.color}
          rounded-full
          border-2 border-white
        `} />
        
        {config.pulse && (
          <div className={`
            ${sizeClasses[size]}
            ${config.color}
            rounded-full
            absolute top-0 left-0
            animate-ping
            opacity-75
          `} />
        )}
      </div>
      
      {showLabel && (
        <span className="text-sm text-gray-400 font-medium">
          {config.label}
        </span>
      )}
    </div>
  );
}
