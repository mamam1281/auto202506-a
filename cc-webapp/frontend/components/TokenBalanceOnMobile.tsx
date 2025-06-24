import React from 'react';
import { Diamond } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface TokenBalanceOnMobileProps {
  show?: boolean;
}

const TokenBalanceOnMobile: React.FC<TokenBalanceOnMobileProps> = ({ show = true }) => {
  const cyberTokenBalance = useSelector((state: RootState) => state.cyberToken.balance);

  if (!show) return null;

  return (
    <div className="flex items-center gap-1 min-w-0 md:hidden">
      <Diamond size={20} className="text-neon-purple-3 flex-shrink-0" />
      <span className="text-foreground text-body font-medium whitespace-nowrap">
        {cyberTokenBalance.toLocaleString()}
      </span>
    </div>
  );
};

export default TokenBalanceOnMobile;
