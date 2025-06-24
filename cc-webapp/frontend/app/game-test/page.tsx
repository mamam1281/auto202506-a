import React from 'react';
import GameLayout from '../../layouts/GameLayout'; // Adjusted path

export default function GameTestPage() {
  return (
    <GameLayout>
      <div className="w-full max-w-4xl mx-auto bg-card/80 p-6 rounded-xl shadow-xl text-center flex flex-col items-center justify-center h-full">
        <h1 className="text-3xl font-bold mb-6 heading-h1 text-primary">Game Test Page</h1>
        <p className="text-xl text-foreground mb-4">
          This page is intended to use the GameLayout.
        </p>
        <p className="text-md text-muted-foreground mb-8">
          You should see an AppHeader (potentially a different one or styled for games)
          and NO Sidebar or BottomNavigationBar for an immersive experience.
        </p>
        <div className="bg-background p-8 rounded-lg shadow-inner w-full h-64 flex items-center justify-center">
          <p className="text-2xl text-accent animate-pulse">-- Actual Game Content Would Be Here --</p>
        </div>
      </div>
    </GameLayout>
  );
}
