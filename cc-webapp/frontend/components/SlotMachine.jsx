'use client';

import { useState, useEffect } from 'react';
import EmotionFeedback from './EmotionFeedback';
import { useEmotionFeedback } from '@/hooks/useEmotionFeedback'; // Adjust path if using @ alias
import useSound from 'use-sound';
import confetti from 'canvas-confetti';

// Dummy sound file paths (ensure these exist in public/sounds/)
const victorySoundPath = '/sounds/victory.mp3';
const failureSoundPath = '/sounds/failure.mp3';

export default function SlotMachine({ userId = 1 }) {
  const [feedback, setFeedback] = useState({ emotion: '', message: '' });
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
  const { fetchEmotionFeedback } = useEmotionFeedback();

  const [playVictory] = useSound(victorySoundPath, { volume: 0.5 });
  const [playFailure] = useSound(failureSoundPath, { volume: 0.5 });

  // Timer ID for clearing feedback
  let feedbackTimer = null;

  useEffect(() => {
    // Cleanup timer on component unmount
    return () => {
      if (feedbackTimer) {
        clearTimeout(feedbackTimer);
      }
    };
  }, [feedbackTimer]);

  const showFeedbackTemporarily = (emotion, message, duration = 5000) => {
    setFeedback({ emotion, message });
    setIsFeedbackVisible(true);

    if (feedbackTimer) {
      clearTimeout(feedbackTimer);
    }
    // Store timer ID to clear if another feedback comes in or component unmounts
    // Type casting to any to avoid TS errors with NodeJS.Timeout vs number
    feedbackTimer = setTimeout(() => {
      setIsFeedbackVisible(false);
      // Optionally clear the message too, or leave it to be replaced by next feedback
      // setFeedback({ emotion: '', message: '' });
    }, duration) as any;
  };

  const handleSpin = async () => {
    setIsFeedbackVisible(false); // Hide previous feedback immediately
    if (feedbackTimer) clearTimeout(feedbackTimer); // Clear pending timeout

    const isWin = Math.random() < 0.3; // 30% chance to win for slots
    const actionType = isWin ? "SLOT_WIN" : "SLOT_LOSE";

    try {
      const feedbackResult = await fetchEmotionFeedback(userId, actionType);
      if (feedbackResult) {
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
      showFeedbackTemporarily('frustration', 'Could not connect to feedback service.');
      playFailure();
    }
  };

  // Helper for confetti variety
  const randomRange = (min, max) => Math.random() * (max - min) + min;

  return (
    <div className="p-6 border rounded-xl shadow-lg bg-white max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Slot Machine</h2>
      <div className="text-5xl mb-6 p-8 bg-gray-100 rounded-lg text-center shadow-inner">
        🎰 <span className="animate-pulse">🤔</span> 🎰
      </div>

      <button
        onClick={handleSpin}
        className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-md active:bg-indigo-800"
      >
        Spin to Win!
      </button>

      <div className="mt-6 h-20"> {/* Fixed height container for feedback to prevent layout shifts */}
        <EmotionFeedback
          isVisible={isFeedbackVisible}
          emotion={feedback.emotion}
          message={feedback.message}
        />
      </div>
    </div>
  );
}
