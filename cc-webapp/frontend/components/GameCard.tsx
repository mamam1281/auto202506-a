import React from 'react';
import { BaseCard } from './Basecard';

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
    className="cursor-pointer hover:scale-105 transition-transform"
    onClick={onClick}
    tabIndex={0}
    role="button"
    aria-label={title}
  >
    <BaseCard className="w-full max-w-sm min-h-[400px]">
      <div className="w-full h-full flex flex-col">
        {/* Top padding to push content down to 1/3 point */}
        <div className="h-32 flex-shrink-0"></div>
        
        <div className="px-10 pb-10 flex-grow flex flex-col justify-center" style={{ gap: '1.1rem' }}>        <div className="text-center" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="mx-auto p-4 rounded-lg bg-amber-400/20 w-fit">
            {imageUrl ? (
              <img src={imageUrl} alt={title} className="w-12 h-12 object-cover rounded-lg" />
            ) : (
              <div className="w-12 h-12 flex items-center justify-center text-amber-400 text-lg font-bold">
                {imagePlaceholder}
              </div>
            )}
          </div>
          <h3 className="text-base font-medium text-white truncate">{title}</h3>
          <p className="text-sm text-gray-300">
            ⭐️ {rating} • {players}명
          </p>
        </div>
        </div>
      </div>
    </BaseCard>
  </div>
);

export default GameCard;
