import React from 'react';

export interface GameCardProps {
  id: string;
  title: string;
  rating: number;
  players: string;
  imageUrl?: string;
  imagePlaceholder: string;
  onClick?: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  title,
  rating,
  players,
  imageUrl,
  imagePlaceholder,
  onClick,
}) => (
  <div
    className="game-card glassmorphism-dark hover-lift transition-all duration-200 cursor-pointer flex flex-col items-center justify-center p-4"
    style={{ height: 'var(--content-card-size, 180px)', minWidth: 120 }}
    onClick={onClick}
    tabIndex={0}
    role="button"
    aria-label={title}
  >
    <div className="game-card-placeholder flex items-center justify-center text-4xl mb-2" style={{height: 64}}>
      {imageUrl ? (
        <img src={imageUrl} alt={title} className="w-12 h-12 object-cover rounded-[--radius-lg]" />
      ) : (
        imagePlaceholder
      )}
    </div>
    <h3 className="game-card-title text-body font-bold mb-1 truncate text-center w-full">{title}</h3>
    <p className="game-card-info text-caption text-[--color-text-secondary] text-center">
      ⭐️ {rating} • {players}
    </p>
  </div>
);

export default GameCard;
