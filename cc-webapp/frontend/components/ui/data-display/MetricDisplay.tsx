// MetricDisplay.tsx - 주요 지표(아이콘+라벨+값+보조텍스트)
import React from 'react';

interface MetricDisplayProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accentText?: React.ReactNode;
  className?: string;
}

export default function MetricDisplay({ icon, label, value, accentText, className }: MetricDisplayProps) {
  return (
    <div className={`flex flex-col items-center justify-center bg-slate-800/80 rounded-xl shadow-lg p-4 min-w-[90px] ${className || ''}`}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-xs text-slate-400 mb-0.5">{label}</div>
      <div className="text-lg font-bold text-white">{value}</div>
      {accentText && <div className="text-xs text-purple-400 mt-0.5">{accentText}</div>}
    </div>
  );
}
