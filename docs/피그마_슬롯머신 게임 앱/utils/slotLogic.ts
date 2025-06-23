// 슬롯 머신 게임 로직

export const SYMBOLS = ['🍒', '🔔', '💎', '7️⃣', '⭐'];

export interface WinResult {
  isWin: boolean;
  payout: number;
  winType?: string;
  winningPositions?: number[];
}

export function checkWinCondition(reels: string[], betAmount: number): WinResult {
  const result: WinResult = {
    isWin: false,
    payout: 0,
    winningPositions: []
  };

  // 3개 모두 같은 경우 (트리플)
  if (reels[0] === reels[1] && reels[1] === reels[2]) {
    result.isWin = true;
    result.winningPositions = [0, 1, 2];

    switch (reels[0]) {
      case '🍒':
        result.payout = betAmount * 5;
        result.winType = '🍒 체리 트리플! 🍒';
        break;
      case '🔔':
        result.payout = betAmount * 10;
        result.winType = '🔔 벨 트리플! 🔔';
        break;
      case '💎':
        result.payout = betAmount * 20;
        result.winType = '💎 다이아몬드 트리플! 💎';
        break;
      case '7️⃣':
        result.payout = betAmount * 50;
        result.winType = '7️⃣ 럭키 세븐! 7️⃣';
        break;
      case '⭐':
        result.payout = betAmount * 100;
        result.winType = '⭐ 메가 잭팟! ⭐';
        break;
      default:
        result.payout = betAmount * 2;
        result.winType = '🎉 트리플 매치! 🎉';
    }
  }
  // 2개가 같은 경우 (더블)
  else if (reels[0] === reels[1]) {
    result.isWin = true;
    result.winningPositions = [0, 1];
    result.payout = Math.floor(betAmount * 1.5);
    result.winType = '🎯 더블 매치! 🎯';
  }
  else if (reels[1] === reels[2]) {
    result.isWin = true;
    result.winningPositions = [1, 2];
    result.payout = Math.floor(betAmount * 1.5);
    result.winType = '🎯 더블 매치! 🎯';
  }
  else if (reels[0] === reels[2]) {
    result.isWin = true;
    result.winningPositions = [0, 2];
    result.payout = Math.floor(betAmount * 1.5);
    result.winType = '🎯 더블 매치! 🎯';
  }

  return result;
}

// 심볼별 가중치 (낮을수록 자주 나옴)
export const SYMBOL_WEIGHTS = {
  '🍒': 30, // 가장 자주 나옴
  '🔔': 25,
  '💎': 20,
  '7️⃣': 15,
  '⭐': 5   // 가장 희귀
};

// 가중치를 적용한 랜덤 심볼 생성
export function getWeightedRandomSymbol(): string {
  const totalWeight = Object.values(SYMBOL_WEIGHTS).reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const [symbol, weight] of Object.entries(SYMBOL_WEIGHTS)) {
    random -= weight;
    if (random <= 0) {
      return symbol;
    }
  }
  
  return SYMBOLS[0]; // 폴백
}

// 연속 패배 시 승리 확률 증가 로직
export function adjustWinChance(consecutiveLosses: number): boolean {
  const baseChance = 0.15; // 15% 기본 승리 확률
  const bonusChance = Math.min(consecutiveLosses * 0.05, 0.3); // 최대 30% 보너스
  const totalChance = baseChance + bonusChance;
  
  return Math.random() < totalChance;
}

// 잭팟 확률 계산
export function calculateJackpotChance(betAmount: number, consecutiveSpins: number): boolean {
  if (betAmount < 50) return false; // 최소 50코인 이상 베팅 시에만 잭팟 가능
  
  const baseChance = 0.001; // 0.1% 기본 확률
  const betMultiplier = Math.min(betAmount / 100, 2); // 베팅액에 따른 배수 (최대 2배)
  const spinBonus = Math.min(consecutiveSpins * 0.0001, 0.005); // 스핀 횟수 보너스
  
  const totalChance = baseChance * betMultiplier + spinBonus;
  return Math.random() < totalChance;
}