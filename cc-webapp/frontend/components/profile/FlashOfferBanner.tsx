'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X, Zap, ExternalLink } from 'lucide-react';
import { Card } from '../ui/basic/card';
import { Button } from '../ui/basic/button';
import type { FlashOffer } from './types';

interface FlashOfferBannerProps {
  offer: FlashOffer;
  onClose?: () => void;
  onClaim?: (offerId: string) => void;
  onVisitSite?: () => void;
}

export default function FlashOfferBanner({ offer, onClose, onClaim, onVisitSite }: FlashOfferBannerProps) {
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
        
        setTimeLeft(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      } else {
        setIsExpired(true);
        clearInterval(interval);
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
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="relative w-full"
      >
        {/* 420px 너비 최적화, 데일리 모달 스타일 통일 */}
        <div className="rounded-xl p-6 relative overflow-hidden bg-gradient-to-br from-orange-500/20 to-red-500/20 
                        backdrop-blur-sm border border-orange-500/30 shadow-lg">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-red-500/10 pointer-events-none" />
          
          {/* Close Button */}
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-4 right-4 h-8 w-8 p-0 text-white/70 hover:text-white z-10"
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          <div className="relative z-10 space-y-4">
            {/* Header with Icon and Title */}
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl 
                           flex items-center justify-center shadow-lg"
              >
                <Zap className="w-6 h-6 text-white" />
              </motion.div>
              
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white leading-tight">
                  {offer.title}
                </h3>
                <p className="text-base text-white/80 leading-tight">{offer.description}</p>
              </div>
            </div>

            {/* Price and Timer Info */}
            <div className="grid grid-cols-2 gap-3">
              {/* Timer */}
              <div className="p-3 rounded-lg bg-red-500/30 border border-red-500/50">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Clock className="w-4 h-4 text-red-300" />
                  </motion.div>
                  <span className="text-sm font-bold text-red-300">{timeLeft}</span>
                </div>
                <p className="text-xs text-red-200 mt-1">남은 시간</p>
              </div>
              
              {/* Discount */}
              <div className="p-3 rounded-lg bg-orange-500/30 border border-orange-500/50">
                <div className="text-sm font-bold text-orange-300">
                  {offer.discount}% 할인
                </div>
                <p className="text-xs text-orange-200 mt-1">{offer.highlight || '특별 혜택'}</p>
              </div>
            </div>

            {/* Price Display */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 
                            border border-green-500/30">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/60 line-through">${offer.originalPrice}</span>
                  <span className="text-xl font-bold text-green-400">${offer.salePrice}</span>
                </div>
                <p className="text-xs text-green-300">지금만 특가</p>
              </div>
              
              <Button
                onClick={() => onClaim && onClaim(offer.id)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500
                           text-white font-bold px-6 py-2 rounded-lg transform hover:scale-105 active:scale-95
                           transition-all duration-200 shadow-lg"
              >
                구매하기
              </Button>
            </div>

            {/* Visit Site Button */}
            {onVisitSite && (
              <Button
                onClick={onVisitSite}
                variant="outline"
                className="w-full h-12 border-white/20 text-white hover:bg-white/10 
                           flex items-center justify-center gap-2 rounded-lg"
              >
                <ExternalLink className="w-4 h-4" />
                더 많은 혜택 보기
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
