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
    className="cursor-pointer game-card-smooth transition-transform w-full"
    onClick={onClick}
    tabIndex={0}
    role="button"
    aria-label={title}
  >
    <BaseCard className="w-full h-full">
      <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6" style={{ gap: '1rem' }}>
        
        {/* 이미지 영역 - 반응형 크기 */}
        <div className="flex-shrink-0 flex items-center justify-center">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={title} 
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 object-cover rounded-xl shadow-lg border-2 border-white/10" 
            />
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-purple-700/20 border-2 border-purple-400/30 rounded-xl shadow-lg backdrop-blur-sm">
              <span className="text-purple-400 text-2xl sm:text-3xl md:text-4xl font-bold">
                {imagePlaceholder}
              </span>
            </div>
          )}
        </div>
        
        {/* 텍스트 정보 영역 - 반응형 */}
        <div className="text-center flex-shrink-0 w-full" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white leading-tight px-2 truncate">
            {title}
          </h3>
          <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm">
            <span className="flex items-center gap-1 text-amber-400 font-medium">
              ⭐️ {rating}
            </span>
            <span className="text-white/60">•</span>
            <span className="text-white/80 font-medium">
              {players}명
            </span>
          </div>
        </div>
        
      </div>
    </BaseCard>
  </div>
);

export default GameCard;
