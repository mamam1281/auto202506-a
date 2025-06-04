# 🎮 게임 개발 전체 체크리스트 (#12)

## 프로젝트 기획 및 설계 📋

### 핵심 시스템 설계
- [x] "사이버 토큰 = 본사 사이트 보상" 구조 설계
- [x] 본사 사이트 활동(퀴즈, 이벤트, 로그인 등)으로 토큰 획득 플로우 작성
- [x] 앱 내 게임/언락/가챠에서 토큰 소비 후 부족 시 본사 사이트로 이동 유도 로직

### 도파민 루프 설계 🎯
- [x] 슬롯, 룰렛, 가챠 등 Variable-Ratio 보상 확률표 정의
- [x] 즉각 피드백(애니메이션 + 사운드 + 토큰 증/감) 기획
- [x] Flash Offer 및 Limited-Time Event 시나리오 작성
- [x] Social Proof(리더보드, 랭킹 보너스) 메커니즘 설계

### CJ AI 시스템 설계 🤖
- [x] "실장 대체 AI(CJ)" 페르소나 및 대화 톤/매너 정의
- [x] 키워드-응답 매핑 JSON 템플릿 생성
- [x] 외부 LLM(GPT-4) 연동 옵션 가이드

### 인증 시스템 설계 🔐
- [x] 초대 코드 생성/배포 프로세스 정의
- [x] 닉네임/비밀번호 로그인 플로우 설계
- [x] 가입 즉시 토큰 보상 + CJ AI 웰컴 메시지 시나리오 작성

### 데이터 기반 개인화 설계 📊
- [x] RFM + Risk-Profile + Cyber Token 잔고 결합 로직 설계
- [x] 본사 사이트 재방문 타이밍 예측 알고리즘 스케치

## 초기 세팅 및 인프라 구축 🚀

### 백엔드 구조 표준화 ✅ (2025.06.04 완료)
- [x] 코드 리포지토리 및 버전 관리 체계 구축
- [x] **백엔드 중복 구조 해결**: 루트 `/app/` 제거 및 `/cc-webapp/backend/` 통합
- [x] **Import 경로 표준화**: `from backend.app.` → `from app.` 변경
- [x] **Docker Compose 설정 수정**: 빌드 경로 `./cc-webapp/backend`로 변경
- [x] **환경 변수 시스템**: PYTHONPATH 및 백엔드 경로 설정

### 인증 시스템 구축 🔐
- [x] 초대 코드 테이블 및 모델 정의 (invite_codes)
- [x] FastAPI 인증 엔드포인트 (/api/auth/login) 구현
- [ ] User 모델에 invite_code, nickname, password_hash, cyber_token_balance 필드 추가
- [ ] **⚠️ 미완성**: 데이터베이스 연결 및 라우터 구현체 누락 (테스트 실패 원인)

### 인프라 기본 구축 🚀
- [x] 백엔드 인프라 구축 (FastAPI + PostgreSQL + Redis + Celery/APScheduler)
- [ ] **🔧 진행 중**: PostgreSQL 스키마 마이그레이션 (User, UserAction, UserReward, AdultContent, UserSegment 등)
- [ ] **❌ 실패**: Redis 연결 및 user:{id}:cyber_token_balance 키 패턴 정의 (Kafka 연결 오류)
- [ ] **❌ 실패**: Celery/APScheduler 기본 설정 (RFM 배치, 토큰 동기화)
### 프론트엔드 프로젝트 세팅 🎨
- [ ] 프론트엔드 프로젝트 세팅 (React/Next.js)
- [x] Tailwind CSS + Lucide-react 아이콘 설치
- [x] Redux Toolkit 스토어 구조 생성 (authSlice, tokenSlice, recommendationSlice, leaderboardSlice)
- [x] Axios 기반 apiClient.js 설정 (baseURL, 인터셉터)

### 토큰 및 성인 콘텐츠 시스템 💰
- [x] **사이버 토큰 기본 구조**: 본사 사이트 연동 토큰 시스템 설계
- [x] **성인 콘텐츠 언락 비용**: Stage별 토큰 비용 정의 (Stage 1=200, Stage 2=500, Stage 3=1000)
- [x] **본사 연동 라우터**: 토큰 획득 및 잔고 조회 기본 구조
- [ ] **⚠️ 미완성**: 실제 토큰 차감 및 콘텐츠 제공 로직

## 🚨 현재 발생 중인 문제 (2025.06.04 - 외부 AI 작업 후)

### 백엔드 구조 표준화 결과 ✅❌
- **✅ 완료**: Import 경로 표준화 (`from app.` 형태로 통일)
- **✅ 완료**: 중복 `/app/` 디렉토리 제거 및 `/cc-webapp/backend/` 통합
- **✅ 완료**: Docker Compose 경로 수정
- **❌ 실패**: 테스트 수집 단계에서 `ModuleNotFoundError` 및 Kafka 연결 오류

### 외부 AI 브랜치 병합 후 즉시 수정 작업 ⚡
> **참조 문서**: `IMMEDIATE_FIX_GUIDE.md`, `AI_BACKEND_STANDARDIZATION_PROMPT.md`

- [ ] **우선순위 1**: `database.py` 완성 - SessionLocal, get_db 함수 완전 구현
- [ ] **우선순위 2**: 누락된 라우터 함수 구현 (auth, adult_content, corporate 실제 로직)
- [ ] **우선순위 3**: Kafka 설정 graceful fallback (연결 실패 시 로컬 로깅)
- [ ] **우선순위 4**: 테스트 환경 SQLite DB 설정 (conftest.py 추가)

### 다음 단계 실행 지침 📋
1. **브랜치 병합**: `git merge <외부AI브랜치명>`
2. **자동 수정 스크립트 실행**: `bash fix_backend_structure.sh`
3. **검증 스크립트 실행**: `bash verify_backend_structure.sh`
4. **즉시 수정 가이드 참조**: `IMMEDIATE_FIX_GUIDE.md` 단계별 실행

## 기능 구현 💻

### 단기 (1~2개월) - 현재 단계 🎯

#### 📋 외부 AI 완료 작업 (2025.06.04) ✅
- [x] **백엔드 구조 리팩토링**: 중복 `/app/` 디렉토리 제거
- [x] **Import 경로 표준화**: `from backend.app.` → `from app.` 전환
- [x] **Docker 경로 표준화**: 빌드 컨텍스트 `./cc-webapp/backend`로 통합
- [x] **기본 라우터 골격**: adult_content, corporate, auth 라우터 추가
- [x] **토큰 언락 시스템**: 성인 콘텐츠 단계별 비용 구조 구현
- [x] **테스트 인프라**: test_unlock.py, test_rewards.py, test_notification.py 추가

#### ⚠️ 외부 AI 작업 중 발생한 문제
- **테스트 수집 실패**: `pytest` 실행 시 누락된 의존성으로 인한 ModuleNotFoundError
- **Kafka 연결 오류**: 개발 환경에서 Kafka 브로커 미설정으로 인한 연결 실패
- **데이터베이스 미설정**: `database.py`의 SessionLocal 및 get_db 함수 미완성

#### ⚠️ 즉시 수정 필요 (테스트 실패 해결)
- [ ] **database.py 완성**: SessionLocal, get_db 함수 완전 구현
- [ ] **라우터 함수 구현**: auth, adult_content, corporate 실제 로직
- [ ] **Kafka 설정**: 연결 실패 시 graceful fallback 구현
- [ ] **테스트 환경**: SQLite 테스트 DB 설정

#### 🔄 이어서 진행할 작업
- [ ] 인증 및 CJ AI 기본 챗 시스템 완성
- [ ] InviteCodeInput, NicknamePasswordForm 컴포넌트 완성
- [ ] FastAPI /api/auth/login, /api/chat 엔드포인트 구현
- [ ] CJ AI 키워드-응답 매핑 JSON 로드 및 룰 엔진 작성
- [ ] Cyber Token 획득/소비 플로우 구현
- [ ] /api/actions 엔드포인트로 유저 액션 기록
- [ ] /api/feedback 엔드포인트에 도파민 피드백 로직 통합(토큰 증/감 포함)
- [ ] Redis 토큰 잔고 실시간 업데이트 구현
- [ ] 슬롯/룰렛 MVP + 피드백 시스템
- [ ] SlotMachine, Roulette 컴포넌트 구현 (Spin 버튼, 애니메이션, 사운드)
- [ ] /api/feedback 호출 후 FeedbackToast, CJChatBubble 연계
- [ ] 연속 스트릭(streak) 로직 및 보너스 확률 적용

### 중기 (3~6개월)
- [ ] 가챠 시스템 + 티켓 언락 플로우
- [ ] /api/gacha 엔드포인트 구현 (50토큰 소모, 티켓/코인 보상)
- [ ] TicketUseModal 컴포넌트로 “티켓 사용 → /api/unlock 호출” 설계
- [ ] Adult Content Unlock 고도화
- [ ] /api/unlock 엔드포인트 구현 (세그먼트 레벨 체크, 토큰 차감)
- [ ] AdultUnlockPanel 컴포넌트 구현 (Stage 1~3 스와이프 UI, Flash Offer 표시)
- [ ] Flash Offer API(/api/flash_offer) 및 프론트 배너 연동
- [ ] 데이터 기반 추천 엔진 통합
- [ ] /api/recommendation 엔드포인트 구현 (RFM + Risk-Profile + TokenBalance)
- [ ] useRecommendation Hook 제작, TodayMissionBoard 컴포넌트 구현
- [ ] Social Proof / LeaderBoard
- [ ] UserAction, UserReward 집계 쿼리 작성
- [ ] LeaderboardPanel 컴포넌트 구현 (실시간 랭킹 조회)
- [ ] LeaderboardSlice에 랭킹 데이터 주기 업데이트 작업 스케줄링

### 장기 (6개월 이상)
- [ ] LTV/Churn Prediction 모델 연동
- [ ] XGBoost 기반 모델 훈련 및 API화
- [ ] Analytics 대시보드(Grafana/Metabase) 연동
- [ ] CJ AI 고도화 (외부 LLM 연동)
- [ ] GPT-4 API 연동 테스트 및 프롬프트 엔지니어링
- [ ] 자연어 생성 품질 개선, 감정 분석 정교화
- [ ] In-App Purchase(iOS/Android) 및 국내 PG 연동 모듈 준비

## 테스트 및 검증 🔍
- [ ] 인증 & 온보딩
- [ ] 유효/무효 초대 코드 입력 테스트
- [ ] 닉네임/비밀번호 유효성 검사 테스트
- [ ] 초기 토큰(200💎) 지급 및 CJ AI 웰컴 메시지 확인
- [ ] 사이버 토큰 흐름
- [ ] 본사 사이트 로그인 → Redis 토큰 +100 반영 확인
- [ ] 슬롯/룰렛 GAME_WIN 시 /api/feedback → 토큰 증감 검증
- [ ] GAME_FAIL 시 토큰 차감(–2) 및 “Retry” 피드백 로직 확인
- [ ] 토큰 잔고 부족 → /api/unlock?desired_stage=1 호출 시 402 응답
- [ ] 성인 콘텐츠 언락
- [ ] Medium 그룹 유저 Stage 2 언락 시도 → 200 OK 확인
- [ ] Low 그룹 유저 Stage 2 언락 시도 → 403 Forbidden 확인
- [ ] Whale 그룹 유저 Stage 3 언락 시도 & 토큰 충분 → 200 OK + 이미지 반환
- [ ] Flash Offer 활성화 시 할인 가격 적용 검증
- [ ] 가챠 티켓
- [ ] 토큰 50 이상 보유 → /api/gacha 호출 시 티켓/코인 분포 확인 (확률 5%, 20%, 50%, 25%)
- [ ] 토큰 49 이하 → 402 Insufficient 확인
- [ ] 티켓 결과 시 reward_type="CONTENT_TICKET" 기록 확인
- [ ] 데이터 기반 추천
- [ ] 추천 엔진 반환값(JSON) 검증 (추천 게임, 제안 메시지)
- [ ] TodayMissionBoard 컴포넌트에서 올바른 카드 노출 확인
- [ ] Social Proof / Leaderboard
- [ ] 랭킹 데이터 주기 업데이트(Polling/실시간) 확인
- [ ] LeaderboardPanel에 상위 10위 사용자 정보 정상 표시
- [ ] CJ AI 채팅
- [ ] “토큰 부족” 메시지 → AI가 “본사 사이트 추천” 답변 (emotion="concern")
- [ ] “확률 알려줘” 메시지 → AI가 “10% 기본, 스트릭 보너스” 응답 (emotion="informative")
- [ ] 대화 실패 시 기본 환영 메시지 노출
- [ ] UI/UX & 애니메이션
- [ ] FeedbackToast 애니메이션 + 사운드 정상 작동 (Win/Fail/Unlock)
- [ ] Flash Offer 배너 및 Countdown Timer 정상 표시
- [ ] Reduce Motion/on/off 사운드 설정 옵션 동작 확인

## 배포 및 모니터링 📦
- [ ] CI/CD 파이프라인 구축
- [ ] GitHub Actions 또는 CircleCI로 빌드/테스트/배포 자동화
- [ ] 서버 인프라 배포 (AWS/GCP/Azure)
- [ ] FastAPI(Uvicorn + Gunicorn) + Nginx 리버스 프록시 설정
- [ ] Redis 클러스터, PostgreSQL 인스턴스 구성
- [ ] Celery Worker/Beat, APScheduler 배포 및 모니터링
- [ ] 모바일 앱/웹 빌드
- [ ] Next.js 정적 파일 생성 & S3/CloudFront 호스팅
- [ ] React Native(iOS/Android) 빌드 및 스토어(Apple App Store, Google Play) 등록
- [ ] 프로덕션 모니터링 설정
- [ ] Sentry(에러 트래킹), Prometheus/Grafana(메트릭) 연동
- [ ] 알림 설정(에러 발생 시 Slack/Email 알림)

## 최종 QA & 릴리즈 체크리스트 ✅
- [ ] 모든 주요 테스트 케이스 통과 여부 확인
- [ ] 보안 점검(인증, 인가, 토큰 유출 방지)
- [ ] 성능 테스트 (스트레스 테스트, 로드 테스트)
- [ ] 이용약관/개인정보처리방침 등 법적 문서 배포


## 📊 현재 진행 상황 요약 (2025.06.04)

### ✅ 완료된 주요 작업
1. **백엔드 구조 표준화** (외부 AI 작업)
   - 중복된 `/app/` 디렉토리 제거
   - `/cc-webapp/backend/` 단일 구조로 통합
   - Docker Compose 경로 표준화
   - Import 경로 수정 (`from backend.app.` → `from app.`)

2. **기본 시스템 설계**
   - 사이버 토큰 경제 시스템 설계
   - 성인 콘텐츠 단계별 언락 비용 정의
   - 본사 사이트 연동 구조 기획

### ❌ 해결 필요한 문제
1. **테스트 수집 실패**
   - 데이터베이스 연결 미완성
   - 라우터 함수 구현체 누락
   - Kafka 연결 오류

### 🎯 다음 우선순위 작업
1. **즉시 수정** (1-2일)
   - database.py 완전 구현
   - 누락된 라우터 함수 추가
   - 테스트 환경 설정

2. **단기 개발** (1-2주)
   - 인증 시스템 완성
   - 토큰 플로우 구현
   - 기본 게임 로직

3. **중기 개발** (1-2개월)
   - 가챠 시스템
   - 개인화 추천 엔진
   - UI/UX 고도화

### 📋 브랜치 병합 가이드
외부 AI 작업 결과를 병합할 때:
```bash
# 1. 현재 브랜치 백업
git checkout -b backup-before-merge

# 2. 외부 브랜치 병합
git checkout main
git pull origin main
git merge [외부-ai-브랜치]

# 3. 즉시 수정할 파일들
- cc-webapp/backend/app/database.py
- cc-webapp/backend/app/routers/*.py
- cc-webapp/backend/tests/conftest.py
```

## 검증 체크리스트 프롬프트 예시:
Before providing your response, confirm that it aligns with:
[ ] Dopamine loop mechanics from 01_architecture_en.md
[ ] User segmentation rules from 02_data_personalization_en.md
[ ] Emotion feedback patterns from 03_emotion_feedback_en.md
[ ] Adult content progression from 04_adult_rewards_en.md
[ ] Corporate site retention flow from 05_corporate_retention_en.md

Your response must explicitly reference which documents were consulted.