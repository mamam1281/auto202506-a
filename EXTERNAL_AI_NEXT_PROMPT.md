# 🤖 외부 AI 작업 프롬프트 - 다음 단계

## 📋 현재 상황 요약
외부 AI가 `origin/codex/fix-test-failures-and-ensure-stability` 브랜치를 통해 테스트 안정성 개선을 완료했습니다. 이제 다음 단계 구현이 필요합니다.

## 🎯 작업 요청사항

### 우선순위 1: 누락된 핵심 라우터 파일 생성
현재 다음 파일들이 완전히 누락되어 있어 구현이 필요합니다:

1. **`cc-webapp/backend/app/routers/auth.py`** - 인증 시스템
2. **`cc-webapp/backend/app/routers/games.py`** - 게임 로직 (슬롯, 룰렛, 가챠)
3. **실제 데이터베이스 마이그레이션** - 모델을 실제 테이블로 생성

### 우선순위 2: 토큰 시스템 실제 구현
현재 메모리 딕셔너리로만 동작하는 시스템을 실제 구현체로 교체:

1. **Redis 토큰 잔고 시스템** - user:{id}:cyber_token_balance 패턴
2. **PostgreSQL 연동** - 실제 테이블 생성 및 데이터 저장
3. **토큰 플로우 완성** - 획득/소비/잔고조회 전체 플로우

## 🔧 구체적 구현 요구사항

### AUTH.PY 라우터 구현
```python
# 필수 엔드포인트
POST /api/auth/signup    # 닉네임/비밀번호 회원가입 (email 불필요)
POST /api/auth/login     # 닉네임/비밀번호 로그인
POST /api/auth/verify-invite  # 초대코드 검증
GET  /api/auth/me        # 현재 사용자 정보

# 비즈니스 로직
- 초대코드 기반 가입 (소수 인증받은 회원 대상)
- 가입 즉시 200 사이버토큰 지급
- JWT 토큰 기반 인증
- 닉네임 중복 체크
```

### GAMES.PY 라우터 구현
```python
# 필수 엔드포인트
POST /api/games/slot     # 슬롯머신 (2토큰 소모, Variable-Ratio 보상)
POST /api/games/roulette # 룰렛 (2토큰 소모, 확률 기반 보상)
POST /api/games/gacha    # 가챠 (50토큰 소모, 티켓/코인 보상)

# 비즈니스 로직 (문서 기준)
- 슬롯/룰렛: 기본 10% 승률, 연속 실패 시 보정
- 가챠: 티켓 5%, 고급코인 20%, 일반코인 50%, 실패 25%
- 도파민 루프: 즉각 피드백, Variable-Ratio 보상
- 토큰 부족 시 본사 사이트 이동 유도
```

### 데이터베이스 마이그레이션
```sql
-- 실제 테이블 생성이 필요한 모델들
- users (id, nickname, password_hash, cyber_token_balance, invite_code)
- user_actions (id, user_id, action_type, timestamp, metadata)
- user_rewards (id, user_id, reward_type, amount, timestamp)
- adult_content (id, stage, content_url, unlock_cost)
- user_segments (id, user_id, segment_type, risk_level)
- invite_codes (id, code, is_used, created_at)
```

## 📋 참조 문서 (반드시 확인)
구현 시 다음 문서들의 요구사항을 정확히 반영하세요:

- **01_architecture_en.md**: 전체 시스템 아키텍처
- **02_data_personalization_en.md**: 사용자 세그먼테이션 로직
- **04_adult_rewards_en.md**: 성인 콘텐츠 단계별 비용 (Stage 1=200, Stage 2=500, Stage 3=1000)
- **05_corporate_retention_en.md**: 본사 사이트 연동 토큰 흐름
- **10_onboarding_en.md**: 닉네임/비밀번호 로그인 (email 제외)

## 🎯 성공 기준
작업 완료 후 다음이 모두 통과해야 합니다:

```bash
# 1. 테스트 통과
cd cc-webapp/backend
python -m pytest tests/ -v

# 2. API 엔드포인트 확인
curl -X POST http://localhost:8000/api/auth/signup
curl -X POST http://localhost:8000/api/games/slot
curl -X POST http://localhost:8000/api/games/gacha

# 3. 데이터베이스 테이블 확인
docker exec -it postgres psql -U user -d cc_db -c "\dt"

# 4. Redis 토큰 시스템 확인
docker exec -it redis redis-cli get user:1:cyber_token_balance
```

## 📝 구현 가이드라인

### 코딩 표준
- FastAPI + SQLAlchemy 2.x 호환성 유지
- Pydantic 스키마 활용한 입/출력 검증
- 환경변수 기반 설정 (개발/프로덕션 분리)
- 선택적 의존성 처리 (Redis, Kafka 연결 실패 시 graceful fallback)

### 보안 고려사항
- 비밀번호 bcrypt 해싱
- JWT 토큰 만료 시간 설정
- 초대코드 일회성 사용 제한
- SQL Injection 방지

### 성능 고려사항
- Redis 캐싱 활용
- 데이터베이스 인덱스 설정
- 연결 풀 최적화
- 비동기 처리 (async/await)

## 🚀 작업 순서 제안
1. **1단계**: auth.py 라우터 구현 (인증 기반 필수)
2. **2단계**: 데이터베이스 마이그레이션 실행
3. **3단계**: games.py 라우터 구현 (토큰 소비 게임)
4. **4단계**: Redis 토큰 시스템 연동
5. **5단계**: 통합 테스트 및 검증

## 📋 체크리스트 업데이트
작업 완료 후 `docs/12_game_dev_full_checklist_ko.md`의 해당 항목들을 체크 완료로 변경해주세요.

---

**중요**: 이 프로그램은 소수 인증받은 회원 대상이므로 닉네임/패스워드만 활용한 간소화된 인증 절차를 구현해주세요. Email 필드는 불필요합니다.
