'use client';

import { useState } from 'react';
import { GachaResult, SAMPLE_ITEMS, GachaItem } from './types';
import { GachaModal } from './GachaModal';
import './gacha-premium-theme.css';

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
    <div className="gacha-container">
      {/* Ticket Display */}
      <div className="gacha-tickets">
        <div className="flex items-center gap-2 justify-center">
          <span className="text-3xl drop-shadow-lg">🎫</span>
          <span className="text-white font-bold text-xl drop-shadow-md">{tickets}</span>
        </div>
      </div>

      {/* Gacha Box */}
      <div className={`gacha-box ${isPlaying ? 'playing' : ''}`}>
        <div className={`gacha-icon ${isPlaying ? 'playing' : ''}`}>
          📦
        </div>
        <h2 className="gacha-title">가챠 상자</h2>
        <p className="gacha-description">신비로운 아이템을 획득하세요!</p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3 w-full">
        <button
          onClick={handlePull}
          disabled={tickets <= 0 || isPlaying}
          className={`gacha-button gacha-pull-button ${tickets <= 0 || isPlaying ? 'disabled' : ''}`}
        >
          {isPlaying ? (
            <div className="flex items-center justify-center gap-2">
              <div className="gacha-loading"></div>
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
          className="gacha-button gacha-recharge-button mx-auto"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg">⚡</span>
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
