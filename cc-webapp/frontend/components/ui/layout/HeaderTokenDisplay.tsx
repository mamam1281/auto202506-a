'use client';

import React from 'react';
import { Coins } from 'lucide-react';
import { cn } from '../utils/utils';

export interface HeaderTokenDisplayProps {
  /** 토큰 금액 */
  amount: number;
  /** 클릭 핸들러 (상세 정보로 이동) */
  onClick?: () => void;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * # HeaderTokenDisplay 컴포넌트
 * 
 * 헤더에 표시하기 위한 간단한 토큰 표시 컴포넌트입니다.
 * TokenBalanceWidget과 달리 헤더에 최적화된 소형 디자인입니다.
 * 
 * ## 특징
 * - **소형 디자인**: 헤더에 맞는 컴팩트한 크기
 * - **클릭 가능**: 상세 정보로 연결
 * - **반응형**: 모바일에서 숨김 처리 가능
 * 
 * @example
 * ```tsx
 * <HeaderTokenDisplay 
 *   amount={1250}
 *   onClick={() => router.push('/wallet')}
 * />
 * ```
 */
export function HeaderTokenDisplay({
  amount,
  onClick,
  className
}: HeaderTokenDisplayProps) {
  const formatAmount = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        // 기본 스타일
        "flex items-center gap-2 px-3 py-1.5 rounded-lg",
        "bg-slate-800/50 backdrop-blur-sm border border-slate-700/50",
        "text-slate-100 font-medium text-sm",
        "transition-all duration-200 ease-in-out",
        
        // 호버 효과
        "hover:bg-slate-800/80 hover:border-purple-500/30",
        "hover:shadow-lg hover:shadow-purple-500/20",
        "hover:scale-105",
        
        // 포커스 효과
        "focus:outline-none focus:ring-2 focus:ring-purple-500/40",
        
        // 반응형 - 작은 화면에서 텍스트 숨김
        "hidden sm:flex",
        
        className
      )}      type="button"
      aria-label={`토큰 잔액: ${amount}`}
    >
      <Coins className="h-5 w-5 text-yellow-400" />
      <span className="text-slate-100">
        {formatAmount(amount)}
      </span>
    </button>
  );
}

export default HeaderTokenDisplay;
