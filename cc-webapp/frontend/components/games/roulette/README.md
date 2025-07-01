# 🎰 Roulette Components Guide

## 현재 사용 중인 컴포넌트

### `UltraCompactRoulette.tsx` ⭐ **MAIN COMPONENT**
- **설명**: 400x750 모바일에 최적화된 극한 압축 룰렛
- **특징**: 
  - 12숫자 (0-11) 간소화된 룰렛
  - 208px 크기 휠 (가독성 좋음)
  - 압축된 UI 레이아웃
  - 보라색 카지노 테마
  - 완전한 게임 기능

### `SimplifiedRouletteConstants.ts` 📋 **CONSTANTS**
- **설명**: 12숫자 룰렛용 상수 및 유틸 함수
- **포함**: 
  - `SIMPLIFIED_ROULETTE_NUMBERS`: [0,1,2,3,4,5,6,7,8,9,10,11]
  - `getSimplifiedNumberColor()`: 색상 계산
  - `checkSimplifiedWin()`: 승리 판정
  - 타입 정의들

## App.tsx에서 사용법

```tsx
import UltraCompactRoulette from './components/roulette/UltraCompactRoulette';

export default function App() {
  return (
    <div className="min-h-screen vh-optimized">
      <UltraCompactRoulette />
    </div>
  );
}
```

## 게임 특징

### 🎯 베팅 옵션
- **숫자 베팅**: 0-11 (12x 배당)
- **색상 베팅**: 빨강/검정 (2x 배당)
- **칩 선택**: $5, $10, $25, $50

### 🎮 게임 플로우
1. 칩 금액 선택
2. 숫자 또는 색상에 베팅
3. SPIN 버튼으로 게임 시작
4. 휠이 돌아가며 결과 표시
5. 승리 시 잔액 증가 + 축하 애니메이션

### 📱 모바일 최적화
- **화면 크기**: 400x750px 완벽 지원
- **스크롤 없음**: 모든 UI가 한 화면에
- **터치 친화적**: 최소 32px 버튼 크기
- **압축 레이아웃**: space-y-2, 작은 패딩

## 향후 확장 가능한 컴포넌트들

### `BettingTable.tsx` 🔧 **미완성**
- 추후 복잡한 베팅 테이블용

### `GameHistory.tsx` 🔧 **미완성**  
- 게임 히스토리 기능용

### `constants.ts` 📋 **레거시**
- 37숫자 풀 룰렛용 (현재 미사용)

---

## ⚠️ 중요 사항

**현재 `UltraCompactRoulette.tsx`만 사용하세요!**

다른 컴포넌트들은 개발 과정에서 생긴 구버전들이므로 무시하셔도 됩니다.