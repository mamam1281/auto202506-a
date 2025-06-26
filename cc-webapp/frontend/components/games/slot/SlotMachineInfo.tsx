'use client';

import React from 'react';
import GameFooter from './GameFooter';

interface SlotMachineInfoProps {
  className?: string;
}

export const SlotMachineInfo: React.FC<SlotMachineInfoProps> = ({
  className = '',
}) => {
  return (
    <div className={`w-full bg-gradient-to-br from-[var(--color-surface-primary)] to-[var(--color-surface-secondary)] rounded-2xl border border-[var(--color-border-primary)] shadow-2xl py-[15px] px-8 sm:px-12 mx-auto ${className}`}>
      <div className="w-full flex justify-center">
        <GameFooter />
      </div>
    </div>
  );
};

export default SlotMachineInfo;
