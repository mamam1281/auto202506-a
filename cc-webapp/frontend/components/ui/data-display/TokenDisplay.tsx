import React from "react";

interface TokenDisplayProps {
  amount: number;
  unit?: string;
  icon?: React.ReactNode;
  className?: string;
}

// 단일 토큰 값/아이콘/단위 표시, 반응형, CSS 변수 적용
export const TokenDisplay: React.FC<TokenDisplayProps> = ({ amount, unit = "CC", icon, className }) => {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--color-primary-charcoal)] text-[var(--color-text-primary)] text-base sm:text-lg md:text-xl ${className || ""}`.trim()}
      style={{
        fontFamily: "var(--font-primary)",
        boxShadow: "0 2px 8px 0 var(--color-shadow-glass)",
        backdropFilter: "blur(8px)",
      }}
    >
      {icon && <span className="mr-1">{icon}</span>}
      <span className="font-bold tabular-nums">{amount.toLocaleString()}</span>
      <span className="ml-1 opacity-80 text-xs sm:text-sm">{unit}</span>
    </span>
  );
};

export default TokenDisplay;
