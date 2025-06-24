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
}) => (  <div
    className="game-card glassmorphism-dark hover-lift transition-all duration-normal cursor-pointer"
    onClick={onClick}
    tabIndex={0}
    role="button"
    aria-label={title}
  >    <div className="game-card-placeholder">
      {imageUrl ? (
        <img src={imageUrl} alt={title} className="w-[var(--icon-lg)] h-[var(--icon-lg)] object-cover rounded-lg" />
      ) : (
        imagePlaceholder
      )}
    </div>
    <h3 className="game-card-title truncate">{title}</h3>
    <p className="game-card-info">
      ⭐️ {rating} • {players}
    </p>
  </div>
);

export default GameCard;
