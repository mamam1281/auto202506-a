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
      {/* 420px 너비 최적화 - 데일리 모달 스타일 통일 */}
      <div className="space-y-3">
        {missions.map((mission, index) => {
          const colors = getMissionTypeColor(mission.type);
          const progressPercentage = (mission.progress / mission.target) * 100;
          const isCompleted = mission.isCompleted || mission.progress >= mission.target;

          return (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="w-full"
            >
              {/* 데일리 모달과 동일한 카드 스타일 */}
              <div 
                className={`
                  rounded-xl p-6 relative overflow-hidden bg-gradient-to-br ${colors.bg} 
                  backdrop-blur-sm border ${colors.border.split(' ')[0]}/30 shadow-lg
                  cursor-pointer transition-all duration-300
                  ${isCompleted ? 'opacity-75' : `hover:shadow-xl ${colors.glow}`}
                `}
                onClick={() => onMissionClick?.(mission)}
              >
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/5 pointer-events-none" />

                <div className="relative z-10 space-y-4">
                  {/* Header with Mission Type Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.bg.replace('/20', '/40')} 
                                     border ${colors.border.split(' ')[0]}/50 flex items-center justify-center shadow-lg`}>
                        <span className="text-lg">{colors.icon}</span>
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="text-base font-bold text-white leading-tight">
                          {mission.title}
                        </h4>
                        <p className="text-sm text-white/80 leading-tight">
                          {mission.description}
                        </p>
                      </div>
                    </div>

                    {/* Status Indicator */}
                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500 }}
                          className="w-8 h-8 rounded-full bg-green-500/30 border border-green-500/50 
                                     flex items-center justify-center"
                        >
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        </motion.div>
                      ) : (
                        <div className={`px-3 py-1 rounded-lg ${colors.bg.replace('/20', '/30')} 
                                       border ${colors.border.split(' ')[0]}/50`}>
                          <span className={`text-xs font-bold ${colors.text}`}>
                            {getMissionTypeLabel(mission.type)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="space-y-3">
                    {/* Progress Info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-white/70">진행률:</span>
                        <span className={`text-sm font-bold ${colors.text} px-2 py-1 rounded-lg 
                                        bg-white/10 border border-white/20`}>
                          {mission.progress}/{mission.target}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-yellow-400/20 
                                     border border-yellow-400/30">
                        <span className="text-yellow-400">💎</span>
                        <span className="text-sm font-bold text-yellow-300">
                          +{mission.reward.amount}
                        </span>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="w-full h-3 bg-black/30 rounded-full overflow-hidden 
                                     border border-white/10 shadow-inner">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${colors.bg.replace('/20', '/80')} 
                                     rounded-full shadow-lg`}
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercentage}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-white/60">
                        <span>0%</span>
                        <span className={`font-bold ${colors.text}`}>
                          {Math.round(progressPercentage)}%
                        </span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>

                  {/* Time Left */}
                  {mission.timeLeft && (
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <Clock className="w-4 h-4" />
                      <span>{mission.timeLeft}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Visit Site Button */}
      {onVisitSite && (
        <Button
          onClick={onVisitSite}
          variant="outline"
          className="w-full h-12 border-white/20 text-white hover:bg-white/10 
                     flex items-center justify-center gap-2 rounded-lg"
        >
          <ExternalLink className="w-4 h-4" />
          더 많은 미션 보기
        </Button>
      )}
    </div>
  );
}
