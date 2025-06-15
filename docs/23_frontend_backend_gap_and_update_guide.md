# 23번 - 프론트엔드-백엔드 갭 분석 및 업데이트 가이드

## 📋 **개요** (2025.06.15 기준)

이 문서는 Casino-Club F2P 프로젝트의 프론트엔드와 백엔드 간의 구현 격차를 분석하고, 
체계적인 통합 및 업데이트 가이드를 제공합니다.

**기준 분석 문서**: `22_project_overview_and_status.md` (2025.06.15 업데이트)

---

## 🔍 **프론트엔드-백엔드 갭 매트릭스**

### **완전 매칭 (✅ Ready for Production)**

| 기능 | 프론트엔드 | 백엔드 | API | 상태 |
|------|------------|--------|-----|------|
| **가챠 게임** | 95% (213 lines) | 100% (126 lines) | ✅ | **완전 구현** |
| **슬롯 머신** | 100% (54 lines) | 100% (86 lines) | ✅ | **완전 구현** |
| **룰렛 게임** | 85% (258 lines) | 100% (123 lines) | ✅ | **거의 완성** |
| **사용자 인증** | 100% (55 lines) | 95% | ✅ | **프로덕션 준비** |
| **토큰 관리** | 100% (19 lines) | 100% | ✅ | **완전 구현** |

### **부분 매칭 (🔄 Needs Alignment)**

| 기능 | 프론트엔드 | 백엔드 | API | 격차 이슈 |
|------|------------|--------|-----|----------|
| **감정 피드백** | 40% (모킹) | 70% | ⚠️ | API 연동 미완성 |
| **성인 콘텐츠** | 60% (249 lines) | 80% | 🔄 | 연령 인증 연동 필요 |
| **프로필 관리** | 60% (223 lines) | 85% | 🔄 | API 스키마 불일치 |
| **알림 시스템** | 미구현 | 100% | ❌ | 프론트엔드 완전 누락 |

### **완전 불일치 (❌ Critical Gap)**

| 기능 | 프론트엔드 | 백엔드 | API | 문제점 |
|------|------------|--------|-----|--------|
| **RPS (가위바위보)** | 70% (62 lines UI) | **0%** | ❌ | **백엔드 서비스 전무** |
| **Quiz (퀴즈)** | 10% (4 lines 스텁) | **0%** | ❌ | **백엔드 서비스 전무** |
| **실시간 채팅** | 미구현 | 기본 구조 | ❌ | WebSocket 연동 필요 |

---

## 🚨 **긴급 수정 필요 항목**

### **1. RPS (가위바위보) - 완전 신규 개발**

**현재 상태**:
- 프론트엔드: `app/rps/page.jsx` (62 lines, UI 70% 완성)
- 백엔드: **서비스/라우터 전무**

**필요 작업**:
```python
# 신규 생성 필요
cc-webapp/backend/app/services/rps_service.py
cc-webapp/backend/app/routers/rps.py (또는 games.py에 통합)

# 예상 구현 시간: 4-6시간
```

**API 스펙 (제안)**:
```python
POST /api/games/rps/play
{
    "user_choice": "rock|paper|scissors",
    "bet_amount": 10
}

Response:
{
    "user_choice": "rock",
    "computer_choice": "scissors", 
    "result": "win",
    "tokens_change": 20,
    "balance": 150
}
```

### **2. Quiz (퀴즈) - 완전 신규 개발**

**현재 상태**:
- 프론트엔드: `components/QuizForm.jsx` (4 lines 스텁)
- 백엔드: **서비스/라우터 전무**

**필요 작업**:
```python
# 신규 생성 필요
cc-webapp/backend/app/services/quiz_service.py
cc-webapp/backend/app/models/quiz.py
cc-webapp/backend/alembic/versions/add_quiz_tables.py

# 예상 구현 시간: 6-8시간 (DB 스키마 포함)
```

**DB 스키마 (제안)**:
```sql
CREATE TABLE quiz_questions (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50),
    question TEXT NOT NULL,
    correct_answer VARCHAR(200),
    wrong_answers JSONB,
    difficulty INTEGER DEFAULT 1
);

CREATE TABLE quiz_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    score INTEGER DEFAULT 0,
    total_questions INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### **3. 감정 피드백 API 연동**

**현재 상태**:
- 프론트엔드: `hooks/useEmotionFeedback.js` (모킹된 상태)
- 백엔드: `emotion_feedback_service.py` (구현됨)

**필요 작업**:
```javascript
// cc-webapp/frontend/hooks/useEmotionFeedback.js 수정
// 모킹된 API 호출 → 실제 백엔드 연동
const response = await fetch('/api/feedback/emotion', {
    method: 'POST',
    body: JSON.stringify({ emotion, context })
});
```

---

## 📊 **우선순위별 업데이트 계획**

### **Phase 1: 긴급 (1-2일)**

#### **1.1 백엔드 테스트 안정화**
```bash
# 최우선: GameService 시그니처 통일
파일: cc-webapp/backend/tests/test_slot_service.py
작업: spin(user_id, db) → spin(user_id, bet_amount, db)
예상 시간: 2시간
```

#### **1.2 RPS 백엔드 서비스 구현**
```python
# cc-webapp/backend/app/services/rps_service.py
class RPSService:
    def play(self, user_id: int, user_choice: str, bet_amount: int, db: Session):
        # 게임 로직 + 토큰 차감/지급
        pass

# cc-webapp/backend/app/routers/games.py에 엔드포인트 추가
@router.post("/rps/play")
async def play_rps(request: RPSPlayRequest, ...):
    pass
```

### **Phase 2: 핵심 기능 (3-4일)**

#### **2.1 Quiz 시스템 완전 구현**
```python
# 1. DB 마이그레이션
alembic revision --autogenerate -m "Add quiz tables"

# 2. 퀴즈 서비스 구현
class QuizService:
    def get_questions(self, category: str, count: int = 10):
        pass
    def submit_answers(self, user_id: int, session_id: int, answers: List):
        pass

# 3. 프론트엔드 QuizForm 컴포넌트 완전 구현 (200+ lines)
```

#### **2.2 감정 피드백 실제 연동**
```javascript
// hooks/useEmotionFeedback.js 실제 API 호출
// components/EmotionFeedback.jsx 테스트 수정
```

### **Phase 3: 고도화 (1주)**

#### **3.1 알림 시스템 프론트엔드 구현**
```javascript
// components/NotificationCenter.jsx 신규 생성
// 백엔드 notification_service.py는 이미 완성됨
```

#### **3.2 실시간 기능 구현**
```python
# WebSocket 지원
# 실시간 토큰 업데이트, 게임 결과 푸시
```

---

## 🔧 **단계별 구현 가이드**

### **Step 1: RPS 서비스 구현 (최우선)**

#### **1.1 백엔드 서비스 생성**
```python
# cc-webapp/backend/app/services/rps_service.py
from dataclasses import dataclass
from typing import Literal
import random

@dataclass
class RPSResult:
    user_choice: str
    computer_choice: str
    result: Literal["win", "lose", "draw"]
    tokens_change: int
    balance: int

class RPSService:
    def __init__(self, repository=None, token_service=None):
        self.repo = repository or GameRepository()
        self.token_service = token_service or TokenService()
    
    def play(self, user_id: int, user_choice: str, bet_amount: int, db: Session) -> RPSResult:
        # 입력 검증
        valid_choices = ["rock", "paper", "scissors"]
        if user_choice not in valid_choices:
            raise ValueError("Invalid choice")
        
        # 토큰 차감
        deducted = self.token_service.deduct_tokens(user_id, bet_amount)
        if deducted is None:
            raise ValueError("토큰이 부족합니다.")
        
        # 게임 로직
        computer_choice = random.choice(valid_choices)
        result = self._determine_winner(user_choice, computer_choice)
        
        # 보상 계산
        payout = 0
        if result == "win":
            payout = bet_amount * 2
            self.token_service.add_tokens(user_id, payout)
        elif result == "draw":
            payout = bet_amount  # 무승부 시 베팅액 반환
            self.token_service.add_tokens(user_id, payout)
        
        balance = self.token_service.get_token_balance(user_id)
        return RPSResult(user_choice, computer_choice, result, payout - bet_amount, balance)
    
    def _determine_winner(self, user: str, computer: str) -> str:
        if user == computer:
            return "draw"
        win_conditions = {
            "rock": "scissors",
            "paper": "rock", 
            "scissors": "paper"
        }
        return "win" if win_conditions[user] == computer else "lose"
```

#### **1.2 API 엔드포인트 추가**
```python
# cc-webapp/backend/app/routers/games.py에 추가
from pydantic import BaseModel

class RPSPlayRequest(BaseModel):
    user_choice: str
    bet_amount: int = 10

@router.post("/rps/play")
async def play_rps(
    request: RPSPlayRequest,
    current_user: User = Depends(get_current_user),
    game_service: GameService = Depends(get_game_service),
    db: Session = Depends(get_db),
) -> dict:
    try:
        user_id = getattr(current_user, "user_id", None)
        if user_id is None:
            raise HTTPException(status_code=401, detail="User ID not found")
        
        result = game_service.rps_play(int(user_id), request.user_choice, request.bet_amount, db)
        return {
            "user_choice": result.user_choice,
            "computer_choice": result.computer_choice,
            "result": result.result,
            "tokens_change": result.tokens_change,
            "balance": result.balance,
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
```

#### **1.3 GameService에 통합**
```python
# cc-webapp/backend/app/services/game_service.py에 추가
from .rps_service import RPSService, RPSResult

class GameService:
    def __init__(self, repository=None):
        # ...existing code...
        self.rps_service = RPSService(self.repo)
    
    def rps_play(self, user_id: int, user_choice: str, bet_amount: int, db: Session) -> RPSResult:
        return self.rps_service.play(user_id, user_choice, bet_amount, db)
```

### **Step 2: 프론트엔드 RPS 연동**

#### **2.1 API 호출 함수 추가**
```javascript
// cc-webapp/frontend/services/gameApi.js에 추가
export const playRPS = async (userChoice, betAmount = 10) => {
  const response = await api.post('/api/games/rps/play', {
    user_choice: userChoice,
    bet_amount: betAmount
  });
  return response.data;
};
```

#### **2.2 RPS 페이지 실제 연동**
```javascript
// cc-webapp/frontend/app/rps/page.jsx 수정
import { playRPS } from '../../services/gameApi';

// 기존 UI (70% 완성)에 실제 API 호출 로직 추가
const handlePlay = async (choice) => {
  try {
    const result = await playRPS(choice, betAmount);
    // 결과 처리 및 애니메이션
  } catch (error) {
    // 에러 처리
  }
};
```

---

## 📈 **예상 완성도 변화**

### **현재 (2025.06.15)**
- **전체 프로젝트**: 68%
- **백엔드**: 85% (RPS/Quiz 누락)
- **프론트엔드**: 52%

### **Phase 1 완료 후 (예상 +2일)**
- **전체 프로젝트**: 75% (+7%)
- **백엔드**: 92% (+7%, RPS 구현)
- **프론트엔드**: 58% (+6%, RPS 연동)

### **Phase 2 완료 후 (예상 +1주)**
- **전체 프로젝트**: 85% (+10%)
- **백엔드**: 98% (+6%, Quiz 구현)
- **프론트엔드**: 72% (+14%, Quiz + 감정 피드백)

### **Phase 3 완료 후 (예상 +2주)**
- **전체 프로젝트**: 92% (+7%)
- **MVP 출시 준비 완료** 🚀

---

## ⚠️ **주의사항 및 리스크**

### **기술적 리스크**
1. **RPS/Quiz 백엔드 구현**: 기존 아키텍처와의 일관성 유지 필요
2. **DB 마이그레이션**: Quiz 테이블 추가 시 기존 데이터 영향 없음 확인
3. **테스트 커버리지**: 신규 서비스에 대한 테스트 필수

### **일정 리스크**
1. **의존성**: RPS → Quiz → 감정 피드백 순서 권장
2. **테스트 실패**: 현재 56개 실패 테스트 우선 수정 필요
3. **API 스키마**: 프론트엔드-백엔드 스키마 불일치 주의

### **품질 리스크**
1. **UX 일관성**: 기존 게임들과 동일한 UI/UX 패턴 유지
2. **성능**: 새로운 게임 추가 시 전체 성능 영향 최소화
3. **보안**: 베팅 시스템의 토큰 조작 방지

---

## 🎯 **성공 메트릭**

### **개발 완료 기준**
- [ ] RPS: 프론트엔드-백엔드 완전 연동, 테스트 통과
- [ ] Quiz: DB 스키마 + 서비스 + UI 완전 구현
- [ ] 감정 피드백: 실제 API 연동, 모킹 제거
- [ ] 전체 테스트: 90% 이상 통과율

### **품질 기준**
- [ ] 게임 플레이: 버그 없는 완전한 플레이 사이클
- [ ] 토큰 관리: 정확한 차감/지급, 밸런스 실시간 반영
- [ ] UX: 기존 게임들과 일관된 사용자 경험
- [ ] 성능: 게임 응답 시간 < 500ms

---

**📋 문서 업데이트**: 2025.06.15
**기준 문서**: `22_project_overview_and_status.md` 
**다음 리뷰**: Phase 1 완료 후 (예상 2025.06.17)
