# Casino-Club F2P 백엔드 표준화/리팩터링 가이드라인 (2025)

## 개요
- 본 가이드라인은 Casino-Club(이하 CC) F2P 웹앱 백엔드의 단계별 표준화 및 리팩터링, 테스트, 배포 자동화 프로세스를 정의한다.
- 모든 변경은 docs/01_architecture_en.md 등 설계 문서와 도메인 책임, 데이터 흐름 기준을 엄격히 준수해야 한다.

## 단계별 진행 계획

### 1단계: UserSegment 및 UserService 통합 리팩터링
- UserService에 get_user_or_none, get_or_create_segment 등 일관성 있는 유저/세그먼트 접근 메서드 구현
- 기존 서비스/테스트 코드에서 해당 메서드 사용으로 통일
- 주요 테스트 케이스(test_user_segments.py, test_rewards.py) 정상 동작 확인
- 기술문서 요약 및 단계별 리팩터링/통합 기준, 체크리스트 작성

### 2단계: 도메인 서비스 분리 및 통합
- 성인 콘텐츠, 플래시 오퍼, 보상, 알림 등 도메인별 서비스 책임 명확화
- 중복/불필요 로직 제거, 각 서비스별 단일 책임 원칙 적용
- 서비스별 단위 테스트 작성 및 통합 테스트 추가
- 영향받는 서비스/라우터/테스트 목록 및 변경점 상세 기록

### 3단계: 테스트 및 데이터 마이그레이션 자동화
- Alembic 기반 데이터 마이그레이션 자동화
- 테스트 커버리지 측정 및 회귀 테스트 체계화
- 주요 테스트 통과율, 실패 케이스, 영향 모듈 상세 기록

### 4단계: API 명세/프론트 연동/CI 파이프라인
- openapi.yaml 등 API 명세 최신화
- 프론트엔드 연동 샘플/문서화
- CI/CD 파이프라인 구축 및 자동화 배포
- 각 단계별 PR 분리, 영향 모듈/테스트 결과 상세 기록

## 체크리스트 및 검증 기준
- docs/013_checklist_prompt_ko.md, 각 도메인별 설계 문서(02~05) 참고
- 모든 변경은 설계/아키텍처/도메인 책임에 부합해야 하며, 테스트 통과 및 회귀 검증 필수
- 각 단계별 완료 후 다음 단계로 진행, PR 및 문서화 병행

## 참고 문서
- docs/01_architecture_en.md (시스템 아키텍처)
- docs/013_checklist_prompt_ko.md (체크리스트)
- docs/02_data_personalization_en.md, 03_emotion_feedback_en.md, 04_adult_rewards_en.md, 05_corporate_retention_en.md (도메인별 설계)
- cc-webapp/backend/app/services/user_service.py (UserService)
- cc-webapp/backend/tests/ (테스트)

## 기록 및 관리
- 각 단계별 PR 분리, 영향받는 서비스/라우터/테스트 목록 및 테스트 결과 상세 기록
- 통합 가이드라인 및 변경 이력 docs/CC_backend_refactor_guideline_ko.md에 지속 반영
