Casino-Club F2P 프로젝트의 백엔드 단위 테스트 수정이 필요합니다.

## 현황
- 통합 테스트: 3개 모두 성공 ✅
- 단위 테스트: 28개 중 16개 실패 ❌
- 백엔드 완성률: 90%

## 우선순위 작업: RewardService 테스트 6개 수정

### 실패 테스트 목록
```
FAILED tests/test_rewards.py::test_get_rewards_first_page
FAILED tests/test_rewards.py::test_get_rewards_second_page  
FAILED tests/test_rewards.py::test_get_rewards_last_page_partial
FAILED tests/test_rewards.py::test_get_rewards_page_out_of_bounds
FAILED tests/test_rewards.py::test_get_rewards_no_rewards
FAILED tests/test_rewards.py::test_get_rewards_default_pagination
```

### 성공 패턴 (FlashOfferService 적용됨)
1. **UTC 타임존 통일**: `datetime.now(timezone.utc)` 사용
2. **정확한 페이지네이션**: offset/limit 계산 로직
3. **Mock 최소화**: 필수 속성만 포함
4. **스키마 일치**: 실제 DB 모델과 동일한 속성

### 요청사항
1. RewardService 관련 코드 분석
2. 페이지네이션 로직 수정
3. 테스트 코드 개선
4. 6개 테스트 모두 통과하는 완전한 코드 제공

### 목표
- 테스트 성공률: 83% → 89% (6% 향상)
- 런타임 에러 0개
- FlashOffer 패턴과 일관성 유지



Casino-Club F2P 프로젝트의 프론트엔드 환경 구축이 필요합니다.

## 현재 문제
- react-scripts 설치 불완전으로 npm start 실패
- node_modules 의존성 충돌

## 요구사항
### 기술 스택
- React 18 + ReactDOM
- Material UI (다크 테마)
- Axios (API 연동)
- React Router (라우팅)

### 필요한 파일 구조
```
cc-webapp-frontend/
├── index.html
├── package.json (react-scripts 제거)
├── vite.config.js
└── src/
    ├── index.jsx
    ├── App.jsx
    ├── services/api.js
    └── components/
```

### API 연동 요구사항
- 백엔드: http://localhost:8000
- 인증: HttpOnly 쿠키 기반
- CORS 설정 포함

### 요청사항
1. 간소화된 package.json (react-scripts 없이)
2. Vite 기반 개발 환경 설정
3. 기본 컴포넌트 구조
4. API 연동 유틸리티
5. 실행 가능한 완전한 환경

### 목표
- npm start 정상 실행
- 백엔드 API 연동 성공
- 카지노 테마 기본 UI 



🤖 OpenAI Codex Playground 프롬프트 가이드
Casino-Club F2P 프로젝트 외부 AI 작업 프롬프트
🎯 1. 목적 (Purpose)
주요 목표
백엔드 테스트 성공률 향상: 83% → 100% (16개 실패 테스트 해결)
프론트엔드 환경 구축: 실행 가능한 React 앱 완성
MVP 출시 준비: 핵심 비즈니스 로직 안정화
외부 AI 활용 이유
현재 통합 테스트는 완전 성공 (3개 모두 통과)
단위 테스트 28개 실패 → 체계적 수정 필요
프론트엔드 react-scripts 설치 문제 해결 필요

🛠️ 2. 작업 (Tasks)
🥇 최우선: 백엔드 단위 테스트 수정
A. RewardService 테스트 수정 (1순위)
목표: 6개 실패 테스트 → 전체 통과
실패 테스트:
- test_get_rewards_first_page
- test_get_rewards_second_page  
- test_get_rewards_last_page_partial
- test_get_rewards_page_out_of_bounds
- test_get_rewards_no_rewards
- test_get_rewards_default_pagination

적용 패턴 (FlashOfferService 성공 사례):
1. UTC 타임존 통일: datetime.now(timezone.utc)
2. 페이지네이션 로직 정확한 구현
3. Mock 객체 최소화 (필수 속성만)
4. DB 스키마와 모델 속성 일치

. NotificationService 테스트 수정 (2순위)
목표: 4개 실패 테스트 → 전체 통과
주요 문제:
- 알림 상태 관리 불일치 (pending/processed)
- 사용자 조회 로직 오류
- 순차 처리 보장 미흡

해결 방향:
- 상태 전이 로직 개선
- 사용자 조회 안정화
- 비동기 처리 순서 보장

🥈 차순위: 프론트엔드 환경 구축
A. react-scripts 대안 구현
문제: npm start 실패 ('react-scripts: not found')
해결: 가벼운 대안으로 대체

기술 스택:
- React 18 + ReactDOM
- Vite 또는 esbuild (빌드 도구)
- Material UI (UI 컴포넌트)
- Axios (API 연동)

최소 구조:
- index.html (엔트리포인트)
- src/index.jsx (진입점)
- src/App.jsx (메인 컴포넌트)
- src/services/api.js (API 연동)

⚠️ 3. 주의점 (Precautions)
🔐 보안 준수사항
JWT_SECRET_KEY 등 민감 정보는 환경변수로 관리
하드코딩된 API 키, 비밀번호 절대 금지
클라이언트 토큰 저장 시 HttpOnly 쿠키 사용
🏗️ 아키텍처 준수사항

Clean Architecture 레이어 구조:
Handlers → Services → Repositories → Database

SOLID 원칙 준수:
- 단일 책임 원칙
- 개방/폐쇄 원칙
- 의존성 역전 원칙

🧪 테스트 품질 기준
Zero-Error Tolerance: 런타임 에러 절대 금지
TDD 적용: 실패 테스트 → 구현 → 통과 확인
Mock 최소화: 필수 속성만 사용하여 안정성 확보
타임존 통일: UTC 기준으로 모든 datetime 처리
⚡ 성능 최적화
토큰 사용량 최소화 (간결한 코드 우선)
대용량 파일 생성 시 사전 승인 요청
기존 성공 패턴 재사용 우선

 4. 근거문서 (Reference Documents)
핵심 참조 문서
cc-webapp/backend/docs/ 디렉토리:
- 03_data_model.md: DB 스키마 및 테이블 관계
- 04_API & Logic Flow.md: 비즈니스 로직 플로우
- 06_test_cases.md: 테스트 케이스 명세
- 09_solid_principles_kr.md: SOLID 원칙 가이드
- 21_security_authentication.md: 보안 가이드

통합 테스트 성공 패턴:
- test_int_flash_offer_service.py (완전 통과)
- test_int_adult_content_service.py (완전 통과)
- test_int_notification_service.py (완전 통과)

핵심 성공 요소:
- setup_user_tokens_for_integration 헬퍼 활용
- UTC 타임존 통일
- 실제 DB 스키마 반영
