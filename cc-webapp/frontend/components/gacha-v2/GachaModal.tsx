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
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: '24px',
                border: `3px solid ${tierColor.border}`,
                boxShadow: `0 20px 40px rgba(0,0,0,0.3), 0 0 60px ${tierColor.glow}`,
                padding: '32px',
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
                  className="px-8 py-4 rounded-xl font-bold text-white text-lg transition-transform duration-200 hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${tierColor.color}, ${tierColor.color}CC)`,
                    boxShadow: `0 6px 20px ${tierColor.glow}`,
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
