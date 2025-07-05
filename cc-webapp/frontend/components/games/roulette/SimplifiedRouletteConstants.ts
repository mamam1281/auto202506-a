// SimplifiedRouletteConstants.ts - 12숫자 룰렛용 상수 및 유틸 함수

export interface SimplifiedBet {
  type: 'number' | 'color';
  value: number | 'red' | 'black';
  amount: number;
}

export interface SimplifiedGameState {
  balance: number;
  isSpinning: boolean;
  winningNumber: number | null;
  bets: SimplifiedBet[];
  history: number[];
}

// 12숫자 룰렛: 0-11
export const SIMPLIFIED_ROULETTE_NUMBERS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

// 칩 금액 옵션
export const CHIP_VALUES = [5, 10, 25, 50];

// 색상 계산 (0은 녹색, 홀수는 빨강, 짝수는 검정)
export function getSimplifiedNumberColor(number: number): 'green' | 'red' | 'black' {
  if (number === 0) return 'green';
  return number % 2 === 1 ? 'red' : 'black';
}

// 승리 판정
export function checkSimplifiedWin(bet: SimplifiedBet, winningNumber: number): boolean {
  if (bet.type === 'number') {
    return bet.value === winningNumber;
  } else if (bet.type === 'color') {
    const winningColor = getSimplifiedNumberColor(winningNumber);
    // 0 (녹색)이 나오면 모든 색상 베팅은 패배
    if (winningColor === 'green') return false;
    return bet.value === winningColor;
  }
  return false;
}

// 배당률 계산
export function getSimplifiedPayout(bet: SimplifiedBet): number {
  if (bet.type === 'number') {
    return 12; // 12배 배당 (12개 숫자)
  } else if (bet.type === 'color') {
    return 2; // 2배 배당
  }
  return 0;
}

// 총 승리 금액 계산
export function calculateSimplifiedWinnings(bets: SimplifiedBet[], winningNumber: number): number {
  return bets.reduce((total, bet) => {
    if (checkSimplifiedWin(bet, winningNumber)) {
      return total + (bet.amount * getSimplifiedPayout(bet));
    }
    return total;
  }, 0);
}

// 휠 위치 계산 (360도를 12등분)
export function getWheelRotation(number: number): number {
  return (number * 30) + (Math.random() * 10 - 5); // 약간의 랜덤 추가
}
