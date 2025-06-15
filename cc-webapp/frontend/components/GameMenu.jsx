'use client';

import Link from 'next/link';

export default function GameMenu() {
  const games = [
    { name: 'Slot', path: '/slot' },
    { name: 'Roulette', path: '/roulette' },
    { name: 'Gacha', path: '/gacha' },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mt-6">
      {games.map((g) => (
        <Link key={g.name} href={g.path} className="bg-gray-700 text-center p-4 rounded-lg text-white hover:bg-gray-600">
          {g.name}
        </Link>
      ))}
    </div>
  );
}
