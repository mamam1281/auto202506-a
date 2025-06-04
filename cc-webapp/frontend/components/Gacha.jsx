'use client';

import { useState, useRef, useEffect } from 'react';
import axios from 'axios'; // Using axios directly for API calls
import { useRouter } from 'next/navigation'; // For potential redirection
// Note: spinGachaClient from '@/utils/rewardUtils' is no longer used here for determining results.
import EmotionFeedback from './EmotionFeedback';
import useSound from 'use-sound';
import confetti from 'canvas-confetti';
import { Coins, Gift, Zap, Sparkles, AlertTriangle } from 'lucide-react'; // Icons

// Sound file paths (ensure these exist in public/sounds/)
const coinSoundPath = '/sounds/coin.mp3';
const gachaWinSoundPath = '/sounds/gacha_win.mp3';
const gachaRevealSoundPath = '/sounds/gacha_reveal.mp3'; // New sound for unlock reveal

export default function Gacha({ userId = 1 }) { // Default userId for now
  const router = useRouter();
  const [isSpinning, setIsSpinning] = useState(false);
  const [feedback, setFeedback] = useState({ emotion: '', message: '' });
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
  const feedbackTimerRef = useRef(null);

  const [playCoinSound] = useSound(coinSoundPath, { volume: 0.6 });
  const [playGachaWinSound] = useSound(gachaWinSoundPath, { volume: 0.7 });
  const [playGachaRevealSound] = useSound(gachaRevealSoundPath, { volume: 0.6 });

  useEffect(() => { // Cleanup timer on unmount
   return () => { if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current); };
  }, []);

  const showFeedbackTemporarily = (emotion, message, duration = 5000) => {
    setFeedback({ emotion, message });
    setIsFeedbackVisible(true);
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = setTimeout(() => setIsFeedbackVisible(false), duration);
  };

  const triggerCoinAnimation = (amount = 50) => {
    // Simple confetti burst styled as coins
    confetti({ particleCount: Math.min(amount, 100), angle: 60, spread: 55, origin: { x: 0.2, y:0.5 }, colors: ['#FFD700', '#FFA500', '#FFBF00'], scalar: 1.2 });
    confetti({ particleCount: Math.min(amount, 100), angle: 120, spread: 55, origin: { x: 0.8, y:0.5 }, colors: ['#FFD700', '#FFA500', '#FFBF00'], scalar: 1.2 });
  };

  const handlePullGacha = async () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setIsFeedbackVisible(false); // Clear previous feedback
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    showFeedbackTemporarily('determination', 'Spinning the Mystic Gacha...', 2500);

    try {
      // Step 1: Call backend to determine gacha result
      const gachaPullResponse = await axios.post('http://localhost:8000/api/gacha/pull', { user_id: userId });
      const result = gachaPullResponse.data; // e.g., {type: "COIN", amount: 50, message?: "..."}

      if (!result || !result.type) {
        console.error("Invalid gacha result from server:", result);
        throw new Error("Invalid gacha result from server.");
      }

      // Step 2: Log the gacha *result* as an action to the backend
      // The action_type helps categorize different reward types from gacha.
      const actionTypeMap = {
        "COIN": "GACHA_REWARD_COIN",
        "CONTENT_UNLOCK": "GACHA_REWARD_CONTENT_UNLOCK",
        "BADGE": "GACHA_REWARD_BADGE"
      };
      const actionType = actionTypeMap[result.type] || `GACHA_REWARD_UNKNOWN`;

      const actionPayload = {
        user_id: userId,
        action_type: actionType,
        // Send all fields from gacha result (type, amount, stage, badge_name, message) as metadata
        metadata: { ...result },
        timestamp: new Date().toISOString(),
      };

      try {
        await axios.post('http://localhost:8000/api/actions', actionPayload);
        console.log('Gacha result action logged to backend:', actionPayload);
      } catch (actionError) {
        console.error('Failed to log gacha result action to backend:', actionError);
        // This is a non-critical error for the user's immediate experience, but should be monitored.
      }

      // Step 3: Handle frontend effects based on gacha result type
      const GACHA_MESSAGE_DURATION = 7000; // Longer duration for gacha results
      if (result.type === "CONTENT_UNLOCK") {
        playGachaRevealSound(); // Play a distinct sound for the reveal
        confetti({ particleCount: 250, spread: 150, origin: { y: 0.2 }, zIndex: 1000, Ticks: 150, disableForReducedMotion: true, scalar: 1.5 });
        showFeedbackTemporarily('happiness', result.message || `Awesome! You've won a new Content Unlock: Stage ${result.stage}! Taking you there...`, GACHA_MESSAGE_DURATION);
        // Navigate to adult_content page where AdultContentViewer will handle the actual unlock display logic
        setTimeout(() => router.push('/adult_content'), 2500); // Delay for user to see message
      } else if (result.type === "COIN") {
        playCoinSound();
        triggerCoinAnimation(result.amount);
        showFeedbackTemporarily('happiness', result.message || `Ka-ching! You won ${result.amount} coins!`, GACHA_MESSAGE_DURATION);
      } else if (result.type === "BADGE") {
        playGachaWinSound();
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 }, scalar: 1.3 });
        showFeedbackTemporarily('happiness', result.message || `Congratulations! You earned the "${result.badge_name}" badge!`, GACHA_MESSAGE_DURATION);
      } else {
        // Fallback for any other unknown types from backend
        showFeedbackTemporarily('neutral', result.message || `You received something interesting: ${result.type}.`, GACHA_MESSAGE_DURATION);
      }

    } catch (error) {
      console.error('Gacha pull process failed:', error);
      const errorMsg = error.response?.data?.detail || 'The Gacha spirits are mischievous today. Please try again.';
      showFeedbackTemporarily('frustration', errorMsg, 6000);
    } finally {
      setIsSpinning(false);
    }
  };

  return (
    <div className="p-6 my-8 bg-gray-800 text-white border-2 border-purple-600 rounded-xl shadow-2xl text-center max-w-md mx-auto transform transition-all hover:scale-105">
      <div className="mb-6">
        <Sparkles size={52} className="mx-auto text-yellow-300 animate-pulse filter drop-shadow-lg" />
        <h2 className="text-3xl font-bold mt-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-300">
          Mystic Gacha Shrine
        </h2>
        <p className="text-sm text-gray-400 mt-1">What wonders will fate bestow upon you?</p>
      </div>

      <div className="my-10 w-48 h-48 bg-purple-900 rounded-full mx-auto flex items-center justify-center shadow-inner border-4 border-purple-700 hover:animate-bounce_">
        <Gift size={72} className="text-yellow-200 filter drop-shadow-md" />
      </div>

      <button
        onClick={handlePullGacha}
        disabled={isSpinning}
        className="w-full px-8 py-4 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white rounded-lg hover:shadow-2xl hover:brightness-110 transition-all duration-300 ease-in-out text-xl font-bold shadow-lg disabled:opacity-70 disabled:bg-gray-500 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-pink-300 focus:ring-opacity-60"
      >
        {isSpinning ? (
          <div className="flex items-center justify-center">
            <Zap size={22} className="animate-spin mr-2.5" /> Summoning Destiny...
          </div>
        ) : (
          'Pull Gacha (100 Coins)' // Placeholder cost, actual cost handled by backend if implemented
        )}
      </button>
      <div className="mt-8 min-h-[65px]"> {/* Min height for feedback area */}
        <EmotionFeedback isVisible={isFeedbackVisible} emotion={feedback.emotion} message={feedback.message} />
      </div>
    </div>
  );
}
