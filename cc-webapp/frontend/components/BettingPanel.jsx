'use client';

export default function BettingPanel({ bet, setBet, balance, disabled }) {
  const bets = [10, 50, 100];

  return (
    <div className="flex justify-center space-x-2 mt-4">
      {bets.map((b) => (
        <button
          key={b}
          onClick={() => setBet(b)}
          disabled={disabled || balance < b}
          className={`px-3 py-1 rounded ${bet === b ? 'bg-blue-600' : 'bg-gray-700'} text-white disabled:opacity-40`}
        >
          {b}
        </button>
      ))}
    </div>
  );
}
