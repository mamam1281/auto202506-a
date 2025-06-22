// 애니메이션 타이밍 상수
export const TIMINGS = {
  fast: 150,      // 마이크로 인터랙션
  normal: 300,    // 일반 전환
  slow: 500,      // 페이지 전환
  game: 1000,     // 게임 애니메이션
  reward: 2000    // 리워드 연출
} as const;

// 룰렛 숫자 정의 (실제 룰렛 순서)
export const ROULETTE_NUMBERS = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
] as const;

// 빨간색 숫자들
export const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36] as const;

// 검은색 숫자들
export const BLACK_NUMBERS = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35] as const;

// 게임 상태
export type GameState = 'idle' | 'spinning' | 'result';

// 베팅 타입
export type BetType = 
  | 'number'      // 특정 숫자
  | 'red'         // 빨간색
  | 'black'       // 검은색
  | 'odd'         // 홀수
  | 'even'        // 짝수
  | 'low'         // 1-18
  | 'high'        // 19-36
  | 'dozen1'      // 1-12
  | 'dozen2'      // 13-24
  | 'dozen3'      // 25-36
  | 'column1'     // 첫 번째 컬럼
  | 'column2'     // 두 번째 컬럼
  | 'column3';    // 세 번째 컬럼

// 베팅 정보
export interface Bet {
  id: string;
  type: BetType;
  value: number | string;
  amount: number;
  payout: number;
}

// 게임 결과
export interface GameResult {
  number: number;
  color: 'red' | 'black' | 'green';
  timestamp: number;
}

// 숫자 색상 반환
export const getNumberColor = (num: number): 'red' | 'black' | 'green' => {
  if (num === 0) return 'green';
  if (RED_NUMBERS.includes(num as any)) return 'red';
  return 'black';
};

// 베팅 당첨 확인
export const checkWin = (bet: Bet, result: number): boolean => {
  switch (bet.type) {
    case 'number':
      return bet.value === result;
    case 'red':
      return getNumberColor(result) === 'red';
    case 'black':
      return getNumberColor(result) === 'black';
    case 'odd':
      return result > 0 && result % 2 === 1;
    case 'even':
      return result > 0 && result % 2 === 0;
    case 'low':
      return result >= 1 && result <= 18;
    case 'high':
      return result >= 19 && result <= 36;
    case 'dozen1':
      return result >= 1 && result <= 12;
    case 'dozen2':
      return result >= 13 && result <= 24;
    case 'dozen3':
      return result >= 25 && result <= 36;
    case 'column1':
      return result > 0 && (result - 1) % 3 === 0;
    case 'column2':
      return result > 0 && (result - 2) % 3 === 0;
    case 'column3':
      return result > 0 && result % 3 === 0;
    default:
      return false;
  }
};

// 베팅 배당률
export const getBetPayout = (betType: BetType): number => {
  switch (betType) {
    case 'number': return 35;
    case 'red':
    case 'black':
    case 'odd':
    case 'even':
    case 'low':
    case 'high': return 1;
    case 'dozen1':
    case 'dozen2':
    case 'dozen3':
    case 'column1':
    case 'column2':
    case 'column3': return 2;
    default: return 0;
  }
};