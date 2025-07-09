'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Clock, X, ExternalLink } from 'lucide-react';
import { Button } from '../ui/basic/button';
import { Card } from '../ui/basic/card';
import { FlashOffer } from './types';

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
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="relative"
      >
        <Card className="relative overflow-hidden border-2 border-orange-500/50 bg-gradient-to-r from-orange-500/20 via-red-500/20 to-orange-500/20">
          {/* Animated background pulse */}
          <motion.div
            animate={{ 
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.02, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10"
          />

          <div className="relative p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  <Zap className="w-5 h-5 text-yellow-400" />
                </motion.div>
                <span className="text-sm text-orange-300 game-subtitle">⚡ FLASH OFFER</span>
                <div className="flex items-center gap-1 px-2 py-1 rounded bg-red-500/30 border border-red-500/50">
                  <Clock className="w-3 h-3 text-red-300" />
                  <span className="text-xs text-red-300 font-mono">{timeLeft}</span>
                </div>
              </div>
              
              {onClose && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-white"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg text-white game-subtitle mb-1">{offer.title}</h3>
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
