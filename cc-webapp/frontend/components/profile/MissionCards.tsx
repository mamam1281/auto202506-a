'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Clock, CheckCircle, ExternalLink } from 'lucide-react';
import { Card } from '../ui/basic/card';
import { Button } from '../ui/basic/button';
import ProgressCircle from './ProgressCircle';
import type { Mission } from './types';

interface MissionCardsProps {
  missions: Mission[];
  onMissionClick?: (mission: Mission) => void;
  onVisitSite?: () => void;
}

export default function MissionCards({ 
  missions, 
  onMissionClick,
  onVisitSite 
}: MissionCardsProps) {
  const getMissionTypeColor = (type: Mission['type']) => {
    switch (type) {
      case 'DAILY':
        return {
          bg: 'from-blue-500/20 to-blue-600/20',
          border: 'border-blue-500/30 border-l-4 border-l-blue-500',
          text: 'text-blue-400',
          icon: '📅',
          glow: 'shadow-blue-500/20'
        };
      case 'WEEKLY':
        return {
          bg: 'from-orange-500/20 to-orange-600/20',
          border: 'border-orange-500/30 border-l-4 border-l-orange-500',
          text: 'text-orange-400',
          icon: '📊',
          glow: 'shadow-orange-500/20'
        };
      case 'SPECIAL':
        return {
          bg: 'from-purple-500/20 to-purple-600/20',
          border: 'border-purple-500/30 border-l-4 border-l-purple-500',
          text: 'text-purple-400',
          icon: '⭐',
          glow: 'shadow-purple-500/20'
        };
      default:
        return {
          bg: 'from-gray-500/20 to-gray-600/20',
          border: 'border-gray-500/30 border-l-4 border-l-gray-500',
          text: 'text-gray-400',
          icon: '🎯',
          glow: 'shadow-gray-500/20'
        };
    }
  };

  const getMissionTypeLabel = (type: Mission['type']) => {
    switch (type) {
      case 'DAILY': return '일일';
      case 'WEEKLY': return '주간';
      case 'SPECIAL': return '특별';
      default: return '미션';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          미션
        </h3>
        
        {onVisitSite && (
          <Button
            onClick={onVisitSite}
            variant="outline"
            size="sm"
            className="text-xs text-primary border-primary/30 hover:bg-primary/10"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            더 많은 미션
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {missions.map((mission, index) => {
          const colors = getMissionTypeColor(mission.type);
          const progressPercentage = (mission.progress / mission.target) * 100;
          const isCompleted = mission.completed || mission.progress >= mission.target;

          return (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <Card 
                className={`
                  p-4 bg-gradient-to-r ${colors.bg} ${colors.border} border-2
                  cursor-pointer transition-all duration-300 relative overflow-hidden
                  ${isCompleted ? 'opacity-75' : `hover:shadow-2xl ${colors.glow} hover:border-opacity-60`}
                `}
                onClick={() => onMissionClick?.(mission)}
              >
                {/* Category Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <span className="text-xl drop-shadow-lg">{colors.icon}</span>
                  <span className={`text-xs px-3 py-1.5 rounded-full bg-white/20 ${colors.text} font-bold border border-white/30 shadow-md backdrop-blur-sm`}>
                    {getMissionTypeLabel(mission.type)}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {/* Mission Icon & Progress */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl">
                      {mission.icon}
                    </div>
                    
                    {!isCompleted && (
                      <div className="absolute -bottom-1 -right-1">
                        <ProgressCircle
                          percentage={progressPercentage}
                          size={24}
                          strokeWidth={3}
                          color={colors.text.replace('text-', '#')}
                          showText={false}
                        />
                      </div>
                    )}
                    
                    {isCompleted && (
                      <div className="absolute -bottom-1 -right-1">
                        <CheckCircle className="w-6 h-6 text-green-400 bg-card rounded-full" />
                      </div>
                    )}
                  </div>

                  {/* Mission Info */}
                  <div className="flex-1 min-w-0 pr-16">
                    <h4 className="font-semibold text-white text-sm mb-1 truncate">
                      {mission.title}
                    </h4>
                    
                    <p className="text-xs text-gray-300 mb-3 line-clamp-2">
                      {mission.description}
                    </p>

                    {/* Enhanced Progress Display */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 font-medium">진행률:</span>
                          <span className={`font-bold ${colors.text} bg-white/10 px-2 py-1 rounded-full`}>
                            {mission.progress}/{mission.target}
                          </span>
                          <span className={`font-bold ${colors.text} bg-gradient-to-r from-white/20 to-white/10 px-2 py-1 rounded-full border border-white/20`}>
                            {Math.round(progressPercentage)}%
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1 bg-yellow-400/20 px-2 py-1 rounded-full border border-yellow-400/30">
                          <span className="text-yellow-400 text-lg">💎</span>
                          <span className="text-sm font-bold text-yellow-300">
                            {mission.reward}
                          </span>
                        </div>
                      </div>
                      
                      {/* Enhanced Progress Bar */}
                      <div className="w-full h-4 bg-black/30 rounded-full overflow-hidden border border-white/10 shadow-inner">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${colors.bg.replace('/20', '/90')} rounded-full relative overflow-hidden shadow-lg`}
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercentage}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        >
                          {/* Progress bar shimmer effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                          {/* Progress bar glow effect */}
                          <div className={`absolute inset-0 bg-gradient-to-r ${colors.bg.replace('/20', '/70')} shadow-lg ${colors.glow.replace('shadow-', 'shadow-inner-')}`} />
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      >
                        <CheckCircle className="w-8 h-8 text-green-400" />
                      </motion.div>
                    ) : (
                      <div className={`w-8 h-8 rounded-full border-2 ${colors.border} flex items-center justify-center`}>
                        <div className={`w-3 h-3 rounded-full ${colors.bg}`} />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Add more missions CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: missions.length * 0.1 + 0.2 }}
      >
        <Card className="p-4 bg-gradient-to-r from-gray-500/10 to-gray-600/10 border-gray-500/20 border-dashed">
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-2">
              더 많은 토큰을 원하세요?
            </p>
            {onVisitSite && (
              <Button
                onClick={onVisitSite}
                variant="outline"
                size="sm"
                className="text-primary border-primary/30 hover:bg-primary/10"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                본사 사이트에서 추가 미션 확인
              </Button>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
