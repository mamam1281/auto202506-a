'use client';

import { useState } from 'react';
import NewRouletteGame from '../../components/games/roulette/NewRouletteGame';

export default function GamesPage() {
  const [selectedGame, setSelectedGame] = useState<'roulette' | null>('roulette');

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* 헤더 */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(167, 139, 250, 0.2)',
          borderRadius: '16px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#f8fafc',
            margin: 0
          }}>
            🎰 Casino Games
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#cbd5e1',
            margin: '8px 0 0 0'
          }}>
            다양한 카지노 게임을 즐겨보세요
          </p>
        </div>

        {/* 게임 선택 */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(167, 139, 250, 0.2)',
          borderRadius: '16px',
          padding: '20px'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#f8fafc',
            margin: '0 0 16px 0'
          }}>
            게임 선택
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <button
              onClick={() => setSelectedGame('roulette')}
              style={{
                background: selectedGame === 'roulette' 
                  ? 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)'
                  : 'rgba(51, 65, 85, 0.6)',
                color: 'white',
                border: selectedGame === 'roulette' 
                  ? '2px solid #a78bfa' 
                  : '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              🎯 룰렛
              <span style={{ fontSize: '14px', opacity: 0.8 }}>
                12숫자 간단 룰렛
              </span>
            </button>
          </div>
        </div>

        {/* 선택된 게임 표시 */}
        {selectedGame === 'roulette' && (
          <div style={{
            background: 'rgba(30, 41, 59, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(167, 139, 250, 0.2)',
            borderRadius: '16px',
            padding: '20px'
          }}>
            <NewRouletteGame />
          </div>
        )}
      </div>
    </div>
  );
}
