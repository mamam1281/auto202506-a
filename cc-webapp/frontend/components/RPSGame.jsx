'use client';

import { useState, useEffect } from 'react';
import EmotionFeedback from './EmotionFeedback';
import { useEmotionFeedback } from '@/hooks/useEmotionFeedback';
import useSound from 'use-sound';
import confetti from 'canvas-confetti';
import { HandRock, HandPaper, HandScissors, HelpCircle } from 'lucide-react'; // Icons

const victorySoundPath = '/sounds/victory.mp3';
const failureSoundPath = '/sounds/failure.mp3'; // Could also be a tie sound

const choices = [
  { name: 'rock', icon: <HandRock size={48} /> },
  { name: 'paper', icon: <HandPaper size={48} /> },
  { name: 'scissors', icon: <HandScissors size={48} /> },
];

export default function RPSGame({ userId = 1 }) {
  const [feedback, setFeedback] = useState({ emotion: '', message: '' });
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
  const { fetchEmotionFeedback } = useEmotionFeedback();

  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState(''); // 'win', 'lose', 'tie'

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

  const determineWinner = (player, computer) => {
    if (player === computer) return 'tie';
    if (
      (player === 'rock' && computer === 'scissors') ||
      (player === 'scissors' && computer === 'paper') ||
      (player === 'paper' && computer === 'rock')
    ) {
      return 'win';
    }
    return 'lose';
  };

  const handlePlay = async (chosenName) => {
    setIsFeedbackVisible(false);
    if (feedbackTimer) clearTimeout(feedbackTimer);

    const player = choices.find(c => c.name === chosenName);
    const computer = choices[Math.floor(Math.random() * choices.length)];
    setPlayerChoice(player);
    setComputerChoice(computer);

    const gameResult = determineWinner(player.name, computer.name);
    setResult(gameResult);

    const actionType = `RPS_${gameResult.toUpperCase()}`; // e.g., RPS_WIN

    try {
      const feedbackResult = await fetchEmotionFeedback(userId, actionType);
      if (feedbackResult) {
        showFeedbackTemporarily(feedbackResult.emotion, feedbackResult.message);
        if (gameResult === 'win') {
          playVictory();
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        } else { // lose or tie
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
      <h2 className="text-2xl font-bold mb-6 text-center text-purple-600">Rock Paper Scissors</h2>

      <div className="flex justify-around mb-6">
        {choices.map((choice) => (
          <button
            key={choice.name}
            onClick={() => handlePlay(choice.name)}
            className="p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
            aria-label={`Choose ${choice.name}`}
          >
            {choice.icon}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 items-center text-center mb-6 min-h-[80px]">
        <div>
          <p className="text-lg font-medium">You Chose:</p>
          <div className="text-purple-600 text-6xl h-16 flex justify-center items-center">
            {playerChoice ? playerChoice.icon : <HelpCircle size={48} className="text-gray-400" />}
          </div>
        </div>
        <div>
          <p className="text-lg font-medium">Computer Chose:</p>
           <div className="text-gray-600 text-6xl h-16 flex justify-center items-center">
            {computerChoice ? computerChoice.icon : <HelpCircle size={48} className="text-gray-400" />}
          </div>
        </div>
      </div>

      {result && (
        <p className={`text-xl font-semibold text-center mb-4 ${
          result === 'win' ? 'text-green-500' : result === 'lose' ? 'text-red-500' : 'text-yellow-500'
        }`}>
          {result === 'tie' ? "It's a Tie!" : `You ${result}!`}
        </p>
      )}

      <div className="mt-4 h-20">
        <EmotionFeedback
          isVisible={isFeedbackVisible}
          emotion={feedback.emotion}
          message={feedback.message}
        />
      </div>
    </div>
  );
}
