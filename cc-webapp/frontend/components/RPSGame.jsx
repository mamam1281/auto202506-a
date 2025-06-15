// cc-webapp/frontend/components/RPSGame.jsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; // Or your apiClient
import { useEmotionFeedback } from '@/hooks/useEmotionFeedback'; // Adjust path if needed
import { playRPS } from '@/services/gameApi'; // Import RPS API function
import EmotionFeedback from './EmotionFeedback';
import useSound from 'use-sound';
import confetti from 'canvas-confetti';
import { HandRock, HandPaper, HandScissors, HelpCircle, RotateCcw, ShieldQuestion } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Sound files
const CHOICE_SOUND_PATH = '/sounds/rps_choice.mp3';
const WIN_SOUND_PATH = '/sounds/victory.mp3';
const LOSE_SOUND_PATH = '/sounds/failure.mp3';
const DRAW_SOUND_PATH = '/sounds/rps_draw.mp3';

const CHOICES = [
  { name: 'rock', icon: <HandRock className="w-full h-full" />, beats: 'scissors', color: 'bg-red-600 hover:bg-red-700 border-red-800' },
  { name: 'paper', icon: <HandPaper className="w-full h-full" />, beats: 'rock', color: 'bg-blue-600 hover:bg-blue-700 border-blue-800' },
  { name: 'scissors', icon: <HandScissors className="w-full h-full" />, beats: 'paper', color: 'bg-green-600 hover:bg-green-700 border-green-800' },
];

const RPSChoiceButton = ({ choice, onSelect, disabled, isPlayerChoice, isComputerChoice, gameResult }) => {
  let buttonStyle = choice.color || 'bg-gray-700 hover:bg-gray-600';
  let ringStyle = '';
  let opacityClass = '';

  if (isPlayerChoice) {
    if (gameResult === 'win') { ringStyle = 'ring-4 ring-yellow-400 shadow-yellow-300/50'; }
    else if (gameResult === 'lose') { ringStyle = 'ring-4 ring-gray-500 shadow-red-400/40'; opacityClass = 'opacity-70';}
    else if (gameResult === 'draw') { ringStyle = 'ring-4 ring-blue-400 shadow-blue-300/40'; }
    else { buttonStyle = 'bg-purple-600 border-purple-800'; ringStyle = 'ring-4 ring-purple-400';} // Chosen by player, pre-result
  } else if (isComputerChoice) {
    // Style for computer's revealed choice
     buttonStyle = choice.color.replace("hover:bg-", "bg-").replace("600", "700"); // Darker, non-hover version
     opacityClass = 'opacity-90';
  }


  return (
    <motion.button
      onClick={() => onSelect(choice.name)}
      disabled={disabled}
      className={`p-3 sm:p-4 rounded-lg text-white transition-all duration-150 ease-in-out transform focus:outline-none focus:ring-opacity-75 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 flex items-center justify-center shadow-xl border-2 ${buttonStyle} ${ringStyle} ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105 active:scale-95'} ${opacityClass}`}
      aria-label={`Choose ${choice.name}`}
    >
      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16">{choice.icon}</div>
    </motion.button>
  );
};


export default function RPSGame({ userId = 1 }) {
  const [playerChoice, setPlayerChoice] = useState(null); // Stores name: 'rock', 'paper', or 'scissors'
  const [computerChoice, setComputerChoice] = useState(null); // Stores name
  const [result, setResult] = useState(null); // 'win', 'lose', 'draw', or null
  const [isPlaying, setIsPlaying] = useState(false);
  const [betAmount, setBetAmount] = useState(10); // Default bet amount
  const [balance, setBalance] = useState(1000); // User balance (should come from props/context)
  const [winAmount, setWinAmount] = useState(0);

  const [feedback, setFeedback] = useState({ emotion: '', message: '' });
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
  const feedbackTimerRef = useRef(null);

  const apiClient = axios.create({ baseURL: 'http://localhost:8000/api' });
  const { fetchEmotionFeedback } = useEmotionFeedback();

  const [playChoiceSound] = useSound(CHOICE_SOUND_PATH, { volume: 0.4 });
  const [playWinSound] = useSound(WIN_SOUND_PATH, { volume: 0.5 });
  const [playLoseSound] = useSound(LOSE_SOUND_PATH, { volume: 0.45 });
  const [playDrawSound] = useSound(DRAW_SOUND_PATH, { volume: 0.4 });

  useEffect(() => {
    return () => clearTimeout(feedbackTimerRef.current);
  }, []);

  const showFeedbackTemporarily = (emotion, message, duration = 4000) => {
    setFeedback({ emotion, message });
    setIsFeedbackVisible(true);
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = setTimeout(() => setIsFeedbackVisible(false), duration);
  };
  const triggerConfetti = (isWin) => {
    const particleColors = isWin ? ['#00FF00', '#FFFF00', '#00FFFF'] : ['#FF0000', '#C0C0C0'];
    confetti({ particleCount: isWin ? 120 : 60, spread: isWin ? 70 : 40, origin: { y: 0.6 }, zIndex: 1000, colors: particleColors, disableForReducedMotion: true });
  };
  const handlePlay = async (chosenPlayerChoiceName) => {
    if (isPlaying || betAmount > balance) return;

    setIsPlaying(true);
    setPlayerChoice(chosenPlayerChoiceName);
    setComputerChoice(null); // Hide computer's previous choice
    setResult(null); // Clear previous result
    setWinAmount(0);
    setIsFeedbackVisible(false); // Clear previous feedback message
    playChoiceSound();
    showFeedbackTemporarily('determination', `You chose ${chosenPlayerChoiceName}! Computer is thinking...`, 1500);

    try {
      // Log player choice action
      apiClient.post('/actions', {
        user_id: userId, action_type: "RPS_PLAYER_CHOICE",
        metadata: { choice: chosenPlayerChoiceName, game_id: "classic_rps", bet_amount: betAmount },
        timestamp: new Date().toISOString(),
      }).catch(err => console.error("Failed to log RPS_PLAYER_CHOICE action:", err));

      await new Promise(resolve => setTimeout(resolve, 800)); // Shorter wait time

      // Call backend RPS API
      const token = 'dummy-token'; // In real app, get from auth context
      const rpsResult = await playRPS(chosenPlayerChoiceName, betAmount, token);
      
      // Update state with backend results
      setComputerChoice(rpsResult.computer_choice);
      setResult(rpsResult.result); // 'win', 'lose', 'draw'
      setWinAmount(rpsResult.win_amount || 0);
      setBalance(rpsResult.new_balance || balance);

      // Get emotion feedback
      const actionType = `RPS_${rpsResult.result.toUpperCase()}`; // e.g., RPS_WIN
      const feedbackResult = await fetchEmotionFeedback(userId, actionType);
      if (feedbackResult) {
        const message = rpsResult.result === 'win' 
          ? `${feedbackResult.message} You won ${rpsResult.win_amount} points!`
          : rpsResult.result === 'lose' 
          ? `${feedbackResult.message} You lost ${betAmount} points.`
          : `${feedbackResult.message} It's a draw!`;
        showFeedbackTemporarily(feedbackResult.emotion, message);
      }

      // Play sounds and effects
      if (rpsResult.result === 'win') { 
        playWinSound(); 
        triggerConfetti(true); 
      } else if (rpsResult.result === 'lose') { 
        playLoseSound(); 
      } else { 
        playDrawSound(); 
      }

      // Log game result
      apiClient.post('/actions', {
        user_id: userId, action_type: actionType,
        metadata: { 
          player_choice: chosenPlayerChoiceName, 
          computer_choice: rpsResult.computer_choice, 
          result: rpsResult.result,
          bet_amount: betAmount,
          win_amount: rpsResult.win_amount || 0
        },
        timestamp: new Date().toISOString(),
      }).catch(err => console.error(`Failed to log ${actionType} action:`, err));

    } catch (error) {
      console.error("RPS game error:", error);
      playLoseSound();
      showFeedbackTemporarily('frustration', 'An error occurred during the game. Please try again.');
    } finally {
      setTimeout(() => { setIsPlaying(false); }, 1800); // Allow new game after results are shown
    }
  };
  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
    setWinAmount(0);
    setIsPlaying(false);
    setIsFeedbackVisible(false);
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
  };

  const handleBetChange = (newBet) => {
    if (newBet > 0 && newBet <= balance) {
      setBetAmount(newBet);
    }
  };

  const getChoiceObjectByName = (name) => CHOICES.find(c => c.name === name);

  return (
    <div className="p-4 sm:p-6 bg-gray-800 text-white border-2 border-indigo-700 rounded-xl shadow-2xl text-center max-w-lg mx-auto my-4">      <header className="mb-6">
        <motion.h2
            whileHover={{ scale:1.03, color: '#818cf8' }}
            className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400"
        >
          Rock, Paper, Scissors
        </motion.h2>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">Make your choice to challenge the computer!</p>
        
        {/* Balance and Betting UI */}
        <div className="mt-4 p-3 bg-gray-700 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">Balance:</span>
            <span className="text-lg font-bold text-green-400">{balance} pts</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-300">Bet Amount:</span>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handleBetChange(Math.max(5, betAmount - 5))}
                disabled={isPlaying || betAmount <= 5}
                className="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded text-sm disabled:opacity-50"
              >
                -
              </button>
              <span className="text-lg font-bold text-yellow-400 min-w-[60px] text-center">{betAmount} pts</span>
              <button 
                onClick={() => handleBetChange(Math.min(balance, betAmount + 5))}
                disabled={isPlaying || betAmount >= balance}
                className="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded text-sm disabled:opacity-50"
              >
                +
              </button>
            </div>
          </div>
          {winAmount > 0 && (
            <div className="mt-2 text-center">
              <span className="text-green-400 font-bold">Won: +{winAmount} pts!</span>
            </div>
          )}
        </div>
      </header>

      <div className="mb-4 sm:mb-6 min-h-[80px] sm:min-h-[100px] flex flex-col items-center justify-center">
        <p className="text-sm text-gray-400 mb-2">Computer's Hand:</p>
        <AnimatePresence mode="wait">
          <motion.div
            key={computerChoice || 'waiting_computer'}
            initial={{ opacity: 0, y: -20, scale: 0.7 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.7 }}
            transition={{ duration: 0.25, ease:"easeInOut" }}
            className="w-20 h-20 sm:w-24 sm:h-24 p-2 rounded-lg shadow-md flex items-center justify-center text-white bg-purple-800 border-2 border-purple-600"
          >
            {computerChoice ? (getChoiceObjectByName(computerChoice)?.icon) : <ShieldQuestion size="55%" className="opacity-60" />}
          </motion.div>
        </AnimatePresence>
      </div>       {playerChoice && (
        <div className="my-3 text-center">
          <p className="text-sm text-gray-400">You chose: <span className={`font-semibold text-lg ${
            result === 'win' ? 'text-green-400' : result === 'lose' ? 'text-red-400' : result === 'draw' ? 'text-yellow-400' : 'text-blue-400'
          }`}>{playerChoice.charAt(0).toUpperCase() + playerChoice.slice(1)}</span></p>
        </div>
      )}

      {betAmount > balance && !isPlaying && (
        <div className="my-3 text-center">
          <p className="text-sm text-red-400">Insufficient balance! Reduce your bet amount.</p>
        </div>
      )}

      {result && !isPlaying && (
        <motion.p
          initial={{opacity:0, y:10}} animate={{opacity:1, y:0}}
          className={`text-xl sm:text-2xl font-bold text-center my-4 ${
          result === 'win' ? 'text-green-400' : result === 'lose' ? 'text-red-400' : 'text-yellow-400'
        }`}>
          {result === 'draw' ? "It's a Draw!" : `You ${result.toUpperCase()}!`}
        </motion.p>
      )}      <div className="flex justify-around items-center my-6 sm:my-8 space-x-2 sm:space-x-3">
        {CHOICES.map((choice) => (
          <RPSChoiceButton
            key={choice.name}
            choice={choice}
            onSelect={handlePlay}
            disabled={isPlaying || betAmount > balance}
            isPlayerChoice={playerChoice === choice.name}
            isComputerChoice={computerChoice === choice.name}
            gameResult={playerChoice === choice.name ? result : null} // Pass result only if it's player's choice
          />
        ))}
      </div>

      <div className="min-h-[50px] sm:min-h-[60px] mb-4">
        <EmotionFeedback isVisible={isFeedbackVisible} emotion={feedback.emotion} message={feedback.message} />
      </div>

      <motion.button
        onClick={resetGame}
        disabled={isPlaying && result === null} // Only allow reset if game is over or not started
        className="w-full sm:w-auto mt-2 px-4 py-2 text-xs sm:text-sm bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 flex items-center justify-center mx-auto"
        whileHover={{ scale: (isPlaying && result === null) ? 1 : 1.05 }}
      >
        <RotateCcw size={16} className="mr-2" /> Reset Game
      </motion.button>
    </div>
  );
}
