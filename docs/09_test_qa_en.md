# 🧪 테스트 및 품질 보증 가이드

## 9.1. 주요 테스트 시나리오 🎯

### 1. 초대 코드 & 인증 🔒

#### 테스트 케이스:
- **유효 Invite Code 입력**
  - 닉네임/비밀번호 등록 후 로그인 성공 확인
- **잘못된 Invite Code 입력**
  - 오류 메시지 표시 검증
- **중복/취약 비밀번호 처리**
  - 중복 닉네임 시 오류 확인
  - 약한 비밀번호에 대한 제한

#### 기대 결과:
- 유효 코드: 200 OK + JWT 발급 → /dashboard 리다이렉트
- 유효하지 않은 코드: 400 Bad Request + 오류 메시지
- 중복 닉네임: 409 Conflict

### 2. 사이버 토큰 흐름 💰

#### 테스트 케이스:
- **토큰 획득 시나리오**
  - 본사 사이트 로그인 → Redis 토큰 +100 반영
  - 슬롯 플레이(GAME_WIN) → token_delta 증가
  - 룰렛 플레이(GAME_FAIL) → token_delta 차감

- **토큰 부족 상황**
  - `/api/unlock?desired_stage=1` 호출 시 402 Insufficient 확인

#### 기대 결과:
- Redis 잔고 정확한 집계
- HTTP 응답 코드 및 메시지 검증
- DB 레코드 정상 기록

### 3. 성인 콘텐츠 언락 🔓

#### 테스트 케이스:
- **세그먼트별 언락 테스트**
  - "Medium" 그룹: Stage 2 언락 허용
  - "Low" 그룹: Stage 2 언락 거부 (403 Forbidden)
  - "Whale" 그룹: Stage 3 언락 검증

- **Flash Offer 시나리오**
  - Stage 1 할인 가격 적용 확인

#### 기대 결과:
- 권한/레벨 체크 정상 작동
- Flash Offer 가격 할인 검증

### 4. 가챠 티켓 🎲

#### 테스트 케이스:
- **토큰 기반 가챠**
  - 토큰 50개 이상: 200 OK + "ticket" 또는 "coin" 반환
  - 토큰 49개 이하: 402 Insufficient

- **결과 기록**
  - 티켓 획득: reward_type="CONTENT_TICKET"
  - 코인 획득: reward_type="COIN"

#### 기대 결과:
- 확률 분배(5%, 20%, 50%, 25%) 검증
- DB 레코드 정상 생성

### 5. CJ AI 채팅 🤖

#### 테스트 케이스:
- **맥락 인식 테스트**
  - "토큰 부족" → 본사 사이트 추천, emotion="concern"
  - "확률 알려줘" → 확률 정보 응답, emotion="informative"
  - 실패 시 기본 응답 확인

#### 기대 결과:
- 감정(emotion) 및 메시지 일관성 검증
- user_actions에 정상 기록

<!-- English translation below -->

# Test & Quality Assurance Guide (English Translation)

## 9.1. Key Test Scenarios 🎯

### 1. Invite Code & Authentication 🔒

#### Test Cases:
- **Valid Invite Code Entry**
  - Verify successful login after nickname/password registration
- **Invalid Invite Code Entry**
  - Validate error message display
- **Duplicate/Weak Password Handling**
  - Check for errors with duplicate nicknames
  - Restrictions on weak passwords

#### Expected Results:
- Valid code: 200 OK + JWT issued → Redirect to /dashboard
- Invalid code: 400 Bad Request + error message
- Duplicate nickname: 409 Conflict

### 2. Cyber Token Flow 💰

#### Test Cases:
- **Token Acquisition Scenario**
  - Head office site login → Reflect Redis token +100
  - Slot play (GAME_WIN) → Increase token_delta
  - Roulette play (GAME_FAIL) → Decrease token_delta

- **Insufficient Token Situation**
  - Check 402 Insufficient when calling `/api/unlock?desired_stage=1`

#### Expected Results:
- Accurate aggregation of Redis balance
- Verification of HTTP response codes and messages
- Normal recording in DB

### 3. Adult Content Unlock 🔓

#### Test Cases:
- **Segmented Unlock Test**
  - "Medium" group: Stage 2 unlock allowed
  - "Low" group: Stage 2 unlock denied (403 Forbidden)
  - "Whale" group: Stage 3 unlock verification

- **Flash Offer Scenario**
  - Check discount price application for Stage 1

#### Expected Results:
- Normal operation of 권한/레벨 체크 (authority/level check)
- Verification of Flash Offer price discount

### 4. Gacha Ticket 🎲

#### Test Cases:
- **Token-based Gacha**
  - 50 or more tokens: 200 OK + "ticket" or "coin" returned
  - Less than 50 tokens: 402 Insufficient

- **Result Recording**
  - Ticket acquisition: reward_type="CONTENT_TICKET"
  - Coin acquisition: reward_type="COIN"

#### Expected Results:
- Verification of probability distribution (5%, 20%, 50%, 25%)
- Normal creation of DB records

### 5. CJ AI Chat 🤖

#### Test Cases:
- **Context Recognition Test**
  - "Insufficient tokens" → Recommend head office site, emotion="concern"
  - "Tell me the probability" → Respond with probability information, emotion="informative"
  - Check default response in case of failure

#### Expected Results:
- Verification of consistency in emotion and message
- Normal recording in user_actions