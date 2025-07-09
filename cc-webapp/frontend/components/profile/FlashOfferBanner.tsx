'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FlashOffer } from './types';

interface FlashOfferBannerProps {
  offer: FlashOffer;
  onClose?: () => void;
  onClaim?: (offerId: string) => void;
  onVisitSite?: () => void;
}

export function FlashOfferBanner({ offer, onClose, onClaim, onVisitSite }: FlashOfferBannerProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const endTime = new Date(offer.endTime).getTime();
      const difference = endTime - now;

      if (difference > 0) {
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}시간 ${minutes}분 ${seconds}초`);
      } else {
        setIsExpired(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [offer.endTime]);

  if (isExpired || !offer.isActive) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="relative w-full p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl border border-orange-500/30"
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-orange-300">{offer.title}</h3>
          {onClose && (
            <button onClick={onClose} className="text-white/60 hover:text-white">
              ×
            </button>
          )}
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">
              {offer.salePrice.toLocaleString()}원
            </span>
            <span className="text-sm line-through text-white/60">
              {offer.originalPrice.toLocaleString()}원
            </span>
            <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
              {offer.discountPercent}% 할인
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-yellow-400 text-sm font-medium">
            ⏰ {timeLeft} 남음
          </span>
          
          <div className="flex gap-2">
            {onClaim && (
              <button
                onClick={() => onClaim(offer.id)}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
              >
                구매하기
              </button>
            )}
            {onVisitSite && (
              <button
                onClick={onVisitSite}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
              >
                사이트 방문
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
    <p className="text-sm text-muted-foreground mb-2">{offer.description}</p>
               
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground line-through">
                      {offer.originalPrice}💎
                    </span>
                    <span className="text-lg text-orange-300 game-subtitle">
                      {offer.discountPrice}💎
                    </span>
                    <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs border border-green-500/30">
                      -{offer.discount}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 ml-4">
                <Button
                  onClick={() => onClaim?.(offer.id)}
                  className="h-10 bg-orange-500 hover:bg-orange-600 text-white border-0 shadow-button"
                >
                  지금 받기
                </Button>
                
                <Button
                  onClick={onVisitSite}
                  variant="outline"
                  size="sm"
                  className="text-xs text-orange-300 border-orange-500/30 hover:bg-orange-500/10"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  본사 사이트
                </Button>
              </div>
            </div>

            {/* Urgency text */}
            <motion.div
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="mt-3 text-xs text-red-300"
            >
              ⚠️ 시간이 지나면 사라져요! 놓치지 마세요!
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
