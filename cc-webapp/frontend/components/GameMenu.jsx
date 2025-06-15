'use client';
import Link from 'next/link';

export default function GameMenu() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 w-full max-w-2xl mx-auto">
      <Link href="/slot" className="bg-gray-800 p-6 rounded-lg text-center shadow hover:bg-gray-700">
        Slot Machine
      </Link>
      <Link href="/roulette" className="bg-gray-800 p-6 rounded-lg text-center shadow hover:bg-gray-700">
        Roulette
      </Link>
      <Link href="/gacha" className="bg-gray-800 p-6 rounded-lg text-center shadow hover:bg-gray-700">
        Gacha
      </Link>
    </div>
  );
}
