# 🎮 시스템 설계 문서 (Architecture)

## 1.1. 프로젝트 개요 🚀

### 프로젝트 명: CC (Casino-Club)

**목표:** 
구축된 웹앱을 모바일게임식 F2P 생태계로 확장하여,
행위중독 트리거(variable-ratio rewards, limited-time events, social proof)와 
도파민 루프(즉각 보상 + 시각·청각 피드백) 메커니즘을 도입해
사용자 몰입도와 과금 전환율을 극대화한다.

### 핵심 목표 🎯

#### 1. Behavioral Addiction Triggering (도파민 루프 강화)

- 슬롯·룰렛·가챠 등의 "확률형 보상" 시스템
- Variable-Ratio Schedule 기반 보상 분배
- Flash Sales / Limited-Time Offers로 긴박감 생성
- Progression Gate / Battle-Pass 구조 (데일리/위클리 미션)

#### 2. Emotion-Driven Feedback (감정 피드백)

- 승리/패배 시 멀티센서리 피드백(비주얼 이펙트, 사운드)
- AI 캐릭터 대사 → 즉각적 "격려/칭찬/질책"
- 감정 기반 추천 미션(우울→힐링 보상, 의지→하이리스크 보상)

#### 3. Freemium Economy & Monetization (과금 구조)

**두 가지 재화:**
- 일반 코인 (Free Coins): 게임 플레이로 획득
- 프리미엄 젬 (Premium Gems): 실제 과금/이벤트 보상

**기타 특징:**
- 가챠 시스템: 프리미엄 젬으로 획득 가능한 "럭키박스"
- Battle-Pass / VIP 티어: 단계별 유료 티어 구독(월간 구독)

#### 4. Adult-Content Unlocking (성인 콘텐츠 잠금 해제)

- 티어별 또는 가챠/미션 성공 시 "어덜트 콘텐츠 스테이지" 진행
- 부분 공개(Teaser) → 부분 노출 → 풀컨텐츠 방식
- 고과금 유저(Whale) 전용 "Exclusive VIP Content"

#### 5. Data-Driven Personalization (데이터 기반 개인화)

- RFM 분석 + LTV 예측 → 고객 세그먼트 (Whale/VIP, Engaged, At-Risk)
- 심리 프로파일(퀴즈/설문) 반영한 추천 보상 확률, 이벤트 타이밍 조정
- 실시간 행동 로그(Redis, Kafka) → 다음 상호작용에서 개인화

## 1.2. High-Level Architecture Diagram
bash
복사
편집
+---------------------------------------------------+
|                    Frontend                       |
|  (React.js + Next.js + Tailwind CSS + Framer)     |
|  • Home Dashboard / Emotion Feed                   |
|  • SlotMachine, RPS, Roulette, Gacha               |
|  • Battle-Pass / VIP Page / Shop                   |
|  • AdultContent Viewer (Teaser → Full Reveal)      |
|  • Daily/Weekly Mission Hub                        |
|  • Social/Leaderboard 뷰                            |
|  • Promotion Pop-ups (Flash Sale, Limited Offer)   |
+---------------------------------------------------+
                       ↓ (HTTP/WebSocket)
+---------------------------------------------------+
|                    Backend                        |
|               (FastAPI + Python)                   |
|  • Auth & JWT (Login/Logout)                      |
|  • API endpoints:                                  |
|      – /api/actions          (트리거 이벤트 기록)  |
|      – /api/rewards          (리워드 이력 조회)     |
|      – /api/feedback         (감정 메시지)          |
|      – /api/unlock           (Adult 콘텐츠 언락)   |
|      – /api/user-segments    (세분화 RFM + 심리)     |
|      – /api/shop/buy         (프리미엄 재화 거래)   |
|      – /api/gacha/spin       (가챠 로직)            |
|      – /api/battlepass       (배틀패스 상태/보상)    |
|      – /api/notification     (Push/SSE 푸시)        |
|  • In-Memory Caching (Redis)                        |
|      – user:{id}:streak_count                       |
|      – user:{id}:last_action_ts                     |
|      – user:{id}:pending_gems                       |
|  • Event Streaming (Kafka)                           |
|      – user_actions 토픽으로 실시간 행동 송출         |
|  • Scheduler (Celery + APScheduler)                  |
|      – Daily RFM / LTV 계산                           |
|      – BattlePass 보상 지급 / 쿠폰 만료 체크           |
|      – 주간 / 월간 리텐션 캠페인 트리거                |
+---------------------------------------------------+
                       ↓ (SQLAlchemy ORM)
+---------------------------------------------------+
|              PostgreSQL  /  Redis                   |
|  Tables:                                           |
|   • users                                          |
|   • user_actions                                   |
|   • user_segments (RFM + psychometric)             |
|   • user_rewards                                   |
|   • adult_content                                  |
|   • battlepass_status                              |
|   • gacha_log                                      |
|   • shop_transactions                              |
|   • notifications                                  |
|   • site_visits                                    |
+---------------------------------------------------+
## 1.3. Component Breakdown
### 1.3.1. Frontend (React.js + Next.js)
#### Home Dashboard (Emotion-Driven)

- **EmotionPromptComponent:** 로그인 시 "오늘 기분 어때요?" 팝업 → /api/feedback 호출
- **TodayMissionHub:** RFM 세그먼트 + 감정 상태 기반 추천 미션
  - 예: "High-Risk & 스트레스 → 오늘은 3회 연속 슬롯 플레이하면 1 Premium Gem 증정"
- **BattlePassProgress:** 현재 배틀패스 티어, 남은 기간, 잠금 보상 미리보기
- **LimitedTimeOfferBanner:** 남은 시간 표시 + 구매 가능 버튼 (프리미엄 재화 사용)

#### Mini-Games Collection

- **SlotMachineComponent**
  - Variable-Ratio Reward (보정식: 기본 확률 5% + streak 보너스)
  - 승리 시 /api/actions POST + /api/rewards GET → 보상 표시 + /api/feedback
  - 패배 시 /api/actions POST + /api/feedback
  - 애니메이션: 빛나는 릴 애니메이션 + 사운드 이펙트

- **RPSGameComponent (Rock-Paper-Scissors)**
  - 멀티/AI 매칭 선택
  - 승리/패배 → /api/actions, /api/feedback, 보상 로직
  - 멀티센서리 피드백 (진동, 사운드, 화면 흔들기)

- **RouletteComponent**
  - 휠 스핀 애니메이션, 랜덤 보상 칸 지정
  - "Hot" / "Cold" 칸 표시 (확률 시각화)
  - 승리 시 추가 프리미엄 젬 확률 제공

- **Gacha System (럭키박스)**
  - **GachaSpinComponent**
    - 사용자 보유 프리미엄 젬 수량 조회
    - Spin 버튼 클릭 시 /api/gacha/spin 호출
    - 리트기어(Loot Table) 기반 확률 분포:
      - Social Proof: "오늘 X명이 Spin 했습니다" 표시
      - Tier별 Drop Rate 제공 (Stage 3 Adult Content 1% 등)
    - Spin 결과 애니메이션 → 보상/단서 제공

#### Shop & BattlePass

- **ShopComponent**
  - 프리미엄 젬 충전 (구매) 페이지
  - 한정 패키지 (예: 100 Gems + 10 Free Spins)
  - Flash Sale / Time-Limited 팝업

- **BattlePassComponent**
  - 무료 트랙 + 유료 트랙 구분
  - 레벨업 조건: 게임 플레이 경험치(Play XP) 또는 프리미엄 젬 사용
  - 티어별 보상 미리보기(Free Coins, Premium Gems, Exclusive Adult Content)

#### Adult-Content Viewer

- **AdultContentStageComponent**
  - Stage 1 (Teaser): 흐릿한 이미지 / 짧은 클립
  - Stage 2 (Partial Reveal): 하의/상의 중 일부 제거된 모습
  - Stage 3 (Full Reveal): 전체 고퀄리티 성인 자산
- **Unlock Logic:**
  - /api/unlock 호출로 현재 스테이지 → UI 내 Story Flow
  - UI: AI 캐릭터가 "축하합니다! Stage 2가 오픈되었습니다. 지금 확인해 보세요."
  - 고과금 세그먼트(Whale) 전용 "VIP Exclusive Scene"

#### Notification & Social Features

- **LeaderboardComponent:**
  - 일일/주간 Top 플레이어 랭킹
  - 친구 초대 코드 / 공유 버튼

- **NotificationBanner:**
  - WebSocket / SSE로 서버 푸시 → 실시간 "친구 초대 보상 획득"
  - "오늘 배틀패스 무료 레벨업 가능" 팝업

#### UI/UX 공통

- Tailwind CSS + Framer Motion (애니메이션)
- 반응형: 데스크톱(3컬럼) / 모바일(단일 스크롤)
- Accessibility: ARIA roles, 키보드 네비게이션

#### Sound Effects:

- 승리: victory.mp3
- 패배: failure.mp3
- 보상: reward.mp3
- Spin: spin.mp3

### 1.3.2. Backend (FastAPI + Python)
#### Authentication & Authorization

- JWT 기반 인증 (이메일/비밀번호 + OAuth 옵션)
- Age Verification: 성인 콘텐츠 접근 시 필수 검증
- 2FA (선택): VIP 티어 상승 시 추가 보안

#### API Modules

- **User Module (/api/users)**
  - POST /api/users/signup (닉네임, 이메일, 비밀번호)
  - POST /api/users/login
  - POST /api/users/verify-age (나이 검증)
  - GET /api/users/{id}/profile (포인트, 티어, 배틀패스 레벨 등)

- **Action Module (/api/actions)**
  - POST: { user_id, action_type, value?, metadata? }
  - 예: action_type = "SLOT_SPIN", value = coins_spent
  - DB 쓰기 → Redis 업데이트 (streak_count, last_action_ts) → Kafka 송출

- **Reward Module (/api/users/{id}/rewards)**
  - GET: 유저별 보상 이력 리턴 (필터: type, 기간)
  - Internal logic: calculateReward(streak_count, user_segment, event_type)

- **Emotion Feedback Module (/api/feedback)**
  - POST: { user_id, action_type } → 즉각 피드백 메시지 + 애니메이션 키 값 리턴
  - 확장: 전투패스 레벨업, 과금 시에도 "감정 토스트" 제공

- **Adult Content Module (/api/unlock)**
  - GET: { user_id } → 현재 스테이지 + 다음 단계 조건 리턴
  - POST: { user_id, purchase_type? } (프리미엄 재화 사용 언락)
  - 내부: attempt_content_unlock (심사 → DB 기록)

- **Shop & Gacha Module (/api/shop, /api/gacha)**
  - POST /api/shop/buy: { user_id, item_id, quantity, payment_method }
  - POST /api/gacha/spin: { user_id, spins = 1~10 } → 리턴: reward_detail
  - 가챠 확률 테이블 RDB 저장 → 주기적 A/B 테스트

- **BattlePass Module (/api/battlepass)**
  - GET /api/battlepass/status: { user_id } → 현재 레벨, 보상 잠금 상태
  - POST /api/battlepass/claim: { user_id, tier_id } → 보상 지급

- **Segmentation & Personalization (/api/user-segments)**
  - GET { user_id } → RFM 그룹, LTV 예측값, 추천 보상 확률, 추천 시간대 리턴
  - Internal: compute_rfm_and_update_segments (APScheduler)

- **Notification Module (/api/notification)**
  - POST { user_id, message, type, schedule? } → 큐에 저장
  - Celery Worker: 예약된 시각에 Push/SSE/Email 전송

- **Analytics & Reporting (/api/analytics)**
  - GET /api/analytics/retention: 리텐션 레포트 (D1, D7, D30)
  - GET /api/analytics/spend: 과금 트렌드 리포트 (일별, 주별)

#### Real-Time Data Processing

- **Redis:**
  - user:{id}:streak_count (int)
  - user:{id}:last_action_ts (timestamp)
  - user:{id}:pending_gems (int)
  - battlepass:{user_id}:xp (int)

- **Kafka:**
  - Topic user_actions → "SLOT_SPIN", "GACHA_SPIN", "PURCHASE" 등 이벤트 스트리밍
  - Analytics 서비스 (ClickHouse, Druid)로 집계

- **Celery + APScheduler:**
  - Daily 02:00 UTC: compute_rfm_and_update_segments 실행 (RFM 재계산)
  - Hourly: "미접속 유저 → 리마인더 푸시(DAILY_INACTIVE)"
  - Weekly: BattlePass 미달성자 대상 "보너스 XP 쿠폰 발송"
  - 이벤트 기반: 유저가 특정 랭크 도달 시 즉시 "Level-Up Reward" Push

### 1.3.3. Database (PostgreSQL)
- **users**
  - id (PK), nickname, email, password_hash, created_at
  - vip_tier (int), battlepass_level (int), total_spent (int)

- **user_actions**
  - id (PK), user_id (FK), action_type (string), value (float), timestamp (datetime)
  - 예: ("SLOT_SPIN", 100 coins), ("GACHA_SPIN", 1 gem)

- **user_segments**
  - id (PK), user_id (FK, unique), rfm_group (string: Whale/Medium/Low),
  - ltv_score (float), risk_profile (string: High/Moderate/Low)
  - last_updated (datetime)

- **user_rewards**
  - id (PK), user_id (FK), reward_type (string: COIN, GEM, CONTENT_UNLOCK, XP),
  - reward_value (string/JSON: amount or content_id), awarded_at (datetime), trigger_action_id (FK optional)

- **adult_content**
  - id (PK), stage (int: 1~3), name (string), description,
  - thumbnail_url, media_url, required_segment_level (int), premium_only (boolean)

- **gacha_log**
  - id (PK), user_id, spin_count, result_type, result_value, timestamp

- **shop_transactions**
  - id (PK), user_id, item_id, quantity, price_in_gems, payment_method, timestamp

- **battlepass_status**
  - id (PK), user_id, current_level (int), xp_accumulated (int), last_claimed_tier (int)

- **notifications**
  - id (PK), user_id, message, is_sent (bool), send_time (datetime), created_at (datetime)

- **site_visits**
  - id (PK), user_id, source (string), visit_timestamp (datetime)



# 01_architecture_en.md (Revised Summary)
위 설계에서는 행위중독 트리거와 모바일게임식 과금 메커니즘을 핵심 축으로 삼아,

- F2P 이코노미(Free Coins vs. Premium Gems)
- 가챠/배틀패스/한정 이벤트
- 도파민 루프 강화용 심리적 보상(멀티센서리, AI 대사)
- 뛰어난 데이터 개인화(RFM + LTV + 심리 프로파일링)
- 성인 콘텐츠 언락을 자연스러운 Progression으로 확장

이 모두를 하나의 통합 시스템으로 설계했습니다.

다음으로는 데이터 파이프라인, 감정 피드백, 어덜트 리워드, 기업 연계(크로스 플랫폼) 문서를 차례대로 개편해 나갑니다.

<!-- English translation below -->

# System Architecture (English Translation)

## 1.1. Project Overview 🚀

### Project Name: CC (Casino-Club)

**Objective:** 
To expand the established web app into a mobile game-like F2P ecosystem,
introducing behavioral addiction triggers (variable-ratio rewards, limited-time events, social proof) and 
dopamine loops (immediate rewards + visual and auditory feedback) mechanisms to
maximize user engagement and monetization conversion rates.

### Core Goals 🎯

#### 1. Behavioral Addiction Triggering (Strengthening Dopamine Loops)

- "Probability-based reward" systems such as slots, roulette, and gacha
- Reward distribution based on Variable-Ratio Schedule
- Creating urgency with Flash Sales / Limited-Time Offers
- Progression Gate / Battle-Pass structure (Daily/Weekly missions)

#### 2. Emotion-Driven Feedback

- Multi-sensory feedback (visual effects, sound) on win/loss
- AI character dialogues → immediate "encouragement/praise/reprimand"
- Emotion-based mission recommendations (Depression→Healing rewards, Willpower→High-risk rewards)

#### 3. Freemium Economy & Monetization

**Two types of currency:**
- Regular Coins (Free Coins): Earned through gameplay
- Premium Gems: Actual purchases/Event rewards

**Other features:**
- Gacha system: "Lucky Boxes" obtainable with Premium Gems
- Battle-Pass / VIP tiers: Subscription-based paid tiers (monthly)

#### 4. Adult-Content Unlocking

- Progressing through "Adult Content Stages" upon tier advancement or gacha/mission success
- Partial disclosure (Teaser) → Partial exposure → Full content method
- "Exclusive VIP Content" for high-spending users (Whales)

#### 5. Data-Driven Personalization

- RFM analysis + LTV prediction → Customer segments (Whale/VIP, Engaged, At-Risk)
- Adjusting recommended reward probabilities and event timings based on psychological profiles (quizzes/surveys)
- Real-time behavior logs (Redis, Kafka) → Personalization in the next interaction

## 1.2. High-Level Architecture Diagram
bash
복사
편집
+---------------------------------------------------+
|                    Frontend                       |
|  (React.js + Next.js + Tailwind CSS + Framer)     |
|  • Home Dashboard / Emotion Feed                   |
|  • SlotMachine, RPS, Roulette, Gacha               |
|  • Battle-Pass / VIP Page / Shop                   |
|  • AdultContent Viewer (Teaser → Full Reveal)      |
|  • Daily/Weekly Mission Hub                        |
|  • Social/Leaderboard view                            |
|  • Promotion Pop-ups (Flash Sale, Limited Offer)   |
+---------------------------------------------------+
                       ↓ (HTTP/WebSocket)
+---------------------------------------------------+
|                    Backend                        |
|               (FastAPI + Python)                   |
|  • Auth & JWT (Login/Logout)                      |
|  • API endpoints:                                  |
|      – /api/actions          (Trigger event logging)  |
|      – /api/rewards          (Reward history inquiry)     |
|      – /api/feedback         (Emotion messages)          |
|      – /api/unlock           (Adult content unlock)   |
|      – /api/user-segments    (Segmented RFM + Psychological)     |
|      – /api/shop/buy         (Premium currency transactions)   |
|      – /api/gacha/spin       (Gacha logic)            |
|      – /api/battlepass       (BattlePass status/rewards)    |
|      – /api/notification     (Push/SSE notifications)        |
|  • In-Memory Caching (Redis)                        |
|      – user:{id}:streak_count                       |
|      – user:{id}:last_action_ts                     |
|      – user:{id}:pending_gems                       |
|  • Event Streaming (Kafka)                           |
|      – Real-time behavior streaming on user_actions topic         |
|  • Scheduler (Celery + APScheduler)                  |
|      – Daily RFM / LTV calculation                           |
|      – BattlePass reward distribution / Coupon expiration check           |
|      – Weekly / Monthly retention campaign triggers                |
+---------------------------------------------------+
                       ↓ (SQLAlchemy ORM)
+---------------------------------------------------+
|              PostgreSQL  /  Redis                   |
|  Tables:                                           |
|   • users                                          |
|   • user_actions                                   |
|   • user_segments (RFM + psychometric)             |
|   • user_rewards                                   |
|   • adult_content                                  |
|   • battlepass_status                              |
|   • gacha_log                                      |
|   • shop_transactions                              |
|   • notifications                                  |
|   • site_visits                                    |
+---------------------------------------------------+
## 1.3. Component Breakdown
### 1.3.1. Frontend (React.js + Next.js)
#### Home Dashboard (Emotion-Driven)

- **EmotionPromptComponent:** "How do you feel today?" popup on login → /api/feedback call
- **TodayMissionHub:** Recommended missions based on RFM segment + emotional state
  - Example: "High-Risk & Stress → Play slots 3 times in a row today to receive 1 Premium Gem"
- **BattlePassProgress:** Current BattlePass tier, remaining time, reward preview
- **LimitedTimeOfferBanner:** Displays remaining time + Purchase button (using premium currency)

#### Mini-Games Collection

- **SlotMachineComponent**
  - Variable-Ratio Reward (Adjustment formula: Base probability 5% + streak bonus)
  - On win: /api/actions POST + /api/rewards GET → Show reward + /api/feedback
  - On loss: /api/actions POST + /api/feedback
  - Animation: Shining reel animation + Sound effects

- **RPSGameComponent (Rock-Paper-Scissors)**
  - Choose between Multi/AI matching
  - Win/Loss → /api/actions, /api/feedback, Reward logic
  - Multi-sensory feedback (Vibration, Sound, Screen shake)

- **RouletteComponent**
  - Wheel spin animation, Random reward segment designation
  - "Hot" / "Cold" segment display (Probability visualization)
  - Increased premium gem probability on win

- **Gacha System (Lucky Box)**
  - **GachaSpinComponent**
    - Check the number of premium gems the user has
    - On clicking Spin button, call /api/gacha/spin
    - Probability distribution based on Loot Table:
      - Social Proof: Display "X people spun today"
      - Tiered Drop Rate provision (e.g., Stage 3 Adult Content 1%)
    - Spin result animation → Provide rewards/clues

#### Shop & BattlePass

- **ShopComponent**
  - Premium gem top-up (purchase) page
  - Limited packages (e.g., 100 Gems + 10 Free Spins)
  - Flash Sale / Time-Limited pop-ups

- **BattlePassComponent**
  - Distinction between free track + paid track
  - Level-up conditions: Game play experience (Play XP) or Premium gem usage
  - Tiered reward preview (Free Coins, Premium Gems, Exclusive Adult Content)

#### Adult-Content Viewer

- **AdultContentStageComponent**
  - Stage 1 (Teaser): Blurry image / Short clip
  - Stage 2 (Partial Reveal): Partial removal of upper/lower clothing
  - Stage 3 (Full Reveal): Complete high-quality adult assets
- **Unlock Logic:**
  - Current stage → UI within Story Flow via /api/unlock call
  - UI: AI character says "Congratulations! Stage 2 is now open. Check it out."
  - "VIP Exclusive Scene" for high-spending segment (Whales)

#### Notification & Social Features

- **LeaderboardComponent:**
  - Daily/Weekly Top player rankings
  - Friend invitation code / Share button

- **NotificationBanner:**
  - Real-time server push via WebSocket / SSE → "Friend invitation reward acquired"
  - "Free BattlePass level-up available today" pop-up

#### UI/UX Common

- Tailwind CSS + Framer Motion (Animations)
- Responsive: Desktop (3 columns) / Mobile (single scroll)
- Accessibility: ARIA roles, Keyboard navigation

#### Sound Effects:

- Victory: victory.mp3
- Defeat: failure.mp3
- Reward: reward.mp3
- Spin: spin.mp3

### 1.3.2. Backend (FastAPI + Python)
#### Authentication & Authorization

- JWT-based authentication (Email/Password + OAuth option)
- Age Verification: Mandatory verification for adult content access
- 2FA (Optional): Additional security when upgrading VIP tier

#### API Modules

- **User Module (/api/users)**
  - POST /api/users/signup (Nickname, Email, Password)
  - POST /api/users/login
  - POST /api/users/verify-age (Age verification)
  - GET /api/users/{id}/profile (Points, Tier, BattlePass level, etc.)

- **Action Module (/api/actions)**
  - POST: { user_id, action_type, value?, metadata? }
  - Example: action_type = "SLOT_SPIN", value = coins_spent
  - DB write → Redis update (streak_count, last_action_ts) → Kafka streaming

- **Reward Module (/api/users/{id}/rewards)**
  - GET: Returns reward history by user (Filter: type, period)
  - Internal logic: calculateReward(streak_count, user_segment, event_type)

- **Emotion Feedback Module (/api/feedback)**
  - POST: { user_id, action_type } → Returns immediate feedback message + animation key value
  - Extension: "Emotion toast" provided even on BattlePass level-up, and purchases

- **Adult Content Module (/api/unlock)**
  - GET: { user_id } → Returns current stage + conditions for the next stage
  - POST: { user_id, purchase_type? } (Unlock using premium currency)
  - Internal: attempt_content_unlock (Review → DB record)

- **Shop & Gacha Module (/api/shop, /api/gacha)**
  - POST /api/shop/buy: { user_id, item_id, quantity, payment_method }
  - POST /api/gacha/spin: { user_id, spins = 1~10 } → Returns: reward_detail
  - Gacha probability table saved in RDB → Periodic A/B testing

- **BattlePass Module (/api/battlepass)**
  - GET /api/battlepass/status: { user_id } → Current level, reward lock status
  - POST /api/battlepass/claim: { user_id, tier_id } → Reward distribution

- **Segmentation & Personalization (/api/user-segments)**
  - GET { user_id } → Returns RFM group, LTV predicted value, recommended reward probability, recommended time zone
  - Internal: compute_rfm_and_update_segments (APScheduler)

- **Notification Module (/api/notification)**
  - POST { user_id, message, type, schedule? } → Saved to queue
  - Celery Worker: Sends Push/SSE/Email at scheduled time

- **Analytics & Reporting (/api/analytics)**
  - GET /api/analytics/retention: Retention report (D1, D7, D30)
  - GET /api/analytics/spend: Spending trend report (Daily, Weekly)

#### Real-Time Data Processing

- **Redis:**
  - user:{id}:streak_count (int)
  - user:{id}:last_action_ts (timestamp)
  - user:{id}:pending_gems (int)
  - battlepass:{user_id}:xp (int)

- **Kafka:**
  - Topic user_actions → Event streaming such as "SLOT_SPIN", "GACHA_SPIN", "PURCHASE" 
  - Aggregation to Analytics services (ClickHouse, Druid)

- **Celery + APScheduler:**
  - Daily 02:00 UTC: Executes compute_rfm_and_update_segments (RFM recalculation)
  - Hourly: "Inactive users → Reminder push (DAILY_INACTIVE)"
  - Weekly: Sends "Bonus XP coupon" to BattlePass underachievers
  - Event-based: Immediate "Level-Up Reward" Push when a user reaches a specific rank

### 1.3.3. Database (PostgreSQL)
- **users**
  - id (PK), nickname, email, password_hash, created_at
  - vip_tier (int), battlepass_level (int), total_spent (int)

- **user_actions**
  - id (PK), user_id (FK), action_type (string), value (float), timestamp (datetime)
  - Example: ("SLOT_SPIN", 100 coins), ("GACHA_SPIN", 1 gem)

- **user_segments**
  - id (PK), user_id (FK, unique), rfm_group (string: Whale/Medium/Low),
  - ltv_score (float), risk_profile (string: High/Moderate/Low)
  - last_updated (datetime)

- **user_rewards**
  - id (PK), user_id (FK), reward_type (string: COIN, GEM, CONTENT_UNLOCK, XP),
  - reward_value (string/JSON: amount or content_id), awarded_at (datetime), trigger_action_id (FK optional)

- **adult_content**
  - id (PK), stage (int: 1~3), name (string), description,
  - thumbnail_url, media_url, required_segment_level (int), premium_only (boolean)

- **gacha_log**
  - id (PK), user_id, spin_count, result_type, result_value, timestamp

- **shop_transactions**
  - id (PK), user_id, item_id, quantity, price_in_gems, payment_method, timestamp

- **battlepass_status**
  - id (PK), user_id, current_level (int), xp_accumulated (int), last_claimed_tier (int)

- **notifications**
  - id (PK), user_id, message, is_sent (bool), send_time (datetime), created_at (datetime)

- **site_visits**
  - id (PK), user_id, source (string), visit_timestamp (datetime)



# 01_architecture_en.md (Revised Summary)
위 설계에서는 행위중독 트리거와 모바일게임식 과금 메커니즘을 핵심 축으로 삼아,

- F2P 이코노미(Free Coins vs. Premium Gems)
- 가챠/배틀패스/한정 이벤트
- 도파민 루프 강화용 심리적 보상(멀티센서리, AI 대사)
- 뛰어난 데이터 개인화(RFM + LTV + 심리 프로파일링)
- 성인 콘텐츠 언락을 자연스러운 Progression으로 확장

이 모두를 하나의 통합 시스템으로 설계했습니다.

다음으로는 데이터 파이프라인, 감정 피드백, 어덜트 리워드, 기업 연계(크로스 플랫폼) 문서를 차례대로 개편해 나갑니다.