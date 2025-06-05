# 🗺️ 프로젝트 로드맵

## 8.1. Q2: 초기 안정화 🚀

### 초대 코드 시스템 강화 🔐
- 관리자용 Invite Code 발급 스크립트 고도화
- 초대 코드 유효성 검사 로직 강화
  - 만료 날짜 적용
  - 중복 방지 메커니즘 구현

### CJ AI 커뮤니케이션 기반 구축 🤖
- 기본 키워드 매핑 및 감정 응답 룰셋 설정
- `/api/chat` 엔드포인트 배포
- 프론트엔드와 seamless 연동

### 사이버 토큰 통합 테스트 💰
- 본사 사이트 → 앱 토큰 획득 플로우 검증
- 앱 내 토큰 사용 플로우 테스트
- Redis > DB 동기화 백업 작업 스케줄링

## 8.2. Q3: 도파민 루프 최적화 🎢

### UI/UX 개선 🎨
- 슬롯·룰렛·가챠 애니메이션 고도화
- "한 번 더" 토스트 반복 로직
- 애니메이션 속도 최적화

### AI 모델 고도화 🧠
- 심화 CJ AI 모델 통합
- 외부 LLM 연동 테스트
- 감정 분석 + 자연어 생성 고도화
  - Prompt 엔지니어링 적용

### 이벤트 시스템 구축 🎉
- 주말 이벤트 자동 생성 스케줄러
- 푸시/배너 노출 로직 개발

## 8.3. Q4: 고급 분석 및 확장 📊

### 예측 모델 배포 🔮
- LTV/Churn Prediction 모델 개발
- XGBoost 기반 예측 모델 훈련
- 관리자용 Analytics 대시보드 시각화

### 커뮤니티 기능 프로토타입 🤝
- 리더보드 개선
  - 친구 초대 랭킹
  - 주간 랭킹
  - VIP 랭킹
- 실시간 채팅 시스템
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
