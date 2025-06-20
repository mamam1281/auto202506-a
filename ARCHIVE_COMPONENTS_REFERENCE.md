# 🗂️ Archive 컴포넌트 참조 관계 문서

## 📋 삭제된 Archive 컴포넌트 목록

### 컴포넌트 파일들 (components/archive/)
1. **AdultContentViewer.jsx** - 성인 콘텐츠 뷰어
2. **CardBase.tsx** - 기본 카드 컴포넌트  
3. **EmotionFeedback.jsx** - 감정 피드백 컴포넌트
4. **Gacha.jsx** - 가챠 게임 컴포넌트
5. **NotificationBanner.jsx** - 알림 배너
6. **QuizForm.jsx** - 퀴즈 폼 컴포넌트
7. **Roulette.jsx** - 룰렛 게임 컴포넌트
8. **RPSGame.jsx** - 가위바위보 게임 컴포넌트
9. **SlotMachine.jsx** - 슬롯머신 게임 (구 버전)
10. **TokenDisplay.jsx** - 토큰 표시 컴포넌트

---

## 🔗 참조 관계 및 대체 필요 페이지들

### 1. Adult Content 페이지
- **파일**: `app/adult_content/page.jsx`
- **참조**: AdultContentViewer 컴포넌트 사용
- **상태**: 현재 import 에러로 빌드 실패
- **대체 필요**: 새로운 AdultContentViewer 컴포넌트 구현

### 2. Gacha 페이지
- **파일**: `app/gacha/page.jsx`
- **참조**: Gacha 컴포넌트 사용
- **상태**: 현재 import 에러로 빌드 실패
- **대체 필요**: 새로운 Gacha 게임 컴포넌트 구현

### 3. RPS 페이지
- **파일**: `app/rps/page.jsx`
- **참조**: RPSGame 컴포넌트 사용
- **상태**: 현재 import 에러로 빌드 실패
- **대체 필요**: 새로운 RPSGame 컴포넌트 구현

### 4. Roulette 페이지
- **파일**: `app/roulette/page.jsx`
- **참조**: Roulette 컴포넌트 사용
- **상태**: 현재 import 에러로 빌드 실패
- **대체 필요**: 새로운 Roulette 게임 컴포넌트 구현

### 5. Quiz 페이지
- **파일**: `app/quiz/page.jsx`
- **참조**: QuizForm 컴포넌트 사용
- **상태**: 현재 import 에러로 빌드 실패
- **대체 필요**: 새로운 QuizForm 컴포넌트 구현

### 6. Layout 파일
- **파일**: `app/layout.js`
- **참조**: NotificationBanner 컴포넌트 사용 (주석 처리됨)
- **상태**: 이미 주석 처리되어 빌드 에러 없음
- **대체 필요**: 새로운 NotificationBanner 컴포넌트 구현

---

## 🎯 재구현 우선순위

### 즉시 구현 필요 (Week 2 게임 컴포넌트)
1. **SlotMachine** ✅ (이미 새 버전 구현됨 - `components/games/Slotmachine.tsx`)
2. **Roulette** ❌ (재구현 필요)
3. **RPSGame** ❌ (재구현 필요)  
4. **Gacha** ❌ (재구현 필요)

### 중간 우선순위 (Week 3 UX 강화)
5. **QuizForm** ❌ (재구현 필요)
6. **EmotionFeedback** ❌ (재구현 필요)
7. **NotificationBanner** ❌ (재구현 필요)

### 낮은 우선순위 (Week 4+ 고급 기능)
8. **AdultContentViewer** ❌ (재구현 필요)
9. **TokenDisplay** ❌ (이미 새 버전 존재 - `components/ui/TokenDisplay.tsx`)
10. **CardBase** ❌ (이미 새 버전 존재 - `components/ui/data-display/Cardbase.tsx`)

---

## 📝 구현 시 참고사항

### 기존 구현과 호환성
- **새로운 컴포넌트는 `components/ui/` 구조 준수**
- **Week 1 완료된 Modal, Toast 등 활용**
- **반응형 디자인 가이드 적용**
- **Storybook 테스트 포함**

### 게임 컴포넌트 특이사항
- **백엔드 API 연동**: `/api/games/` 엔드포인트 활용
- **토큰 시스템**: 기존 Token 서비스 연동
- **사운드 효과**: 게임별 사운드 컨트롤러 적용
- **애니메이션**: Framer Motion 활용한 게임 효과

---

**문서 생성일**: 2025-06-20  
**상태**: Archive 폴더 삭제 예정, 참조 관계 문서화 완료
