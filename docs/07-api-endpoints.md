# 🖥️ Technical Implementation & API Guide

## Overview
Comprehensive guide to system's technical implementation and API endpoints.

## 1. System Architecture

### Frontend (React/Next.js)
- **Tech Stack**: React 18 + Next.js + Redux Toolkit + Tailwind CSS
- **Real-time Communication**: WebSocket for CJ AI Chat
- **State Management**: Redux + React Query

### Backend (FastAPI)
- **Tech Stack**: FastAPI + SQLAlchemy + Redis + WebSocket
- **Authentication**: JWT + bcrypt + Invite Code System
- **Game Engine**: Modularized Probability-based System

## 2. Main API Endpoints

### Authentication Management
```
POST /auth/login          - Invite code-based login
POST /auth/register       - User registration
POST /auth/refresh        - Token refresh
```

### Game Service
```
POST /games/slot/spin     - Slot machine spin
POST /games/roulette/spin - Roulette spin  
POST /games/gacha/pull    - Gacha pull
POST /games/rps/play      - Rock-Paper-Scissors game
GET  /games/history       - Game history query
GET  /games/probability   - Probability info query
```

### Quiz Service (New) 📝
```
GET  /api/quiz/list       - Quiz list query
POST /api/quiz/submit     - Quiz submission and scoring
GET  /api/quiz/{id}       - Individual quiz query
POST /api/quiz/create     - Quiz creation (admin)
```

### AI Consultation Service
```
WS   /chat/ws/{user_id}   - WebSocket chat connection
POST /ai/analyze          - Emotion analysis request
GET  /ai/templates        - Response template query
```

### Advanced Emotion Analysis (New) 🤖✨
```
POST /ai/analyze          - Advanced emotion analysis with context
POST /recommend/personalized - AI-powered game recommendations  
POST /feedback/generate   - Emotion-based personalized feedback
GET  /emotion/history     - User emotion analysis history
```

### User Segment
```
GET  /segments/user       - User segment query
PUT  /segments/adjust     - Segment adjustment
```

### Token Management
```
GET  /tokens/balance      - Token balance query
POST /tokens/sync         - Head office site token synchronization
```

## 3. Game Service Implementation

### Slot Machine Logic
- **Base Probability**: 15% win rate
- **Segment Bonus**: Whale(+10%), Medium(+5%), Low(0%)
- **Streak System**: Probability increase on consecutive failures, forced win on 7th failure
- **Cost**: 10 tokens

### Roulette System
- **Betting Types**: Number(35x), Color(2x), Odd/Even(2x)
- **House Edge**: Differentiated by segment
- **Minimum Bet**: 10 tokens
- **New Features**:
  - Streak Management: Win/loss tracking
  - Jackpot System: Progressive jackpot for number bets
  - Comprehensive Logging: Detailed bet and result tracking
  - Error Handling: Enhanced token validation

### Gacha System
- **Grade-based Probability**: Legendary(5%), Epic(20%), Rare(50%), Common(25%)
- **Pity System**: Guaranteed within 90 pulls
- **Duplication Prevention**: 50% reduced probability for owned items

### Rock-Paper-Scissors (RPS) System
- **Choices**: rock, paper, scissors
- **Win Logic**: rock beats scissors, paper beats rock, scissors beats paper
- **Segment-based Rewards**: 
  - Whale users: 2.5x bet amount on win
  - Medium users: 2x bet amount on win
  - Low users: 1.5x bet amount on win
- **Draw**: Bet amount refunded
- **Loss**: Bet amount lost
- **Minimum Bet**: User-defined amount (must have sufficient tokens)
- **Game Recording**: All games logged to user_actions table

## 4. Authentication and Security

### JWT Token Management
- **Expiration Time**: 24 hours
- **Automatic Renewal**: Renewed automatically 1 hour before expiration
- **Security Header**: Bearer Token method

### Invite Code System
- **Format**: 6-character alphanumeric combination
- **Validation**: Real-time validity check
- **Examples**: ABC123, DEF456, GHI789

### Password Policy
- **Length**: 8-20 characters
- **Composition**: Must include letters and numbers
- **Validation**: Real-time policy check

## 5. Real-time Chat System

### WebSocket Connection
```javascript
const ws = new WebSocket(`ws://localhost:8000/chat/ws/${userId}`);

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    handleCJResponse(data);
};
```

### CJ AI Emotion Analysis
- **Emotion Recognition**: frustrated, excited, curious, tired, angry, sad, neutral
- **Multi-language Support**: Korean, English with automatic language detection
- **Confidence Scoring**: 0.0-1.0 confidence levels with LLM fallback
- **Context Awareness**: Previous chat history and game session analysis
- **Response Generation**: 50+ categorized feedback templates
- **Real-time Updates**: WebSocket push notifications for instant feedback

### Advanced Features
- **LLM Fallback**: OpenAI/Claude integration when local model confidence < threshold
- **Recommendation Engine**: Hybrid collaborative + content-based filtering
- **Template System**: Emotion + segment + context-aware response generation
- **Performance Monitoring**: Redis-based usage tracking and caching

## 6. Response Format

### Standard Response
```json
{
  "success": true,
  "data": {},
  "message": "Success",
  "timestamp": "2025-01-XX"
}
```

### Game Result Response
```json
{
  "success": true,
  "result": "WIN",
  "symbols": ["🍒", "🍒", "🍒"],
  "reward": 100,
  "streak": 0,
  "message": "Congratulations! You've won 100 tokens!"
}
```

### RPS Game Response
```json
{
  "success": true,
  "data": {
    "user_choice": "rock",
    "computer_choice": "scissors", 
    "result": "win",
    "tokens_change": 15,
    "balance": 285
  },
  "message": "You won!"
}
```

### RPS Game Request
```json
{
  "user_choice": "rock",
  "bet_amount": 10
}
```

### Error Response
```json
{
  "success": false,
  "error_code": "INSUFFICIENT_TOKENS",
  "message": "Insufficient tokens.",
  "required_tokens": 10,
  "current_tokens": 5
}
```

## 7. Status Codes

- `200` - Success
- `400` - Bad Request
- `401` - Authentication Failed  
- `402` - Insufficient Tokens
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## 8. Request Limits

- **General API**: 100 requests per minute
- **Game API**: 30 requests per minute
- **Chat API**: No limit
- **Authentication API**: 10 requests per minute

## 9. Development Environment Setup

### Local Development
```bash
# Run Backend
uvicorn app.main:app --reload --port 8000

# Run Frontend  
npm run dev

# Test WebSocket
wscat -c ws://localhost:8000/chat/ws/1
```

### Environment Variable Setup
For environment-specific settings, refer to the [Environment Configuration Guide](./13-environment-config.md)

## 10. Advanced Emotion API Testing

### Manual API Testing
```bash
# 1. Test emotion analysis
curl -X POST "http://localhost:8000/ai/analyze" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{
    "user_id": 1,
    "text": "슬롯에서 대박났어! 정말 기뻐요!",
    "context": {
      "recent_games": ["slot"],
      "win_streak": 3,
      "session_duration": 1800
    }
  }'

# Expected Response:
{
  "success": true,
  "data": {
    "emotion": "excited",
    "score": 0.85,
    "confidence": 0.92,
    "language": "korean",
    "context_aware": true
  }
}

# 2. Test personalized recommendations
curl -X GET "http://localhost:8000/recommend/personalized?user_id=1" \
  -H "Authorization: Bearer <jwt_token>"

# Expected Response:
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "game_type": "roulette",
        "confidence": 0.78,
        "reason": "Based on your excited mood and recent slot wins"
      }
    ]
  }
}

# 3. Test emotion feedback generation
curl -X POST "http://localhost:8000/feedback/generate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{
    "user_id": 1,
    "emotion": "excited",
    "segment": "Medium",
    "context": {"game_type": "slot", "result": "win"}
  }'

# Expected Response:
{
  "success": true,
  "data": {
    "feedback": "축하합니다! 이 기세를 몰아 룰렛도 도전해보세요! 🎉",
    "template_id": "excited_win_medium",
    "animation_meta": {"type": "celebration", "duration": 3000}
  }
}
```

## 11. 🆕 New Router Architecture

### Router Structure
```
app/routers/
├── auth.py           # 기존 인증 관련
├── games.py          # 기존 게임 관련  
├── segments.py       # 기존 세그먼트 관련
├── tokens.py         # 기존 토큰 관리
├── chat.py           # 기존 채팅/WebSocket
├── feedback.py       # 🆕 감정 피드백 생성
├── analyze.py        # 🆕 고급 감정 분석
└── recommend.py      # 🆕 개인화 추천
```

### Integration Status
- ✅ All new routers successfully integrated
- ✅ Main app imports working correctly  
- ✅ Conditional imports prevent startup errors
- ✅ Service classes properly instantiated
- ✅ API endpoints responding correctly
