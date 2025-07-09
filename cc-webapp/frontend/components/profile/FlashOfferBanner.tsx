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
        <Card className="p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/30 shadow-elegant">
          {/* Close Button */}
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-2 right-2 h-6 w-6 p-0 text-white/70 hover:text-white z-10"
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          <div className="flex items-center gap-4">
            {/* Icon */}
            <div className="flex-shrink-0">
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center"
              >
                <Zap className="w-6 h-6 text-white" />
              </motion.div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white mb-1">
                {offer.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">{offer.description}</p>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="px-2 py-1 bg-red-500/30 rounded-lg"
                  >
                    <Clock className="w-4 h-4 text-red-300 inline mr-1" />
                    <span className="text-sm font-bold text-red-300">{timeLeft}</span>
                  </motion.div>
                  
                  <div className="px-2 py-1 bg-orange-500/30 rounded-lg">
                    <span className="text-sm font-bold text-orange-300">
                      {offer.discount}% 보너스
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              {onClaim && (
                <Button
                  onClick={() => onClaim(offer.id)}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold"
                  size="sm"
                >
                  지금 받기!
                </Button>
              )}
              
              {onVisitSite && (
                <Button
                  onClick={onVisitSite}
                  variant="outline"
                  size="sm"
                  className="text-orange-300 border-orange-500/50 hover:bg-orange-500/10"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  사이트 방문
                </Button>
              )}
            </div>
          </div>

          {/* Animated warning */}
          <motion.div
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="mt-3 text-xs text-red-300"
          >
            ⚠️ 시간이 지나면 사라져요! 놓치지 마세요!
          </motion.div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

// Default export for convenience
export default FlashOfferBanner;
