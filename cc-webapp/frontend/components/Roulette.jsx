'use client';

import { useState, useEffect, useRef } from 'react'; // Added useRef
import EmotionFeedback from './EmotionFeedback';
import { useEmotionFeedback } from '@/hooks/useEmotionFeedback';
import useSound from 'use-sound';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react'; // Icon for wheel

const victorySoundPath = '/sounds/victory.mp3';
const failureSoundPath = '/sounds/failure.mp3';

const wheelNumbers = Array.from({ length: 37 }, (_, i) => i); // 0-36 numbers for roulette

export default function Roulette({ userId = 1 }) {
  const [feedback, setFeedback] = useState({ emotion: '', message: '' });
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
  const { fetchEmotionFeedback } = useEmotionFeedback();

  const [isSpinning, setIsSpinning] = useState(false); // Renamed from 'spinning' for consistency
  const [chosenNumber, setChosenNumber] = useState(null);
  const [winningNumber, setWinningNumber] = useState(null);
  const [rotation, setRotation] = useState(0);

  const [playVictory] = useSound(victorySoundPath, { volume: 0.5 });
  const [playFailure] = useSound(failureSoundPath, { volume: 0.5 });

  const feedbackTimerRef = useRef(null); // Use useRef for the timer ID

  useEffect(() => {
    return () => { if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current); };
  }, []); // Empty dependency array

  const showFeedbackTemporarily = (emotion, message, duration = 4000) => {
    setFeedback({ emotion, message });
    setIsFeedbackVisible(true);
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = setTimeout(() => setIsFeedbackVisible(false), duration);
  };

  const handleSpin = async () => {
    if (chosenNumber === null) {
      showFeedbackTemporarily('neutral', 'Please select a number to bet on before spinning!');
      return;
    }
    if (isSpinning) return;

    setIsSpinning(true);
    setWinningNumber(null); // Clear previous winning number
    setIsFeedbackVisible(false);
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    showFeedbackTemporarily('determination', 'Wheel is spinning... No more bets!', 3500);


    const randomSpins = Math.floor(Math.random() * 4) + 4; // 4 to 7 full spins
    // Calculate a target rotation ensuring it lands visually on a number.
    // This is tricky for a real visual wheel; for a simple display, less so.
    const landedNumber = Math.floor(Math.random() * wheelNumbers.length); // 0-36
    // Simulate rotation to roughly point to the number. For 37 numbers, each slot is ~9.7 degrees.
    // This is a visual approximation.
    const targetAngleOffset = (360 / wheelNumbers.length) * landedNumber;
    const finalRotation = (randomSpins * 360) + targetAngleOffset + (Math.random() * (360/wheelNumbers.length/2) - (360/wheelNumbers.length/4));

    setRotation(finalRotation);

    await new Promise(resolve => setTimeout(resolve, 3000)); // Spin duration

    setWinningNumber(landedNumber);
    setIsSpinning(false);

    const isWin = landedNumber === chosenNumber;
    const actionType = isWin ? "ROULETTE_WIN" : "ROULETTE_LOSE";

    try {
      const feedbackResult = await fetchEmotionFeedback(userId, actionType);
      if (feedbackResult) {
        showFeedbackTemporarily(feedbackResult.emotion, feedbackResult.message);
        if (isWin) {
          playVictory();
          confetti({ particleCount: 200, spread: 120, origin: { y: 0.4 } });
        } else {
          playFailure();
        }
      }
    } catch (error) {
      console.error("Error fetching/processing feedback:", error);
      showFeedbackTemporarily('frustration', 'Could not get feedback from server.');
      playFailure();
    }
  };

  return (
    <div className="p-6 border rounded-xl shadow-lg bg-white max-w-lg mx-auto my-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-red-600">Roulette Rush</h2>

      <motion.div
        className="w-56 h-56 rounded-full border-8 border-red-700 bg-red-600 flex items-center justify-center text-white text-4xl font-bold mx-auto mb-8 shadow-2xl relative"
        animate={{ rotate: rotation }}
        transition={{ type: "spring", stiffness: 50, damping: 15, duration: 2.8 }}
      >
        <div className="absolute top-[-10px] left-1/2 transform -translate-x-1/2 text-xl text-yellow-300">▼</div>
        {/* Displaying the target icon, or the number if landed */}
        {isSpinning ? <Target size={48} className="animate-ping" /> : (winningNumber !== null ? winningNumber : <Target size={48}/>)}
      </motion.div>


      <div className="mb-6">
        <label htmlFor="betNumberRoulette" className="block text-sm font-medium text-gray-700 mb-1">
          Place your bet (0-36):
        </label>
        <select
          id="betNumberRoulette"
          value={chosenNumber === null ? '' : chosenNumber}
          onChange={(e) => setChosenNumber(parseInt(e.target.value, 10))}
          disabled={isSpinning}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
        >
          <option value="" disabled>-- Select Number --</option>
          {wheelNumbers.map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSpin}
        disabled={isSpinning || chosenNumber === null}
        className="w-full px-6 py-4 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 shadow-lg text-lg"
      >
        {isSpinning ? 'Spinning...' : 'Spin the Wheel!'}
      </button>

      {winningNumber !== null && !isSpinning && (
        <p className={`text-2xl font-bold text-center mt-6 animate-pulse ${
          winningNumber === chosenNumber ? 'text-green-600' : 'text-red-700'
        }`}>
          {winningNumber === chosenNumber ? `🎉 Winner! Landed on ${winningNumber}! 🎉` : `Landed on ${winningNumber}. Better luck next time!`}
        </p>
      )}

      <div className="mt-6 h-24"> {/* Adjusted height */}
        <EmotionFeedback
          isVisible={isFeedbackVisible}
          emotion={feedback.emotion}
          message={feedback.message}
        />
      </div>
    </div>
  );
}
