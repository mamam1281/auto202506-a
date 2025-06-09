# 🧪 테스트 및 품질 보증 통합 가이드

## 개요
자동화 시스템의 테스트 전략, 실행 방법, 품질 관리를 종합적으로 안내합니다.

## 1. 현재 테스트 현황 📊

### 테스트 통과율 대시보드
```bash
# 2025년 6월 9일 기준
================== 89 passed, 1 skipped, 3 warnings in 1.59s ==================
```

### 성과 지표
- **통과율**: 96.3% (89/92 테스트 통과)
- **스킵**: 1 테스트
- **경고**: 3개 (Pydantic V2 관련)
- **목표**: 100% 통과율 달성

## 2. 테스트 구조 및 전략

### 단위 테스트 (Unit Tests)
- **위치**: `tests/unit/`
- **도구**: pytest
- **커버리지**: 90% 이상 목표
- **범위**: 개별 함수, 클래스 메서드

### 통합 테스트 (Integration Tests)
- **위치**: `tests/integration/`
- **환경**: Docker 컨테이너
- **데이터**: 테스트 전용 DB
- **범위**: 서비스 간 연동

### E2E 테스트 (End-to-End Tests)
- **위치**: `tests/e2e/`
- **도구**: Selenium + pytest
- **브라우저**: Chrome, Firefox
- **범위**: 전체 사용자 여정

## 3. 주요 테스트 시나리오 🎯

### 3.1. 초대 코드 & 인증 테스트 🔒

```python
def test_valid_invite_code_authentication():
    """유효한 초대 코드로 인증 성공"""
    # Given: 유효한 초대 코드 "ABC123"
    # When: 닉네임/비밀번호와 함께 인증 요청
    # Then: 200 OK + JWT 토큰 발급

def test_invalid_invite_code_rejection():
    """잘못된 초대 코드 거부"""
    # Given: 잘못된 초대 코드 "INVALID"
    # When: 인증 요청
    # Then: 400 Bad Request + "유효하지 않은 초대 코드" 메시지

def test_jwt_token_expiration():
    """JWT 토큰 만료 처리"""
    # Given: 만료된 JWT 토큰
    # When: 인증이 필요한 API 호출
    # Then: 401 Unauthorized + 재로그인 요구
```

### 3.2. 게임 서비스 테스트 🎲

#### 슬롯 머신 테스트
```python
def test_slot_spin_success():
    """슬롯 정상 스핀 테스트"""
    # Given: 충분한 토큰(100개), Medium 세그먼트 사용자
    # When: 슬롯 스핀 요청 (비용: 10토큰)
    # Then: 200 OK + 결과(승리/패배) + 토큰 변화량

def test_slot_forced_win_at_streak_7():
    """스트릭 7회 시 강제 승리"""
    # Given: 연속 실패 7회
    # When: 8번째 스핀 요청
    # Then: 100% 승리 + 스트릭 리셋

def test_slot_segment_probability():
    """세그먼트별 확률 조정"""
    # Given: Whale 세그먼트 사용자
    # When: 슬롯 스핀 (100회 테스트)
    # Then: 승률 25% (base 15% + whale 10%) 근사치
```

#### 룰렛 테스트
```python
def test_roulette_number_bet_payout():
    """룰렛 숫자 베팅 페이아웃"""
    # Given: 숫자 7에 10토큰 베팅
    # When: 결과가 7인 경우
    # Then: 35배 페이아웃 (350토큰 지급)

def test_roulette_house_edge():
    """룰렛 하우스 엣지 테스트"""
    # Given: Medium 세그먼트 (하우스 엣지 10%)
    # When: 1000회 베팅 시뮬레이션
    # Then: 평균 수익률 90% 근사치
```

#### 가챠 테스트
```python
def test_gacha_pity_system():
    """가챠 Pity System 테스트"""
    # Given: 89회 연속 Epic 미획득
    # When: 90번째 가챠 뽑기
    # Then: Epic 이상 100% 보장

def test_gacha_probability_distribution():
    """가챠 확률 분포 테스트"""
    # Given: 1000회 가챠 시뮬레이션
    # When: 가챠 뽑기 실행
    # Then: Legendary(5%), Epic(20%), Rare(50%), Common(25%) 분포
```

### 3.3. CJ AI 채팅 테스트 🤖

```python
def test_websocket_connection_establishment():
    """WebSocket 연결 성립"""
    # Given: 유효한 사용자 ID
    # When: WebSocket 연결 요청
    # Then: 연결 성공 + 환영 메시지 수신

def test_cj_emotion_analysis():
    """CJ AI 감정 분석"""
    # Given: "대박! 슬롯에서 이겼어!" 메시지
    # When: 감정 분석 실행
    # Then: emotion="excited" + 축하 메시지 응답

def test_websocket_connection_recovery():
    """WebSocket 연결 복구"""
    # Given: 네트워크 장애로 연결 끊김
    # When: 재연결 시도
    # Then: 자동 재연결 + 이전 대화 컨텍스트 복원
```

### 3.4. 토큰 관리 테스트 💰

```python
def test_token_synchronization():
    """토큰 동기화 테스트"""
    # Given: Redis와 DB 간 토큰 불일치
    # When: 동기화 작업 실행
    # Then: Redis 값으로 DB 업데이트 + 불일치 로그 기록

def test_insufficient_token_handling():
    """토큰 부족 처리"""
    # Given: 토큰 5개 보유
    # When: 슬롯 스핀 요청 (10토큰 필요)
    # Then: 402 Insufficient + 부족 수량 안내
```

## 4. 환경변수 테스트 개선사항

### 사용자 세그먼트 서비스 테스트
- 환경변수 오버라이드 테스트 추가
- 확률 조정값과 하우스 엣지 설정 검증
- JSON 파싱 오류 처리 테스트

### 게임 서비스 테스트
- 확률 테이블 환경변수 관리 테스트
- 보안 강화 관련 테스트 (확률 조작 방지)
- 로깅 기능 검증

### AI 서비스 테스트
- 개선된 감정 분석 알고리즘 테스트
- 다양한 응답 템플릿 검증
- 에러 처리 및 복구 테스트

## 5. 서비스별 테스트 현황

### 완전 통과 서비스 (100%) ✅
- FlashOfferService: 모든 테스트 통과
- AdultContentService: 통합 테스트 완료
- NotificationService: 알림 관련 모든 테스트 통과
- TrackingService: 통합 테스트 통과
- AgeVerificationService: 연령 검증 테스트 통과
- RewardService: 보상 관련 테스트 완료
- VIPContentService: VIP 콘텐츠 테스트 통과

### 신규 개발 모듈 테스트
- SlotService: 확률, 보상 로직 테스트 통과 ✅
- RouletteService: 베팅 타입별 페이아웃 테스트 통과 ✅
- GachaService: 확률 테이블, Pity System 테스트 통과 ✅
- GameService: 통합 게임 서비스 테스트 통과 ✅

## 6. 실행 방법

### 전체 테스트
```bash
pytest -v --cov=src --cov-report=html
```

### 특정 모듈 테스트
```bash
pytest tests/unit/test_user_segment_service.py -v
pytest tests/unit/test_game_service.py -v
pytest tests/unit/test_cj_ai_service.py -v
```

### 환경변수 테스트
```bash
SEGMENT_PROB_ADJUST_JSON='{"VIP": 0.2}' pytest tests/unit/test_user_segment_service.py::TestEnvironmentOverrides -v
```

### 게임 서비스 테스트
```bash
# 슬롯 머신 테스트
pytest tests/unit/test_slot_service.py -v

# 룰렛 테스트
pytest tests/unit/test_roulette_service.py -v

# 가챠 테스트
pytest tests/unit/test_gacha_service.py -v
```

## 7. 통합 시나리오 테스트 🔄

### 완전한 사용자 여정 테스트
```python
def test_complete_user_journey():
    """완전한 사용자 여정 테스트"""
    # 1. 초대 코드로 가입
    # 2. 초기 토큰 200개 지급 확인
    # 3. 슬롯 게임 5회 플레이
    # 4. 토큰 부족 시 본사 사이트 방문
    # 5. 추가 토큰 획득 후 성인 콘텐츠 언락
    # 6. CJ AI와 대화
    # Then: 모든 단계 정상 작동 + 데이터 일관성 유지
```

## 8. CI/CD 통합 및 품질 관리

### GitHub Actions 설정
- Pull Request 시 필수 테스트 통과
- 커버리지 리포트 자동 생성
- 테스트 실패 시 배포 중단

### 품질 지표
- **코드 커버리지**: 90% 이상
- **테스트 통과율**: 100% 목표
- **빌드 시간**: 5분 이내
- **테스트 실행 시간**: 2분 이내

## 9. 남은 작업 및 일정

### 최종 처리해야 할 경고
- Pydantic V2 관련 경고 3개 해결
- ConfigDict 사용으로 변경 필요

### 향후 개선 계획
- 성능 테스트 추가
- 부하 테스트 도입
- 보안 테스트 강화
- 접근성 테스트 추가

## 10. 테스트 데이터 관리

### Fixture 기반 테스트 데이터
- 환경별 설정 분리
- 민감정보 제외한 목업 데이터 사용
- 테스트 간 독립성 보장

### 데이터 정리 자동화
```python
@pytest.fixture(autouse=True)
def cleanup_test_data():
    """테스트 후 데이터 정리"""
    yield
    # 테스트 데이터 정리 로직
```

이제 중복된 문서들이 통합되어 더 체계적이고 포괄적인 가이드가 되었습니다.
