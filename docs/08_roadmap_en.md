# 🗺️ 프로젝트 로드맵 (Updated: 2025.06.16)

## 🎉 **PHASE 1: 완료된 핵심 시스템들** ✅

### ✅ 게임 엔진 완전 구축 (100% 완료) 🎮
- **슬롯 머신**: Variable-Ratio + 스트릭 보너스 + DB 토큰 연동 ✅
- **룰렛**: 베팅 타입별 페이아웃 + 하우스 엣지 완전 구현 ✅
- **가챠**: Pity System + 등급별 확률 + DB 토큰 관리 ✅
- **RPS 게임**: 베팅 시스템 + 완전 API 엔드포인트 ✅

### ✅ 백엔드 아키텍처 완전 안정화 (100% 완료) 🏗️
- **Clean Architecture**: 위임 패턴 기반 완벽 구현 ✅
- **테스트 안정성**: 274개 테스트 100% 통과 ✅
- **토큰 시스템**: 완전 DB 기반 전환 (User.cyber_token_balance) ✅
- **AI 서비스**: CJ AI Service 완전 구현 + 테스트 ✅

### ✅ 프론트엔드 구조 완전 정리 (95% 완료) 🗂️
- **단일 아키텍처**: Next.js 15 + React 19 확정 ✅
- **게임 UI**: 4개 게임 컴포넌트 완전 구현 ✅
- **중복 제거**: cc-webapp-frontend (Vite) 완전 삭제 ✅
- **빌드 시스템**: Docker + Turbopack 정상 작동 ✅

---

## 🚀 **PHASE 2: 현재 진행 중** (85% 완료)

### CJ AI 커뮤니케이션 기반 구축 🤖 (90% 완료)
- ✅ 기본 감정 분석 및 응답 시스템 완성
- ✅ `/api/chat` 엔드포인트 배포 완료
- ✅ WebSocket 통신 기반 구조 완성
- 🔄 로컬 LLM 실제 모델 로딩 (sentiment_analyzer.py)

### 사이버 토큰 통합 테스트 💰 (95% 완료)
- ✅ 앱 내 토큰 사용 플로우 완전 구현
- ✅ TokenService DB 기반 완전 전환
- ✅ 모든 게임 API DB 토큰 연동 완료
- 🔄 외부 결제 게이트웨이 연동 (15% 남음)

### 프론트엔드-백엔드 완전 연동 🔗 (80% 완료)
- ✅ 백엔드 API 모든 엔드포인트 정상 작동
- ✅ 프론트엔드 게임 컴포넌트 완전 구현
- 🔄 실제 게임 플레이 통합 테스트 (20% 남음)
- 🔄 사용자 대시보드 UI 완성 (40% 남음)

---

## 📊 **PHASE 3: 고급 분석 및 확장** (30% 완료)

### UI/UX 개선 🎨 (40% 완료)
- ✅ 기본 게임 애니메이션 구현
- 🔄 슬롯·룰렛·가챠 애니메이션 고도화
- 🔄 "한 번 더" 토스트 반복 로직
- 🔄 사용자 경험 최적화
- 게시판 기능 초기 버전 개발

<!-- English translation below -->

# Project Roadmap (English Translation)

## 8.1. Q2: Initial Stabilization 🚀

### Invite Code System Enhancement 🔐
- Advanced script for issuing Invite Codes for administrators
- Strengthened validation logic for invite codes
  - Expiration date implementation
  - Duplicate prevention mechanism

### CJ AI Communication Infrastructure 🤖
- Basic keyword mapping and sentiment response ruleset configuration
- Deployment of `/api/chat` endpoint
- Seamless integration with the frontend

### Cyber Token Integration Testing 💰
- Verification of token acquisition flow from the main site to the app
- Testing of token usage flow within the app
- Scheduling of Redis > DB synchronization backup tasks

## 8.2. Q3: Dopamine Loop Optimization 🎢

### UI/UX Improvements 🎨
- Advanced animations for slots, roulette, and gacha
- "One More Time" toast repetition logic
- Animation speed optimization

### AI Model Enhancement 🧠
- Integration of advanced CJ AI model
- Testing of external LLM integration
- Enhancement of sentiment analysis and natural language generation
  - Application of prompt engineering

### Event System Establishment 🎉
- Automated weekend event creation scheduler
- Development of push/banner display logic

## 8.3. Q4: Advanced Analytics and Expansion 📊

### Predictive Model Deployment 🔮
- Development of LTV/Churn Prediction model
- Training of predictive model based on XGBoost
- Visualization of analytics dashboard for administrators

### Community Feature Prototype 🤝
- Leaderboard improvements
  - Friend invitation rankings
  - Weekly rankings
  - VIP rankings
- Real-time chat system
- Initial version development of bulletin board feature
