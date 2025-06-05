# 🤖 외부 AI 작업자를 위한 프로젝트 설정 가이드

## 📂 프로젝트 구조
```
cc-webapp/
├── backend/           # FastAPI 백엔드
│   ├── app/
│   │   ├── models.py     # SQLAlchemy 모델
│   │   ├── routers/      # API 라우터
│   │   └── tests/        # 단위 테스트 (현재 오류 상태)
│   └── requirements.txt
├── frontend/          # React 프론트엔드
└── start.sh          # 개발 서버 시작 스크립트
```

## 🚨 현재 해결 필요한 문제들

### Backend 테스트 오류
- **위치**: `cc-webapp/backend/app/tests/`
- **문제**: SyntaxError 및 NameError로 pytest 실행 실패
- **로그**: `/tmp/pytest.log` 참조
- **영향**: 단위 테스트 실행 불가

### 주요 오류 파일들
1. `app/routers/games.py` - undefined symbols
2. 여러 테스트 모듈의 구문 오류

## 🎯 작업 우선순위

### 1. 즉시 수정 필요 (Critical)
- [ ] Backend 테스트 구문 오류 수정
- [ ] `app/routers/games.py` NameError 해결
- [ ] pytest 실행 환경 정상화

### 2. 코드 품질 개선 (High)
- [ ] 테스트 커버리지 확보
- [ ] 도파민 루프 로직 검증
- [ ] 사용자 세분화 로직 테스트

### 3. 아키텍처 검증 (Medium)
- [ ] 감정 기반 피드백 메커니즘
- [ ] 성인 콘텐츠 단계별 잠금해제
- [ ] 기업 사이트 리텐션 플로우

## 🛠️ 개발 환경 설정

### Backend 설정
```bash
cd cc-webapp/backend
pip install -r requirements.txt
# 현재 패키지는 이미 설치됨
```

### 테스트 실행 (현재 실패)
```bash
pytest  # SyntaxError로 실패
```

### 서버 실행
```bash
# 프로젝트 루트에서
./start.sh
# Backend: http://localhost:8000
# Frontend: http://localhost:3000
```

## 📝 작업 가이드라인

### 코드 수정 시 주의사항
1. **도파민 루프 로직**: 사용자 행동 분석 및 보상 시스템
2. **세분화 로직**: RFM 기반 사용자 그룹핑
3. **감정 피드백**: 사용자 반응에 따른 동적 조정
4. **성인 콘텐츠**: 단계별 잠금해제 시스템
5. **리텐션**: 기업 사이트 사용자 유지 전략

### 테스트 작성 원칙
- 각 기능별 단위 테스트 그룹화
- 도파민 트리거 시나리오 검증
- 예외 상황 처리 확인

## 🔧 긴급 수정 체크리스트

- [ ] `pytest` 컬렉션 오류 해결
- [ ] `app/routers/games.py` import 문제 수정
- [ ] 테스트 파일 구문 검사 및 수정
- [ ] 테스트 실행 확인 (`pytest -v`)
- [ ] 코드 커버리지 측정

## 📞 문의사항
작업 중 궁금한 점이나 추가 정보가 필요하면 언제든 문의해주세요.