// cc-webapp/frontend/components/SlotMachine.jsx
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios'; // Or your apiClient
import { useEmotionFeedback } from '@/hooks/useEmotionFeedback';
import EmotionFeedback from './EmotionFeedback';
import useSound from 'use-sound';
import confetti from 'canvas-confetti';
import { Zap, Repeat, Gift, ShieldQuestion, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Sound files
const SPIN_SOUND_PATH = '/sounds/slot_spin.mp3';
const REEL_STOP_SOUND_PATH = '/sounds/reel_stop.mp3';
const VICTORY_SOUND_PATH = '/sounds/victory.mp3';
const FAILURE_SOUND_PATH = '/sounds/failure.mp3';

// Slot machine configuration
const SYMBOLS = ['🎰', '🍒', '🔔', '💎', '💰', '🎁', '⭐', '🍊', '🍋']; // Expanded symbols
const NUM_REELS = 3;
const REEL_ANIMATION_BASE_DURATION = 1000; // ms for the first reel
const REEL_STAGGER_DELAY = 250; // ms delay for each subsequent reel stop
const INDIVIDUAL_SYMBOL_ANIMATION_DURATION = 80; // ms for each symbol change during spin visual

export default function SlotMachine({ userId = 1 }) {
  const [reels, setReels] = useState(Array(NUM_REELS).fill(SYMBOLS[0]));
  const [spinning, setSpinning] = useState(false);
  const [feedback, setFeedback] = useState({ emotion: '', message: '' });
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
  const feedbackTimerRef = useRef(null);
  const reelRefs = useRef([]); // For direct DOM manipulation of reel symbols if needed for complex animation

  const apiClient = axios.create({ baseURL: 'http://localhost:8000/api' });
  const { fetchEmotionFeedback } = useEmotionFeedback();

  const [playSpinSound, { stop: stopSpinSound }] = useSound(SPIN_SOUND_PATH, { volume: 0.35, loop: true });
  const [playReelStopSound] = useSound(REEL_STOP_SOUND_PATH, { volume: 0.25 });
  const [playVictorySound] = useSound(VICTORY_SOUND_PATH, { volume: 0.5 });
  const [playFailureSound] = useSound(FAILURE_SOUND_PATH, { volume: 0.4 });

  useEffect(() => {
    reelRefs.current = reelRefs.current.slice(0, NUM_REELS); // Initialize refs array
    return () => { // Cleanup
      clearTimeout(feedbackTimerRef.current);
      if (stopSpinSound) stopSpinSound();
    };
  }, [stopSpinSound]);

  const showFeedbackTemporarily = (emotion, message, duration = 4000) => {
    setFeedback({ emotion, message });
    setIsFeedbackVisible(true);
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = setTimeout(() => setIsFeedbackVisible(false), duration);
  };

  const triggerConfetti = () => {
    confetti({ particleCount: 180, spread: 80, origin: { y: 0.55 }, zIndex: 1000, disableForReducedMotion: true, colors: ['#FFD700', '#FF69B4', '#00FFFF', '#7CFC00', '#F08080'] });
  };

  // Function to simulate one reel's spin animation
  const animateReel = useCallback((reelIndex, finalSymbol) => {
    return new Promise((resolve) => {
      const reelElement = reelRefs.current[reelIndex];
      if (!reelElement) {
        resolve(null); // Or handle error
        return;
      }

      let animationFrameId;
      let currentSymbolIndex = 0;
      const startTime = Date.now();
      const totalDuration = REEL_ANIMATION_BASE_DURATION + reelIndex * REEL_STAGGER_DELAY;

      const updateSymbol = () => {
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < totalDuration) {
          currentSymbolIndex = (currentSymbolIndex + 1) % SYMBOLS.length;
          reelElement.textContent = SYMBOLS[currentSymbolIndex];
          animationFrameId = setTimeout(updateSymbol, INDIVIDUAL_SYMBOL_ANIMATION_DURATION);
        } else {
          reelElement.textContent = finalSymbol;
          playReelStopSound();
          resolve(finalSymbol); // Resolve with the final symbol
        }
      };
      updateSymbol();
    });
  }, [playReelStopSound]); // SYMBOLS removed as it's constant here

  const handleSpin = async () => {
    if (spinning) return;

    setSpinning(true);
    setIsFeedbackVisible(false);
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    playSpinSound();

    // Initialize reels to a spinning state visually (optional, animateReel handles it)
    reelRefs.current.forEach(reel => { if(reel) reel.textContent = '🌀'; });

    try {
      // Log action to backend (optimistically)
      apiClient.post('/actions', {
        user_id: userId, action_type: "SLOT_SPIN_INITIATED",
        metadata: { machine_id: "cosmic_slots_v1" },
        timestamp: new Date().toISOString(),
      }).catch(err => console.error("Failed to log SLOT_SPIN_INITIATED action:", err));

      // Simulate backend determining the result.
      // In a real app, this would be an API call: `const result = await apiClient.post('/slots/spin', { userId });`
      // `result` would contain `{ finalSymbols: ['🍒', '🍒', '💰'], isWin: true, winType: "...", amountWon: ... }`
      // For this client-side simulation:
      const finalReelSymbols = Array(NUM_REELS).fill(null).map(() => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);

      // Animate reels to their final symbols
      const animationPromises = finalReelSymbols.map((symbol, index) => animateReel(index, symbol));
      await Promise.all(animationPromises);

      stopSpinSound(); // Stop looping spin sound after all reels have stopped
      setReels(finalReelSymbols); // Update React state with final symbols

      // Determine win/loss based on finalReelSymbols
      const isWin = finalReelSymbols.every(s => s === finalReelSymbols[0]) || // Three of a kind
                    (finalReelSymbols.filter(s => s === '💰').length >= 2); // At least two money bags
      const actionType = isWin ? "SLOT_WIN" : "SLOT_LOSE";

      // Log the outcome action
       apiClient.post('/actions', {
        user_id: userId, action_type: actionType,
        metadata: { machine_id: "cosmic_slots_v1", resultReels: finalReelSymbols },
        timestamp: new Date().toISOString(),
      }).catch(err => console.error(`Failed to log ${actionType} action:`, err));


      const feedbackResult = await fetchEmotionFeedback(userId, actionType);
      if (feedbackResult) {
        showFeedbackTemporarily(feedbackResult.emotion, feedbackResult.message);
      }

      if (isWin) {
        playVictorySound();
        triggerConfetti();
      } else {
        playFailureSound();
      }

    } catch (error) {
      console.error("Slot spin process failed:", error);
      if (stopSpinSound) stopSpinSound();
      playFailureSound();
      showFeedbackTemporarily('frustration', 'Spin encountered an issue. Please try again.');
    } finally {
      setSpinning(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-800 text-white border-2 border-purple-700 rounded-xl shadow-2xl text-center max-w-md mx-auto my-4">
      <header className="mb-6">
        <motion.div whileHover={{ scale: 1.1, transition:{type:'spring', stiffness:300} }}>
          <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-400">
            Cosmic Slots
          </h2>
        </motion.div>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">Spin to win universal treasures!</p>
      </header>

      <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-black bg-opacity-40 rounded-lg shadow-inner border border-gray-700">
        <div className="flex justify-around items-center h-20 sm:h-24 rounded-md overflow-hidden">
          {Array(NUM_REELS).fill(null).map((_, index) => (
            <div
              key={index}
              ref={el => reelRefs.current[index] = el}
              className="text-3xl sm:text-5xl w-1/3 h-full flex items-center justify-center bg-gray-700 bg-opacity-50 m-1 rounded shadow-md text-yellow-300"
              style={{ fontSize: SYMBOL_HEIGHT * 0.75 }} // Dynamic font size based on assumed symbol height
            >
              {reels[index]} {/* Initial symbol, updated by animation */}
            </div>
          ))}
        </div>
      </div>

      <motion.button
        onClick={handleSpin}
        disabled={spinning}
        className={`w-full px-6 py-3 sm:px-8 sm:py-4 text-white rounded-lg transition-all duration-300 ease-in-out text-lg sm:text-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-opacity-75
          ${spinning
            ? 'bg-gray-600 cursor-default'
            : 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 focus:ring-green-400'
          }`}
        whileHover={{ scale: spinning ? 1 : 1.04 }}
        whileTap={{ scale: spinning ? 1 : 0.96 }}
      >
        {spinning ? (
          <div className="flex items-center justify-center">
            <Repeat size={20} className="animate-spin mr-2.5" /> Spinning...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <PlayCircle size={22} className="mr-2" /> Spin Now!
          </div>
        )}
      </motion.button>

      <div className="mt-4 sm:mt-6 min-h-[50px] sm:min-h-[60px]">
        <EmotionFeedback isVisible={isFeedbackVisible} emotion={feedback.emotion} message={feedback.message} />
      </div>
    </div>
  );
}
