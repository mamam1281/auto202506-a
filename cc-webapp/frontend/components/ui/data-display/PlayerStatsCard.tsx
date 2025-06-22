// PlayerStatsCard.tsx - 플레이어 주요 스탯 카드
import React from 'react';
import ProgressBar from './ProgressBar';

interface PlayerStatsCardProps {
  money: number;
  xp: number;
  notifications: number;
  health: number;
  stamina: number;
  profileImage?: string;
}

export default function PlayerStatsCard({ money, xp, notifications, health, stamina, profileImage }: PlayerStatsCardProps) {
  return (
    <div className="flex items-center gap-4 bg-slate-800/80 rounded-2xl shadow-xl p-4">
      {profileImage && <img src={profileImage} alt="프로필" className="w-14 h-14 rounded-full object-cover border-2 border-purple-400" />}
      <div className="flex-1 grid grid-cols-2 gap-2">
        <div>
          <div className="text-xs text-slate-400">머니</div>
          <div className="font-bold text-white">{money.toLocaleString()}₩</div>
        </div>
        <div>
          <div className="text-xs text-slate-400">XP</div>
          <div className="font-bold text-white">{xp}</div>
        </div>
        <div>
          <div className="text-xs text-slate-400">알림</div>
          <div className="font-bold text-purple-400">{notifications}</div>
        </div>
        <div>
          <div className="text-xs text-slate-400">체력</div>
          <ProgressBar value={health} color="red" />
        </div>
        <div>
          <div className="text-xs text-slate-400">스태미나</div>
          <ProgressBar value={stamina} color="yellow" />
        </div>
      </div>
    </div>
  );
}
