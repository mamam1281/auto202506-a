# 🤖 Casino-Club F2P 프로젝트 AI 어시스턴트 테스트 가이드 (Codex 의뢰용 프롬프트)

---

## 1) 목표
- **F2P(Free-to-Play) 게임 플랫폼**의 핵심 서비스와 기능을 신속하게 검증하고, 전체 테스트를 100% 통과시키는 것이 목적입니다.
- **F2P 게임의 재미·몰입·보상·개인화**에 초점을 맞춥니다.
- 사용자 경험, 보상 시스템, 미션, 콘텐츠 언락, 실시간 피드백 등 **F2P 게임의 핵심 메커니즘**이 정상 동작하는지 테스트합니다.

---

## 2) 온보딩 및 테스트 가이드드
- **RewardService, NotificationService, AdultContentService, GameService(슬롯/룰렛/가챠 등)** 등 주요 서비스의 단위/통합 테스트를 모두 통과시켜야 합니다.
- **GameService**는 다음과 같은 기능/모듈/아키텍처로 구성되어야 합니다:
    - **핵심 모듈**: games.py (router), game_service.py (service), game_repository.py (repository)
    - **기능**: 슬롯, 룰렛, 가챠, 미션, 리더보드, 이벤트, 배틀패스, 성인콘텐츠 언락 등
    - **아키텍처**: Clean Architecture (Router → Service → Repository → DB), SOLID 원칙 준수
    - **상태 관리**: Hot/Cold, Streak, Jackpot 등은 Redis/DB로 분리 저장
    - **환경변수**: RTP, 확률, 잭팟 한도 등은 .env/환경변수로 관리
- 테스트 실패 시, 다음을 반드시 수행:
  1. 실패 원인(AssertionError, Mock 오류, 시그니처 불일치 등) 상세 분석
  2. 서비스/테스트 코드의 문제점과 개선방안 제시
  3. RewardService/NotificationService에서 성공한 패턴(UTC 타임존, Mock 최소화, DB 스키마 일치, 세션 갱신 등) 적용
  4. 모든 테스트가 통과할 때까지 반복적으로 수정
- **프론트엔드 환경**은 React+Vite+Material UI+Axios+React Router 기반으로, npm install/build/start가 정상 동작해야 하며, API 연동은 http://localhost:8000 기준으로 설정합니다.
- **백엔드 테스트**는 pytest 기준으로, SQLAlchemy 등 필수 의존성 누락 시 pip install로 즉시 복구해야 합니다.
- 테스트 성공률, 남은 실패 테스트, 주요 이슈 및 해결 내역을 문서에 계속 업데이트합니다.

---

## 3) 근거문서

- **01_architecture_en.md**: 전체 시스템 구조, F2P 게임 메커니즘, API/DB 설계, 게임 서비스 계층 구조
- **03_emotion_feedback_en.md**: 감정 피드백 시스템 및 사용자 몰입 설계
- **04_adult_rewards_en.md**: 콘텐츠 언락 및 보상 구조
- **06_user_journey_en.md**: 유저 여정 및 온보딩 흐름
- **09_test_qa_en.md**: 테스트 및 품질 보증 기준, 주요 시나리오
- **12_game_dev_full_checklist_ko.md**: 전체 개발 체크리스트 및 최신 진행 현황, 게임 기능별 구현/테스트 현황
- **15_ai_assistant_test_guide.md**: 본 테스트 가이드 및 Codex 의뢰 프롬프트
- **21_security_authentication.md**: 인증/보안 설계 기준

---

## 4) 주의점

- **F2P(Free-to-Play) 게임**의 재미, 보상, 개인화, 미션, 실시간 피드백 등 긍정적 요소만 강조합니다.
- 테스트/코드/문서 모두 **Clean Architecture, SOLID 원칙, TDD, Zero-Error** 기준을 반드시 준수해야 합니다.
- PowerShell 명령어 사용 시 **; (세미콜론)으로 명령어 연결** (윈도우 환경)
- 모든 테스트는 **pytest**로 실행, 실패 시 즉시 원인 분석 및 수정
- **의존성 누락**(예: SQLAlchemy) 발생 시, pip install로 즉시 복구
- 테스트 성공률, 남은 과제, 주요 이슈는 항상 문서에 최신 상태로 반영
- **보안/개인정보 보호** 기준(21_security_authentication.md) 반드시 준수

---
## 5) 고급 게임 로직 및 핵심 모듈/기능 체크리스트

### [A] 고급 게임 로직 및 핵심 모듈/기능 체크리스트

#### 1. 핵심 모듈/아키텍처
- [x] **games.py (Router)**: 모든 게임 관련 API 엔드포인트 구현
- [] **game_service.py (Service)**: 게임 비즈니스 로직(확률, RTP, 스트릭, 잭팟 등) 진행중
- [] **game_repository.py (Repository)**: DB/Redis 연동 및 데이터 저장/조회 책임 분리 진행중
- [x] **Clean Architecture 계층 구조**: Router → Service → Repository → DB/Redis 구조 준수

#### 2. 주요 게임/시스템 기능
- [ ] **슬롯(미니게임) 기능**: Variable-Ratio 보상, RTP, 잭팟, Hot/Cold, 스트릭 로직 포함
- [ ] **룰렛 기능**: 확률 기반 보상, Hot/Cold, RTP, 실시간 피드백
- [ ] **가챠(뽑기) 기능**: 확률 테이블, 보상 풀, RTP, 페어니스 로깅
- [ ] **미션/퀘스트 시스템**: 데일리/위클리/스페셜 미션, 자동 보상 지급
- [ ] **리더보드 시스템**: 실시간 랭킹, 경쟁 트리거, 랭킹 데이터 API 제공
- [ ] **이벤트 시스템**: 한정 이벤트, Flash Offer, 기간/조건/보상 관리
- [ ] **배틀패스 시스템**: 무료/유료 트랙, 레벨업, 보상 언락
- [ ] **성인콘텐츠 언락**: 단계별 언락, 세그먼트/토큰 조건, 보상 기록

#### 3. 환경/운영 체크
- [ ] **환경변수(.env) 기반 파라미터 관리**: RTP, 확률, 잭팟 한도 등 실시간 조정
- [ ] **의존성 파일(requirements.txt 등) 최신화 및 변경 감지**
- [ ] **Redis/DB 연동**: 실시간 상태(Hot/Cold, Streak, Jackpot 등) 인메모리 관리, 장기 데이터는 RDBMS 저장
- [ ] **API Rate Limit & Abuse 방지**: Rate Limit, 캡차, 세션 제한 등
- [ ] **테스트 환경 분리**: 테스트/운영 환경별 DB, Redis, 환경변수 분리

---

## 5) 고급 게임 로직 및 핵심 모듈/기능 체크리스트

### [A] 고급 게임 로직 (상용 F2P/시스템에서 차용 가능)

- [ ] **Variable-Ratio Reward Schedule**  
  - 각 미니게임(슬롯, 룰렛, 가챠 등)은 확률 기반 보상(Variable-Ratio) 로직을 사용해야 함  
  - 예시: 승리/보상 확률이 플레이 횟수, 연승, 유저 세그먼트에 따라 동적으로 변동
  - 실제 적용 모듈: game_service.py, game_repository.py, games.py

- [ ] **RTP(Return to Player) 시뮬레이션**  
  - 전체 게임의 RTP(유저 환급률) 시뮬레이션 및 로그 기록  
  - RTP 값은 환경변수(예: RTP_SLOT=0.93)로 관리, 운영 중 실시간 조정 가능
  - 실제 적용: .env, config.py, game_service.py

- [ ] **Hot/Cold State, Streak Logic**  
  - 연승/연패 스트릭, Hot/Cold 상태에 따른 보상/확률 변화  
  - 유저별 streak 상태는 Redis 등 인메모리 DB에 저장
  - 실제 적용: streak_service.py, redis_utils.py

- [ ] **Progressive Jackpot/Accumulation**  
  - 일부 미니게임(슬롯 등)은 누적 잭팟/누적 보상 풀을 지원  
  - 잭팟 금액은 DB/Redis에 저장, 트리거 시 전체 유저에게 브로드캐스트
  - 실제 적용: jackpot_service.py, redis_utils.py

- [ ] **Fairness & Audit Trail**  
  - 모든 랜덤 결과는 seed/log와 함께 저장, 추후 감사 가능  
  - 랜덤 시드/결과는 환경변수 및 DB에 기록
  - 실제 적용: game_service.py, audit_log.py

- [ ] **실시간 피드백/이벤트 트리거**  
  - 게임 결과에 따라 실시간 애니메이션, 사운드, AI 메시지 등 즉각 피드백  
  - 이벤트 트리거(예: 대규모 당첨, 미션 달성)는 NotificationService와 연동
  - 실제 적용: notification_service.py, games.py

---

### [B] 이벤트/리더보드/미션 시스템 체크리스트

- [ ] **이벤트 시스템**
  - 데일리/위클리/시즌 한정 이벤트, Flash Offer, 한정 미션 등 지원
  - 이벤트/미션 조건, 보상, 기간 등은 DB/환경변수로 관리
  - 실제 적용: event_service.py, mission_service.py, .env

- [ ] **리더보드 시스템**
  - 실시간 랭킹, 친구 초대, 경쟁 트리거
  - 랭킹 산정 로직(예: 토큰, 승률, 미션 달성 등)은 서비스 계층에서 분리 구현
  - 랭킹 데이터는 Redis/DB에 저장, API로 제공
  - 실제 적용: leaderboard_service.py, redis_utils.py

- [ ] **미션/퀘스트 시스템**
  - 데일리/위클리/스페셜 미션, 보상 자동 지급
  - 미션 달성 조건, 보상, 진행상태는 DB/환경변수로 관리
  - 실제 적용: mission_service.py, .env

- [ ] **이벤트/리더보드/미션 통합 알림**
  - 주요 이벤트/랭킹 변화/미션 달성 시 NotificationService와 연동하여 실시간 알림 제공
  - 실제 적용: notification_service.py

---

### [C] 시스템 사양/환경값 변화 체크리스트

- [ ] **환경변수(.env) 변화 감지 및 반영**
  - 최근 .env, .env.example, config.py 등 환경변수 파일에 변경사항이 있는지 반드시 확인
  - 주요 파라미터(RTP, 확률, 잭팟 한도 등) 변경 시 서비스 재시작/핫리로드 필요 여부 체크
  - 환경변수 변경 이력은 git commit 또는 별도 changelog로 관리

- [ ] **의존성 파일(백엔드 requirements.txt 등) 최신화**
  - requirements.txt, requirements-dev.txt, pyproject.toml 등 의존성 파일에 변경사항이 있는지 확인
  - 신규 패키지 추가/삭제 시 반드시 파일 최신화 및 커밋
  - 의존성 변경 시 CI/CD 파이프라인에서 자동 설치/테스트가 정상 동작하는지 검증

- [ ] **환경값 변화에 따른 시스템 영향 분석**
  - RTP, 확률, 잭팟 한도 등 주요 환경값 변경 시 게임 밸런스, 보상 정책, 로그/통계 시스템에 미치는 영향 분석
  - 운영 중 실시간 조정이 필요한 파라미터는 hot-reload 또는 admin API로 관리 가능하도록 설계

- [ ] **환경/의존성 변화 자동 체크 요청**
  - Codex에게 .env, requirements.txt, pyproject.toml 등 주요 파일의 변경 이력(git diff 등)과 실제 적용 여부를 반드시 체크하도록 요청
  - 예시: "최근 .env, requirements.txt에 변경이 있었는지 git diff로 확인해줘. 변경 시 서비스 재시작/마이그레이션 필요 여부도 알려줘."

---

## ✅ 구현/테스트 현황 및 우선순위별 기능 체크리스트

### [A] 우선순위별 구현/미구현 기능 체크리스트

- [ ] **게임별 세부 서비스/핸들러 분리**
  - slot_service.py, roulette_service.py, gacha_service.py 등 각 게임별 서비스/핸들러 분리 필요
- [ ] **슬롯(미니게임) 기능**
  - Variable-Ratio 보상, RTP, 잭팟, Hot/Cold, 스트릭 로직 포함
- [ ] **랜덤룰렛 기능** - 추후 세세하게 지시할 예정정
  - 확률 기반 보상, Hot/Cold, RTP, 실시간 피드백
- [ ] **가챠(뽑기) 기능**
  - 확률 테이블, 보상 풀, RTP, 페어니스 로깅
- [ ] **AI/추천/개인화 로직**
  - recommendation_service.py, emotion_feedback_service.py 등 AI 기반 추천/감정 피드백/개인화 보상 서비스 미구현
- [ ] **유저 세그먼트/등급 시스템**
  - user_segment_service.py 등 유저 등급/세그먼트 및 보상/확률 변화 로직 분리 필요
- [ ] **미션/퀘스트 시스템**
  - 데일리/위클리/스페셜 미션, 자동 보상 지급
- [ ] **리더보드 시스템**
  - 실시간 랭킹, 경쟁 트리거, 랭킹 데이터 API 제공
- [ ] **이벤트 시스템**
  - 한정 이벤트, Flash Offer, 기간/조건/보상 관리
- [ ] **배틀패스 시스템**
  - 무료/유료 트랙, 레벨업, 보상 언락
- [ ] **성인콘텐츠 언락**
  - 단계별 언락, 세그먼트/토큰 조건, 보상 기록
- [ ] **통합 알림/이벤트 브로드캐스트**
  - 대규모 이벤트(잭팟, 랭킹 등) 브로드캐스트용 이벤트 브로커/큐/서비스 미구현
- [ ] **통계/로그/감사(Audit) 시스템**
  - audit_log_service.py, stats_service.py 등 게임 결과/보상/시드/RTP 감사 및 통계 기록 서비스 미구현
- [ ] **관리자/운영자 기능**
  - Admin API/Service(이벤트/미션/보상/환경변수 실시간 조정, 유저 밴/언락 등) 미구현
- [ ] **보안/인증/권한 관리 고도화**
  - auth_service.py, permission_service.py 등 JWT, OAuth, 관리자 권한 분리 등 고도화 필요
- [ ] **API Rate Limit & Abuse 방지**
  - rate_limit_service.py, abuse_detection_service.py 등 Abuse 방지/속도 제한/봇 탐지 미구현
- [ ] **테스트 자동화/CI/CD 연동**
  - ci_cd_service.py, migration_service.py 등 테스트 자동화/배포 파이프라인/마이그레이션 자동화 미구현
- [ ] **환경변수(.env) 기반 파라미터 관리**
  - RTP, 확률, 잭팟 한도 등 실시간 조정
- [ ] **의존성 파일(requirements.txt 등) 최신화 및 변경 감지**
- [ ] **Redis/DB 연동**
  - 실시간 상태(Hot/Cold, Streak, Jackpot 등) 인메모리 관리, 장기 데이터는 RDBMS 저장
- [ ] **테스트 환경 분리**
  - 테스트/운영 환경별 DB, Redis, 환경변수 분리

---

### [B] 고급 게임 로직 (상용 F2P/시스템에서 차용 가능)

- [ ] **Variable-Ratio Reward Schedule**  
  - 각 미니게임(슬롯, 룰렛, 가챠 등)은 확률 기반 보상(Variable-Ratio) 로직을 사용해야 함  
  - 예시: 승리/보상 확률이 플레이 횟수, 연승, 유저 세그먼트에 따라 동적으로 변동
  - 실제 적용 모듈: game_service.py, game_repository.py, games.py

- [ ] **RTP(Return to Player) 시뮬레이션**  
  - 전체 게임의 RTP(유저 환급률) 시뮬레이션 및 로그 기록  
  - RTP 값은 환경변수(예: RTP_SLOT=0.93)로 관리, 운영 중 실시간 조정 가능
  - 실제 적용: .env, config.py, game_service.py

- [ ] **Hot/Cold State, Streak Logic**  
  - 연승/연패 스트릭, Hot/Cold 상태에 따른 보상/확률 변화  
  - 유저별 streak 상태는 Redis 등 인메모리 DB에 저장
  - 실제 적용: streak_service.py, redis_utils.py

- [ ] **Progressive Jackpot/Accumulation**  
  - 일부 미니게임(슬롯 등)은 누적 잭팟/누적 보상 풀을 지원  
  - 잭팟 금액은 DB/Redis에 저장, 트리거 시 전체 유저에게 브로드캐스트
  - 실제 적용: jackpot_service.py, redis_utils.py

- [ ] **Fairness & Audit Trail**  
  - 모든 랜덤 결과는 seed/log와 함께 저장, 추후 감사 가능  
  - 랜덤 시드/결과는 환경변수 및 DB에 기록
  - 실제 적용: game_service.py, audit_log.py

- [ ] **실시간 피드백/이벤트 트리거**  
  - 게임 결과에 따라 실시간 애니메이션, 사운드, AI 메시지 등 즉각 피드백  
  - 이벤트 트리거(예: 대규모 당첨, 미션 달성)는 NotificationService와 연동
  - 실제 적용: notification_service.py, games.py

---
## 📋 개발/운영 표준 및 베스트 프랙티스 참고 안내

> **아래의 개발/운영 표준 및 베스트 프랙티스는 모든 개발/테스트/운영 단계에서 반드시 준수해야 합니다.**
>  
> - 요구사항 분석, 설계, 코딩, 보안, 테스트, 배포, 모니터링 등 전 단계에 적용
> - 구체적 작업 요청/질문이 있을 경우, 본 가이드라인을 기반으로 적용/답변
> - 세부 적용 예시, 코드 표준, 테스트/배포/운영 관련 문의는 별도 요청 시 상세 안내

**주요 참고 문서 및 규칙**
- docs/기술설계상세.md, docs/아키텍쳐명세서.md, docs/모듈계층설계.md, docs/테스트및검증.md, docs/09_solid_principles_kr.md, docs/21_security_authentication.md 등
- 요구사항/설계/코드/테스트/운영/보안/배포 등 모든 단계에서 최신 문서 기준 준수
- PowerShell 명령어 사용 시 윈도우 환경에서는 반드시 ;(세미콜론) 사용
- 구체적 작업 요청, 테스트 실행, 코드 리뷰, 문서화 등은 별도 요청 시 단계별로 안내

> **질문/작업 요청 예시**
> - "아키텍처 표준에 맞게 서비스 계층 리팩토링 해줘"
> - "테스트 케이스를 TDD 방식으로 추가해줘"
> - "보안 설계 기준에 따라 인증 로직 점검해줘"
> - "배포 자동화 스크립트 작성해줘"
> - "문서화/코드 표준 위반 사례가 있는지 리뷰해줘"
> - "테스트 자동화/CI 연동 방법 안내해줘"
> - "PowerShell 명령어 예시를 보여줘"

**별도 요청이 없을 경우, 본 표준은 참고용 안내로만 유지됩니다.**

현재 게임 서비스 모듈(games.py, game_service.py, game_repository.py 등)은 코드가 전혀 없는 0 상태임.
- Clean Architecture(핸들러→서비스→레포지토리→DB) 구조로 기본 뼈대를 먼저 만들어줘
- 각 계층별로 최소 1개 함수(예: 슬롯 플레이, 룰렛 플레이, 가챠 뽑기)를 구현
- 각 함수는 입력/출력/예외처리/로깅을 반드시 포함
- DB 연동은 SQLite 또는 Redis를 사용(테스트 가능하도록)
- 각 계층별로 pytest 기반 테스트 코드도 함께 작성
- 코드와 테스트 모두 한글 주석으로 설명 추가

최소 동작 MVP를 빠르게 만들고, 이후 세부 기능을 확장할 수 있도록 설계해줘.


테스트기준 명확성 
Casino-Club F2P 프로젝트의 백엔드(파이썬) 게임 서비스 모듈에 대해 다음 기준을 반드시 충족하는 테스트 코드를 작성해줘.

- pytest 기반의 단위/통합 테스트를 games.py, game_service.py, game_repository.py에 대해 각각 작성
- 슬롯, 룰렛, 가챠 기능별로 성공/실패/예외 상황을 모두 커버
- RTP, 확률, 잭팟, Hot/Cold, 스트릭 등 주요 상태값이 정상적으로 반영되는지 검증
- Redis/DB 연동이 실제로 동작하는지, Mock을 최소화하고 실제 환경과 최대한 유사하게 테스트
- 테스트 실행 시 모든 케이스가 통과해야 하며, 실패 시 원인과 개선방안을 상세히 리포트
- 테스트 커버리지는 90% 이상을 목표로 할 것

테스트 코드 예시와 함께, 각 테스트가 어떤 기능을 검증하는지 주석으로 설명해줘.

 slot_service.py, roulette_service.py, gacha_service.py 파일을 생성하고, 각각의 게임 로직을 서비스 계층에서 분리 구현해줘
- 각 서비스에 대해 단위 테스트(pytest)도 함께 작성
- 테스트는 성공/실패/예외/엣지케이스를 모두 포함
- 모든 코드는 Clean Architecture, SOLID, TDD 원칙을 준수해야 함
- 테스트가 통과하지 않으면, 실패 원인과 수정방안을 반드시 리포트로 남겨줘

