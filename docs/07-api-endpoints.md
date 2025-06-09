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
GET  /games/history       - Game history query
GET  /games/probability   - Probability info query
```

### AI Consultation Service
```
WS   /chat/ws/{user_id}   - WebSocket chat connection
POST /ai/analyze          - Emotion analysis request
GET  /ai/templates        - Response template query
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

### Gacha System
- **Grade-based Probability**: Legendary(5%), Epic(20%), Rare(50%), Common(25%)
- **Pity System**: Guaranteed within 90 pulls
- **Duplication Prevention**: 50% reduced probability for owned items

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
- **Emotion Recognition**: frustrated, excited, curious, tired
- **Response Generation**: Customized responses based on situation
- **Action Suggestion**: Redirect to head office site when tokens are insufficient

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
