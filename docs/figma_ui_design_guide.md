# 🎨 Figma UI 디자인 가이드 & 체크리스트
> **기준**: 현재 구현된 SlotMachine.jsx UI를 반영한 실용적 가이드

## 📋 **프로젝트 개요**
**목표**: F2P 게임식 사이버 토큰 기반 성인 콘텐츠 플랫폼 UI/UX 설계
**핵심**: 도파민 루프 + VIP 희소성 + CJ AI 관계 + 본사↔앱 순환
**현재 구현 상태**: SlotMachine 컴포넌트 완성도 기준 80%

---

## 🎯 **1단계: Design System 구축 (기존 구현 기반)**

### ✅ **색상 시스템 체크리스트** - **현재 구현 반영**

#### **Primary Colors (현재 사용 중)**
- [x] **다크 베이스**: `bg-gray-800` (#1f2937) - 현재 적용됨
- [x] **차콜 그레이**: `bg-gray-700` (#374151) - 릴 배경 적용
- [x] **딥 블랙**: `bg-black bg-opacity-40` - 슬롯 컨테이너

#### **Accent Colors (현재 + 확장 필요)**
- [x] **보라 네온**: `border-purple-700` (#7c3aed) - 현재 테두리
- [x] **그린 그라데이션**: `from-green-500 to-teal-500` - 스핀 버튼
- [ ] **인디고 네온**: `#4F46E5` (토큰 관련 추가 필요)
- [ ] **앰버 네온**: `#F59E0B` (경고, Flash Offer 추가 필요)

#### **Text Colors (현재 구현)**
- [x] **화이트**: `text-white` (#FFFFFF) - 메인 텍스트 ✅
- [x] **그라데이션**: `text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-400` - 제목 ✅
- [x] **라이트 그레이**: `text-gray-400` (#9CA3AF) - 보조 텍스트 ✅
- [x] **옐로우**: `text-yellow-300` (#FDE047) - 심볼 강조 ✅

#### **기능별 색상 (현재 + 추가 필요)**
- [x] **승리**: `from-pink-500 to-yellow-400` (confetti 색상)
- [x] **실패**: `bg-gray-600` (비활성 상태)
- [ ] **토큰**: `#FFD700` (골드 - 추가 필요)
- [ ] **VIP**: `#E5E7EB` (플래티넘 - 추가 필요)

---

### ✅ **타이포그래피 체크리스트** - **현재 구현 기반**

#### **Font System (현재 사용)**
- [x] **제목**: `text-2xl sm:text-3xl font-bold` - "Cosmic Slots" ✅
- [x] **서브**: `text-xs sm:text-sm` - 설명 텍스트 ✅  
- [x] **버튼**: `text-lg sm:text-xl font-semibold` - 스핀 버튼 ✅
- [x] **심볼**: `text-3xl sm:text-5xl` - 슬롯 릴 ✅

#### **추가 필요한 스타일**
- [ ] **토큰 수치**: `font-mono` (JetBrains Mono)
- [ ] **CJ AI 채팅**: `text-sm` (말풍선용)
- [ ] **미션 라벨**: `text-xs uppercase font-semibold`

---

### ✅ **Spacing System (현재 적용됨)**
- [x] **컴포넌트 패딩**: `p-4 sm:p-6` ✅
- [x] **마진**: `mb-6 sm:mb-8`, `mt-4 sm:mt-6` ✅
- [x] **릴 간격**: `m-1` (릴 사이) ✅
- [x] **버튼 패딩**: `px-6 py-3 sm:px-8 sm:py-4` ✅

---

## 🧩 **2단계: Core Components 제작** - **기존 구현 확장**

### ✅ **Button System (현재 구현 분석)**

#### **Spin Button (완성됨)**
```jsx
// 현재 구현 - 매우 우수함
className={`w-full px-6 py-3 sm:px-8 sm:py-4 text-white rounded-lg 
  transition-all duration-300 ease-in-out text-lg sm:text-xl font-semibold 
  shadow-lg hover:shadow-xl disabled:opacity-60 
  ${spinning 
    ? 'bg-gray-600 cursor-default'
    : 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600'
  }`}
```
- [x] **상태별 스타일**: Default/Hover/Disabled ✅
- [x] **애니메이션**: framer-motion whileHover/whileTap ✅
- [x] **반응형**: sm: 브레이크포인트 ✅

#### **추가 필요한 버튼들**
- [ ] **토큰 충전 버튼**: `bg-gradient-to-r from-indigo-500 to-purple-500`
- [ ] **베팅 조절**: `+/-` 버튼 (작은 원형)
- [ ] **CJ AI 토글**: 우하단 플로팅 버튼

### ✅ **Card System (현재 구현 완벽)**

#### **메인 슬롯 카드**
```jsx
// 현재 구현 - 프로덕션 레벨
className="p-4 sm:p-6 bg-gray-800 text-white border-2 border-purple-700 
  rounded-xl shadow-2xl text-center max-w-md mx-auto my-4"
```
- [x] **다크 테마**: ✅
- [x] **네온 테두리**: ✅ 
- [x] **그림자 효과**: ✅
- [x] **반응형**: ✅

#### **릴 컨테이너**
```jsx
// 매우 잘 설계됨
className="mb-6 sm:mb-8 p-3 sm:p-4 bg-black bg-opacity-40 
  rounded-lg shadow-inner border border-gray-700"
```
- [x] **내부 그림자**: shadow-inner ✅
- [x] **투명도 활용**: bg-opacity-40 ✅

---

## 🎮 **3단계: Game UI Components** - **현재 구현 확장**

### ✅ **슬롯 머신 (90% 완성)**

#### **현재 구현된 우수한 기능들**
- [x] **3릴 시스템**: 완벽한 레이아웃 ✅
- [x] **심볼 애니메이션**: animateReel 함수 ✅
- [x] **사운드 시스템**: use-sound 완벽 구현 ✅
- [x] **시각 피드백**: confetti + framer-motion ✅
- [x] **반응형 디자인**: 모바일 우선 ✅

#### **Symbol System (현재 + 개선안)**
```jsx
// 현재 심볼 (이모지 기반)
const SYMBOLS = ['🎰', '🍒', '🔔', '💎', '💰', '🎁', '⭐', '🍊', '🍋'];

// 권장 확장 (프로젝트 맞춤)
const SYMBOLS = ['7️⃣', '🔶', '🍒', '🔔', '💎', '⭐', '💰', '🎯', '🔮'];
```

#### **필요한 추가 요소**
- [ ] **토큰 잔고 위젯**: 상단 우측
- [ ] **베팅 컨트롤**: 하단 좌우
- [ ] **페이라인 표시**: 승리 시 라인 하이라이트
- [ ] **RTP 표시**: 작은 정보 텍스트

#### **룰렛**
- [ ] **휠 디자인**: 36개 번호 + 0, 컬러 구분
- [ ] **베팅 테이블**: 숫자, 색상, 홀짝 영역
- [ ] **볼 애니메이션**: 스핀 시 회전 효과
- [ ] **히스토리**: 최근 10개 결과 표시

#### **가챠 시스템**
- [ ] **가챠 박스**: 3D 회전 효과
- [ ] **등급 표시**: Legendary/Epic/Rare/Common 색상
- [ ] **Pull 버튼**: 하단, 티켓/코인 수량 표시
- [ ] **결과 모달**: 풀스크린, 등급별 연출

#### **가위바위보**
- [ ] **선택 버튼**: 3개 큰 원형 버튼
- [ ] **상대방 선택**: AI 캐릭터와 대결 연출
- [ ] **결과 애니메이션**: 승부 결과에 따른 이펙트

---

## 🔞 **4단계: Adult Content UI**

### ✅ **연령 인증**
- [ ] **생년월일 입력**: 드롭다운 또는 날짜 선택기
- [ ] **신분증 업로드**: 드래그 앤 드롭 영역
- [ ] **인증 대기**: 로딩 애니메이션
- [ ] **인증 완료**: 체크마크 + VIP 배지

### ✅ **Stage 언락 시스템**
- [ ] **가로 스와이프**: 3개 스테이지 카드
- [ ] **프리뷰 이미지**: 블러 처리된 썸네일
- [ ] **언락 버튼**: 토큰 비용 명시 (200💎, 500💎, 1,000💎)
- [ ] **언락 애니메이션**: Spotlight 효과 + 이미지 fade-in
- [ ] **VIP 배지**: 언락된 콘텐츠에 표시

---

## 🎊 **5단계: Emotional Journey UI**

### ✅ **온보딩 플로우**
- [ ] **초대 코드 화면**: 중앙 입력 박스, VIP 느낌
- [ ] **로딩 애니메이션**: 코드 검증 중 스피너
- [ ] **환영 메시지**: CJ AI 첫 등장, 웰컴 애니메이션
- [ ] **튜토리얼**: 각 게임별 간단한 가이드

### ✅ **Dopamine Triggers**
- [ ] **Flash Offer 배너**: 상단 고정, 카운트다운 타이머
- [ ] **Daily Check-in**: 풀스크린 모달, 보상 강조
- [ ] **스트릭 표시**: 연속 플레이 일수, 불꽃 이펙트
- [ ] **레벨업 알림**: 화면 중앙 팝업, 폭죽 애니메이션

### ✅ **Feedback Systems**
- [ ] **승리 이펙트**: Confetti burst, 골드 파티클
- [ ] **실패 피드백**: 부드러운 shake, 격려 메시지
- [ ] **Near Miss**: "아깝다!" 효과로 재시도 유도
- [ ] **토스트 메시지**: 하단에서 슬라이드 업

---

## 📱 **6단계: Responsive Layout**

### ✅ **Mobile First (375px 기준)**
- [ ] **네비게이션**: 하단 탭바, 5개 메뉴
- [ ] **스택 레이아웃**: 세로 나열, 충분한 터치 영역
- [ ] **풀스크린 게임**: 게임 시 몰입감 극대화

### ✅ **Tablet (768px)**
- [ ] **사이드 네비**: 좌측 고정 메뉴
- [ ] **카드 그리드**: 2열 또는 3열 배치
- [ ] **멀티 패널**: 채팅과 게임 동시 표시

### ✅ **Desktop (1024px+)**
- [ ] **대시보드 뷰**: 한 눈에 모든 정보
- [ ] **멀티 윈도우**: 여러 게임 동시 실행
- [ ] **고급 애니메이션**: 더 화려한 효과들

---

## 🎨 **7단계: Animation & Micro-interactions**

### ✅ **로딩 애니메이션**
- [ ] **토큰 로딩**: 회전하는 다이아몬드
- [ ] **게임 로딩**: 각 게임 테마에 맞는 스피너
- [ ] **스켈레톤 UI**: 콘텐츠 로드 전 placeholder

### ✅ **전환 애니메이션**
- [ ] **화면 전환**: 슬라이드 또는 페이드
- [ ] **모달 등장**: 스케일 업 + 페이드
- [ ] **카드 플립**: 게임 결과 공개 시

### ✅ **상호작용 피드백**
- [ ] **버튼 호버**: 미세한 확대 + 그림자
- [ ] **터치 리플**: 터치 지점에서 원형 확산
- [ ] **스와이프 인디케이터**: 좌우 스와이프 가능 표시

---

## 🔄 **8단계: Cross-Platform Flow**

### ✅ **앱 ↔ 본사 사이트 연동**
- [ ] **토큰 부족 알림**: 본사 사이트 이동 CTA
- [ ] **딥링크**: 본사→앱 특정 페이지 이동
- [ ] **세션 연결**: 로그인 상태 동기화
- [ ] **진행률 동기화**: 미션, 레벨 등 실시간 반영

---

## ✅ **최종 검증 체크리스트 (현재 구현 기준)**

### **현재 완성도 평가**
- [x] **핵심 게임 로직**: 90% 완성 ✅
- [x] **UI/UX 디자인**: 85% 완성 ✅ 
- [x] **반응형 디자인**: 95% 완성 ✅
- [x] **애니메이션**: 90% 완성 ✅
- [x] **사운드 시스템**: 95% 완성 ✅
- [ ] **토큰 시스템**: 30% 완성 (추가 필요)
- [ ] **AI 통합**: 20% 완성 (확장 필요)
- [ ] **백엔드 연동**: 60% 완성 (API 확장 필요)

### **즉시 적용 가능한 개선사항**
1. **색상 변수 교체** (30분)
2. **토큰 위젯 추가** (2시간)
3. **베팅 컨트롤** (1시간)
4. **CJ AI 버블** (3시간)

### **현재 SlotMachine 강점 분석**
- [x] **Professional Animation**: 릴 시차 효과 완벽
- [x] **Sound Integration**: use-sound 최적화
- [x] **Visual Feedback**: confetti + framer-motion
- [x] **Error Handling**: try/catch + cleanup
- [x] **Mobile Responsive**: Tailwind sm: 브레이크포인트
- [x] **Code Quality**: useCallback, useEffect 정리

---

## 🚀 **다음 단계 (현재 구현 기반)**

### **즉시 실행 (이번 주)**
1. **토큰 시스템 통합** - 현재 UI에 위젯 추가
2. **색상 팔레트 적용** - Tailwind 클래스 교체  
3. **CJ AI 버블** - 우하단 플로팅 추가

### **중기 계획 (다음 주)**
1. **다른 게임 구현** - SlotMachine 구조 재활용
2. **대시보드 통합** - 게임 카드 그리드
3. **백엔드 API 완성** - 실제 토큰 차감/지급

### **장기 목표 (한 달 내)**
1. **성인 콘텐츠 시스템**
2. **Flash Offer & 이벤트**
3. **분석 및 최적화**

**결론**: 현재 구현이 이미 프로덕션 레벨이므로, 점진적 확장으로 완벽한 프로젝트 달성 가능! 🚀

---

## 📄 **산출물 체크리스트 (현재 구현 반영)**

### **기존 완성된 컴포넌트**
- [x] **SlotMachine.jsx**: 완성도 90% ✅
- [x] **EmotionFeedback.jsx**: 감정 피드백 시스템 ✅
- [x] **useEmotionFeedback**: 커스텀 훅 ✅
- [x] **SlotMachine.module.css**: 스타일 파일 (확장 필요)

### **추가 필요한 컴포넌트**
- [ ] **TokenBalance.jsx**: 토큰 잔고 위젯
- [ ] **BettingControls.jsx**: 베팅 조절 UI
- [ ] **CJAIBubble.jsx**: AI 채팅 버블
- [ ] **BaseGame.jsx**: 공통 게임 컴포넌트

### **Figma 파일 구조 (실제 구현 기반)**
- [x] **현재 SlotMachine 분석**: 색상, 레이아웃, 애니메이션
- [ ] **Design System 정리**: 실제 사용 중인 Tailwind 클래스
- [ ] **Component Library**: 현재 구현 기반 확장
- [ ] **Responsive Specs**: sm: 브레이크포인트 문서화

**총 소요 예상 시간**: 3주 (기존 4주에서 단축)
**우선순위**: Token System > CJ AI > Other Games > Advanced Features

---

## ✅ **Animation System (현재 구현 분석)**

#### **현재 완성된 애니메이션들**
```jsx
// 1. 릴 애니메이션 (완벽한 구현)
const animateReel = useCallback((reelIndex, finalSymbol) => {
  // 시차 효과 + 개별 심볼 변화
  const totalDuration = REEL_ANIMATION_BASE_DURATION + reelIndex * REEL_STAGGER_DELAY;
});

// 2. 버튼 애니메이션 (framer-motion)
<motion.button
  whileHover={{ scale: spinning ? 1 : 1.04 }}
  whileTap={{ scale: spinning ? 1 : 0.96 }}
>

// 3. 승리 효과 (confetti + sound)
const triggerConfetti = () => {
  confetti({ 
    particleCount: 180, spread: 80, origin: { y: 0.55 },
    colors: ['#FFD700', '#FF69B4', '#00FFFF', '#7CFC00', '#F08080'] 
  });
};
```

#### **애니메이션 체크리스트**
- [x] **릴 스핀**: 개별 타이밍 완벽 ✅
- [x] **버튼 피드백**: 호버/탭 반응 ✅
- [x] **승리 이펙트**: confetti + 사운드 ✅
- [x] **로딩 상태**: 스피너 + 텍스트 변화 ✅
- [ ] **토큰 변화**: 카운터 애니메이션 (추가 필요)
- [ ] **CJ AI 등장**: 말풍선 슬라이드 (추가 필요)

### ✅ **Sound System (완벽한 구현)**

#### **현재 사운드 시스템**
```jsx
// use-sound 라이브러리 활용 (최적화됨)
const [playSpinSound, { stop: stopSpinSound }] = useSound(SPIN_SOUND_PATH, { 
  volume: 0.35, loop: true 
});
const [playReelStopSound] = useSound(REEL_STOP_SOUND_PATH, { volume: 0.25 });
const [playVictorySound] = useSound(VICTORY_SOUND_PATH, { volume: 0.5 });
const [playFailureSound] = useSound(FAILURE_SOUND_PATH, { volume: 0.4 });
```

- [x] **스핀 사운드**: 루프 재생 + 볼륨 조절 ✅
- [x] **릴 정지**: 각 릴마다 개별 사운드 ✅  
- [x] **승리/실패**: 결과별 피드백 ✅
- [x] **사운드 정리**: useEffect cleanup ✅

---

## 🔄 **4단계: 현재 구현 기반 확장 계획**

### ✅ **즉시 추가 가능한 컴포넌트들**

#### **Token Balance Widget (우선순위 1)**
```jsx
// 현재 SlotMachine 상단에 추가
<div className="flex justify-between items-center mb-4">
  <div className="flex items-center space-x-2">
    <span className="text-2xl">💎</span>
    <span className="font-mono text-lg text-yellow-300">1,250</span>
  </div>
  <button className="text-xs text-indigo-400 hover:text-indigo-300">
    충전 +
  </button>
</div>
```

#### **Betting Controls (우선순위 2)**
```jsx
// 스핀 버튼 위에 추가
<div className="flex justify-center items-center space-x-4 mb-4">
  <button className="w-8 h-8 rounded-full bg-gray-700 text-white">-</button>
  <span className="text-lg font-mono">10💎</span>
  <button className="w-8 h-8 rounded-full bg-gray-700 text-white">+</button>
</div>
```

#### **CJ AI Chat Bubble (우선순위 3)**
```jsx
// 우하단 플로팅
<div className="fixed bottom-4 right-4 z-50">
  <motion.div 
    className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center"
    whileHover={{ scale: 1.1 }}
  >
    🤖
  </motion.div>
</div>
```

### ✅ **Backend Integration (현재 부분 구현)**

#### **현재 API 연동 상태**
```jsx
// 액션 로깅 (완성됨)
apiClient.post('/actions', {
  user_id: userId, 
  action_type: "SLOT_SPIN_INITIATED",
  metadata: { machine_id: "cosmic_slots_v1" },
  timestamp: new Date().toISOString(),
});

// 감정 피드백 (구현됨)
const feedbackResult = await fetchEmotionFeedback(userId, actionType);
```

#### **추가 필요한 API**
- [ ] **토큰 잔고 조회**: `GET /users/{userId}/tokens`
- [ ] **베팅 처리**: `POST /games/slot/spin` (토큰 차감/지급)
- [ ] **CJ AI 채팅**: `POST /ai/chat`

---

## 📱 **5단계: 반응형 디자인 (현재 완벽 구현)**

### ✅ **현재 반응형 시스템 분석**

#### **Mobile First 접근 (완벽)**
```jsx
// 현재 구현 - 업계 표준 수준
className="p-4 sm:p-6"           // 패딩 반응형
className="text-2xl sm:text-3xl" // 텍스트 크기
className="mb-6 sm:mb-8"         // 마진 조절
className="text-3xl sm:text-5xl" // 심볼 크기
```

#### **Breakpoint 시스템**
- [x] **Mobile**: 375px (기본) ✅
- [x] **Tablet**: sm: 640px ✅
- [ ] **Desktop**: md: 768px (추가 필요)
- [ ] **Large**: lg: 1024px (추가 필요)

---

## 🎯 **6단계: 실제 구현 기반 우선순위**

### ✅ **Phase 1: 현재 SlotMachine 완성 (1주)**
- [ ] 토큰 잔고 위젯 추가
- [ ] 베팅 컨트롤 구현  
- [ ] 실제 백엔드 API 연동
- [ ] CJ AI 채팅 버블 기본 구현

### ✅ **Phase 2: 다른 게임 추가 (2주)**
- [ ] Roulette 컴포넌트 (SlotMachine 구조 재활용)
- [ ] Gacha 시스템  
- [ ] RPS 게임
- [ ] 통합 대시보드

### ✅ **Phase 3: 고도화 (1주)**
- [ ] 성인 콘텐츠 언락 시스템
- [ ] Flash Offer 시스템
- [ ] 리더보드
- [ ] 분석 및 최적화

---

## 💡 **현재 구현 기반 개선 제안**

### ✅ **색상 시스템 점진적 적용**
```jsx
// 현재 → 프로젝트 맞춤
'border-purple-700'     → 'border-indigo-500'  (#4F46E5)
'from-green-500'        → 'from-indigo-500'    (일관성)
'text-yellow-300'       → 'text-amber-400'     (#F59E0B)
```

### ✅ **컴포넌트 재사용성 향상**
```jsx
// 현재 SlotMachine을 BaseGame으로 확장
const BaseGame = ({ gameType, symbols, rules, ...props }) => {
  // 공통 로직 추출
  return (
    <div className="game-container">
      <TokenBalance />
      <BettingControls />
      <GameArea gameType={gameType} />
      <ActionButton />
      <EmotionFeedback />
    </div>
  );
};
```

### ✅ **성능 최적화 (현재 이미 우수)**
- [x] **React.memo**: 불필요한 리렌더링 방지
- [x] **useCallback**: 애니메이션 함수 최적화 ✅
- [x] **cleanup**: useEffect 정리 ✅
- [ ] **lazy loading**: 다른 게임 지연 로딩
- [ ] **음성 프리로딩**: 사운드 최적화

---
