🧪 테스트 개발 통합 체크리스트 - Casino-Club F2P 프로젝트

📋 프로젝트 테스트 현황 및 관리 가이드

🎯 최종 목표: pytest 전체 통과 달성

📊 현재 테스트 상황 (2025.06.08 최신)
✅ FlashOfferService 테스트 완료
- [x] 7개 테스트 모두 통과 (100% 성공률)
- [x] 타임존 문제 해결 완료
- [x] 모델 속성 동기화 완료
- [x] UserReward 호환성 문제 해결


🚨 **현재 긴급 문제: 다른 서비스 테스트 다수 실패**
```
16 failed, 83 passed, 1 skipped, 12 warnings
```

📈 전체 프로젝트 테스트 진행률
통과: 83개
실패: 16개
현재 성공률: 83%

🔍 해결된 주요 문제들
✅ 1. FlashOffer 모델 속성 동기화
- [x] is_active → is_purchased 변경
- [x] offer_type → trigger_reason 변경
- [x] 필수 필드 content_id, discount_rate 추가
✅ 2. 타임존 처리 표준화
- [x] UTC 타임존 통일 처리
- [x] datetime.now(timezone.utc) 사용
- [x] 테스트 간 타임스탬프 일관성 확보
✅ 3. UserReward 모델 호환성
- [x] 불필요한 amount, created_at 파라미터 제거
- [x] 최소 필수 속성만 사용하여 안정성 확보

🚨 남은 실패 테스트 우선순위 (최신 업데이트)

🎉 **완료된 작업들**
- [x] ~~pytest 컬렉션 오류 해결~~ ✅
- [x] ~~Migration 문제 (trigger_action_id 추가)~~ ✅  
- [x] ~~테스트 Setup 오류 해결~~ ✅
- [x] ~~Migration 실행 및 DB 동기화~~ ✅
- [x] ~~Pydantic V2 경고 해결~~ ✅

🔥 **다음 우선순위 (실제 데이터 기반 + 최신 업데이트)**
- [x] ~~전체 테스트 현황 파악~~ ✅ **78% 통과율 확인**
- [x] **Pydantic V2 추가 수정 완료** ✅ **GachaPullResponseItem, tracking router**
- [ ] **Pydantic V2 수정 효과 확인** (경고 메시지 감소 측정)
- [ ] **21개 실패 테스트 Service별 분류 (재분석)**
- [ ] **Top 3 실패 Service에 FlashOffer 패턴 적용**
- [ ] **13개 경고 메시지 완전 제거**

🟡 중간 (단계적 해결)
- [ ] Mock 객체 구조: 테스트 파라미터 불일치
- [ ] 사용자 찾기 실패: User Service Mock 설정
- [ ] API 엔드포인트: 통합 테스트 안정화
🟢 낮음 (최적화 단계)
- [ ] 성능 테스트: 응답 시간 최적화
- [ ] 커버리지 향상: 80% 이상 달성
- [ ] E2E 테스트: 사용자 플로우 검증
📝 다음 단계 실행 계획
Phase 1: Migration & Schema 완전 해결 🔄
Phase 2: 나머지 Service 테스트 수정 🔄
Phase 3: 통합 테스트 최종 검증 🔄
📝 **긴급 해결 프롬프트 가이드 (업데이트)**

## ✅ ~~1단계: pytest 컬렉션 오류 해결~~ (완료)

## 🔥 **1-B단계: 테스트 Setup 오류 해결 (신규)**

### 프롬프트:
```
FlashOffer 통합 테스트에서 Setup 단계에서 오류가 발생합니다.

다음 서비스들의 초기화 문제를 해결해주세요:

1. **Fixture 의존성 순서 확인**:
   - db_session fixture가 올바르게 설정되었는지 확인
   - 각 서비스 fixture들이 db_session에 의존하는지 검증
   - conftest.py에서 fixture 순서와 scope 설정 점검

2. **서비스 초기화 문제 해결**:
   - TokenService 초기화 파라미터 확인
   - AgeVerificationService 의존성 체크
   - RewardService 설정 검증
   - AdultContentService 초기화 검증

3. **데이터베이스 연결 문제**:
   - 테스트 DB 연결 상태 확인
   - Migration 상태 검증
   - 테스트용 테이블 생성 확인

4. **Mock 설정 검토**:
   - 외부 의존성들이 올바르게 Mock 처리되었는지 확인
   - 환경변수 설정 검증

에러 발생 위치:
- tests/integration/test_int_flash_offer_service.py
- Setup 단계에서 서비스 객체 생성 실패

현재 성공한 부분:
✅ FlashOfferTrigger enum 추가 완료
✅ 파일 컴파일 및 import 성공
```

## 🔥 **1-C단계: Pydantic V2 경고 해결**

### 프롬프트:
```
Pydantic V2 호환성 경고를 해결해주세요:

경고 메시지:
"Valid config keys have changed in V2: 'orm_mode' has been renamed to 'from_attributes'"

해결 방법:
1. **모든 Pydantic 모델 검토**:
   - models/ 폴더의 모든 파일 검사
   - schemas/ 폴더의 모든 파일 검사

2. **Config 클래스 업데이트**:
   ```python
   # 기존 (V1)
   class Config:
       orm_mode = True
   
   # 변경 (V2)
   class Config:
       from_attributes = True
   ```

3. **일괄 변경 명령어**:
   ```bash
   find . -name "*.py" -exec sed -i 's/orm_mode = True/from_attributes = True/g' {} \;
   ```

4. **검증**:
   - 모든 Pydantic 모델이 올바르게 작동하는지 확인
   - 경고 메시지가 사라지는지 검증
```

## 🔥 2단계: Migration 문제 해결

### 프롬프트:
```
UserReward 모델에서 'trigger_action_id' is an invalid keyword argument 오류가 발생합니다.

다음을 체계적으로 해결해주세요:

1. **DB 스키마 확인**:
   - UserReward 테이블의 실제 컬럼 구조 조회
   - trigger_action_id 컬럼 존재 여부 확인
   - 필수/선택 필드 구분

2. **모델 정의 수정**:
   - models/user_reward.py에서 trigger_action_id 필드 정의 확인
   - SQLAlchemy 컬럼 타입과 제약조건 맞춤
   - Foreign Key 관계 설정 검증

3. **Migration 스크립트 생성/수정**:
   - alembic revision --autogenerate -m "fix_user_reward_trigger_action_id"
   - 생성된 migration 파일 검토 및 수정
   - 기존 데이터와의 호환성 고려

4. **테스트 Mock 객체 업데이트**:
   - FlashOfferService 성공 사례처럼 최소 필수 속성만 사용
   - trigger_action_id 파라미터 제거 또는 올바른 값 설정
```

## 🔥 3단계: 스키마 불일치 해결

### 프롬프트:
```
DB 컬럼 누락 문제를 완전히 해결해주세요:

1. **전체 모델 검증**:
   - 모든 SQLAlchemy 모델과 실제 DB 테이블 비교
   - 누락된 컬럼, 잘못된 타입, 제약조건 불일치 찾기

2. **일괄 수정**:
   - docs/03_data_model.md와 실제 모델 동기화
   - ERD 문서(docs/13_erd_overview.md)와 비교 검증

3. **Migration 전략**:
   - 데이터 손실 없는 안전한 migration 순서 수립
   - 롤백 시나리오 준비

프로젝트 내 중요 파일들:
- src/models/*.py
- alembic/versions/*.py  
- docs/03_data_model.md
- docs/13_erd_overview.md
```

## 🔥 4단계: 의존성 문제 해결

### 프롬프트:
```
Import 오류 및 모듈 누락 문제를 해결해주세요:

1. **의존성 순환 문제 해결**:
   - 모든 파일의 import 구문 검토
   - 순환 참조 제거 (circular import)
   - 조건부 import나 런타임 import 사용 검토

2. **누락된 모듈 설치**:
   - requirements.txt 검증 및 업데이트
   - pip install -r requirements.txt 재실행
   - 개발 의존성과 운영 의존성 분리

3. **경로 문제 해결**:
   - PYTHONPATH 설정 확인
   - 상대경로 vs 절대경로 일관성
   - __init__.py 파일 존재 여부

검증 명령어:
- python -c "import sys; print(sys.path)"
- python -c "from src.models.user_reward import UserReward"
```

## 🛠️ **외부 환경 작업용 설정값**

### 환경변수 설정 (.env 파일)
```env
# Database Configuration
DATABASE_URL=sqlite:///./test.db
POSTGRES_URL=postgresql://user:password@localhost:5432/casino_club_test
REDIS_URL=redis://localhost:6379/0

# Test Configuration  
PYTEST_CURRENT_TEST=1
TESTING=true
TEST_DATABASE_URL=sqlite:///:memory:

# Python Path
PYTHONPATH=./src:./tests:$PYTHONPATH

# Logging
LOG_LEVEL=DEBUG
LOG_FILE=./logs/test.log

# Timezone
TZ=UTC
DEFAULT_TIMEZONE=UTC

# Flask/FastAPI Configuration
FLASK_ENV=testing
DEBUG=true
SECRET_KEY=test_secret_key_for_development_only

# External Services (Mock)
EXTERNAL_API_BASE_URL=http://localhost:8000/mock
PAYMENT_SERVICE_URL=http://localhost:8001/mock
```

### requirements-test.txt
```txt
pytest>=7.4.0
pytest-asyncio>=0.21.0
pytest-cov>=4.1.0
pytest-mock>=3.11.0
pytest-xdist>=3.3.0
pytest-html>=3.2.0
pytest-warnings>=0.3.1

# Database
sqlalchemy>=2.0.0
alembic>=1.11.0
psycopg2-binary>=2.9.0

# Testing utilities
factory-boy>=3.3.0
faker>=19.0.0
freezegun>=1.2.0
responses>=0.23.0

# Linting & Formatting
black>=23.0.0
isort>=5.12.0
flake8>=6.0.0
mypy>=1.5.0
```

### pytest.ini
```ini
[tool:pytest]
testpaths = tests
python_files = test_*.py
python_functions = test_*
python_classes = Test*
addopts = 
    -v
    --tb=short
    --strict-markers
    --disable-warnings
    --cov=src
    --cov-report=html
    --cov-report=term-missing
    --cov-fail-under=80
markers =
    unit: Unit tests
    integration: Integration tests
    slow: Slow running tests
    database: Tests requiring database
filterwarnings =
    ignore::DeprecationWarning
    ignore::PendingDeprecationWarning
```

### 작업 스크립트 (run_tests.sh)
```bash
#!/bin/bash
# 환경 설정
export PYTHONPATH="./src:./tests:$PYTHONPATH"
export TESTING=true
export DATABASE_URL="sqlite:///:memory:"

# 의존성 설치
pip install -r requirements-test.txt

# 데이터베이스 초기화
python -c "from src.database import init_db; init_db()"

# Migration 실행
alembic upgrade head

# 테스트 실행 (단계별)
echo "=== 1단계: Syntax 체크 ==="
python -m py_compile tests/integration/test_int_flash_offer_service.py

echo "=== 2단계: Import 체크 ==="
python -c "import tests.integration.test_int_flash_offer_service"

echo "=== 3단계: 개별 테스트 실행 ==="
pytest tests/integration/test_int_flash_offer_service.py -v --tb=short

echo "=== 4단계: 전체 테스트 실행 ==="
pytest tests/ -x --tb=short
```

### Docker 환경 (docker-compose.test.yml)
```yaml
version: '3.8'
services:
  test-db:
    image: postgres:15
    environment:
      POSTGRES_DB: casino_club_test
      POSTGRES_USER: test_user
      POSTGRES_PASSWORD: test_password
    ports:
      - "5433:5432"
    volumes:
      - test_db_data:/var/lib/postgresql/data

  test-redis:
    image: redis:7-alpine
    ports:
      - "6380:6379"

  test-app:
    build: .
    environment:
      - DATABASE_URL=postgresql://test_user:test_password@test-db:5432/casino_club_test
      - REDIS_URL=redis://test-redis:6379/0
      - TESTING=true
    depends_on:
      - test-db
      - test-redis
    volumes:
      - .:/app
    working_dir: /app
    command: pytest tests/ -v

volumes:
  test_db_data:
```

### VS Code 설정 (.vscode/settings.json)
```json
{
    "python.testing.pytestEnabled": true,
    "python.testing.pytestArgs": [
        "tests"
    ],
    "python.testing.unittestEnabled": false,
    "python.defaultInterpreterPath": "./venv/bin/python",
    "python.envFile": "${workspaceFolder}/.env",
    "python.terminal.activateEnvironment": true
}
```

🛠️ 개발 시 반드시 따라야 할 테스트 규칙
1. 새로운 Service 개발 체크리스트
- [ ] 실패하는 테스트 먼저 작성 (TDD)
- [ ] UTC 타임존 사용 (datetime.now(timezone.utc))
- [ ] 모델 속성 정확히 확인 후 사용
- [ ] Mock 객체 최소 필수 속성만 설정
- [ ] 에러 핸들링 테스트 포함
2. 모델 수정 시 체크리스트
- [ ] Migration 스크립트 업데이트
- [ ] 관련 Service 테스트 수정
- [ ] Mock 객체 속성 동기화
- [ ] 기존 테스트 영향도 확인
3. 테스트 실행 표준 절차
📊 성과 지표 및 목표
**🎉 달성된 목표**
- [x] ~~pytest 컬렉션 오류 완전 해결~~ ✅
- [x] ~~Migration 파일 생성 및 적용~~ ✅
- [x] ~~테스트 Setup 오류 해결~~ ✅
- [x] ~~Migration 실행 및 DB 동기화~~ ✅
- [x] ~~기본 테스트 실행 환경 복구~~ ✅
- [x] ~~Pydantic V2 경고 해결~~ ✅
- [x] ~~FlashOffer 통합 테스트 완전 통과~~ ✅

**즉시 목표 (오늘 내)**
- [ ] **실패 테스트 21개 Service별 분류 완료**
- [ ] **Top 3 실패 Service 식별**
- [ ] **첫 번째 Service 수정 시작 (FlashOffer 패턴 적용)**

**단기 목표 (3일 내)**
- [ ] FlashOffer 성공 패턴을 상위 3개 Service에 적용
- [ ] 전체 테스트 통과율 78% → 85% 달성
- [ ] 경고 메시지 13개 → 0개 완전 제거

중기 목표 (1주일 내)
- [ ] 모든 Service 테스트 통과
- [ ] Mock 구조 표준화 완료
- [ ] 목표: 100% 테스트 통과
장기 목표 (2주일 내)
- [ ] 커버리지 80% 이상
- [ ] CI/CD 파이프라인 구축
- [ ] 성능 테스트 추가
🎯 FlashOfferService 성공 사례 활용법
적용 가능한 패턴
다른 Service에 적용할 수정 방법
- [ ] TokenService: 타임존 + Mock 구조 정리
- [ ] UnlockService: Migration + 모델 속성 동기화
- [ ] UserService: Mock 파라미터 + 에러 핸들링
🔄 지속적 모니터링 체크리스트
일일 체크 (개발 중)
- [ ] 새로운 실패 테스트 없는지 확인
- [ ] 수정한 테스트 재실행 검증
- [ ] 타임존/Mock 설정 일관성 유지
주간 체크 (스프린트 말)
- [ ] 전체 테스트 통과율 측정
- [ ] 커버리지 리포트 생성
- [ ] 테스트 실행 시간 최적화
배포 전 최종 체크
- [ ] pytest tests/ -q 전체 통과
- [ ] 커버리지 기준 충족
- [ ] 성능 테스트 통과
📚 참고 자료 및 문서
**🥇 AI 작업용 핵심 기준 문서**
- [x] **`docs/15_ai_assistant_test_guide.md`** - AI 전용 실시간 가이드 (최우선)
- [x] **`docs/14_test_tracking_service_analysis.md`** - 본 문서 (전체 현황)

**🥈 기술 참조 문서**  
- [ ] docs/03_data_model.md - DB 스키마 참조
- [ ] docs/13_erd_overview.md - ERD 구조
- [ ] docs/01_architecture_en.md - 시스템 아키텍처

**🥉 개발 가이드 문서**
- [ ] docs/04_API & Logic Flow.md - API 플로우
- [ ] docs/06_test_cases.md - 테스트 케이스
- [ ] docs/09_solid_principles_kr.md - SOLID 원칙
- [ ] docs/21_security_authentication.md - 보안 가이드

**⚠️ AI 작업시 문서 우선순위**:
1. `docs/15_ai_assistant_test_guide.md` (매번 확인)
2. `docs/14_test_tracking_service_analysis.md` (전체 상황)  
3. `docs/03_data_model.md` + `docs/13_erd_overview.md` (Migration시)

🏆 최종 성공 기준
✅ 테스트 통과 기준
📊 수치 목표
테스트 통과율: 100%
커버리지: 80% 이상
테스트 실행 시간: 30초 이내
🎯 현재 진행 상황: FlashOfferService 완료 ✅ → 다음: Migration 문제 해결 🔄

"FlashOfferService 성공 패턴을 다른 Service에 적용하여 빠른 해결 가능"

