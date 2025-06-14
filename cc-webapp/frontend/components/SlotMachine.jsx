'use client';

import { useState, useEffect } from 'react';
import SlotReel from './SlotReel';
import BettingPanel from './BettingPanel';
import { playSlot } from '@/services/gameApi';
import '@/styles/slot-animations.css';

const SYMBOLS = ['🍒', '🍋', '🔔', '7'];

export default function SlotMachine({ token }) {
  const [reels, setReels] = useState(['🍒', '🍒', '🍒']);
  const [spinning, setSpinning] = useState(false);
  const [bet, setBet] = useState(10);
  const [balance, setBalance] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // fetch balance when component mounts using TokenDisplay component separately
  }, []);

  const spin = async () => {
    if (spinning) return;
    setSpinning(true);
    setMessage('');
    try {
      const data = await playSlot(token, bet);
      const { reels: r, payout, remaining_tokens, is_winner } = data.result;
      setReels(r.map((n) => SYMBOLS[n % SYMBOLS.length]));
      setBalance(remaining_tokens);
      if (is_winner) {
        setMessage(`You won ${payout}!`);
      } else {
        setMessage('Try again');
      }
    } catch (err) {
      setMessage('Error');
    } finally {
      setSpinning(false);
    }
  };

  return (
    <div className="text-center p-4 bg-gray-800 rounded-lg shadow-lg">
      <div className="flex justify-center space-x-2 mb-4">
        {reels.map((s, i) => (
          <SlotReel key={i} symbol={s} spinning={spinning} />
        ))}
      </div>
      <BettingPanel bet={bet} setBet={setBet} balance={balance} disabled={spinning} />
      <button
        onClick={spin}
        disabled={spinning}
        className="mt-4 px-4 py-2 bg-green-600 rounded text-white disabled:opacity-50"
      >
        {spinning ? 'Spinning...' : 'Spin'}
      </button>
      {message && <p className="mt-2 text-yellow-400">{message}</p>}
    </div>
  );
}
