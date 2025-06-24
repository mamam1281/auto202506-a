'use client';

import React, { useState, useEffect } from 'react'; // Added useEffect
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store'; // Assuming store is in ../../store
import { decrementBalance, incrementBalance, clearLastTransaction } from '../../store/cyberTokenSlice';
import { gameAPI, userActionsAPI, rewardsAPI, feedbackAPI } from '../../utils/api'; // Import API services
import confetti from 'canvas-confetti';
// Import other necessary hooks, components, and types later

export interface RouletteWheelProps {
  minBet: number;
  // Other props like onSpin, onBetPlaced, etc., can be added later
}

const RouletteWheel: React.FC<RouletteWheelProps> = ({ minBet }) => {
  const [currentBet, setCurrentBet] = useState<number>(minBet);
  const [selectedBetType, setSelectedBetType] = useState<'number' | 'color' | 'odd_even' | null>(null);
  const [selectedBetValue, setSelectedBetValue] = useState<string | number | null>(null); // e.g., 17, 'red', 'odd'
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [targetRotation, setTargetRotation] = useState<number>(0); // For wheel animation
  const [lastWinningNumber, setLastWinningNumber] = useState<number | null>(null);
  const [numberHistory, setNumberHistory] = useState<number[]>([]); // For Hot/Cold numbers display
  const [jackpotAmount, setJackpotAmount] = useState<number>(1000000); // Mock jackpot
  const [cjaiMessage, setCjaiMessage] = useState<string | null>(null); // For CJ AI messages

  const dispatch = useDispatch<AppDispatch>();
  const cyberTokenBalance = useSelector((state: RootState) => state.cyberToken.balance);
  const lastTransactionStatus = useSelector((state: RootState) => state.cyberToken.lastTransactionStatus);


  // Placeholder for wheel sectors
  // const sectors = Array.from({ length: 37 }, (_, i) => i); // European Roulette (0-36)

  const wheelNumbers = [
    // Standard European roulette wheel sequence (clockwise)
    // Number, Color (r, b, g for red, black, green)
    { num: 0, color: 'g' }, { num: 32, color: 'r' }, { num: 15, color: 'b' }, { num: 19, color: 'r' },
    { num: 4, color: 'b' }, { num: 21, color: 'r' }, { num: 2, color: 'b' }, { num: 25, color: 'r' },
    { num: 17, color: 'b' }, { num: 34, color: 'r' }, { num: 6, color: 'b' }, { num: 27, color: 'r' },
    { num: 13, color: 'b' }, { num: 36, color: 'r' }, { num: 11, color: 'b' }, { num: 30, color: 'r' },
    { num: 8, color: 'b' }, { num: 23, color: 'r' }, { num: 10, color: 'b' }, { num: 5, color: 'r' },
    { num: 24, color: 'b' }, { num: 16, color: 'r' }, { num: 33, color: 'b' }, { num: 1, color: 'r' },
    { num: 20, color: 'b' }, { num: 14, color: 'r' }, { num: 31, color: 'b' }, { num: 9, color: 'r' },
    { num: 22, color: 'b' }, { num: 18, color: 'r' }, { num: 29, color: 'b' }, { num: 7, color: 'r' },
    { num: 28, color: 'b' }, { num: 12, color: 'r' }, { num: 35, color: 'b' }, { num: 3, color: 'r' },
    { num: 26, color: 'b' },
  ];
  const totalSectors = wheelNumbers.length;
  const anglePerSector = 360 / totalSectors;

  const getColorClass = (color: string) => {
    if (color === 'r') return 'bg-red-600'; // Tailwind red
    if (color === 'b') return 'bg-black';   // Tailwind black
    if (color === 'g') return 'bg-green-600'; // Tailwind green
    return 'bg-gray-700'; // Fallback
  };


  const handleSpin = () => {
    if (isSpinning || !selectedBetType || currentBet < minBet) return;

    // Check balance
    if (cyberTokenBalance < currentBet) {
      console.error("Insufficient token balance to place bet.");
      setCjaiMessage(`Not enough tokens! You need ${currentBet} but only have ${cyberTokenBalance}.`);
      return;
    }

    // Dispatch decrement balance - this will be the actual bet placement
    // In a real scenario, you might wait for backend confirmation before spinning,
    // or do an optimistic update and then rollback on failure.
    dispatch(decrementBalance(currentBet));
    // Note: We might need to check lastTransactionStatus from Redux here if it indicates failure due to insufficient funds
    // despite the client-side check, though the slice logic should prevent balance going negative.

    console.log(`Bet placed: ${currentBet} tokens on ${selectedBetType} - ${selectedBetValue}. Deducting balance.`);

    // Clear any previous transaction status from Redux state for this new attempt
    dispatch(clearLastTransaction());
    setCjaiMessage(null); // Clear previous AI/error messages

    // Record the action immediately (could also be done after successful bet confirmation from backend)
    userActionsAPI.postRecordAction({
      actionType: 'ROULETTE_BET_PLACED',
      metadata: { betType: selectedBetType, betValue: selectedBetValue, amount: currentBet }
    }).catch(error => console.error("Failed to record action:", error)); // Log error, don't block game

    setIsSpinning(true);

    // Get winning number from (mocked) API
    gameAPI.postRouletteSpin({ betType: selectedBetType, betValue: selectedBetValue, amount: currentBet })
      .then(result => {
        const { winningNumber, color, winningSectorIndex } = result;

        // Find the corresponding data from our client-side wheelNumbers array
        // This step is important if the API only returns the number and color, but not the exact index on our specific wheel sequence.
        // However, our mock API now returns winningSectorIndex, which is more direct.
        const winningNumberDataFromClientArray = wheelNumbers[winningSectorIndex];
        if (!winningNumberDataFromClientArray || winningNumberDataFromClientArray.num !== winningNumber) {
            console.error("Mismatch between API result and client wheel definition, or invalid index.");
            // Fallback or error handling needed here
            setIsSpinning(false);
            // Potentially refund bet if server result is unusable
            dispatch(incrementBalance(currentBet)); // Refund the bet
            alert("Error processing game result. Your bet has been refunded.");
            return;
        }

        // Calculate the target angle for the wheel to stop at the winning sector
    // The pointer is at the top (0 degrees or 360 degrees).
    // Each sector's angle is calculated based on its index.
    // The wheel spins clockwise (positive rotation).
    // We want the middle of the winning sector to align with the pointer.

    // Angle to the middle of the winning sector from the 0-degree line of the wheel:
    // The rotation in the map is `anglePerSector * index - (anglePerSector / 2)`
    // So, to align sector `winningSectorIndex` which STARTS at `anglePerSector * winningSectorIndex`,
    // its middle is at `anglePerSector * winningSectorIndex + anglePerSector / 2`.
    // But our sectors are rendered with their *start* at `rotation`.
    // The `rotation` for sector `i` is `anglePerSector * i - (anglePerSector / 2)`.
    // So the start of sector `i` is at that rotation. Its end is `anglePerSector * i + (anglePerSector / 2)`.
    // The middle of sector `i` is at `anglePerSector * i`.
    // We want this middle point to be at the top (0 deg). So, wheel needs to rotate by -(anglePerSector * winningSectorIndex).
    let landingAngle = -(anglePerSector * winningSectorIndex);

    // Add multiple full rotations for visual effect
    const fullRotations = 5 + Math.floor(Math.random() * 5); // 5 to 9 full rotations
    const totalAngle = landingAngle + (360 * fullRotations);

    setTargetRotation(prevRotation => prevRotation + totalAngle); // Accumulate rotation for multiple spins

        let landingAngle = -(anglePerSector * winningSectorIndex);

        const fullRotations = 5 + Math.floor(Math.random() * 5);
        const totalAngle = landingAngle + (360 * fullRotations);

        setTargetRotation(prevRotation => prevRotation + totalAngle);

        setTimeout(() => {
          setIsSpinning(false);
          setLastWinningNumber(winningNumber);
          setNumberHistory(prevHistory => [winningNumber, ...prevHistory.slice(0, 9)]); // Keep last 10 numbers
          console.log(`Winning number from API: ${winningNumber} (Color: ${color})`);

          // Simulate sounds
          console.log("PLAY_SOUND: wheel_stops.mp3");


          let payout = 0;
          const isOdd = winningNumber % 2 !== 0;
          const isEven = winningNumber !== 0 && winningNumber % 2 === 0;

          if (selectedBetType === 'number' && selectedBetValue === winningNumber) {
            payout = currentBet * 35;
          } else if (selectedBetType === 'color') {
            if ((selectedBetValue === 'red' && color === 'r') || (selectedBetValue === 'black' && color === 'b')) {
              payout = currentBet * 2;
            }
          } else if (selectedBetType === 'odd_even') {
            if ((selectedBetValue === 'odd' && isOdd) || (selectedBetValue === 'even' && isEven)) {
              payout = currentBet * 2;
            }
          }

          const resultType = payout > 0 ? 'win' : 'loss';
          const tokensChanged = payout > 0 ? payout : 0; // Net change for feedback is only winnings, bet already deducted.

          if (payout > 0) {
            console.log(`Congratulations! You won ${payout} tokens.`);
            dispatch(incrementBalance(payout));
            console.log("PLAY_SOUND: win_major.mp3"); // Simulate sound
            confetti({ // Confetti effect
              particleCount: 150,
              spread: 180,
              origin: { y: 0.6 }
            });
          } else {
            console.log("Sorry, no win this time.");
            console.log("PLAY_SOUND: lose_default.mp3"); // Simulate sound
          }

          // Update rewards history (mocked)
          rewardsAPI.getRewardsHistory().then(history => {
            console.log("Updated rewards history (mock):", history);
          }).catch(error => console.error("Failed to get rewards history:", error));

          // Post game feedback (mocked)
          feedbackAPI.postGameFeedback({
            game: 'roulette',
            result: resultType,
            tokensChanged: tokensChanged, // This is the amount won, not net. Bet was already deducted.
            // sentiment: could be analyzed or set based on win/loss/amount
          }).then(feedbackResponse => {
            console.log("Feedback API response (mock):", feedbackResponse.cj_ai_response);
            setCjaiMessage(feedbackResponse.cj_ai_response); // Set CJ AI message
          }).catch(error => console.error("Failed to post feedback:", error));

        }, 4000); // Animation duration
      })
      .catch(error => {
        console.error("Error during roulette spin API call:", error);
        setIsSpinning(false);
        // Important: Refund the bet if the API call failed before determining a result
        dispatch(incrementBalance(currentBet));
        alert("An error occurred while spinning the wheel. Your bet has been refunded.");
      });
  };

  // Effect to check transaction status from Redux (e.g. if server-side decrement failed)
  useEffect(() => {
    if (lastTransactionStatus === 'failed' && isSpinning) {
      // This case implies that the decrementBalance in Redux failed (e.g. server rejected it)
      // though our current slice makes this unlikely for client-side checks.
      // This is more relevant if decrementBalance was an async thunk that could fail.
      setIsSpinning(false);
      // Potentially reset wheel animation or show error.
      console.error("Bet placement failed at backend/Redux level even after client check.");
      // No need to refund here as decrementBalance in the slice already handles not changing balance on failure.
      alert("There was an issue placing your bet. Please try again.");
    }
  }, [lastTransactionStatus, isSpinning, dispatch]);


  return (
    <div className="flex flex-col items-center justify-center p-4 bg-card rounded-xl shadow-2xl modern-mesh-card w-full max-w-3xl"> {/* Increased max-width slightly */}
      {/* Top section for Jackpot and Last Numbers */}
      <div className="w-full flex justify-between items-center mb-4 px-2">
        <div>
          <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">Progressive Jackpot</h3>
          <p className="text-2xl font-bold text-amber-300 animate-pulse">{jackpotAmount.toLocaleString()} Tokens</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider text-right">Last Numbers</h3>
          <div className="flex gap-1 justify-end">
            {numberHistory.length === 0 && <span className="text-xs text-muted-foreground/70">Spin to see history</span>}
            {numberHistory.map((num, i) => {
              const numData = wheelNumbers.find(wn => wn.num === num) || { color: 'gray-700' }; // Find color for history
              return (
                <span
                  key={i}
                  className={`text-xs font-bold px-1.5 py-0.5 rounded-sm text-white ${getColorClass(numData.color)}`}
                >
                  {num}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-neon-purple-3 mb-6">Roulette</h2>

      <div className="relative mb-8">
        {/* Pointer */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10" style={{ transform: 'translateX(-50%) translateY(-100%) rotate(180deg)' }}>
          <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[15px] border-t-primary"></div>
        </div>

        {/* Roulette Wheel visual */}
        <motion.div
          className="w-80 h-80 md:w-96 md:h-96 border-8 border-neon-purple-4 rounded-full bg-background relative flex items-center justify-center shadow-2xl"
          animate={{ rotate: targetRotation }}
          transition={
            isSpinning
            ? {
                type: "spring",
                damping: 15, // Lower damping allows more oscillation for "tremor"
                stiffness: 40, // Adjust for speed of settling
                mass: 1, // Default is 1, can be adjusted
                duration: 4, // Approximate duration, spring calculates actual
                // ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier for a fast start and smooth end (circOut-like)
              }
            : { duration: 0 } // Instant change if not spinning (e.g. for reset)
          }
        >
          {wheelNumbers.map((sector, index) => {
            // The static rotation of sectors should be calculated so that sector 0 is initially at the top.
            // The pointer is at 0 degrees (top).
            // If wheelNumbers[0] is '0g', its initial rotation should make it align under the pointer.
            // The `anglePerSector * index` correctly positions the start of the sector.
            // To align the *middle* of the sector with the pointer, it would be `anglePerSector * index`.
            // However, our pointer points to the start of the sector line.
            // The current calculation `anglePerSector * index - (anglePerSector / 2)` positions the *middle* of the sector wedge at `anglePerSector * index`.
            // So, if sector 0 is at index 0, its middle is at 0 deg. This means its display starts at -anglePerSector/2.
            // This is fine, the `landingAngle` calculation in `handleSpin` correctly targets the middle of the sector.
            const rotation = anglePerSector * index; // Let's simplify: sector i starts at anglePerSector * i

            // To make the pointer point to the division line *before* the number:
            // The first sector (index 0) should start at 0 degrees.
            // The number itself is slightly offset into the sector.
            // The `landingAngle` in `handleSpin` is `-(anglePerSector * winningSectorIndex)`. This targets the start of the sector.
            // Let's adjust the sector rendering slightly to assume the pointer points to the start of a sector.
            // The text and color will be for that sector.
            // So, sector `i` spans from `anglePerSector * i` to `anglePerSector * (i + 1)`.
            // The visual rendering of each sector div will be rotated by `anglePerSector * i`.
            const sectorInitialRotation = anglePerSector * index;
            return (
              <div
                key={`${sector.num}-${index}`}
                className={`absolute w-1/2 h-1/2 origin-bottom-left top-1/2 left-1/2 border-r border-gray-500/50`}
                style={{
                  transform: `rotate(${rotation}deg)`,
                  clipPath: `polygon(0 0, 100% 0, 100% ${Math.tan(anglePerSector/2 * Math.PI/180) * 100}%, 0 ${Math.tan(anglePerSector/2 * Math.PI/180) * 100}%)` // Simplified wedge using percentage - this is tricky
                }}
              >
                <div
                  className={`w-full h-full flex items-center justify-start pt-2 pl-2 ${getColorClass(sector.color)}`}
                  // A more accurate wedge might require a different structure or SVG
                  // For now, this is a simplified rectangular segment rotated.
                  // To make it a proper wedge segment:
                  // clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' on an inner element,
                  // and the parent needs to be a square that is part of the circle.
                  // This current clip-path is a rough attempt to make a slim wedge from origin.
                >
                  <span
                    className="text-xs font-bold text-white transform -rotate-90 origin-center" // Rotate text to be readable
                    style={{ transform: `rotate(${90 - anglePerSector/2}deg) translate(10px, -50%)`, whiteSpace: 'nowrap' }} // Adjust text position and orientation
                  >
                    {sector.num}
                  </span>
                </div>
              </div>
            );
          })}
          {/* Inner circle/decoration */}
          <div className="absolute w-20 h-20 md:w-24 md:h-24 bg-card rounded-full border-4 border-neon-purple-1 shadow-inner-sm"></div>
        </motion.div>
      </div>

      {/* Betting Controls Area */}
      <div className="mb-6 w-full space-y-4">
        <div>
          <label htmlFor="betAmount" className="block text-sm font-medium text-muted-foreground mb-1 text-center">Bet Amount (Min: {minBet})</label>
          <input
            id="betAmount"
            type="number"
            value={currentBet}
            onChange={(e) => setCurrentBet(Math.max(minBet, parseInt(e.target.value, 10) || minBet))}
            className="bg-input text-foreground border-2 border-border-hover rounded-lg p-3 text-center w-full md:w-1/2 mx-auto block text-xl focus:border-primary focus:ring-primary"
            min={minBet}
            disabled={isSpinning}
          />
        </div>

        {/* Bet Type Selection Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <motion.button
            onClick={() => { setSelectedBetType('color'); setSelectedBetValue('red'); }}
            disabled={isSpinning}
            className={`btn btn-md ${selectedBetValue === 'red' && selectedBetType === 'color' ? 'btn-primary ring-2 ring-offset-2 ring-offset-background ring-primary' : 'btn-secondary'} bg-red-600 hover:bg-red-700 text-white`}
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 12px rgba(239,68,68,0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            Red
          </motion.button>
          <motion.button
            onClick={() => { setSelectedBetType('color'); setSelectedBetValue('black'); }}
            disabled={isSpinning}
            className={`btn btn-md ${selectedBetValue === 'black' && selectedBetType === 'color' ? 'btn-primary ring-2 ring-offset-2 ring-offset-background ring-primary' : 'btn-secondary'} bg-black hover:bg-gray-800 text-white`}
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 12px rgba(50,50,50,0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            Black
          </motion.button>
          <motion.button
            onClick={() => { setSelectedBetType('odd_even'); setSelectedBetValue('odd'); }}
            disabled={isSpinning}
            className={`btn btn-md ${selectedBetValue === 'odd' && selectedBetType === 'odd_even' ? 'btn-primary ring-2 ring-offset-2 ring-offset-background ring-primary' : 'btn-secondary'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Odd
          </motion.button>
          <motion.button
            onClick={() => { setSelectedBetType('odd_even'); setSelectedBetValue('even'); }}
            disabled={isSpinning}
            className={`btn btn-md ${selectedBetValue === 'even' && selectedBetType === 'odd_even' ? 'btn-primary ring-2 ring-offset-2 ring-offset-background ring-primary' : 'btn-secondary'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Even
          </button>
        </div>

        {/* Number Bet Selection (Placeholder - could be a grid) */}
        <div>
          <motion.button
            onClick={() => setSelectedBetType('number')}
            disabled={isSpinning}
            className={`btn btn-md w-full ${selectedBetType === 'number' ? 'btn-primary ring-2 ring-offset-2 ring-offset-background ring-primary' : 'btn-outline'}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Bet on Number (Click to enable, then select from a grid - TBD)
          </motion.button>
          {selectedBetType === 'number' && (
            <div className="mt-2 p-3 bg-background rounded-md border border-border">
              <p className="text-sm text-muted-foreground text-center">Number selection grid will appear here.</p>
              {/* Example: Select a number */}
              <input
                type="number"
                min="0" max="36"
                placeholder="Enter 0-36"
                onChange={(e) => setSelectedBetValue(parseInt(e.target.value,10))}
                className="bg-input text-foreground border-border rounded p-2 w-full mt-2 text-center"
                disabled={isSpinning}
              />
            </div>
          )}
        </div>
      </div>

      <motion.button
        onClick={handleSpin}
        disabled={isSpinning || !selectedBetType || currentBet < minBet} // Disable if no bet type selected or bet too low
        className="btn btn-primary btn-lg btn-animated w-full md:w-1/2 neon-pulse disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: 1.03, y: -2, boxShadow: "0px 10px 20px var(--shadow-neon-hover)" }}
        whileTap={{ scale: 0.97, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        {isSpinning ? 'Spinning...' : `Spin for ${currentBet} Tokens`}
      </motion.button>

      {/* CJ AI Message Area & Last Winning Number */}
      <div className="mt-6 w-full text-center space-y-2" aria-live="polite"> {/* Announce changes in this region */}
        {cjaiMessage && (
          <motion.div
            key={cjaiMessage} // Key change will trigger animation
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-3 bg-primary/10 border border-primary/30 rounded-lg text-primary text-sm italic"
            role="status" // Role for live region content
          >
            <strong>CJ AI:</strong> {cjaiMessage}
          </motion.div>
        )}
        {lastWinningNumber !== null && (
           <motion.div
            key={`win-${lastWinningNumber}-${numberHistory.length}`} // Ensure re-animation
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="p-2 bg-background/50 rounded-md"
            role="status" // Announce winning number
          >
            <span className="text-muted-foreground">Last Winning Number: </span>
            <span className={`font-bold text-xl px-2 py-1 rounded ${getColorClass(wheelNumbers.find(s => s.num === lastWinningNumber)?.color || 'g')} text-white`}>
              {lastWinningNumber}
            </span>
          </motion.div>
        )}
        {!isSpinning && !cjaiMessage && lastWinningNumber === null && (
           <p className="text-sm text-muted-foreground">Place your bets!</p>
        )}
      </div>
    </div>
  );
};

export default RouletteWheel;
