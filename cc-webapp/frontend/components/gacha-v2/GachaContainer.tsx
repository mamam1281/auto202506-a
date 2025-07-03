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
      className="h-screen flex flex-col items-center p-4"
      style={{
        background: 'linear-gradient(135deg, #0f766e 0%, #065f46 100%)',
        maxHeight: '750px',
        maxWidth: '400px',
        margin: '0 auto',
        gap: '15px',
      }}
    >
      {/* Ticket Display */}
      <div 
        className="px-2 py-2 rounded-xl flex items-center gap-1 justify-center"
        style={{
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 0 rgba(0, 0, 0, 0.1)',
        }}
      >
        <span className="text-2xl drop-shadow-lg">🎫</span>
        <span className="text-white font-bold drop-shadow-md" style={{fontSize: '18px'}}>{tickets}</span>
      </div>

      {/* Gacha Box */}
      <div 
        className="w-full flex flex-col items-center justify-center px-4 py-4 rounded-3xl text-center"
        style={{
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.2), inset 0 2px 0 rgba(255, 255, 255, 0.4), inset 0 -2px 0 rgba(0, 0, 0, 0.1)',
          transform: isPlaying ? 'scale(1.02)' : 'scale(1)',
          transition: 'transform 0.3s ease-out',
          maxWidth: '310px',
          height: '250px',
        }}
      >
        <div 
          className={`text-8xl mb-3 transition-all duration-500 ${isPlaying ? 'animate-bounce scale-110' : ''}`}
          style={{
            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
          }}
        >
          📦
        </div>
        <h2 className="text-white text-xl font-bold mb-1 drop-shadow-lg">가챠 상자</h2>
        <p className="text-white/80 text-xs drop-shadow-md">신비로운 아이템을 획득하세요!</p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3 w-full">
        <button
          onClick={handlePull}
          disabled={tickets <= 0 || isPlaying}
          className="w-full h-8 rounded-lg font-bold text-white text-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100"
          style={{
            background: tickets > 0 && !isPlaying 
              ? 'linear-gradient(145deg, #10b981 0%, #059669 50%, #047857 100%)'
              : 'linear-gradient(145deg, #6b7280 0%, #4b5563 100%)',
            boxShadow: tickets > 0 && !isPlaying 
              ? '0 6px 20px rgba(16, 185, 129, 0.3), 0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.1)'
              : '0 3px 12px rgba(107, 114, 128, 0.25), inset 0 1px 0 rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderTop: '1px solid rgba(255,255,255,0.3)',
          }}
        >
          {isPlaying ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              뽑는 중...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl drop-shadow-lg">🎰</span>
              가챠 뽑기
            </div>
          )}
        </button>

        <button
          onClick={handleRecharge}
          className="h-8 rounded-lg font-semibold text-white text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] mx-auto px-4"
          style={{
            background: 'linear-gradient(145deg,rgb(58, 50, 34) 0%,rgb(156, 88, 11) 50%, #b45309 100%)',
            boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3), 0 1px 6px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderTop: '1px solid rgba(255,255,255,0.3)',
            width: 'fit-content',
          }}
        >
          <div className="flex items-center justify-center gap-1">
            <span className="text-sm">⚡</span>
            티켓 충전
          </div>
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
