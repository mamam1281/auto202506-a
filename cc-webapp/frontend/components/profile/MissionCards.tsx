'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Mission } from './types';

interface MissionCardsProps {
  missions: Mission[];
  onMissionClick: (missionId: string) => void;
  onVisitSite?: () => void;
}

export function MissionCards({ missions, onMissionClick, onVisitSite }: MissionCardsProps) {
  return (
    <div className="p-6 bg-card border-elegant shadow-elegant rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg text-white game-subtitle">오늘의 미션</h3>
        <button
          onClick={onVisitSite}
          className="text-primary hover:text-primary/80 text-sm p-0 flex items-center gap-1"
        >
          <ExternalLink className="w-4 h-4" />
          더 많은 미션
        </button>
      </div>
      
      <div className="space-y-4">
        {missions.map((mission) => (
          <MissionCard 
            key={mission.id} 
            mission={mission} 
            onClick={() => onMissionClick(mission.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface MissionCardProps {
  mission: Mission;
  onClick: () => void;
}

function MissionCard({ mission, onClick }: MissionCardProps) {
  const progressPercentage = Math.round((mission.progress / mission.target) * 100);
  
  const getBadgeClass = (type: string) => {
    switch (type) {
      case 'DAILY':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'WEEKLY':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'SPECIAL':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };
  
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="p-4 rounded-xl bg-muted/10 border border-border hover:border-primary/30 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-muted/30 flex items-center justify-center text-xl">
          {mission.icon}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm text-white">{mission.title}</h4>
            <span className={`inline-block px-2 py-1 text-xs rounded border ${getBadgeClass(mission.type)}`}>
              {mission.type === 'DAILY' ? '일일' : mission.type === 'WEEKLY' ? '주간' : '특별'}
            </span>
          </div>
          
          <p className="text-xs text-muted-foreground mb-2">{mission.description}</p>
          
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">
              진행도: {mission.progress}/{mission.target}
            </span>
            <span className="text-xs text-yellow-400">+{mission.reward}💎</span>
          </div>
          
          <div className="w-full h-1.5 bg-primary/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
      </div>
    </motion.div>
  );
}
