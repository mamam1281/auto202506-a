# 🧪 Testing & Quality Assurance Integrated Guide

## Overview
Comprehensive guide to test strategy, execution methods, and quality management.

## 1. Current Test Status 📊

### Test Pass Rate Dashboard
```bash
# As of June 9, 2025
================== 89 passed, 1 skipped, 3 warnings in 1.59s ==================
```

### Performance Metrics
- **Pass Rate**: 96.3% (89/92 tests passed)
- **Skipped**: 1 test
- **Warnings**: 3 (Pydantic V2 related)
- **Target**: Achieve 100% pass rate

## 2. Test Structure & Strategy

### Unit Tests
- **Location**: `tests/unit/`
- **Tool**: pytest
- **Coverage**: 90%+ target
- **Scope**: Individual functions, class methods

### Integration Tests
- **Location**: `tests/integration/`
- **Environment**: Docker containers
- **Data**: Test-specific DB
- **Scope**: Service interconnections

### E2E Tests
- **Location**: `tests/e2e/`
- **Tools**: Selenium + pytest
- **Browsers**: Chrome, Firefox
- **Scope**: Complete user journeys

## 3. Key Test Scenarios 🎯

### 3.1. Invite Code & Authentication Tests 🔒

```python
def test_valid_invite_code_authentication():
    """Successful authentication with valid invite code"""
    # Given: Valid invite code "ABC123"
    # When: Authentication request with nickname/password
    # Then: 200 OK + JWT token issued

def test_invalid_invite_code_rejection():
    """Invalid invite code rejection"""
    # Given: Invalid invite code "INVALID"
    # When: Authentication request
    # Then: 400 Bad Request + "Invalid invite code" message

def test_jwt_token_expiration():
    """JWT token expiration handling"""
    # Given: Expired JWT token
    # When: API call requiring authentication
    # Then: 401 Unauthorized + Re-login required
```

### 3.2. Game Service Tests 🎲

#### Slot Machine Tests
```python
def test_slot_spin_success():
    """Slot spin success test"""
    # Given: Sufficient tokens (100), Medium segment user
    # When: Slot spin request (cost: 10 tokens)
    # Then: 200 OK + Result (win/lose) + Token change

def test_slot_forced_win_at_streak_7():
    """Forced win on 7th streak"""
    # Given: 7 consecutive losses
    # When: 8th spin request
    # Then: 100% win + Streak reset

def test_slot_segment_probability():
    """Probability adjustment by segment"""
    # Given: Whale segment user
    # When: Slot spin (100 spins test)
    # Then: Win rate approximately 25% (base 15% + whale 10%)
```

#### Roulette Tests
```python
def test_roulette_win_streak():
    """룰렛 연승 스트릭 테스트"""
    # Given: 3연승 중인 사용자
    # When: 베팅 승리
    # Then: 스트릭 4로 증가 + 로그 기록

def test_roulette_jackpot_win():
    """룰렛 잭팟 획득 테스트"""
    # Given: 잭팟 풀 1000토큰
    # When: 스트레이트 업 베팅 성공
    # Then: 잭팟 지급 + 잭팟 풀 리셋

def test_roulette_insufficient_tokens():
    """룰렛 토큰 부족 테스트"""
    # Given: 보유 토큰 5개
    # When: 최소 베팅(10토큰) 시도
    # Then: 402 에러 + 상세 오류 메시지
```

#### Gacha Tests
```python
def test_gacha_pity_system():
    """Gacha Pity System test"""
    # Given: 89 consecutive non-Epic draws
    # When: 90th gacha pull
    # Then: Epic or higher guaranteed

def test_gacha_probability_distribution():
    """Gacha probability distribution test"""
    # Given: 1000 gacha simulation
    # When: Gacha pulls executed
    # Then: Distribution of Legendary(5%), Epic(20%), Rare(50%), Common(25%)
```

### 3.3. CJ AI Chat Tests 🤖

```python
def test_websocket_connection_establishment():
    """WebSocket connection establishment"""
    # Given: Valid user ID
    # When: WebSocket connection request
    # Then: Connection successful + Welcome message received

def test_cj_emotion_analysis():
    """CJ AI emotion analysis"""
    # Given: Message "Awesome! I won on the slot!"
    # When: Emotion analysis executed
    # Then: emotion="excited" + Congratulations message response

def test_websocket_connection_recovery():
    """WebSocket connection recovery"""
    # Given: Connection lost due to network failure
    # When: Reconnection attempt
    # Then: Automatic reconnection + Previous conversation context restored
```

### 3.4. Token Management Tests 💰

```python
def test_token_synchronization():
    """Token synchronization test"""
    # Given: Token mismatch between Redis and DB
    # When: Synchronization task executed
    # Then: DB updated with Redis value + Mismatch log recorded

def test_insufficient_token_handling():
    """Insufficient token handling"""
    # Given: 5 tokens available
    # When: Slot spin request (needs 10 tokens)
    # Then: 402 Insufficient + Shortage notification
```

## 4. Environment Variable Test Improvements

### User Segment Service Tests
- Added tests for environment variable overrides
- Verified probability adjustment values and house edge settings
- Tested JSON parsing error handling

### Game Service Tests
- Managed probability table environment variable tests
- Strengthened security-related tests (to prevent probability manipulation)
- Verified logging functionality

### AI Service Tests
- Tested improved emotion analysis algorithm
- Verified various response templates
- Tested error handling and recovery

### Recent Test Results
```bash
# 2025년 6월 10일 기준
collected 15 items
..... (생략)
✅ 15 passed in 2.31s
```
