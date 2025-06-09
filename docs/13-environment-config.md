# 환경 설정 가이드

## 개요
시스템 운영에 필요한 환경변수 설정과 관리 방법을 안내합니다.

## 기본 환경변수

### 데이터베이스 설정
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
REDIS_URL=redis://localhost:6379/0
```

### 보안 설정
```bash
SECRET_KEY=your-secret-key-here
JWT_SECRET=your-jwt-secret-here
ENCRYPTION_KEY=your-encryption-key-here
```

## 서비스별 환경변수

### 사용자 세그먼트 서비스
```bash
# 확률 조정값 (JSON 형식)
SEGMENT_PROB_ADJUST_JSON='{"VIP": 0.15, "PREMIUM": 0.1, "STANDARD": 0.05}'

# 하우스 엣지 설정 (JSON 형식)
HOUSE_EDGE_JSON='{"VIP": 0.02, "PREMIUM": 0.03, "STANDARD": 0.05}'
```

**설정 예시:**
- VIP 사용자: 15% 확률 증가, 2% 하우스 엣지
- PREMIUM 사용자: 10% 확률 증가, 3% 하우스 엣지
- STANDARD 사용자: 5% 확률 증가, 5% 하우스 엣지

### 게임 서비스
```bash
# 확률 테이블 (JSON 형식)
GAME_PROBABILITY_TABLE='{"SLOT": 0.95, "ROULETTE": 0.97, "BLACKJACK": 0.99}'

# 보안 설정
GAME_SECURITY_ENABLED=true
PROBABILITY_MANIPULATION_CHECK=true
```

### AI 상담 서비스
```bash
# 감정 분석 모델 설정
SENTIMENT_MODEL_PATH=/models/sentiment_v2.bin
SENTIMENT_THRESHOLD=0.7

# 응답 템플릿 설정
RESPONSE_TEMPLATE_PATH=/templates/responses/
DEFAULT_LANGUAGE=ko
```

## 환경별 설정

### 개발 환경 (.env.development)
```bash
DEBUG=true
LOG_LEVEL=DEBUG
DATABASE_URL=postgresql://dev_user:dev_pass@localhost:5432/dev_db
```

### 프로덕션 환경 (.env.production)
```bash
DEBUG=false
LOG_LEVEL=INFO
DATABASE_URL=postgresql://prod_user:prod_pass@db-server:5432/prod_db
```

### 테스트 환경 (.env.test)
```bash
DATABASE_URL=postgresql://test_user:test_pass@localhost:5432/test_db
SEGMENT_PROB_ADJUST_JSON='{"TEST": 0.5}'
```

## 설정 검증

### 환경변수 로딩 검증
시스템 시작 시 다음 항목들이 자동으로 검증됩니다:
- JSON 형식 환경변수 파싱 성공 여부
- 필수 환경변수 존재 여부
- 값의 유효성 (범위, 타입 등)

### 로깅
환경변수 로딩 과정은 다음과 같이 로깅됩니다:
- 성공적인 로딩: INFO 레벨
- JSON 파싱 오류: ERROR 레벨
- 기본값 사용: WARNING 레벨

## 보안 고려사항

### 민감정보 관리
- `.env` 파일을 `.gitignore`에 추가
- 프로덕션 환경에서는 시스템 환경변수 또는 Vault 사용
- 정기적인 시크릿 키 로테이션

### 접근 제어
- 환경변수 파일 권한 설정 (600)
- 컨테이너 환경에서는 시크릿 볼륨 마운트
- 로그에 민감정보 출력 방지

## 문제 해결

### 자주 발생하는 오류
1. **JSON 파싱 오류**: 환경변수 값이 올바른 JSON 형식인지 확인
2. **환경변수 미설정**: 필수 환경변수가 모두 설정되었는지 확인
3. **권한 오류**: 파일 및 디렉토리 권한 확인

### 디버깅 팁
- `LOG_LEVEL=DEBUG`로 설정하여 상세 로그 확인
- 시스템 시작 시 환경변수 로딩 로그 모니터링
- 테스트 환경에서 설정 검증 후 프로덕션 적용
