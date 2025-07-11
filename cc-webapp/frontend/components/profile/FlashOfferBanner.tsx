'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X, Zap, ExternalLink, Star } from 'lucide-react';
import { Card } from '../ui/basic/card';
import { Button } from '../ui/basic/button';
import type { FlashOffer } from './types';

interface FlashOfferBannerProps {
  offer: FlashOffer;
  onClose?: () => void;
  onVisitSite?: () => void;
}

export default function FlashOfferBanner({ offer, onClose, onVisitSite }: FlashOfferBannerProps) {
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
        {/* 420px 너비 최적화, 데일리 모달 스타일 통일 - 좌우 패딩 16px로 조밀하게 */}
        <div className="rounded-xl py-5 relative overflow-hidden bg-gradient-to-br from-slate-600/20 to-slate-700/20 
                        backdrop-blur-sm border border-slate-500/30 shadow-lg"
             style={{ paddingLeft: '16px', paddingRight: '16px' }}>
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-500/10 via-transparent to-slate-700/10 pointer-events-none" />
          
          {/* Close Button - 겹침 방지를 위한 별도 위치 */}
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-3 right-3 h-7 w-7 p-0 text-white/70 hover:text-white z-20 
                         bg-black/20 hover:bg-black/40 rounded-full"
            >
              <X className="h-3 w-3" />
            </Button>
          )}

          <div className="relative z-10 space-y-5">
            {/* Header with Icon and Title - 마진 조정으로 Close 버튼과 겹침 방지 */}
            <div className="flex items-center gap-4 pr-10">
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-11 h-11 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl 
                           flex items-center justify-center shadow-lg flex-shrink-0"
              >
                <Zap className="w-5 h-5 text-white" />
              </motion.div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white leading-tight mb-1 whitespace-nowrap overflow-hidden text-ellipsis">
                  {offer.title}
                </h3>
                <p className="text-base text-white/80 leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                  {offer.description}
                </p>
              </div>
            </div>

            {/* Price and Timer Info - 간격 조정 */}
            <div className="grid grid-cols-2 gap-4">
              {/* Timer - 수직 배열 */}
              <div className="p-3 rounded-lg bg-slate-700/30 border border-slate-600/50 flex flex-col items-center text-center space-y-2">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-8 h-8 bg-slate-600/50 rounded-full flex items-center justify-center"
                >
                  <Clock className="w-4 h-4 text-slate-300" />
                </motion.div>
                <span className="text-base font-bold text-slate-300">{timeLeft}</span>
                <p className="text-sm text-slate-400">남은 시간</p>
              </div>
              
              {/* Discount */}
              <div className="p-3 rounded-lg bg-slate-600/30 border border-slate-500/50 flex flex-col items-center text-center space-y-2">
                <div className="w-8 h-8 bg-slate-500/50 rounded-full flex items-center justify-center">
                  <span className="text-lg">%</span>
                </div>
                <div className="text-base font-bold text-slate-200">
                  {offer.discount}% 할인
                </div>
                <p className="text-sm text-slate-300">{offer.highlight || '특별 혜택'}</p>
              </div>
            </div>

            {/* Visit Official Site Display - 고급화된 본사카드 */}
            <div className="relative p-5 rounded-xl overflow-hidden
                            bg-gradient-to-br from-slate-700/40 via-slate-600/30 to-slate-500/40
                            border-2 border-slate-400/40 shadow-2xl
                            backdrop-blur-sm">
              {/* 고급 배경 효과 */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 pointer-events-none" />
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-slate-300/20 to-transparent rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-slate-400/15 to-transparent rounded-full blur-xl" />
              
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-bold text-slate-100 tracking-wide">본사 사이트</span>
                                      </div>
                    <p className="text-sm text-slate-300 font-medium">더 많은 혜택확인!</p>
                  </div>
                </div>
                
                <Button
                  onClick={onVisitSite}
                  className="w-full h-12 relative overflow-hidden
                             bg-gradient-to-r from-slate-600/90 via-slate-500/80 to-slate-400/90
                             hover:from-slate-500/90 hover:via-slate-400/80 hover:to-slate-300/90
                             border-2 border-slate-400/50 hover:border-slate-300/60
                             text-white font-bold rounded-lg
                             shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_25px_rgba(0,0,0,0.4)]
                             transform hover:scale-[1.02] active:scale-[0.98]
                             transition-all duration-300 ease-out
                             flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-sm font-bold tracking-wide">바로가기</span>
                  
                  {/* 내부 하이라이트 효과 */}
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                </Button>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
