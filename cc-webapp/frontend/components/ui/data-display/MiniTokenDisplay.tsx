// MiniTokenDisplay.tsx
// AppBar 등 한 줄 상태표시용 초간단 토큰 디스플레이 (디자인 시스템 완전 준수)

'use client';
import React from 'react';
import { Coins } from 'lucide-react';

export interface MiniTokenDisplayProps {
  amount: number;
  status?: 'normal' | 'warning' | 'critical';
  className?: string;
}

export const MiniTokenDisplay: React.FC<MiniTokenDisplayProps> = ({
  amount,
  status = 'normal',
  className = ''
}) => {
  // 색상 시스템 (통합 CSS 변수 기반)
  const colorVars = {
    normal: 'var(--color-emerald-400, #34d399)',
    warning: 'var(--color-amber-400, #fbbf24)',
    critical: 'var(--color-red-400, #f87171)'
  };
  const iconColor = colorVars[status];

  // 1K, 1M 단위 포맷
  const format = (n: number) => n >= 1_000_000 ? (n/1_000_000).toFixed(1)+'M' : n >= 1_000 ? (n/1_000).toFixed(1)+'K' : n.toLocaleString();

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-sm font-bold bg-slate-800/70 shadow-sm border border-slate-700 select-none ${className}`}
      style={{
        color: iconColor,
        background: 'var(--color-slate-800, #1e293b)',
        borderColor: 'var(--color-slate-700, #334155)',
        boxShadow: `0 0 8px 0 ${iconColor}22`,
        minWidth: 0,
        lineHeight: 1.2
      }}
      aria-label={`토큰 ${format(amount)}개`}
    >
      <Coins size={16} style={{ color: iconColor, flexShrink: 0 }} />
      <span style={{ color: 'inherit', fontWeight: 700 }}>{format(amount)}</span>
    </span>
  );
};

export default MiniTokenDisplay;
