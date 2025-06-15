'use client';
import { useState, useEffect } from 'react';
import SlotReel from './SlotReel';
import BettingPanel from './BettingPanel';
import { playSlot } from '@/services/gameApi';
import { fetchTokenBalance } from '@/services/auth';

const symbols = ['1','2','3','4','5','6','7','8','9'];

export default function SlotMachine() {
  const [spinning, setSpinning] = useState(false);
  const [reels, setReels] = useState(['1','1','1']);
  const [bet, setBet] = useState(10);
  const [tokens, setTokens] = useState(0);
  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  useEffect(() => {
    if (accessToken) {
      fetchTokenBalance(accessToken).then(setTokens).catch(() => {});
    }
  }, [accessToken]);

  const spin = async () => {
    if (!accessToken) return;
    setSpinning(true);
    try {
      const result = await playSlot(bet, accessToken);
      setReels(result.reels.map((n) => n.toString()));
      setTokens(result.remaining_tokens);
    } catch (err) {
      console.error(err);
    } finally {
      setSpinning(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow max-w-md w-full text-center">
      <div className="flex justify-center space-x-4 mb-4">
        {reels.map((s, idx) => (
          <SlotReel key={idx} index={idx} symbol={s} spinning={spinning} />
        ))}
      </div>
      <BettingPanel bet={bet} setBet={setBet} tokens={tokens} disabled={spinning} />
      <button
        onClick={spin}
        disabled={spinning || tokens < bet}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded disabled:opacity-50"
      >
        {spinning ? 'Spinning...' : 'Spin'}
      </button>
    </div>
  );
}
