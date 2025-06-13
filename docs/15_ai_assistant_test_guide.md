# 🤖 게임 API DB 연동 완성 및 게임 서비스 테스트 강화 프롬프트

---

## 🎯 **즉시 실행 필요한 핵심 작업 2개**

### **작업 1: 게임 API DB 연동 완성 ("not implemented yet" 해결)**
현재 `app/routers/games.py`에서 3개 엔드포인트가 "not implemented yet" 상태입니다:
- `/api/games/slot` (슬롯 머신)
- `/api/games/roulette` (룰렛)  
- `/api/games/gacha` (가챠)

**요구사항:**
1. 실제 게임 로직으로 교체 (확률 계산, DB 저장, 보상 지급)
2. 각 게임별 서비스(`slot_service.py`, `roulette_service.py`, `gacha_service.py`)와 연동
3. DB 트랜잭션 안전성 보장
4. 적절한 에러 핸들링 및 로깅

### **작업 2: 게임 서비스 테스트 커버리지 50% 이상 달성**
현재 게임 관련 서비스들의 테스트 커버리지가 35% 미만입니다:
- `game_service.py` - 32% 커버리지
- `slot_service.py` - 28% 커버리지  
- `roulette_service.py` - 31% 커버리지
- `gacha_service.py` - 34% 커버리지

**요구사항:**
1. 각 서비스의 테스트 커버리지를 50% 이상으로 증가
2. 성공/실패/예외 시나리오 모두 커버
3. 확률 계산, RTP, 스트릭 로직 검증
4. Mock 최소화, 실제 DB/Redis 환경에서 테스트

---

## 📁 **프로젝트 현재 상태 요약**

### ✅ **완료된 작업**
- 전체 99개 테스트 100% 통과 (0 failed, 32 warnings)
- DB 마이그레이션 완료 (migration_script.py 실행 성공)
- 저가치 테스트 제거 및 테스트 코드 최적화
- 핵심 서비스 파일 복구/재작성 완료
- 문서화 업데이트 (testing guide, checklist)

### ⚠️ **즉시 처리 필요**
- **게임 API 3개 엔드포인트**: "not implemented yet" → 실제 DB 연동 로직
- **게임 서비스 테스트 커버리지**: 35% → 50% 이상 증가

### 📊 **현재 테스트 커버리지 상태**
```
Overall coverage: 52%
Critical gaps:
- game_service.py: 32%
- slot_service.py: 28% 
- roulette_service.py: 31%
- gacha_service.py: 34%
```

---

## 🛠️ **구체적 구현 가이드**

### **Part A: 게임 API DB 연동 구현**

**파일 위치:** `cc-webapp/backend/app/routers/games.py`

**현재 상태 (교체 필요):**
```python
# Line 해당 위치에서 다음과 같은 구조 발견:
@router.post("/slot")
async def play_slot():
    return {"message": "not implemented yet"}

@router.post("/roulette") 
async def play_roulette():
    return {"message": "not implemented yet"}

@router.post("/gacha")
async def play_gacha():
    return {"message": "not implemented yet"}
```

**구현해야 할 구조:**
1. **슬롯 엔드포인트:**
   - 사용자 베팅 금액 검증
   - `slot_service.play_slot()` 호출
   - 결과 DB 저장 및 보상 지급
   - 응답: 게임 결과, 보상, 잔액 업데이트

2. **룰렛 엔드포인트:**
   - 베팅 타입 및 금액 검증  
   - `roulette_service.play_roulette()` 호출
   - 결과 처리 및 DB 업데이트
   - 응답: 결과 번호, 당첨 여부, 보상

3. **가챠 엔드포인트:**
   - 가챠 타입 및 횟수 검증
   - `gacha_service.play_gacha()` 호출  
   - 아이템 지급 및 이력 저장
   - 응답: 획득 아이템 목록, 레어도

### **Part B: 게임 서비스 테스트 강화**

**테스트 파일 위치:** `cc-webapp/backend/tests/`

**추가/복구 필요한 테스트 파일들:**
- `test_game_service.py`
- `test_slot_service.py` 
- `test_roulette_service.py`
- `test_gacha_service.py`

**각 테스트에서 커버해야 할 시나리오:**

1. **성공 시나리오:**
   - 정상 게임 플레이 및 결과 반환
   - 확률에 따른 보상 지급
   - DB 상태 업데이트 검증

2. **실패 시나리오:**
   - 잔액 부족 시 게임 거부
   - 잘못된 입력값 처리
   - DB 연결 실패 시 롤백

3. **비즈니스 로직 검증:**
   - RTP(Return to Player) 계산 정확성
   - 스트릭(연승/연패) 상태 관리
   - 확률 테이블 적용 검증

---

## 📋 **세부 구현 체크리스트**

### **슬롯 서비스 (slot_service.py)**
- [ ] `play_slot(user_id, bet_amount)` 메서드 구현
- [ ] 심볼 조합 확률 계산 로직
- [ ] 잭팟/보너스 라운드 처리
- [ ] 스트릭 카운터 업데이트
- [ ] 테스트: 승리/패배/잭팟 시나리오

### **룰렛 서비스 (roulette_service.py)**  
- [ ] `play_roulette(user_id, bet_type, bet_amount)` 메서드
- [ ] 0-36 번호 생성 및 색상/홀짝 판정
- [ ] 베팅 타입별 배당률 계산
- [ ] 결과 히스토리 저장
- [ ] 테스트: 다양한 베팅 타입별 검증

### **가챠 서비스 (gacha_service.py)**
- [ ] `play_gacha(user_id, gacha_type, count)` 메서드  
- [ ] 레어도별 확률 테이블 적용
- [ ] 천장 시스템 (보장 메커니즘) 구현
- [ ] 중복 아이템 처리 로직
- [ ] 테스트: 확률 검증, 천장 시스템 테스트

### **DB 연동 (game_repository.py)**
- [ ] 게임 결과 기록 메서드들
- [ ] 사용자 잔액 업데이트 트랜잭션
- [ ] 아이템 인벤토리 관리
- [ ] Redis 캐시 연동 (핫스트릭 등)

---

## 🔧 **기술적 요구사항**

### **환경 설정**
- Python 3.9+, FastAPI, SQLAlchemy, Redis
- 테스트: pytest, pytest-cov, pytest-asyncio
- DB: SQLite (개발), PostgreSQL (운영)

### **아키텍처 패턴**
- Clean Architecture (Router → Service → Repository → DB)
- 의존성 주입 (Dependency Injection) 활용
- 트랜잭션 안전성 보장

### **성능 요구사항**  
- 게임 API 응답 시간: < 500ms
- 동시 사용자 처리: 100+ concurrent requests
- 테스트 실행 시간: < 60초

### **보안 요구사항**
- JWT 토큰 기반 인증 필수
- 베팅 금액 서버사이드 검증
- Rate limiting (사용자당 게임 빈도 제한)
- 게임 결과 감사 로그 기록

---

## 📖 **참고 문서 및 코드**

### **핵심 참고 파일들**
- `app/models.py` - DB 스키마 정의
- `app/schemas.py` - API 입출력 스키마  
- `app/database.py` - DB 연결 및 세션 관리
- `app/services/` - 기존 서비스 패턴 참고
- `tests/` - 기존 테스트 코드 패턴 참고

### **중요 설정 파일들**
- `requirements.txt` - 의존성 패키지 목록
- `pytest.ini` - 테스트 설정
- `alembic/` - DB 마이그레이션 스크립트

### **API 문서**
- FastAPI 자동 생성 문서: `http://localhost:8000/docs`
- 게임 API 명세: `docs/07-api-endpoints.md`

---

## ✅ **완료 기준 및 검증 방법**

### **구현 완료 기준**
1. **3개 게임 API 모두 실제 로직으로 교체 완료**
2. **pytest 실행 시 모든 테스트 통과 (99+ tests)**  
3. **게임 서비스 테스트 커버리지 50% 이상 달성**
4. **게임 플레이 → DB 저장 → 결과 반환 전체 플로우 정상 동작**

### **검증 명령어**
```bash
# 1. 전체 테스트 실행
cd cc-webapp/backend
python -m pytest -v

# 2. 커버리지 확인  
python -m pytest --cov=app --cov-report=term-missing

# 3. 게임 API 수동 테스트
python -m pytest tests/test_*game* -v

# 4. 특정 서비스 커버리지 확인
python -m pytest --cov=app.services.game_service --cov-report=term-missing
```

### **최종 검증 체크리스트**
- [ ] `/api/games/slot` POST 요청 시 실제 게임 결과 반환
- [ ] `/api/games/roulette` POST 요청 시 룰렛 결과 및 보상 계산  
- [ ] `/api/games/gacha` POST 요청 시 아이템 획득 및 인벤토리 업데이트
- [ ] 각 게임별 성공/실패/예외 시나리오 테스트 통과
- [ ] 전체 테스트 스위트 100% 통과 유지
- [ ] 게임 서비스 통합 커버리지 50% 이상

---

## 🚀 **작업 진행 순서 (권장)**

1. **현재 상태 확인** (5분)
   - `grep -r "not implemented yet" app/routers/games.py`
   - `python -m pytest --cov=app.services.*game* --cov-report=term`

2. **슬롯 API 우선 구현** (30분)
   - `slot_service.py` 핵심 메서드 구현
   - `games.py` 슬롯 엔드포인트 실제 로직 연결
   - 기본 테스트 케이스 추가

3. **룰렛 & 가챠 API 구현** (45분)  
   - 동일한 패턴으로 순차 구현
   - 각각의 비즈니스 로직에 맞는 구현

4. **테스트 강화** (30분)
   - 누락된 테스트 케이스 추가
   - 커버리지 50% 달성까지 보완

5. **통합 검증** (10분)
   - 전체 테스트 스위트 실행
   - API 수동 테스트 및 최종 확인

**예상 총 소요 시간: 약 2시간**

---

이 프롬프트를 외부 AI에게 전달하면, 게임 API DB 연동 완성과 테스트 커버리지 향상 작업을 체계적으로 수행할 수 있습니다.

---

## 📚 **추가 컨텍스트 및 참고 자료**

### **프로젝트 아키텍처 문서**
- `docs/01_architecture_en.md` - 전체 시스템 구조 및 F2P 게임 메커니즘
- `docs/CC_backend_refactor_guideline_ko.md` - 백엔드 리팩토링 가이드라인  
- `docs/17_game.md` - 게임 서비스 계층 구조 및 핵심 모듈 설계

### **기술 구현 참고**
- `docs/07-api-endpoints.md` - API 엔드포인트 명세
- `docs/security_authentication_en.md` - 인증 및 보안 구현 가이드
- `docs/09-testing-guide.md` - 현재 테스트 상태 및 가이드 (99 tests, 100% pass)

### **개발 체크리스트**  
- `docs/12_game_dev_full_checklist_ko.md` - 전체 개발 진행 현황 (백엔드 98% 완료)
- `docs/PROJECT_PROGRESS_CHECKLIST.md` - 프로젝트 전체 진행 상황

### **중요 제약사항**
- **윈도우 환경**: PowerShell 명령어 사용 시 `;` (세미콜론) 사용
- **Clean Architecture**: Router → Service → Repository → DB 계층 준수
- **TDD 원칙**: 테스트 코드와 함께 구현, Mock 최소화
- **보안 요구사항**: JWT 인증, 서버사이드 검증, Rate limiting 필수

### **환경 설정 파일**
- `cc-webapp/backend/requirements.txt` - Python 의존성
- `cc-webapp/backend/pytest.ini` - 테스트 설정
- `cc-webapp/backend/alembic.ini` - DB 마이그레이션 설정

---

**이 프롬프트로 외부 AI가 수행해야 할 핵심 작업:**
1. **게임 API 3개 엔드포인트 실제 구현** (슬롯/룰렛/가챠)
2. **게임 서비스 테스트 커버리지 50% 이상 달성**
3. **모든 테스트 통과 상태 유지** (99+ tests)
4. **DB 연동 안전성 및 성능 보장**

완료 후 `python -m pytest --cov=app --cov-report=term` 명령어로 검증 가능합니다.