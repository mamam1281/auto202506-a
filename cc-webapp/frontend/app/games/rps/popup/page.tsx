'use client';

import React from 'react';
import RPSGame from '../../../../components/games/rps/RPSGame';

export default function RPSPopupPage() {
  return (
    <div className="w-full min-h-fit max-h-screen flex items-center justify-center bg-transparent p-0">
      <div className="w-full max-w-[400px] h-auto flex items-center justify-center">
        <RPSGame isPopup={true} />
      </div>
    </div>
  );
}