// cc-webapp/frontend/app/roulette/page.tsx
'use client';

import React from 'react';
import GameLayout from '../../layouts/GameLayout'; // Using the new GameLayout
import RouletteWheel from '../../components/games/RouletteWheel'; // Using the new RouletteWheel component
import { Metadata } from 'next'; // For potential future metadata if this becomes a server component or for consistency

// If this page were a Server Component, metadata would be exported like this:
// export const metadata: Metadata = {
//   title: 'Cyber Roulette - Neon Spin',
//   description: 'Try your luck at the Cyber Roulette wheel!',
// };

export default function RoulettePage() {
  // The GameLayout will provide the AppHeader.
  // Specific game title or other info could be passed to GameLayout or set via context if needed.

  return (
    <GameLayout>
      <div className="flex flex-col items-center justify-center w-full h-full">
        {/*
          The RouletteWheel component itself will define its max width and internal structure.
          This div ensures it's centered within the GameLayout's main content area.
        */}
        <RouletteWheel minBet={10} />
      </div>
    </GameLayout>
  );
}
