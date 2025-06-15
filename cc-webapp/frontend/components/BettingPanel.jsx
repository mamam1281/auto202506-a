'use client';

export default function BettingPanel({ bet, setBet, tokens, disabled }) {
  const bets = [10, 50, 100];
  return (
    <div className="flex space-x-4 my-4">
      {bets.map((b) => (
        <button
          key={b}
          disabled={disabled || tokens < b}
          onClick={() => setBet(b)}
          className={`px-4 py-2 rounded ${bet === b ? 'bg-purple-700' : 'bg-purple-600'} disabled:opacity-50`}
        >
          {b}
        </button>
      ))}
    </div>
  );
}
