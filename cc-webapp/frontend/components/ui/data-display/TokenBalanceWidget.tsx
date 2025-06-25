import React from "react";
import TokenDisplay from "./TokenDisplay";
import { Loader2 } from "lucide-react";

interface TokenBalanceWidgetProps {
  amount: number;
  loading?: boolean;
  criticalThreshold?: number;
  onClick?: () => void;
  className?: string;
}

// 상태: LOADING, NORMAL, CRITICAL (amount < criticalThreshold)
export const TokenBalanceWidget: React.FC<TokenBalanceWidgetProps> = ({
  amount,
  loading = false,
  criticalThreshold = 100000,
  onClick,
  className,
}) => {
  const isCritical = amount < criticalThreshold;
  return (
    <div
      className={`relative flex items-center gap-3 px-4 py-3 rounded-2xl glassmorphism border border-[var(--color-primary-purple)] shadow-lg transition-all duration-300 min-w-[180px] sm:min-w-[220px] ${isCritical ? "ring-2 ring-[var(--color-accent-amber)]" : ""} ${className || ""}`.trim()}
      style={{
        background: "var(--color-glass-ice)",
        backdropFilter: "blur(16px)",
      }}
      onClick={onClick}
    >
      {loading ? (
        <Loader2 className="animate-spin text-[var(--color-primary-purple)] w-7 h-7 mr-2" />
      ) : (
        <TokenDisplay
          amount={amount}
          icon={<span className="inline-block w-5 h-5 bg-gradient-neon rounded-full" />}
        />
      )}
      <span className="ml-auto text-xs sm:text-sm text-[var(--color-text-secondary)]" style={{fontFamily: "var(--font-primary)"}}>
        {isCritical ? "잔액 부족!" : "토큰 잔액"}
      </span>
    </div>
  );
};

export default TokenBalanceWidget;
