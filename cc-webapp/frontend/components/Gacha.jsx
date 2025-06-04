// cc-webapp/frontend/components/Gacha.jsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import EmotionFeedback from './EmotionFeedback'; // Ensure this path is correct
import useSound from 'use-sound';
import confetti from 'canvas-confetti';
import { Coins, Gift, Zap, Sparkles, Award, ShieldQuestion } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Sound files (ensure these are in public/sounds/)
const COIN_SOUND = '/sounds/coin.mp3';
const GACHA_WIN_SOUND = '/sounds/gacha_win.mp3';
const GACHA_REVEAL_SOUND = '/sounds/gacha_reveal.mp3';
const GACHA_PULL_SOUND = '/sounds/gacha_pull.mp3'; // New sound for button click (create if doesn't exist)
const ERROR_SOUND = '/sounds/failure.mp3';


// Simple coin animation component (optional, can be expanded)
const CoinAnimation = ({ active }) => { // Changed prop name for clarity
  useEffect(() => {
    if (!active) return;

    const duration = 1 * 1000; // 1 second of coin rain
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 25, spread: 360, ticks: 50, zIndex: 100, disableForReducedMotion: true, scalar: 0.8 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 30 * (timeLeft / duration); // Fewer particles over time
      // Left side burst
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.4), y: Math.random() - 0.2 }, colors: ['#FFD700', '#FFA500', '#FFBF24'] }));
      // Right side burst
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.6, 0.9), y: Math.random() - 0.2 }, colors: ['#FFD700', '#FFA500', '#FFBF24'] }));
    }, 200); // Interval for bursts

    return () => clearInterval(interval);
  }, [active]);

  return null; // This component only triggers an effect
};


export default function Gacha({ userId = 1 }) {
  const router = useRouter();
  const [isSpinning, setIsSpinning] = useState(false);
  const [feedback, setFeedback] = useState({ emotion: '', message: '' });
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
  const [showCoinRainEffect, setShowCoinRainEffect] = useState(false);
  const feedbackTimerRef = useRef(null);

  // apiClient setup (use global if available, or define per component for specific needs)
  const apiClient = axios.create({ baseURL: 'http://localhost:8000/api' });

  const [playCoinSfx] = useSound(COIN_SOUND, { volume: 0.45 });
  const [playGachaWinSfx] = useSound(GACHA_WIN_SOUND, { volume: 0.65 });
  const [playGachaRevealSfx] = useSound(GACHA_REVEAL_SOUND, { volume: 0.55 });
  const [playGachaPullSfx, { stop: stopGachaPullSfx }] = useSound(GACHA_PULL_SOUND, { volume: 0.4 });
  const [playErrorSfx] = useSound(ERROR_SOUND, { volume: 0.4 });

  useEffect(() => {
    return () => { // Cleanup timer on unmount
        if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
        stopGachaPullSfx(); // Stop any looping sounds if necessary
    };
  }, [stopGachaPullSfx]);

  const showFeedbackTemporarily = (emotion, message, duration = 5000) => {
    setFeedback({ emotion, message });
    setIsFeedbackVisible(true);
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = setTimeout(() => setIsFeedbackVisible(false), duration);
  };

  const handlePullGacha = async () => {
    setIsSpinning(true);
    setShowCoinRainEffect(false); // Reset coin animation
    playGachaPullSfx();
    // Initial feedback while processing, shorter duration
    showFeedbackTemporarily('neutral', 'Contacting the Gacha Spirits...', 2500);

    try {
      const gachaPullResponse = await apiClient.post('/gacha/pull', { user_id: userId });
      const result = gachaPullResponse.data; // Expected: {type, message?, amount?, stage?, badge_name?}

      if (!result || !result.type) {
        console.error("Invalid gacha result from server:", result);
        throw new Error("Invalid gacha result from server. Please try again.");
      }

      const actionTypeMap = {
        "COIN": "GACHA_REWARD_COIN",
        "CONTENT_UNLOCK": "GACHA_REWARD_CONTENT_UNLOCK",
        "BADGE": "GACHA_REWARD_BADGE"
      };
      const actionType = actionTypeMap[result.type] || `GACHA_REWARD_UNKNOWN_${result.type}`;

      const actionPayload = {
        user_id: userId,
        action_type: actionType,
        metadata: { ...result }, // Send the whole gacha result as metadata
        timestamp: new Date().toISOString(),
      };
      // Asynchronously log action, don't let it block UI updates for gacha result
      apiClient.post('/actions', actionPayload)
        .then(() => console.log('Gacha result action logged:', actionPayload))
        .catch(err => console.error('Failed to log gacha result action:', err));

      // Handle frontend effects based on gacha result type
      const GACHA_RESULT_MESSAGE_DURATION = 7000; // Longer duration for actual results
      if (result.type === "CONTENT_UNLOCK") {
        playGachaRevealSfx();
        confetti({ particleCount: 200, spread: 120, origin: { y: 0.3 }, zIndex: 1000, Ticks: 120, angle: 90, scalar: 1.2, colors: ['#8A2BE2', '#FF00FF', '#00FFFF', '#DA70D6'], disableForReducedMotion: true });
        showFeedbackTemporarily('happiness', result.message || `Amazing! You've won a new Content Unlock: Stage ${result.stage}! Taking you there...`, GACHA_RESULT_MESSAGE_DURATION);
        setTimeout(() => router.push('/adult_content'), 2800); // Delay for user to see message
      } else if (result.type === "COIN") {
        playCoinSfx();
        setShowCoinRainEffect(true);
        setTimeout(() => setShowCoinRainEffect(false), 2000); // Duration of coin rain effect
        showFeedbackTemporarily('happiness', result.message || `Ka-ching! You've been awarded ${result.amount} coins!`, GACHA_RESULT_MESSAGE_DURATION);
      } else if (result.type === "BADGE") {
        playGachaWinSfx();
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 }, Ticks: 100, disableForReducedMotion: true, shapes: ['star'], colors:['#FFDF00', '#FFD700', '#F0E68C'] });
        showFeedbackTemporarily('happiness', result.message || `Incredible! You've earned the special "${result.badge_name}" badge!`, GACHA_RESULT_MESSAGE_DURATION);
      } else { // Fallback for unknown types
        playGachaWinSfx(); // Generic win sound
        showFeedbackTemporarily('neutral', result.message || `You received something interesting: ${result.type}.`, GACHA_RESULT_MESSAGE_DURATION);
      }

    } catch (error) {
      console.error('Gacha pull process failed:', error);
      playErrorSfx();
      const errorMsg = error.response?.data?.detail || 'The Gacha spirits are mischievous today. Please try again.';
      showFeedbackTemporarily('frustration', errorMsg, 6000);
    } finally {
      setIsSpinning(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-800 text-white border-2 border-purple-700 rounded-xl shadow-2xl text-center max-w-md mx-auto my-4">
      {showCoinRainEffect && <CoinAnimation active={showCoinRainEffect} />}
      <div className="mb-6">
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, ease:"easeInOut" }}
        >
          <Sparkles size={48} className="mx-auto text-yellow-400 filter drop-shadow(0 0 0.5rem #FFFF00)" />
        </motion.div>
        <h2 className="text-2xl sm:text-3xl font-bold mt-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-400">
          Mystic Gacha Shrine
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">Spin for fortune, unlock secrets!</p>
      </div>

      <div className="my-6 sm:my-8 w-32 h-32 sm:w-40 sm:h-40 bg-purple-900 rounded-full mx-auto flex items-center justify-center shadow-inner border-4 border-purple-600 relative overflow-hidden">
        <AnimatePresence>
          {isSpinning ? (
            <motion.div
              key="spinning_gacha_icon"
              initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 90}}
              transition={{ duration: 0.3, ease: "circOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <ShieldQuestion size={48} className="text-yellow-300 opacity-80 animate-pulse" />
            </motion.div>
          ) : (
            <motion.div
              key="idle_gacha_icon"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Gift size={52} className="text-yellow-300 sm:text-6xl filter drop-shadow(0 0 0.3rem #FFFF99)" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.button
        onClick={handlePullGacha}
        disabled={isSpinning}
        className="w-full px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white rounded-lg hover:shadow-2xl hover:brightness-110 transition-all duration-300 ease-in-out text-lg sm:text-xl font-semibold shadow-lg disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-75"
        whileHover={{ scale: isSpinning ? 1 : 1.03 }}
        whileTap={{ scale: isSpinning ? 1 : 0.97 }}
      >
        {isSpinning ? (
          <div className="flex items-center justify-center">
            <Zap size={20} className="animate-spin mr-2" /> Processing...
          </div>
        ) : (
          'Pull Gacha (100 Coins)' // Display cost, actual deduction logic is backend's responsibility
        )}
      </motion.button>
      <div className="mt-4 sm:mt-6 min-h-[50px] sm:min-h-[60px]">
        <EmotionFeedback isVisible={isFeedbackVisible} emotion={feedback.emotion} message={feedback.message} />
      </div>
    </div>
  );
}
