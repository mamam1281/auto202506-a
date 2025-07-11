'use client';

import { Coins, Flame, Trophy, Settings, Gift } from 'lucide-react';
import type { ProfileStatsProps } from './types';

/**
 * 400px * 750px에 최적화된 통합 프로필 통계
 * 한국 사용자 경험에 맞춘 단일 컴포넌트
 */
export default function ProfileStats({ user }: ProfileStatsProps) {
  // 액션 핸들러들
  const handleChargeTokens = () => console.log('토큰 충전');
  const handleViewRewards = () => console.log('보상 페이지');
  const handleViewHistory = () => console.log('전적 보기');
  const handleSettings = () => console.log('설정');
  const handleClaimReward = () => console.log('연속 출석 보상 받기');

  return (
    <div className="rounded-xl py-6 relative overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20"
         style={{ paddingLeft: '16px', paddingRight: '16px' }}>
      {/* 데일리 모달과 동일한 배경 효과 */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 pointer-events-none" />
      
      <div className="relative z-10 space-y-8">
        {/* 핵심 통계 표시 - 데일리 모달과 동일한 간격 */}
        <div className="grid grid-cols-2 gap-6" role="region" aria-label="계정 통계">
          {/* 토큰 (가장 중요) */}
          <div className="bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border border-amber-400/30 
                          rounded-xl text-center focus-within:ring-2 focus-within:ring-amber-400/50
                          shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]
                          transform hover:scale-[1.02] transition-all duration-300 ease-out
                          before:content-[''] before:absolute before:inset-0 before:rounded-xl
                          before:bg-gradient-to-br before:from-white/10 before:via-transparent before:to-black/5
                          before:pointer-events-none relative overflow-hidden"
               style={{ padding: '12px' }}
               tabIndex={0}
               role="button"
               aria-label={`보유 토큰 ${(user.cyber_token_balance || 0).toLocaleString()}개`}>
            <div className="flex items-center justify-center gap-2 relative z-10">
              <Coins className="w-5 h-5 text-amber-400 drop-shadow-sm" />
              <span className="text-amber-300 whitespace-nowrap drop-shadow-sm" style={{ fontSize: '13px' }}>보유 토큰</span>
              <div className="text-amber-400 font-bold whitespace-nowrap drop-shadow-sm" style={{ fontSize: '16px' }}>
                {(user.cyber_token_balance || 0).toLocaleString()}
              </div>
            </div>
          </div>
          
          {/* 연속 출석 */}
          <div className="bg-gradient-to-br from-orange-500/20 to-red-500/10 border border-orange-400/30 
                          rounded-xl text-center focus-within:ring-2 focus-within:ring-orange-400/50
                          shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]
                          transform hover:scale-[1.02] transition-all duration-300 ease-out
                          before:content-[''] before:absolute before:inset-0 before:rounded-xl
                          before:bg-gradient-to-br before:from-white/10 before:via-transparent before:to-black/5
                          before:pointer-events-none relative overflow-hidden"
               style={{ padding: '12px' }}
               tabIndex={0}
               role="button"
               aria-label={`연속 출석 ${user.loginStreak || 0}일째`}>
            <div className="flex items-center justify-center gap-2 relative z-10">
              <Flame className="w-5 h-5 text-orange-400 drop-shadow-sm" />
              <span className="text-orange-300 whitespace-nowrap drop-shadow-sm" style={{ fontSize: '13px' }}>연속 출석</span>
              <div className="text-orange-400 font-bold whitespace-nowrap drop-shadow-sm" style={{ fontSize: '16px' }}>
                {user.loginStreak || 0}일
              </div>
            </div>
          </div>
          
          {/* 승리/미션 통계 */}
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-400/30 
                          rounded-xl text-center focus-within:ring-2 focus-within:ring-green-400/50
                          shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]
                          transform hover:scale-[1.02] transition-all duration-300 ease-out
                          before:content-[''] before:absolute before:inset-0 before:rounded-xl
                          before:bg-gradient-to-br before:from-white/10 before:via-transparent before:to-black/5
                          before:pointer-events-none relative overflow-hidden"
               style={{ padding: '12px' }}
               tabIndex={0}
               role="button"
               aria-label={`총 ${user.wins || 0}승 달성`}>
            <div className="flex items-center justify-center gap-2 relative z-10">
              <Trophy className="w-5 h-5 text-green-400 drop-shadow-sm" />
              <span className="text-green-300 whitespace-nowrap drop-shadow-sm" style={{ fontSize: '13px' }}>승리</span>
              <div className="text-green-400 font-bold whitespace-nowrap drop-shadow-sm" style={{ fontSize: '16px' }}>{user.wins || 0}</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-400/30 
                          rounded-xl text-center focus-within:ring-2 focus-within:ring-blue-400/50
                          shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]
                          transform hover:scale-[1.02] transition-all duration-300 ease-out
                          before:content-[''] before:absolute before:inset-0 before:rounded-xl
                          before:bg-gradient-to-br before:from-white/10 before:via-transparent before:to-black/5
                          before:pointer-events-none relative overflow-hidden"
               style={{ padding: '12px' }}
               tabIndex={0}
               role="button"
               aria-label={`${user.completedMissions || 0}개 미션 완료`}>
            <div className="flex items-center justify-center gap-2 relative z-10">
              <Gift className="w-5 h-5 text-blue-400 drop-shadow-sm" />
              <span className="text-blue-300 whitespace-nowrap drop-shadow-sm" style={{ fontSize: '13px' }}>미션완료</span>
              <div className="text-blue-400 font-bold whitespace-nowrap drop-shadow-sm" style={{ fontSize: '16px' }}>{user.completedMissions || 0}</div>
            </div>
          </div>
        </div>

        {/* 연속 출석 보상 - 데일리 모달과 동일한 패딩 */}
        {(user.loginStreak || 0) >= 7 && (
          <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/20 border-2 border-purple-400/40 
                          rounded-xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
              {(user.loginStreak || 0) % 7 === 0 ? (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-lg font-bold text-green-300">
                      {user.loginStreak}일 연속 출석 달성! 🎉
                    </span>
                  </div>
                  <button 
                    onClick={handleClaimReward}
                    className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 
                               text-white font-bold rounded-lg hover:from-green-500 hover:to-emerald-500
                               transform hover:scale-105 active:scale-95 transition-all duration-200
                               shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <Gift className="w-5 h-5" />
                    특별 보상 받기
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-base font-medium text-purple-300 mb-2">
                    연속 출석 {user.loginStreak}일째
                  </div>
                  <div className="text-sm text-purple-200">
                    {7 - ((user.loginStreak || 0) % 7)}일 더 출석하면 특별 보상!
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 빠른 액션 버튼들 - 데일리 모달과 동일한 간격 */}
        <div className="space-y-6">
          {/* Primary Actions */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={handleChargeTokens}
              className="flex items-center justify-center gap-3 h-14 bg-gradient-to-r from-blue-600 to-purple-600 
                         text-white font-bold rounded-lg hover:from-blue-500 hover:to-purple-500
                         transform hover:scale-105 active:scale-95 transition-all duration-200
                         shadow-lg hover:shadow-xl text-base"
            >
              <Coins size={20} />
              <span>토큰 충전</span>
            </button>
            
            <button 
              onClick={handleViewRewards}
              className="flex items-center justify-center gap-3 h-14 bg-gradient-to-r from-amber-600 to-orange-600 
                         text-white font-bold rounded-lg hover:from-amber-500 hover:to-orange-500
                         transform hover:scale-105 active:scale-95 transition-all duration-200
                         shadow-lg hover:shadow-xl text-base"
            >
              <Gift size={20} />
              <span>보상 받기</span>
            </button>
          </div>
          
          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={handleViewHistory}
              className="flex items-center justify-center gap-2 h-12 bg-slate-700/50 
                         text-gray-300 font-medium rounded-lg hover:bg-slate-600/50 hover:text-white
                         transform hover:scale-105 active:scale-95 transition-all duration-200
                         border border-slate-600/30 text-base"
            >
              <Trophy size={18} />
              <span>전적 보기</span>
            </button>
            
            <button 
              onClick={handleSettings}
              className="flex items-center justify-center gap-2 h-12 bg-slate-700/50 
                         text-gray-300 font-medium rounded-lg hover:bg-slate-600/50 hover:text-white
                         transform hover:scale-105 active:scale-95 transition-all duration-200
                         border border-slate-600/30 text-base"
            >
              <Settings size={18} />
              <span>설정</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
