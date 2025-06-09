# 🖥️ 기술 구현 및 API 가이드

## 개요
자동화 시스템의 기술 구현과 API 엔드포인트를 종합적으로 안내합니다.

## 1. 시스템 아키텍처

### Frontend (React/Next.js)
- **기술 스택**: React 18 + Next.js + Redux Toolkit + Tailwind CSS
- **실시간 통신**: WebSocket을 통한 CJ AI 채팅
- **상태 관리**: Redux + React Query

### Backend (FastAPI)
- **기술 스택**: FastAPI + SQLAlchemy + Redis + WebSocket
- **인증**: JWT + bcrypt + 초대 코드 시스템
- **게임 엔진**: 모듈화된 확률 기반 시스템

## 2. 주요 API 엔드포인트

### 인증 관리
```
POST /auth/login          - 초대 코드 기반 로그인
POST /auth/register       - 사용자 등록
POST /auth/refresh        - 토큰 갱신
```

### 게임 서비스
```
POST /games/slot/spin     - 슬롯 머신 스핀
POST /games/roulette/spin - 룰렛 스핀  
POST /games/gacha/pull    - 가챠 뽑기
GET  /games/history       - 게임 이력 조회
GET  /games/probability   - 확률 정보 조회
```

### AI 상담 서비스
```
WS   /chat/ws/{user_id}   - WebSocket 채팅 연결
POST /ai/analyze          - 감정 분석 요청
GET  /ai/templates        - 응답 템플릿 조회
```

### 사용자 세그먼트
```
GET  /segments/user       - 사용자 세그먼트 조회
PUT  /segments/adjust     - 세그먼트 조정
```

### 토큰 관리
```
GET  /tokens/balance      - 토큰 잔고 조회
POST /tokens/sync         - 본사 사이트 토큰 동기화
```

## 3. 게임 서비스 구현

### 슬롯 머신 로직
- **기본 확률**: 15% 승률
- **세그먼트 보너스**: Whale(+10%), Medium(+5%), Low(0%)
- **스트릭 시스템**: 연속 실패 시 확률 증가, 7회 시 강제 승리
- **비용**: 10 토큰

### 룰렛 시스템
- **베팅 타입**: 숫자(35배), 색상(2배), 홀짝(2배)
- **하우스 엣지**: 세그먼트별 차등 적용
- **최소 베팅**: 10 토큰

### 가챠 시스템
- **등급별 확률**: Legendary(5%), Epic(20%), Rare(50%), Common(25%)
- **Pity System**: 90회 보장 시스템
- **중복 방지**: 보유 아이템 확률 50% 감소

## 4. 인증 및 보안

### JWT 토큰 관리
- **만료 시간**: 24시간
- **자동 갱신**: 만료 1시간 전 자동 갱신
- **보안 헤더**: Bearer Token 방식

### 초대 코드 시스템
- **형식**: 6자리 영문/숫자 조합
- **검증**: 실시간 유효성 확인
- **예시**: ABC123, DEF456, GHI789

### 비밀번호 정책
- **길이**: 8-20자
- **구성**: 영문 + 숫자 필수
- **검증**: 실시간 정책 확인

## 5. 실시간 채팅 시스템

### WebSocket 연결
```javascript
const ws = new WebSocket(`ws://localhost:8000/chat/ws/${userId}`);

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    handleCJResponse(data);
};
```

### CJ AI 감정 분석
- **감정 인식**: frustrated, excited, curious, tired
- **응답 생성**: 상황별 맞춤 응답
- **액션 제안**: 토큰 부족 시 본사 사이트 리다이렉트

## 6. 응답 형식

### 표준 응답
```json
{
  "success": true,
  "data": {},
  "message": "Success",
  "timestamp": "2025-01-XX"
}
```

### 게임 결과 응답
```json
{
  "success": true,
  "result": "WIN",
  "symbols": ["🍒", "🍒", "🍒"],
  "reward": 100,
  "streak": 0,
  "message": "축하합니다! 100 토큰 획득!"
}
```

### 에러 응답
```json
{
  "success": false,
  "error_code": "INSUFFICIENT_TOKENS",
  "message": "토큰이 부족합니다.",
  "required_tokens": 10,
  "current_tokens": 5
}
```

## 7. 상태 코드

- `200` - 성공
- `400` - 잘못된 요청
- `401` - 인증 실패  
- `402` - 토큰 부족
- `403` - 권한 없음
- `404` - 리소스 없음
- `409` - 중복 데이터
- `500` - 서버 오류

## 8. 요청 제한

- **일반 API**: 분당 100회
- **게임 API**: 분당 30회
- **채팅 API**: 제한 없음
- **인증 API**: 분당 10회

## 9. 개발 환경 설정

### 로컬 개발
```bash
# Backend 실행
uvicorn app.main:app --reload --port 8000

# Frontend 실행  
npm run dev

# WebSocket 테스트
wscat -c ws://localhost:8000/chat/ws/1
```

### 환경변수 설정
환경별 설정은 [환경 설정 가이드](./13-environment-config.md) 참조
