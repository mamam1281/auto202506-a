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

## 5. Advanced Emotion Analysis System Tests 🤖✨

### 5.1. Emotion Models Validation
```python
def test_emotion_result_creation():
    """Emotion result model validation"""
    # Given: Valid emotion data
    emotion = EmotionResult(
        emotion=SupportedEmotion.EXCITED,
        score=0.8,
        confidence=0.9,
        language=SupportedLanguage.KOREAN
    )
    # Then: Model created successfully
    assert emotion.emotion == "excited"
    assert emotion.is_confident() == True

def test_multi_language_emotion_detection():
    """Multi-language emotion detection"""
    # Given: Korean and English text
    korean_text = "정말 기뻐요!"
    english_text = "I'm so happy!"
    # When: Emotion analysis executed
    # Then: Both detect EXCITED emotion with high confidence
```

### 5.2. Sentiment Analyzer Tests
```python
def test_sentiment_analyzer_local_model():
    """Local sentiment model test"""
    # Given: Configured local model
    analyzer = SentimentAnalyzer()
    # When: Analyze text "I love this game!"
    result = analyzer.analyze("I love this game!")
    # Then: Returns positive emotion with confidence

def test_sentiment_analyzer_llm_fallback():
    """LLM fallback when confidence is low"""
    # Given: Ambiguous text with low confidence
    # When: Local model confidence < 0.7
    # Then: Fallback to external LLM (OpenAI/Claude)
    # And: Log fallback usage for cost tracking
```

### 5.3. CJ AI Service Integration Tests
```python 
def test_ai_analyze_endpoint():
    """POST /ai/analyze endpoint test"""
    # Given: Valid user message
    payload = {
        "user_id": 1,
        "text": "슬롯에서 대박났어!",
        "context": {"recent_games": ["slot"]}
    }
    # When: POST to /ai/analyze
    response = client.post("/ai/analyze", json=payload)
    # Then: 200 OK + emotion analysis result

def test_ai_websocket_push():
    """Real-time emotion feedback via WebSocket"""
    # Given: Active WebSocket connection
    # When: Emotion analysis completed
    # Then: Real-time feedback pushed to client
```

### 5.4. Recommendation Service Tests
```python
def test_personalized_recommendation():
    """Personalized game recommendation"""
    # Given: User with emotion history
    # When: GET /recommend/personalized
    # Then: Returns game recommendations based on emotion + history

def test_recommendation_strategy_selection():
    """Recommendation strategy selection"""
    # Given: Different user segments (Whale, Medium, Low)
    # When: Request recommendations
    # Then: Different strategies applied (collaborative vs content-based)
```

### 5.5. Emotion Feedback Service Tests
```python
def test_feedback_template_selection():
    """Emotion-based feedback template selection"""
    # Given: User emotion "frustrated" + segment "Medium"
    # When: Request feedback
    # Then: Appropriate encouraging template selected

def test_multi_language_feedback():
    """Multi-language feedback generation"""
    # Given: Korean user with "excited" emotion
    # When: Generate feedback
    # Then: Korean feedback template used

def test_llm_fallback_feedback():
    """LLM fallback when no template matches"""
    # Given: Rare emotion combination
    # When: No matching template found
    # Then: LLM generates contextual feedback
```

## 6. Integration Testing Commands

### 6.1. MVP Test Execution (Updated Path)
```bash
# Navigate to correct test directory
cd cc-webapp/backend

# Run MVP level tests only
pytest -m mvp -v

# Run all new emotion tests
pytest -m emotion -v

# Run specific test file
pytest tests/test_emotion_mvp.py -v

# Run with discovery check
pytest tests/ -v --collect-only

# Run all tests with coverage
pytest tests/ -v --cov=app
```

### 6.2. Test Location and Structure
```
cc-webapp/backend/
├── tests/
│   ├── conftest.py              # Test configuration
│   ├── test_emotion_mvp.py      # MVP emotion tests
│   ├── test_user_segment_service.py  # Existing tests
│   ├── test_game_service.py     # Existing tests
│   └── test_cj_ai_service.py    # Existing tests
├── pytest.ini                  # Pytest configuration
└── app/                         # Application code
```

### 6.3. Test Discovery Debugging
```bash
# Check if pytest can find test files
pytest --collect-only

# Verbose test discovery
pytest --collect-only -q

# Check specific directory
pytest tests/unit/ --collect-only

# Run with maximum verbosity
pytest tests/unit/test_emotion_mvp.py -vvv
```

### 6.4. Test File Verification
```bash
# Verify test file syntax
python -m py_compile tests/unit/test_emotion_mvp.py

# Run single test
pytest tests/unit/test_emotion_mvp.py::test_pytest_discovers_this_file -v

# Check imports
python -c "import tests.unit.test_emotion_mvp; print('Import successful')"
```

### 6.5. API Endpoint Testing
```bash
# Test emotion analysis endpoint
curl -X POST "http://localhost:8000/ai/analyze" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"user_id": 1, "text": "정말 기뻐요!", "context": {}}'

# Test recommendation endpoint
curl -X GET "http://localhost:8000/recommend/personalized?user_id=1" \
  -H "Authorization: Bearer <token>"

# Test feedback endpoint
curl -X POST "http://localhost:8000/feedback/generate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"user_id": 1, "emotion": "excited", "segment": "Medium"}'
```

### 6.6. Database Integration Test
```bash
# Test database migrations
alembic upgrade head

# Verify emotion log table
psql -d test_db -c "SELECT * FROM user_emotion_logs LIMIT 5;"

# Test recommendation history
psql -d test_db -c "SELECT * FROM recommendation_history WHERE accepted = true;"
```

### 6.7. Redis Integration Test
```bash
# Test Redis emotion caching
redis-cli GET "emotion:user:1:latest"

# Test LLM usage logging
redis-cli HGETALL "llm_usage:daily:$(date +%Y%m%d)"
```

## 7. Performance Testing

### 7.1. Load Testing
```python
def test_emotion_analysis_performance():
    """Emotion analysis performance test"""
    # Given: 100 concurrent emotion analysis requests
    # When: All requests processed
    # Then: Average response time < 500ms
    # And: No memory leaks or errors

def test_recommendation_cache_efficiency():
    """Recommendation caching efficiency"""
    # Given: Repeated recommendation requests
    # When: Cache hit ratio measured
    # Then: Cache hit ratio > 80%
```

### 7.2. Memory and Resource Testing
```bash
# Monitor memory usage during tests
pytest tests/unit/test_advanced_emotion.py --profile

# Check for memory leaks
valgrind python -m pytest tests/unit/test_advanced_emotion.py
```

## 8. Quick Problem Solving 🚀

### 8.1. Missing Dependencies Fix
```bash
# Install missing test dependencies
pip install httpx pytest-asyncio

# If still failing, run MVP tests only
pytest tests/test_emotion_mvp.py -v

# Skip problematic tests temporarily
pytest tests/ -v -k "not (auth or chat_ws or gacha_router)"
```

### 8.2. Test Environment Setup
```bash
# Set test environment variables
export TESTING=true
export DATABASE_URL=sqlite:///./test.db

# Run tests without external services
pytest tests/test_emotion_mvp.py -v --tb=short
```
