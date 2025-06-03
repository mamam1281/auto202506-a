'use client';

import { useState, useEffect } from 'react';
import EmotionFeedback from './EmotionFeedback';
import { useEmotionFeedback } from '@/hooks/useEmotionFeedback';
import useSound from 'use-sound';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion'; // For wheel animation

const victorySoundPath = '/sounds/victory.mp3';
const failureSoundPath = '/sounds/failure.mp3';

const wheelNumbers = Array.from({ length: 37 }, (_, i) => i); // 0-36

export default function Roulette({ userId = 1 }) {
  const [feedback, setFeedback] = useState({ emotion: '', message: '' });
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
  const { fetchEmotionFeedback } = useEmotionFeedback();

  const [spinning, setSpinning] = useState(false);
  const [chosenNumber, setChosenNumber] = useState(null); // User's bet
  const [winningNumber, setWinningNumber] = useState(null);
  const [rotation, setRotation] = useState(0); // For wheel animation

  const [playVictory] = useSound(victorySoundPath, { volume: 0.5 });
  const [playFailure] = useSound(failureSoundPath, { volume: 0.5 });

  let feedbackTimer = null;

  useEffect(() => {
    return () => { if (feedbackTimer) clearTimeout(feedbackTimer); };
  }, [feedbackTimer]);

  const showFeedbackTemporarily = (emotion, message, duration = 5000) => {
    setFeedback({ emotion, message });
    setIsFeedbackVisible(true);
    if (feedbackTimer) clearTimeout(feedbackTimer);
    feedbackTimer = setTimeout(() => setIsFeedbackVisible(false), duration) as any;
  };

  const handleSpin = async () => {
    if (chosenNumber === null) {
      showFeedbackTemporarily('neutral', 'Please pick a number to bet on first!');
      return;
    }
    setIsFeedbackVisible(false);
    if (feedbackTimer) clearTimeout(feedbackTimer);
    setSpinning(true);

    // Simulate wheel spin animation
    const randomSpins = Math.floor(Math.random() * 5) + 3; // 3 to 7 full spins
    const finalRotation = randomSpins * 360 + Math.random() * 360; // Add random partial spin
    setRotation(finalRotation);

    const landedNumber = Math.floor(Math.random() * wheelNumbers.length); // 0-36

    // Simulate delay for spin animation
    await new Promise(resolve => setTimeout(resolve, 3000)); // 3 seconds for spin

    setWinningNumber(landedNumber);
    setSpinning(false);

    const isWin = landedNumber === chosenNumber;
    const actionType = isWin ? "ROULETTE_WIN" : "ROULETTE_LOSE";

    try {
      const feedbackResult = await fetchEmotionFeedback(userId, actionType);
      if (feedbackResult) {
        showFeedbackTemporarily(feedbackResult.emotion, feedbackResult.message);
        if (isWin) {
          playVictory();
          confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
        } else {
          playFailure();
        }
      }
    } catch (error) {
      console.error("Error fetching/processing feedback:", error);
      showFeedbackTemporarily('frustration', 'Could not get feedback.');
      playFailure();
    }
  };

  return (
    <div className="p-6 border rounded-xl shadow-lg bg-white max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-red-600">Roulette</h2>

      {/* Simplified Roulette Wheel visualization */}
      <motion.div
        className="w-48 h-48 rounded-full border-8 border-red-700 bg-red-500 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-2xl"
        animate={{ rotate: rotation }}
        transition={{ duration: 2.8, ease: "circOut" }} // Slightly shorter than spin delay
      >
        {winningNumber !== null && !spinning ? winningNumber : '?'}
      </motion.div>

      <div className="mb-4">
        <label htmlFor="betNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Choose your number (0-36):
        </label>
        <select
          id="betNumber"
          value={chosenNumber === null ? '' : chosenNumber}
          onChange={(e) => setChosenNumber(parseInt(e.target.value, 10))}
          disabled={spinning}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
        >
          <option value="" disabled>Select a number</option>
          {wheelNumbers.map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSpin}
        disabled={spinning || chosenNumber === null}
        className="w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 shadow-md"
      >
        {spinning ? 'Spinning...' : 'Spin the Wheel!'}
      </button>

      {winningNumber !== null && !spinning && (
        <p className={`text-xl font-semibold text-center mt-4 ${
          winningNumber === chosenNumber ? 'text-green-500' : 'text-red-500'
        }`}>
          {winningNumber === chosenNumber ? `Congratulations! You won on ${winningNumber}!` : `Sorry, the winning number was ${winningNumber}.`}
        </p>
      )}

      <div className="mt-6 h-20">
        <EmotionFeedback
          isVisible={isFeedbackVisible}
          emotion={feedback.emotion}
          message={feedback.message}
        />
      </div>
    </div>
  );
}
