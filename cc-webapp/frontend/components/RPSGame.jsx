'use client';

import { useState, useEffect, useRef } from 'react'; // Added useRef
import EmotionFeedback from './EmotionFeedback';
import { useEmotionFeedback } from '@/hooks/useEmotionFeedback';
import useSound from 'use-sound';
import confetti from 'canvas-confetti';
import { HandRock, HandPaper, HandScissors, HelpCircle, Shuffle } from 'lucide-react'; // Added Shuffle for computer thinking

const victorySoundPath = '/sounds/victory.mp3';
const failureSoundPath = '/sounds/failure.mp3';
const tieSoundPath = '/sounds/failure.mp3'; // Using failure sound for tie for now

const choices = [
  { name: 'rock', icon: <HandRock size={48} />, beats: 'scissors' },
  { name: 'paper', icon: <HandPaper size={48} />, beats: 'rock' },
  { name: 'scissors', icon: <HandScissors size={48} />, beats: 'paper' },
];

export default function RPSGame({ userId = 1 }) {
  const [feedback, setFeedback] = useState({ emotion: '', message: '' });
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false); // For disabling buttons during play
  const { fetchEmotionFeedback } = useEmotionFeedback();

  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState(''); // 'WIN', 'LOSE', 'TIE'

  const [playVictory] = useSound(victorySoundPath, { volume: 0.5 });
  const [playFailure] = useSound(failureSoundPath, { volume: 0.5 });
  const [playTie] = useSound(tieSoundPath, { volume: 0.4 });

  const feedbackTimerRef = useRef(null);

  useEffect(() => {
    return () => { if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current); };
  }, []); // Empty dependency array

  const showFeedbackTemporarily = (emotion, message, duration = 4000) => {
    setFeedback({ emotion, message });
    setIsFeedbackVisible(true);
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = setTimeout(() => setIsFeedbackVisible(false), duration);
  };

  const determineWinner = (playerName, computerName) => {
    if (playerName === computerName) return 'TIE';
    const playerAction = choices.find(c => c.name === playerName);
    if (playerAction.beats === computerName) return 'WIN';
    return 'LOSE';
  };

  const handlePlay = async (chosenName) => {
    if (isPlaying) return;
    setIsPlaying(true);
    setIsFeedbackVisible(false);
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);

    setPlayerChoice(choices.find(c => c.name === chosenName));
    setComputerChoice(null); // Clear previous computer choice
    setResult(''); // Clear previous result
    showFeedbackTemporarily('determination', 'Rock, Paper, Scissors...', 1500);

    // Simulate computer thinking
    await new Promise(resolve => setTimeout(resolve, 1000));
    const computer = choices[Math.floor(Math.random() * choices.length)];
    setComputerChoice(computer);

    const gameResult = determineWinner(chosenName, computer.name);
    setResult(gameResult); // 'WIN', 'LOSE', 'TIE'
    const actionType = `RPS_${gameResult}`;

    try {
      const feedbackResult = await fetchEmotionFeedback(userId, actionType);
      if (feedbackResult) {
        // Override "Rock, Paper, Scissors..." message
        showFeedbackTemporarily(feedbackResult.emotion, feedbackResult.message);
        if (gameResult === 'WIN') {
          playVictory();
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        } else if (gameResult === 'LOSE') {
          playFailure();
        } else { // TIE
          playTie();
        }
      }
    } catch (error) {
      console.error("Error fetching/processing feedback:", error);
      showFeedbackTemporarily('frustration', 'Could not get feedback from server.');
      if (gameResult !== 'WIN') playFailure(); // Play failure if not a win and error occurred
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <div className="p-6 border rounded-xl shadow-lg bg-white max-w-lg mx-auto my-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-purple-600">Rock Paper Scissors</h2>

      <div className="flex justify-around mb-8">
        {choices.map((choice) => (
          <button
            key={choice.name}
            onClick={() => handlePlay(choice.name)}
            disabled={isPlaying}
            className="p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:bg-gray-400 disabled:cursor-not-allowed"
            aria-label={`Choose ${choice.name}`}
          >
            {choice.icon}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 items-center text-center mb-6 min-h-[100px]">
        <div>
          <p className="text-lg font-medium text-gray-700">You Chose:</p>
          <div className="text-purple-600 text-6xl h-16 flex justify-center items-center my-2">
            {playerChoice ? playerChoice.icon : <HelpCircle size={48} className="text-gray-300" />}
          </div>
        </div>
        <div>
          <p className="text-lg font-medium text-gray-700">Computer Chose:</p>
           <div className="text-gray-600 text-6xl h-16 flex justify-center items-center my-2">
            {isPlaying && !computerChoice ? <Shuffle size={48} className="text-gray-400 animate-spin" /> : computerChoice ? computerChoice.icon : <HelpCircle size={48} className="text-gray-300" />}
          </div>
        </div>
      </div>

      {result && !isPlaying && (
        <p className={`text-2xl font-bold text-center mb-4 animate-pulse ${
          result === 'WIN' ? 'text-green-500' : result === 'LOSE' ? 'text-red-500' : 'text-yellow-500'
        }`}>
          {result === 'TIE' ? "It's a Tie!" : `You ${result}!`}
        </p>
      )}

      <div className="mt-4 h-24"> {/* Adjusted height */}
        <EmotionFeedback
          isVisible={isFeedbackVisible}
          emotion={feedback.emotion}
          message={feedback.message}
        />
      </div>
    </div>
  );
}
