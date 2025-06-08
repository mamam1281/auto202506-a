# 🧪 테스트 개발 체크리스트 - Casino-Club F2P 프로젝트

## 📋 전체 프로젝트 개발에서 이용할 테스트 가이드라인

### 🎯 **목표: 28개 실패 → 0개 전체 통과**

---

## 📊 현재 상황 (2025.06.08)

### ✅ **통과 현황**: 86/109개 (78.9%)
### ❌ **실패 현황**: 23/109개 (21.1%)
### ⏭️ **스킵**: 1개

---

## 🔍 **주요 실패 원인 분석**

### 1. **타임존 문제** (우선순위: 🔥 높음)
- **문제**: `can't compare offset-naive and offset-aware datetimes`
- **영향**: Flash Offer Service 7개 테스트 실패
- **해결**: UTC 타임존 통일 처리

### 2. **스키마/Migration 문제** (우선순위: 🔥 높음)  
- **문제**: `'trigger_action_id' is an invalid keyword argument for UserReward`
- **영향**: Unlock 관련 3개 테스트 실패
- **해결**: Migration Script 실행 + 모델 동기화

### 3. **Mock/Test 구조 문제** (우선순위: 🟡 중간)
- **문제**: Mock 파라미터 누락, 사용자 찾기 실패
- **영향**: 13개 테스트 실패
- **해결**: Test Fixture 정리 + Mock 구조 개선

---

## 📝 **단계별 수정 계획**

### **Phase 1: Migration & Schema 수정** ✅ 완료
- [x] Migration script 실행
- [x] 누락된 DB 컬럼 추가
- [x] 새로운 의존성 설치

### **Phase 2: 타임존 문제 해결** 🔄 진행중
- [ ] Flash Offer Service 타임존 통일
- [ ] UTC 기반 datetime 처리
- [ ] Test fixture timezone 정리

### **Phase 3: Mock/Test 구조 개선** 🔄 대기
- [ ] User Service Mock 정리
- [ ] Test Fixture 표준화
- [ ] 테스트 파라미터 정리

### **Phase 4: 통합 테스트 강화** 🔄 대기
- [ ] API 엔드포인트 테스트
- [ ] 데이터베이스 상태 검증
- [ ] 에러 핸들링 테스트

---

## 🛠️ **개발 시 반드시 따라야 할 테스트 규칙**

### **1. TDD (Test-Driven Development) 준수**
```bash
# 개발 프로세스
1. 실패하는 테스트 작성
2. 최소한의 코드로 테스트 통과
3. 리팩터링 및 최적화
4. 테스트 재실행 및 검증
```

### **2. 테스트 실행 명령어**
```bash
# 전체 테스트 실행
pytest tests/ -v

# 특정 모듈 테스트
pytest tests/test_flash_offer_service.py -v

# 커버리지 포함 실행
pytest tests/ --cov=app --cov-report=html

# 실패한 테스트만 재실행
pytest tests/ --lf -v
```

### **3. 새로운 기능 개발 시 체크리스트**
- [ ] **단위 테스트 작성** (Service 레이어)
- [ ] **통합 테스트 작성** (API 엔드포인트)
- [ ] **Mock 객체 적절히 활용**
- [ ] **타임존 처리 UTC 통일**
- [ ] **DB 트랜잭션 테스트**
- [ ] **에러 케이스 테스트**

### **4. 코드 수정 후 필수 검증**
```bash
# 1. 변경된 모듈 테스트
pytest tests/test_{module_name}.py -v

# 2. 전체 테스트 실행
pytest tests/ -q

# 3. 정적 분석
flake8 app/
black app/ --check

# 4. 타입 체크 (추후 추가 예정)
# mypy app/
```

---

## 📂 **테스트 파일 구조 및 컨벤션**

### **디렉터리 구조**
```
tests/
├── __init__.py
├── conftest.py                 # Test fixtures & setup
├── test_*.py                   # 단위 테스트
└── integration/
    └── test_int_*.py           # 통합 테스트
```

### **테스트 파일 네이밍 컨벤션**
```python
# 단위 테스트
test_{service_name}_service.py
test_{router_name}.py

# 통합 테스트  
test_int_{service_name}_service.py

# 테스트 메서드 네이밍
def test_{method_name}_{scenario}_{expected_result}():
    pass

# 예시
def test_unlock_content_stage_insufficient_tokens():
def test_create_flash_offer_success():
```

### **Mock 사용 가이드라인**
```python
# Service 레이어 테스트에서 외부 의존성 Mock
@patch('app.services.redis_client.get')
@patch('app.services.db_session.commit')
def test_service_method_success(self, mock_commit, mock_redis):
    # Given
    mock_redis.return_value = "expected_value"
    
    # When  
    result = self.service.method()
    
    # Then
    self.assertEqual(result.status, "success")
    mock_commit.assert_called_once()
```

---

## 🚨 **실패 방지를 위한 개발 가이드라인**

### **1. 타임존 처리 표준**
```python
# ❌ 잘못된 사용
from datetime import datetime
now = datetime.now()  # 타임존 정보 없음

# ✅ 올바른 사용  
from datetime import datetime, timezone
now = datetime.now(timezone.utc)  # UTC 명시
```

### **2. 데이터베이스 모델 수정 시**
```python
# 1. 모델 수정
# 2. Migration 스크립트 생성/수정
# 3. 테스트 fixture 업데이트
# 4. 관련 테스트 실행 및 검증
```

### **3. Service 레이어 개발 시**
```python
# 1. Service 메서드 정의
# 2. 실패하는 테스트 작성
# 3. 최소 구현으로 테스트 통과
# 4. 리팩터링 및 에러 핸들링 추가
# 5. 테스트 재실행
```

---

## 📈 **성과 지표 및 목표**

### **단기 목표 (1주일)**
- [x] 의존성 문제 해결 ✅
- [ ] 타임존 문제 해결 (7개 테스트)
- [ ] Migration 문제 해결 (3개 테스트)
- [ ] **목표: 90% 이상 통과율**

### **중기 목표 (2주일)**  
- [ ] Mock/Fixture 문제 해결 (13개 테스트)
- [ ] **목표: 100% 테스트 통과**
- [ ] 커버리지 80% 이상 달성

### **장기 목표 (1개월)**
- [ ] 테스트 자동화 CI/CD 구축
- [ ] 성능 테스트 추가
- [ ] E2E 테스트 구축

---

## 🔄 **지속적 개선 프로세스**

### **주간 리뷰 체크리스트**
- [ ] 새로운 실패 테스트 없는지 확인
- [ ] 테스트 커버리지 유지/향상
- [ ] 테스트 실행 시간 최적화
- [ ] 테스트 문서 업데이트

### **코드 리뷰 시 테스트 체크포인트**
- [ ] 새로운 기능에 대한 테스트 존재
- [ ] 테스트가 의미있는 케이스 커버
- [ ] Mock 사용이 적절한지
- [ ] 테스트 코드의 가독성

---

## 📚 **참고 문서**

- **프로젝트 아키텍처**: `docs/01_architecture_en.md`
- **API 명세**: `docs/openapi.yaml`  
- **테스트 케이스**: `docs/09_test_qa_en.md`
- **에러 분석**: `docs/test_tracking_service_analysis.md`

---

**최종 목표: 🎯 pytest -q 전체 통과 (28개 실패 → 0개)**

*"모든 테스트가 통과해야만 프로덕션 배포 가능"*
