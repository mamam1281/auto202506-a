// cc-webapp/frontend/components/Roulette.jsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; // Or your apiClient
import { useEmotionFeedback } from '@/hooks/useEmotionFeedback'; // Adjust path if needed
import EmotionFeedback from './EmotionFeedback';
import useSound from 'use-sound';
import confetti from 'canvas-confetti';
import { Zap, RotateCcw, PlayCircle, Target as PointerIcon } from 'lucide-react'; // Using Target as Pointer
import { motion, AnimatePresence } from 'framer-motion';

// Sound files
const ROULETTE_SPIN_SOUND_PATH = '/sounds/roulette_spin.mp3';
const ROULETTE_WIN_SOUND_PATH = '/sounds/victory.mp3';
const ROULETTE_LOSE_SOUND_PATH = '/sounds/failure.mp3';

// Roulette Wheel Configuration
const WHEEL_SEGMENTS = [
  { value: '10 Coins', colorClass: 'bg-red-600', type: 'COIN', amount: 10, textColor: 'text-white' },
  { value: 'Try Again!', colorClass: 'bg-gray-700', type: 'LOSE', textColor: 'text-gray-300' },
  { value: '50 Coins', colorClass: 'bg-green-600', type: 'COIN', amount: 50, textColor: 'text-white' },
  { value: 'Small Prize', colorClass: 'bg-blue-600', type: 'BADGE', badge_name: 'ROULETTE_SMALL_PRIZE', textColor: 'text-white' },
  { value: 'Jackpot!', colorClass: 'bg-yellow-500', type: 'COIN', amount: 200, textColor: 'text-yellow-900 font-bold' },
  { value: 'Nothing', colorClass: 'bg-gray-700', type: 'LOSE', textColor: 'text-gray-300' },
  { value: '25 Coins', colorClass: 'bg-purple-600', type: 'COIN', amount: 25, textColor: 'text-white' },
  { value: 'Big Prize!', colorClass: 'bg-indigo-600', type: 'BADGE', badge_name: 'ROULETTE_BIG_PRIZE', textColor: 'text-white' },
];
const NUM_WHEEL_SEGMENTS = WHEEL_SEGMENTS.length;
const SEGMENT_ANGLE_DEG = 360 / NUM_WHEEL_SEGMENTS;

export default function Roulette({ userId = 1 }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentRotationDeg, setCurrentRotationDeg] = useState(0);
  const [winningSegmentIdx, setWinningSegmentIdx] = useState(null); // Index of the winning segment

  const [feedback, setFeedback] = useState({ emotion: '', message: '' });
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
  const feedbackTimerRef = useRef(null);

  const apiClient = axios.create({ baseURL: 'http://localhost:8000/api' });
  const { fetchEmotionFeedback } = useEmotionFeedback();

  const [playSpinSound, { stop: stopSpinSound }] = useSound(ROULETTE_SPIN_SOUND_PATH, { volume: 0.45, loop: true });
  const [playWinSound] = useSound(ROULETTE_WIN_SOUND_PATH, { volume: 0.55 });
  const [playLoseSound] = useSound(ROULETTE_LOSE_SOUND_PATH, { volume: 0.45 });

  useEffect(() => {
    return () => {
      clearTimeout(feedbackTimerRef.current);
      if (stopSpinSound) stopSpinSound();
    };
  }, [stopSpinSound]);

  const showFeedbackTemporarily = (emotion, message, duration = 4500) => {
    setFeedback({ emotion, message });
    setIsFeedbackVisible(true);
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = setTimeout(() => setIsFeedbackVisible(false), duration);
  };

  const triggerConfetti = (isJackpot = false) => {
    confetti({
      particleCount: isJackpot ? 250 : 120,
      spread: isJackpot ? 100 : 70,
      origin: { y: 0.5 },
      zIndex: 1000, // Ensure confetti is above other elements
      disableForReducedMotion: true,
      angle: isJackpot ? randomRange(45,135) : 90,
      colors: isJackpot ? ['#FFD700', '#FFA500', '#FF4500', '#FF6347', '#FFFFFF'] : ['#FFD700', '#C0C0C0', '#00FFFF', '#87CEEB'],
      scalar: isJackpot ? 1.3 : 1,
      drift: randomRange(-0.5, 0.5)
    });
  };
  const randomRange = (min, max) => Math.random() * (max - min) + min;


  const handleSpin = async () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setWinningSegmentIdx(null); // Clear previous result visual
    setIsFeedbackVisible(false);
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    playSpinSound();
    showFeedbackTemporarily('determination', 'Wheel is spinning... Round and round!', 2800);

    const determinedWinningIndex = Math.floor(Math.random() * NUM_WHEEL_SEGMENTS);
    const winningSegmentData = WHEEL_SEGMENTS[determinedWinningIndex];

    const baseRotations = 5; // Number of full spins
    const randomOffsetDeg = (Math.random() - 0.5) * (SEGMENT_ANGLE_DEG * 0.8); // Stop not exactly at center of segment
    // Calculate rotation to make the start of the winning segment align with the top pointer (0 degrees)
    // If pointer is at top (0 deg), segment i (0-indexed) starts at i * SEG_ANGLE and ends at (i+1)*SEG_ANGLE.
    // To make segment i land at top, wheel needs to rotate by -(i * SEG_ANGLE + offset_within_segment)
    const targetRotationOffsetDeg = (determinedWinningIndex * SEGMENT_ANGLE_DEG) + (SEGMENT_ANGLE_DEG / 2); // Center of segment
    const finalTargetRotationDeg = (baseRotations * 360) - targetRotationOffsetDeg - randomOffsetDeg;

    // Using a new rotation value each time, not cumulative, for more predictable final position
    setCurrentRotationDeg(finalTargetRotationDeg);
    const spinAnimationDuration = 4000; // ms, should match CSS transition or motion duration

    try {
      apiClient.post('/actions', {
        user_id: userId, action_type: "ROULETTE_SPIN_INITIATED",
        metadata: { game_id: "wheel_of_fortune_v1" },
        timestamp: new Date().toISOString(),
      }).catch(err => console.error("Failed to log ROULETTE_SPIN_INITIATED:", err));

      await new Promise(resolve => setTimeout(resolve, spinAnimationDuration));
      if (stopSpinSound) stopSpinSound();
      setWinningSegmentIdx(determinedWinningIndex);

      let actionType = "ROULETTE_RESULT_NEUTRAL"; // Default action type
      let emotion = "neutral";
      let message = winningSegmentData.message || `You landed on: ${winningSegmentData.value}!`;

      if (winningSegmentData.type === 'LOSE') {
        actionType = "ROULETTE_LOSE";
        emotion = "frustration";
        message = winningSegmentData.message || `Landed on ${winningSegmentData.value}. Better luck next time!`;
        playLoseSound();
      } else { // WIN (COIN or BADGE)
        actionType = winningSegmentData.value === 'Jackpot!' ? "ROULETTE_JACKPOT" : "ROULETTE_WIN";
        emotion = winningSegmentData.value === 'Jackpot!' ? "happiness" : "happiness"; // Could be more ecstatic for jackpot

        if (winningSegmentData.type === 'COIN') {
          message = winningSegmentData.message || `Congratulations! You won ${winningSegmentData.amount} coins!`;
        } else if (winningSegmentData.type === 'BADGE') {
          message = winningSegmentData.message || `Fantastic! You earned the "${winningSegmentData.badge_name}" badge!`;
        }
        playWinSound();
        triggerConfetti(winningSegmentData.value === 'Jackpot!');
      }

      apiClient.post('/actions', {
        user_id: userId, action_type: actionType,
        metadata: { result: winningSegmentData, segment_index: determinedWinningIndex },
        timestamp: new Date().toISOString(),
      }).catch(err => console.error(`Failed to log ${actionType} outcome:`, err));

      const feedbackResult = await fetchEmotionFeedback(userId, actionType); // Mocked hook
      showFeedbackTemporarily(feedbackResult?.emotion || emotion, feedbackResult?.message || message);

    } catch (error) {
      console.error("Roulette spin process error:", error);
      if (stopSpinSound) stopSpinSound();
      playLoseSound();
      showFeedbackTemporarily('frustration', 'Spin encountered an error. Please try again.');
    } finally {
       setTimeout(() => setIsSpinning(false), 800); // Short delay before enabling button again
    }
  };

  const resetWheelAndFeedback = () => {
    setWinningSegmentIdx(null);
    setIsFeedbackVisible(false);
    // setCurrentRotationDeg(0); // Optionally reset visual rotation if not cumulative
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-800 text-white border-2 border-teal-700 rounded-xl shadow-2xl text-center max-w-sm sm:max-w-md mx-auto my-4">
      <header className="mb-6">
         <motion.div whileHover={{ y: -2, transition: { type: 'spring', stiffness: 300 } }}>
        <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-400 to-sky-400">
          Wheel of Fortune
        </h2>
        </motion.div>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">Spin the wheel for dazzling prizes!</p>
      </header>

      <div className="relative w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 mx-auto mb-6 sm:mb-8">
        <div className="absolute top-[-12px] left-1/2 transform -translate-x-1/2 z-20 p-1 bg-gray-700 rounded-full shadow-md">
          <PointerIcon size={28} className="text-red-400" />
        </div>

        <motion.div
          className="w-full h-full rounded-full border-4 border-gray-600 shadow-xl overflow-hidden relative select-none bg-gray-700"
          animate={{ rotate: currentRotationDeg }}
          transition={{ duration: 4, ease: [0.25, 0.1, 0.25, 1] }} // cubic-bezier for spin effect
        >
          {WHEEL_SEGMENTS.map((segment, index) => (
            <div
              key={index}
              className={`absolute w-1/2 h-1/2 origin-bottom-right flex items-center justify-center p-1 ${segment.colorClass}`}
              style={{
                transform: `rotate(${index * SEGMENT_ANGLE_DEG}deg) skewY(-${90 - SEGMENT_ANGLE_DEG}deg)`,
                clipPath: 'polygon(0 0, 100% 0, 100% 100%)',
              }}
            >
              <div
                style={{ transform: `skewY(${90 - SEGMENT_ANGLE_DEG}deg) rotate(${(SEGMENT_ANGLE_DEG/2) - 90}deg) translateY(-50%)`}}
                className={`transform text-xs sm:text-sm font-semibold ${segment.textColor} text-center w-[calc(100%*0.6)]`} // Adjust width for text fit
              >
                {segment.value.split(' ').map(word => <div key={word}>{word}</div>)}
              </div>
            </div>
          ))}
        </motion.div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none"> {/* Hub */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-500 rounded-full border-2 border-gray-400 shadow-inner"></div>
        </div>
      </div>

      <motion.button
        onClick={handleSpin}
        disabled={isSpinning}
        className={`w-full px-6 py-3 sm:px-8 sm:py-4 text-white rounded-lg transition-all duration-300 ease-in-out text-lg sm:text-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-opacity-75
          ${isSpinning
            ? 'bg-gray-500 cursor-default'
            : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 focus:ring-cyan-400'
          }`}
        whileHover={{ scale: isSpinning ? 1 : 1.04 }}
        whileTap={{ scale: isSpinning ? 1 : 0.96 }}
      >
        {isSpinning ? (
          <div className="flex items-center justify-center">
            <Zap size={20} className="animate-spin mr-2.5" /> Spinning...
          </div>
        ) : (
           <div className="flex items-center justify-center">
            <PlayCircle size={22} className="mr-2" /> Spin the Wheel!
          </div>
        )}
      </motion.button>

      <div className="mt-4 sm:mt-6 min-h-[50px] sm:min-h-[60px]">
        <AnimatePresence mode="wait">
          {winningSegmentIdx !== null && !isSpinning && (
            <motion.div
              key="rouletteResultDisplay"
              initial={{ opacity: 0, y:10 }}
              animate={{ opacity: 1, y:0 }}
              className="p-3 bg-gray-700 rounded-md text-center my-2 shadow"
            >
              <p className={`font-semibold ${WHEEL_SEGMENTS[winningSegmentIdx].textColor.replace("text-black", "text-yellow-300")}`}> {/* Ensure visibility on gray-700 */}
                Landed on: {WHEEL_SEGMENTS[winningSegmentIdx].value}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        <EmotionFeedback isVisible={isFeedbackVisible} emotion={feedback.emotion} message={feedback.message} />
      </div>

      {!isSpinning && winningSegmentIdx !== null && (
        <motion.button
          onClick={resetWheelAndFeedback}
          className="w-full sm:w-auto mt-2 px-4 py-2 text-xs sm:text-sm bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center justify-center mx-auto"
          whileHover={{ scale: 1.05 }}
          initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.3}}
        >
          <RotateCcw size={16} className="mr-2" /> Play Again
        </motion.button>
      )}
    </div>
  );
}
