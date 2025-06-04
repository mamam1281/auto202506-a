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