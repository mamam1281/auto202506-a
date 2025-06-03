'use client';

import { useState, useEffect } from 'react';
import axios from 'axios'; // Using axios directly for API calls
import { useRouter } from 'next/navigation'; // For potential redirection
import { spinGachaClient } from '@/utils/rewardUtils'; // Client-side gacha logic
import EmotionFeedback from './EmotionFeedback';
import useSound from 'use-sound';
import confetti from 'canvas-confetti';

// Sound file paths (ensure these exist in public/sounds/)
const coinSoundPath = '/sounds/coin.mp3';
const gachaWinSoundPath = '/sounds/gacha_win.mp3';
const unlockRevealSoundPath = '/sounds/victory.mp3'; // Re-using victory for unlock reveal

export default function Gacha({ userId = 1 }) { // Default userId for now
  const router = useRouter();
  const [isSpinning, setIsSpinning] = useState(false);
  const [feedback, setFeedback] = useState({ emotion: '', message: '' });
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
  let feedbackTimer = null; // To store timer ID for setTimeout

  const [playCoinSound] = useSound(coinSoundPath, { volume: 0.6 });
  const [playGachaWinSound] = useSound(gachaWinSoundPath, { volume: 0.7 });
  const [playUnlockRevealSound] = useSound(unlockRevealSoundPath, { volume: 0.6 });

  useEffect(() => {
    // Cleanup timer on component unmount
    return () => {
      if (feedbackTimer) clearTimeout(feedbackTimer);
    };
  }, [feedbackTimer]); // Dependency array includes feedbackTimer

  const showFeedbackTemporarily = (emotion, message, duration = 6000) => {
    setFeedback({ emotion, message });
    setIsFeedbackVisible(true);
    if (feedbackTimer) clearTimeout(feedbackTimer); // Clear existing timer
    // Type casting to any for Nodejs.Timeout vs number from browser
    feedbackTimer = setTimeout(() => {
      setIsFeedbackVisible(false);
    }, duration) as any;
  };

  const handlePullGacha = async () => {
    setIsSpinning(true);
    // Initial feedback while processing
    showFeedbackTemporarily('determination', 'Spinning the Gacha... Good luck!', 3000);

    try {
      const result = await spinGachaClient(userId); // Calls client-side gacha logic

      // Log the gacha result action to the backend
      const actionPayload = {
        user_id: userId,
        action_type: `GACHA_REWARD_${result.type.toUpperCase()}`, // e.g., GACHA_REWARD_COIN, GACHA_REWARD_CONTENT_UNLOCK
        metadata: { ...result }, // Send all result details as metadata
        timestamp: new Date().toISOString(),
      };
      try {
        await axios.post('http://localhost:8000/api/actions', actionPayload);
        console.log('Gacha action logged to backend:', actionPayload);
      } catch (actionError) {
        console.error('Failed to log gacha action to backend:', actionError);
        // Non-fatal for the gacha experience itself, but should be monitored.
      }

      // Handle different types of gacha results
      if (result.type === "CONTENT_UNLOCK") {
        playGachaWinSound();
        showFeedbackTemporarily('determination', `You won a Stage ${result.stage} Unlock! Attempting to unlock now...`, 8000);

        // Short delay before attempting unlock for UX
        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
          // Call the /api/unlock endpoint to actually perform the unlock
          const unlockResponse = await axios.get(`http://localhost:8000/api/unlock?user_id=${userId}`);

          playUnlockRevealSound();
          confetti({ particleCount: 180, spread: 100, origin: { y: 0.4 } });
          showFeedbackTemporarily('happiness', `Content Unlocked: Stage ${unlockResponse.data.stage} - ${unlockResponse.data.name || ''}!`, 8000);

          // Optional: Redirect to content page after a delay
          setTimeout(() => router.push('/adult_content'), 2500);

        } catch (unlockError) {
          console.error("Failed to unlock content after gacha win:", unlockError);
          const errorMsg = unlockError.response?.data?.detail || "Could not complete the unlock process.";
          if (errorMsg.toLowerCase().includes("all stages already unlocked")) {
             showFeedbackTemporarily('neutral', "All content already unlocked! Here's some coins instead as a fallback.", 8000);
             // TODO: Optionally award fallback coins by logging another action or calling a specific endpoint.
             // For now, just a message.
          } else {
             showFeedbackTemporarily('frustration', `Unlock Error: ${errorMsg}`, 8000);
          }
        }
      } else if (result.type === "COIN") {
        playCoinSound();
        showFeedbackTemporarily('happiness', `You won ${result.amount} coins! Ka-ching!`, 6000);
        confetti({ particleCount: Math.min(result.amount, 200), angle: 60, spread: 60, origin: { x: 0 }, colors: ['#FFD700', '#FFB000', '#FBBF24'] });
        confetti({ particleCount: Math.min(result.amount, 200), angle: 120, spread: 60, origin: { x: 1 }, colors: ['#FFD700', '#FFB000', '#FBBF24'] });
      } else if (result.type === "BADGE") {
        playGachaWinSound();
        showFeedbackTemporarily('happiness', `You earned the "${result.badge_name}" badge! Impressive!`, 6000);
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 }, scalar: 1.2 });
      } else { // Should not be reached if GACHA_ITEMS_CLIENT is exhaustive
        showFeedbackTemporarily('neutral', 'An interesting item was won! Check your inventory.', 6000);
      }

    } catch (error) {
      console.error('Gacha pull process failed:', error);
      showFeedbackTemporarily('frustration', 'Gacha pull failed. Please try again later.', 6000);
    } finally {
      setIsSpinning(false);
    }
  };

  return (
    <div className="p-6 my-8 border rounded-xl shadow-2xl bg-gradient-to-br from-purple-700 via-indigo-600 to-pink-600 text-white max-w-lg mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center drop-shadow-lg">Mystic Gacha</h2>
      <p className="text-center mb-6 text-purple-200">What wonders await you?</p>
      <div className="flex justify-center mb-8">
        {/* Placeholder for Gacha visual/animation if any */}
        <div className="w-32 h-32 bg-purple-400 rounded-full flex items-center justify-center text-5xl shadow-inner animate-pulse">🔮</div>
      </div>
      <button
        onClick={handlePullGacha}
        disabled={isSpinning}
        className="w-full px-8 py-4 bg-yellow-400 text-purple-800 rounded-lg hover:bg-yellow-300 transition-all duration-150 ease-in-out text-xl font-bold shadow-xl disabled:opacity-70 disabled:bg-gray-500 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:ring-opacity-50"
      >
        {isSpinning ? 'Summoning...' : 'Pull (100 Coins)'}
      </button>
      <div className="mt-6 min-h-[60px]"> {/* Min height for feedback area */}
        <EmotionFeedback isVisible={isFeedbackVisible} emotion={feedback.emotion} message={feedback.message} />
      </div>
    </div>
  );
}
