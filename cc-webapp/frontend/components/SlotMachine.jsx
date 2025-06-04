'use client';

import { useState, useEffect, useRef } from 'react'; // Added useRef
import EmotionFeedback from './EmotionFeedback';
import { useEmotionFeedback } from '@/hooks/useEmotionFeedback';
import useSound from 'use-sound';
import confetti from 'canvas-confetti';

const victorySoundPath = '/sounds/victory.mp3';
const failureSoundPath = '/sounds/failure.mp3';

export default function SlotMachine({ userId = 1 }) {
  const [feedback, setFeedback] = useState({ emotion: '', message: '' });
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false); // Added isSpinning state
  const { fetchEmotionFeedback } = useEmotionFeedback();

  const [playVictory, { stop: stopVictorySound }] = useSound(victorySoundPath, { volume: 0.5 });
  const [playFailure, { stop: stopFailureSound }] = useSound(failureSoundPath, { volume: 0.5 });

  const feedbackTimerRef = useRef(null); // Use useRef for the timer ID

  useEffect(() => {
    // Cleanup timer on component unmount
    return () => {
      if (feedbackTimerRef.current) {
        clearTimeout(feedbackTimerRef.current);
      }
    };
  }, []); // Empty dependency array, runs only on mount and unmount

  const showFeedbackTemporarily = (emotion, message, duration = 4000) => {
    setFeedback({ emotion, message });
    setIsFeedbackVisible(true);

    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current);
    }
    feedbackTimerRef.current = setTimeout(() => {
      setIsFeedbackVisible(false);
    }, duration);
  };

  const handleSpin = async () => {
    if (isSpinning) return; // Prevent multiple spins
    setIsSpinning(true);

    // Hide previous feedback immediately & clear its timer
    setIsFeedbackVisible(false);
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);

    showFeedbackTemporarily('determination', 'Spinning the reels...', 2000); // Initial feedback

    // Simulate game spin duration
    await new Promise(resolve => setTimeout(resolve, 1500));

    const isWin = Math.random() < 0.4; // 40% chance to win for slots
    const actionType = isWin ? "SLOT_WIN" : "SLOT_LOSE";

    try {
      const feedbackResult = await fetchEmotionFeedback(userId, actionType);
      if (feedbackResult) {
        // Override the "Spinning..." message with the actual result feedback
        showFeedbackTemporarily(feedbackResult.emotion, feedbackResult.message);
        if (isWin) {
          playVictory();
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.6 },
            drift: randomRange(-0.5, 0.5),
            angle: randomRange(45, 135),
            scalar: randomRange(0.75, 1.25),
          });
        } else {
          playFailure();
        }
      }
    } catch (error) {
      console.error("Error during spin or fetching feedback:", error);
      showFeedbackTemporarily('frustration', 'Feedback service error. Please try again.');
      playFailure(); // Play failure sound on error too
    } finally {
      setIsSpinning(false); // Reset spinning state
    }
  };

  const randomRange = (min, max) => Math.random() * (max - min) + min; // Helper for confetti

  return (
    <div className="p-6 border rounded-xl shadow-lg bg-white max-w-md mx-auto my-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Slot Machine</h2>
      <div className="text-5xl mb-6 p-8 bg-gray-100 rounded-lg text-center shadow-inner">
        {isSpinning ? '🌀🌀🌀' : '🎰 🤔 🎰'}
      </div>

      <button
        onClick={handleSpin}
        disabled={isSpinning} // Disable button while spinning
        className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-md active:bg-indigo-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isSpinning ? 'Spinning...' : 'Spin to Win!'}
      </button>

      <div className="mt-6 h-24"> {/* Adjusted height for potentially taller feedback box */}
        <EmotionFeedback
          isVisible={isFeedbackVisible}
          emotion={feedback.emotion}
          message={feedback.message}
        />
      </div>
    </div>
  );
}
