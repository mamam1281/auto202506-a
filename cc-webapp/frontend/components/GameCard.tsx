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
      <div className="w-full h-full flex flex-col items-center justify-center p-6" style={{ gap: '1.5rem' }}>
        
        {/* 이미지 영역 - 중앙에 큰 이미지 */}
        <div className="flex-shrink-0 flex items-center justify-center">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={title} 
              className="w-32 h-32 object-cover rounded-xl shadow-lg border-2 border-white/10" 
            />
          ) : (
            <div className="w-32 h-32 flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-purple-700/20 border-2 border-purple-400/30 rounded-xl shadow-lg backdrop-blur-sm">
              <span className="text-purple-400 text-4xl font-bold">
                {imagePlaceholder}
              </span>
            </div>
          )}
        </div>
        
        {/* 텍스트 정보 영역 */}
        <div className="text-center flex-shrink-0" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h3 className="text-lg font-semibold text-white leading-tight px-2">
            {title}
          </h3>
          <div className="flex items-center justify-center gap-3 text-sm">
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
