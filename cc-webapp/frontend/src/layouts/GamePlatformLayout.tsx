import React from 'react';
// import { Button } from '../components/Button'; // Button 컴포넌트가 이미 구현되어 있다면 주석 해제

// "Popular Games" 섹션의 게임 카드 데이터 타입
export interface GameCardData {
  id: string;
  title: string;
  rating: number; // e.g., 4.9
  players: string; // e.g., "1.2K명" or "1.2K players"
  imageUrl?: string;
  imagePlaceholder: string; // e.g., "🎮"
  onClick?: () => void;
}

// "Quick Start" 섹션의 아이템 데이터 타입
export interface QuickStartItemData {
  id: string;
  label: string;
  iconBgColor: string; // 아이콘 배경색
  iconPlaceholder: string; // e.g., "▶️", "🏆"
  onClick?: () => void;
}

// GamePlatformLayout 컴포넌트의 props
export interface GamePlatformLayoutProps {
  welcomeMessage: string;
  subMessage: string;
  popularGames: GameCardData[];
  quickStartItems: QuickStartItemData[];
}

const GamePlatformLayout: React.FC<GamePlatformLayoutProps> = ({
  welcomeMessage,
  subMessage,
  popularGames,
  quickStartItems,
}) => {
  return (
    <div className="game-platform-layout safe-py safe-px">
      {/* Header Section */}
      <header className="layout-header mb-[--layout-gap]">
        <h1 className="layout-title heading-h1">{welcomeMessage}</h1>
        <p className="layout-subtitle text-body text-[--color-text-secondary]">{subMessage}</p>
      </header>

      {/* Popular Games Section */}
      <section className="mb-[--layout-gap]">
        <div className="flex justify-between items-center mb-4 main-section-header">
          <h2 className="heading-h2 main-section-title">🔥 Popular Games</h2>
          {/* Button 컴포넌트로 교체 필요 */}
          <button className="main-section-more-button btn btn-text btn-sm">View More</button>
        </div>
        <div className="content-grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[var(--spacing-4)]">
          {popularGames.map((game) => (
            <div
              key={game.id}
              className="game-card glassmorphism-dark hover-lift transition-all duration-200 cursor-pointer"
              onClick={game.onClick}
              style={{ height: 'var(--content-card-size, 180px)' }}
            >
              <div className="game-card-placeholder flex items-center justify-center text-4xl mb-2" style={{height: 64}}>
                {game.imageUrl ? (
                  <img src={game.imageUrl} alt={game.title} className="w-12 h-12 object-cover rounded-[--radius-lg]" />
                ) : (
                  game.imagePlaceholder
                )}
              </div>
              <h3 className="game-card-title text-body font-bold mb-1 truncate">{game.title}</h3>
              <p className="game-card-info text-caption text-[--color-text-secondary]">
                ⭐️ {game.rating} • {game.players}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Start Section */}
      <section>
        <h2 className="heading-h2 mb-4">🚀 Quick Start</h2>
        <div className="quick-start-grid content-grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[var(--spacing-3)]">
          {quickStartItems.map((item) => (
            <div
              key={item.id}
              className="quick-start-item glassmorphism-dark flex flex-col items-center justify-center gap-2 cursor-pointer hover-lift transition-all duration-200"
              style={{
                '--icon-bg': item.iconBgColor,
                height: 'var(--content-card-size, 120px)',
              } as React.CSSProperties}
              onClick={item.onClick}
            >
              <div
                className="quick-start-icon flex items-center justify-center text-3xl mb-1"
                style={{
                  background: 'var(--icon-bg)',
                  borderRadius: 'var(--radius-lg)',
                  width: 48,
                  height: 48,
                }}
              >
                {item.iconPlaceholder}
              </div>
              <span className="quick-start-label text-body font-medium text-center">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default GamePlatformLayout;
