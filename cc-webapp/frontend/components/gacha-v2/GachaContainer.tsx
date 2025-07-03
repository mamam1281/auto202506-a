'use client';

import { useState } from 'react';
import { GachaResult, SAMPLE_ITEMS, GachaItem } from './types';
import { GachaModal } from './GachaModal';

export function GachaContainer() {
  const [tickets, setTickets] = useState(5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState<GachaResult | null>(null);

  const performGacha = (): GachaItem => {
    const random = Math.random() * 100;
    let cumulativeProbability = 0;

    for (const item of SAMPLE_ITEMS) {
      cumulativeProbability += item.probability;
      if (random <= cumulativeProbability) {
        return item;
      }
    }

    return SAMPLE_ITEMS[0]; // fallback
  };

  const handlePull = async () => {
    if (tickets <= 0 || isPlaying) return;

    setIsPlaying(true);
    setTickets(prev => prev - 1);

    // 애니메이션 시간
    await new Promise(resolve => setTimeout(resolve, 1500));

    const item = performGacha();
    const gachaResult: GachaResult = {
      item,
      isNew: Math.random() > 0.7 // 30% chance for new
    };

    setResult(gachaResult);
    setShowModal(true);
    setIsPlaying(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setResult(null);
  };

  const handleRecharge = () => {
    setTickets(prev => prev + 10);
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #0f766e 0%, #065f46 100%)',
      }}
    >
      {/* Ticket Display */}
      <div 
        className="mb-8 px-6 py-3 rounded-2xl flex items-center gap-3"
        style={{
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }}
      >
        <span className="text-2xl">🎫</span>
        <span className="text-white font-bold text-lg">{tickets}</span>
      </div>

      {/* Gacha Box */}
      <div 
        className="mb-8 p-8 rounded-3xl text-center"
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          width: '100%',
          maxWidth: '400px',
        }}
      >
        <div className={`text-8xl mb-6 transition-transform duration-500 ${isPlaying ? 'animate-bounce' : ''}`}>
          📦
        </div>
        <h2 className="text-white text-2xl font-bold mb-2">가챠 상자</h2>
        <p className="text-white/80 text-sm">신비로운 아이템을 획득하세요!</p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={handlePull}
          disabled={tickets <= 0 || isPlaying}
          className="px-8 py-4 rounded-xl font-bold text-white text-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{
            background: tickets > 0 && !isPlaying 
              ? 'linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)'
              : '#6b7280',
            boxShadow: tickets > 0 && !isPlaying 
              ? '0 6px 20px rgba(20, 184, 166, 0.4)'
              : 'none',
          }}
        >
          {isPlaying ? '뽑는 중...' : '가챠 뽑기'}
        </button>

        <button
          onClick={handleRecharge}
          className="px-8 py-3 rounded-xl font-semibold text-white text-base transition-all duration-200 hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            boxShadow: '0 4px 16px rgba(245, 158, 11, 0.4)',
          }}
        >
          티켓 충전 (+10)
        </button>
      </div>

      {/* Modal */}
      <GachaModal
        isOpen={showModal}
        result={result}
        onClose={handleCloseModal}
      />
    </div>
  );
}
