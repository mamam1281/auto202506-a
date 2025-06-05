# 🖥️ 기술 구현 문서

## 7.1. Frontend 구현 (React/Next.js) 🌐

### 7.1.1. 프로젝트 구조 📂

```
/frontend
│
├── public/
│   ├── sounds/           # 게임 사운드 파일
│   ├── images/           # 이미지 리소스
│   └── cheatsheet/       # 가이드 문서
│
├── src/
│   ├── components/       # 주요 컴포넌트
│   │    ├── Auth/        # 인증 관련 컴포넌트
│   │    ├── Dashboard/   # 대시보드 컴포넌트
│   │    ├── Games/       # 게임 컴포넌트
│   │    ├── AdultContent/# 성인 콘텐츠 컴포넌트
│   │    └── ... (기타 컴포넌트)
│   │
│   ├── hooks/            # 커스텀 훅
│   ├── pages/            # 페이지 라우팅
│   ├── redux/            # 상태 관리
│   ├── utils/            # 유틸리티 함수
│   └── styles/           # 스타일시트
│
└── 설정 파일들
```

### 7.1.2. 인증 흐름 🔐

#### 초대 코드 입력 컴포넌트

```javascript
// 초대 코드 유효성 검사 예시
if (!/^[A-Z0-9]{6}$/.test(inputCode)) {
  setError("유효한 초대 코드가 아닙니다.");
  return;
}
setInviteValid(true);
```

#### 로그인/회원가입 API 호출

```python
@app.post("/api/auth/login")
def login(auth_req: AuthRequest, db=Depends(get_db)):
    # 인증 로직
    user = db.query(User).filter(
        User.invite_code == auth_req.invite_code,
        User.nickname == auth_req.nickname
    ).first()
    
    if not user or not verify_password(auth_req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="인증 실패")
    
    # JWT 토큰 발급
    access_token = create_access_token({"sub": user.id})
    return {"access_token": access_token, "token_type": "bearer"}
```

## 7.2. Backend 구현 (FastAPI) 🚀

### 7.2.1. 인증 모델 및 스키마

```python
# 사용자 모델
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    invite_code = Column(String(6), unique=True)
    nickname = Column(String(50), unique=True)
    password_hash = Column(String(255))
    cyber_token_balance = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
```

### 7.2.2. 초대 코드 생성 🎫

```python
def generate_invite_codes(n=100):
    codes = set()
    while len(codes) < n:
        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        if not db.query(User).filter(User.invite_code == code).first():
            codes.add(code)
    
    for c in codes:
        new_user = User(invite_code=c, nickname=None, password_hash=None)
        db.add(new_user)
    
    db.commit()
```

### 7.2.3. 토큰 잔고 동기화 💰

```python
@celery.task
def sync_token_from_redis_to_db():
    all_users = db.query(User).all()
    for user in all_users:
        redis_balance = int(redis.get(f"user:{user.id}:cyber_token_balance") or 0)
        user.cyber_token_balance = redis_balance
    db.commit()
```

### 7.2.4. CJ AI 대화 엔드포인트 🤖

```python
@app.post("/api/chat")
def chat_with_cj(request: ChatRequest, db=Depends(get_db), redis=Depends(get_redis)):
    # 유저 메시지 저장
    new_action = UserAction(
        user_id=request.user_id,
        action_type="USER_CHAT",
        metadata={"message": request.message},
        timestamp=datetime.utcnow()
    )
    db.add(new_action); db.commit()

    # AI 응답 생성
    response_text, emotion = generate_ai_response(
        request.user_id, 
        request.message, 
        db, 
        redis
    )

    # AI 응답 기록
    new_action = UserAction(
        user_id=request.user_id,
        action_type="CJ_CHAT",
        metadata={"message": response_text, "emotion": emotion},
        timestamp=datetime.utcnow()
    )
    db.add(new_action); db.commit()

    return {"message": response_text, "emotion": emotion}
```

### AI 응답 생성 로직

```python
def generate_ai_response(user_id: int, user_msg: str, db, redis):
    # 토큰 부족 감지
    if "토큰 부족" in user_msg or "토큰 없어" in user_msg:
        balance = int(redis.get(f"user:{user_id}:cyber_token_balance") or 0)
        if balance < 100:
            return (f"{balance}토큰밖에 없어요. 본사 사이트 접속 시 200토큰을 드립니다!", "concern")
    
    # 게임 확률 정보
    if "확률" in user_msg:
        return ("슬롯 머신 기본 승률은 10%이며, 연속 승리 스트릭에 따라 최대 +30%까지 보너스가 지급됩니다.", "informative")
    
    # 기본 응답
    return ("무엇을 도와드릴까요?", "neutral")
```

주요 특징:
- 심플하고 명확한 구조
- 키워드 기반 AI 응답
- 상황별 맞춤 메시지 제공

## 7.3. 요약 및 기대 효과 🌈

- 제한된 사용자 환경
- 초대 코드 기반 접근 제어
- 실시간 토큰 동기화
- AI 기반 상호작용

<!-- English translation below -->

# Technical Implementation (English Translation)

## 7.1. Frontend Implementation (React/Next.js) 🌐

### 7.1.1. Project Structure 📂

```
/frontend
│
├── public/
│   ├── sounds/           # Game sound files
│   ├── images/           # Image resources
│   └── cheatsheet/       # Guide documents
│
├── src/
│   ├── components/       # Main components
│   │    ├── Auth/        # Authentication related components
│   │    ├── Dashboard/   # Dashboard component
│   │    ├── Games/       # Game components
│   │    ├── AdultContent/# Adult content components
│   │    └── ... (Other components)
│   │
│   ├── hooks/            # Custom hooks
│   ├── pages/            # Page routing
│   ├── redux/            # State management
│   ├── utils/            # Utility functions
│   └── styles/           # Stylesheets
│
└── Configuration files
```

### 7.1.2. Authentication Flow 🔐

#### Invite Code Input Component

```javascript
// Invite code validation example
if (!/^[A-Z0-9]{6}$/.test(inputCode)) {
  setError("Invalid invite code.");
  return;
}
setInviteValid(true);
```

#### Login/Signup API Call

```python
@app.post("/api/auth/login")
def login(auth_req: AuthRequest, db=Depends(get_db)):
    # Authentication logic
    user = db.query(User).filter(
        User.invite_code == auth_req.invite_code,
        User.nickname == auth_req.nickname
    ).first()
    
    if not user or not verify_password(auth_req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Authentication failed")
    
    # Issue JWT token
    access_token = create_access_token({"sub": user.id})
    return {"access_token": access_token, "token_type": "bearer"}
```

## 7.2. Backend Implementation (FastAPI) 🚀

### 7.2.1. Authentication Model and Schema

```python
# User model
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    invite_code = Column(String(6), unique=True)
    nickname = Column(String(50), unique=True)
    password_hash = Column(String(255))
    cyber_token_balance = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
```

### 7.2.2. Invite Code Generation 🎫

```python
def generate_invite_codes(n=100):
    codes = set()
    while len(codes) < n:
        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        if not db.query(User).filter(User.invite_code == code).first():
            codes.add(code)
    
    for c in codes:
        new_user = User(invite_code=c, nickname=None, password_hash=None)
        db.add(new_user)
    
    db.commit()
```

### 7.2.3. Token Balance Synchronization 💰

```python
@celery.task
def sync_token_from_redis_to_db():
    all_users = db.query(User).all()
    for user in all_users:
        redis_balance = int(redis.get(f"user:{user.id}:cyber_token_balance") or 0)
        user.cyber_token_balance = redis_balance
    db.commit()
```

### 7.2.4. CJ AI Conversation Endpoint 🤖

```python
@app.post("/api/chat")
def chat_with_cj(request: ChatRequest, db=Depends(get_db), redis=Depends(get_redis)):
    # Save user message
    new_action = UserAction(
        user_id=request.user_id,
        action_type="USER_CHAT",
        metadata={"message": request.message},
        timestamp=datetime.utcnow()
    )
    db.add(new_action); db.commit()

    # Generate AI response
    response_text, emotion = generate_ai_response(
        request.user_id, 
        request.message, 
        db, 
        redis
    )

    # Log AI response
    new_action = UserAction(
        user_id=request.user_id,
        action_type="CJ_CHAT",
        metadata={"message": response_text, "emotion": emotion},
        timestamp=datetime.utcnow()
    )
    db.add(new_action); db.commit()

    return {"message": response_text, "emotion": emotion}
```

### AI Response Generation Logic

```python
def generate_ai_response(user_id: int, user_msg: str, db, redis):
    # Detecting low tokens
    if "토큰 부족" in user_msg or "토큰 없어" in user_msg:
        balance = int(redis.get(f"user:{user_id}:cyber_token_balance") or 0)
        if balance < 100:
            return (f"{balance}토큰밖에 없어요. 본사 사이트 접속 시 200토큰을 드립니다!", "concern")
    
    # Game probability information
    if "확률" in user_msg:
        return ("슬롯 머신 기본 승률은 10%이며, 연속 승리 스트릭에 따라 최대 +30%까지 보너스가 지급됩니다.", "informative")
    
    # Default response
    return ("무엇을 도와드릴까요?", "neutral")
```

Key Features:
- Simple and clear structure
- Keyword-based AI responses
- Contextualized messages

## 7.3. Summary and Expected Effects 🌈

- Restricted user environment
- Invite code-based access control
- Real-time token synchronization
- AI-based interaction