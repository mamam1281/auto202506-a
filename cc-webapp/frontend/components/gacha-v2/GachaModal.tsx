'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GachaResult, TIER_COLORS } from './types';

interface GachaModalProps {
  isOpen: boolean;
  result: GachaResult | null;
  onClose: () => void;
}

export function GachaModal({ isOpen, result, onClose }: GachaModalProps) {
  if (!result) return null;

  const tierColor = TIER_COLORS[result.item.tier];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998]"
            style={{ background: 'rgba(0, 0, 0, 0.7)' }}
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 30 }}
              className="pointer-events-auto w-full max-w-sm"
              style={{
                background: `linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)`,
                backdropFilter: 'blur(25px)',
                WebkitBackdropFilter: 'blur(25px)',
                borderRadius: '24px',
                border: `3px solid ${tierColor.border}`,
                boxShadow: `
                  0 25px 50px rgba(0,0,0,0.4), 
                  0 0 80px ${tierColor.glow}, 
                  inset 0 2px 0 rgba(255,255,255,0.8),
                  inset 0 -2px 0 rgba(0,0,0,0.1)
                `,
                padding: '28px',
              }}
            >
              {/* Tier Badge */}
              <div className="flex justify-center mb-6">
                <div
                  className="px-6 py-3 rounded-full text-sm font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${tierColor.color}, ${tierColor.color}CC)`,
                    boxShadow: `0 4px 16px ${tierColor.glow}`,
                  }}
                >
                  {tierColor.name}
                </div>
              </div>

              {/* Item */}
              <div className="text-center mb-6">
                <div className="text-8xl mb-4">{result.item.emoji}</div>
                {result.isNew && (
                  <div className="inline-block px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full mb-2">
                    NEW!
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="text-center mb-8 space-y-3">
                <h3 
                  className="text-2xl font-bold"
                  style={{ color: tierColor.color }}
                >
                  {result.item.name}
                </h3>
                <p 
                  className="text-base opacity-80"
                  style={{ color: tierColor.color }}
                >
                  {result.item.description}
                </p>
              </div>

              {/* Button */}
              <div className="text-center">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-lg font-bold text-white text-sm transition-all duration-200 hover:scale-105 hover:shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${tierColor.color}, ${tierColor.color}CC)`,
                    boxShadow: `0 4px 12px ${tierColor.glow}, inset 0 1px 0 rgba(255,255,255,0.3)`,
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  확인
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
