'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { GachaContainer } from './GachaContainer';
import { PullButton } from './PullButton';
import { TicketCounter } from './TicketCounter';
import { ResultModal } from './ResultModal';
import {
  GachaState,
  GachaResult,
  TIER_CONFIG,
  SAMPLE_ITEMS,
  PITY_MAX_PULLS,
  GachaTier
} from '../../../types/gacha';
import { useTickets } from '../../../contexts/gacha/TicketContext';
import { cn } from '../../utils/cn';

interface GachaBoxProps {
  className?: string;
  // Props for API endpoints will be added later if needed for actual integration
  // For now, using mock functions and console logs
}

// Local storage key for pity count
const PITY_COUNT_STORAGE_KEY = 'gachaPityCount';

export function GachaBox({ className = '' }: GachaBoxProps) {
  const { state: ticketState, spendTicket } = useTickets();
  const [gachaState, setGachaState] = useState<GachaState>('ready');
  const [currentResult, setCurrentResult] = useState<GachaResult | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);

  // Pity counter state - managed locally for simulation
  const [pityCount, setPityCount] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const savedPity = localStorage.getItem(PITY_COUNT_STORAGE_KEY);
      return savedPity ? parseInt(savedPity, 10) : 0;
    }
    return 0;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(PITY_COUNT_STORAGE_KEY, pityCount.toString());
    }
  }, [pityCount]);

  const mockGachaPull = useCallback(async (): Promise<GachaResult> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500)); // Shorter delay for pulling animation itself

    let selectedTier: GachaTier = 'common';
    let itemFromPity = false;

    // Pity System Logic
    if (pityCount >= PITY_MAX_PULLS -1) { // -1 because current pull is the 90th
      selectedTier = 'legendary';
      itemFromPity = true;
      console.log("PITY SYSTEM TRIGGERED! Guaranteed Legendary!");
    } else {
      const random = Math.random() * 100;
      let cumulativeProbability = 0;
      const tiers = Object.keys(TIER_CONFIG) as GachaTier[];

      for (const tier of tiers) {
        cumulativeProbability += TIER_CONFIG[tier].probability;
        if (random <= cumulativeProbability) {
          selectedTier = tier;
          break;
        }
      }
    }

    const itemsOfTier = SAMPLE_ITEMS.filter(item => item.tier === selectedTier);
    if (itemsOfTier.length === 0) { // Fallback if no items for a tier (should not happen with good config)
        console.warn(`No items found for tier: ${selectedTier}. Defaulting to common.`);
        const commonItems = SAMPLE_ITEMS.filter(item => item.tier === 'common');
        const fallbackItem = commonItems[Math.floor(Math.random() * commonItems.length)] || SAMPLE_ITEMS[0];
         return {
            ...fallbackItem,
            id: Date.now().toString(),
        };
    }

    const selectedItem = itemsOfTier[Math.floor(Math.random() * itemsOfTier.length)];

    const result: GachaResult = {
      ...selectedItem,
      id: Date.now().toString(),
    };

    // Mock Action Logging
    console.log('[ACTION LOG] Gacha Pull Initiated. User:', 'currentUser', 'Result:', result);
    // Mock Emotional Feedback Trigger
    console.log('[EMOTIONAL FEEDBACK] Analyzing result for feedback. Tier:', result.tier);
    if (result.tier === 'legendary' || result.tier === 'epic') {
      console.log('[EMOTIONAL FEEDBACK] High tier item! Generating excited feedback.');
    }

    // Update pity count
    if (itemFromPity || result.tier === 'legendary') {
      setPityCount(0); // Reset pity if legendary obtained (either by pity or luck)
    } else {
      setPityCount(prev => prev + 1);
    }

    return result;
  }, [pityCount]);

  const handlePull = async () => {
    if (gachaState !== 'ready' || ticketState.count < 1) return;

    setGachaState('pulling');

    const ticketSpent = spendTicket(); // Consume ticket from context
    if (!ticketSpent) {
      console.warn("Failed to spend ticket, likely due to race condition or context issue.");
      setGachaState('ready');
      return;
    }

    try {
      const result = await mockGachaPull();
      setCurrentResult(result);

      // Wait for pulling animation to mostly complete before transitioning to reveal
      await new Promise(resolve => setTimeout(resolve, 1000)); // Duration of GachaContainer pulling animation is ~2.5s

      setGachaState('reveal');

      // Show modal after a short delay for reveal animation to start
      setTimeout(() => {
        setShowResultModal(true);
      }, 800); // Allow GachaContainer reveal animation to play a bit

    } catch (error) {
      console.error('Gacha pull failed:', error);
      // TODO: Potentially refund ticket if API call failed after deduction
      setGachaState('ready');
    }
  };

  const handleCloseModal = () => {
    setShowResultModal(false);
    // currentResult is not reset immediately to allow modal exit animation
    setTimeout(() => {
        setCurrentResult(null);
        setGachaState('ready');
    }, 300); // Match modal exit animation duration
  };

  return (
    <div className={cn('w-full max-w-lg mx-auto p-4 sm:p-6 rounded-2xl', className)}>
      {/* Ticket Counter is displayed above GachaBox */}
      <motion.div
        className="flex justify-center mb-4 sm:mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <TicketCounter />
      </motion.div>

      {/* Gacha Container */}
      <motion.div
        className="mb-6 sm:mb-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
      >
        <GachaContainer
          state={gachaState}
          tier={currentResult?.tier}
        />
      </motion.div>

      {/* Pull Button */}
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
      >
        <PullButton
          state={gachaState}
          tickets={ticketState.count}
          onPull={handlePull}
          className="w-full max-w-xs sm:max-w-sm" // Constrain button width
        />
      </motion.div>

      {/* Result Modal */}
      <ResultModal
        isOpen={showResultModal}
        result={currentResult}
        onClose={handleCloseModal}
      />
       {/* Pity Counter Display (for debugging/testing) */}
       {/* <div className="text-center mt-4 text-xs text-clear-muted">Pity Count: {pityCount} / {PITY_MAX_PULLS}</div> */}
    </div>
  );
}
