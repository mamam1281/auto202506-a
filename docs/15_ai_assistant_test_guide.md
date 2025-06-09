# 🤖 Casino-Club F2P 프로젝트 AI 어시스턴트 테스트 가이드

## 📊 현재 진행 상황

### ✅ 완료된 작업
- **통합 테스트**: 3개 모두 성공 ✅
- **RewardService**: 6개 실패 → 전체 통과 ✅  
- **NotificationService**: 6개 실패 → 전체 통과 ✅

### 🎯 현재 우선순위: AdultContentService 테스트 수정 (1순위)

#### 실패 테스트 현황 (3개)
```
FAILED tests/test_adult_content_service.py::TestAdultContentService::test_get_user_unlock_history_success - AssertionError: 0 != 2
FAILED tests/test_adult_content_service.py::TestAdultContentService::test_unlock_content_stage_already_explicitly_unlocked
FAILED tests/test_adult_content_service.py::TestAdultContentService::test_upgrade_access_temporarily_user_not_found
```

#### 핵심 문제점
1. **사용자 잠금 해제 이력 조회**: 예상 2개 → 실제 0개 반환
2. **메서드 시그니처 불일치**: `content_id` 파라미터 오류
3. **Mock 데코레이터 매개변수 누락**: 3개 `@patch`에 대응 매개변수 부족

### 📋 다음 순위 작업 대기 중

#### 기타 Service 테스트들 (2순위)
- UserService, AuthService 등 나머지 실패 테스트들
- 예상 실패 개수: 약 7-10개

### 🎯 성공 패턴 (검증됨)

#### RewardService & NotificationService 적용 패턴
1. **UTC 타임존 통일**: `datetime.now(timezone.utc)` 필수
2. **Mock 최소화**: 필수 속성만 포함하여 안정성 확보
3. **실제 DB 스키마 반영**: 테이블 구조와 정확히 일치
4. **SQLAlchemy 세션 관리**: 테스트 후 `session.refresh()` 적용
5. **상태 전이 로직**: pending → processed 순차 처리

#### 핵심 성공 요소
- **setup_user_tokens_for_integration** 헬퍼 활용
- **Zero-Error Tolerance**: 런타임 에러 절대 금지
- **TDD 적용**: 실패 테스트 → 구현 → 통과 확인

### 📊 테스트 성공률 현황
- **시작 시점**: 28개 중 16개 실패 (57% 성공률)
- **현재**: 28개 중 3개 실패 (89% 성공률) 📈 +32% 향상
- **목표**: 100% 성공률

### 🥈 차순위: 프론트엔드 환경 구축

#### 현재 문제
- react-scripts 설치 불완전으로 npm start 실패
- node_modules 의존성 충돌

#### 해결 방향
- **Vite 기반 환경**: react-scripts 대신 경량화된 빌드 도구
- **기술 스택**: React 18 + Material UI + Axios
- **API 연동**: 백엔드 http://localhost:8000 연결

### ⚠️ 준수 사항

#### 🔐 보안 기준
- JWT_SECRET_KEY 등 민감 정보는 환경변수 관리
- 하드코딩된 API 키, 비밀번호 절대 금지
- HttpOnly 쿠키 기반 토큰 저장

#### 🏗️ 아키텍처 기준
- **Clean Architecture**: Handlers → Services → Repositories → Database
- **SOLID 원칙**: 단일 책임, 개방/폐쇄, 의존성 역전 원칙

#### 🧪 테스트 품질 기준
- **Zero-Error Tolerance**: 런타임 에러 절대 금지
- **Mock 최소화**: 필수 속성만 사용하여 안정성 확보
- **타임존 통일**: UTC 기준으로 모든 datetime 처리

### 📚 핵심 참조 문서

#### cc-webapp/backend/docs/ 디렉토리
- **03_data_model.md**: DB 스키마 및 테이블 관계
- **04_API & Logic Flow.md**: 비즈니스 로직 플로우
- **06_test_cases.md**: 테스트 케이스 명세
- **09_solid_principles_kr.md**: SOLID 원칙 가이드
- **21_security_authentication.md**: 보안 가이드

#### 통합 테스트 성공 패턴
- **test_int_flash_offer_service.py** (완전 통과)
- **test_int_adult_content_service.py** (완전 통과)
- **test_int_notification_service.py** (완전 통과)

### 🚀 즉시 실행 명령어

#### AdultContentService 테스트 확인
```powershell
cd "C:\Users\task2\OneDrive\문서\GitHub\2025-2\auto202506-a\cc-webapp\backend"; python -m pytest tests/test_adult_content_service.py -v --tb=short
```

#### 전체 테스트 현황 확인
```powershell
cd "C:\Users\task2\OneDrive\문서\GitHub\2025-2\auto202506-a\cc-webapp\backend"; python -m pytest --tb=no -q
```

### 📈 성과 지표
- **RewardService**: 6개 실패 → 0개 실패 ✅
- **NotificationService**: 6개 실패 → 0개 실패 ✅
- **다음 목표**: AdultContentService 3개 실패 → 0개 실패
- **최종 목표**: 100% 테스트 통과, MVP 출시 준비 완료
