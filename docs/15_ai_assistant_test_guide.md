# 🤖 Casino-Club F2P 프로젝트 AI 어시스턴트 테스트 가이드 (Codex 의뢰용 프롬프트)

---

## 1) 목표

- **F2P(Free-to-Play) 게임 플랫폼**의 핵심 서비스와 기능을 신속하게 검증하고, 전체 테스트를 100% 통과시키는 것이 목적입니다.
- 도박/카지노 관련 용어는 사용하지 않고, **F2P 게임의 재미·몰입·보상·개인화**에 초점을 맞춥니다.
- 사용자 경험, 보상 시스템, 미션, 콘텐츠 언락, 실시간 피드백 등 **F2P 게임의 핵심 메커니즘**이 정상 동작하는지 테스트합니다.

---

## 2) 작업할 내용

- **RewardService, NotificationService, AdultContentService** 등 주요 서비스의 단위/통합 테스트를 모두 통과시켜야 합니다.
- 테스트 실패 시, 다음을 반드시 수행:
  1. 실패 원인(AssertionError, Mock 오류, 시그니처 불일치 등) 상세 분석
  2. 서비스/테스트 코드의 문제점과 개선방안 제시
  3. RewardService/NotificationService에서 성공한 패턴(UTC 타임존, Mock 최소화, DB 스키마 일치, 세션 갱신 등) 적용
  4. 모든 테스트가 통과할 때까지 반복적으로 수정
- **프론트엔드 환경**은 React+Vite+Material UI+Axios+React Router 기반으로, npm install/build/start가 정상 동작해야 하며, API 연동은 http://localhost:8000 기준으로 설정합니다.
- **백엔드 테스트**는 pytest 기준으로, SQLAlchemy 등 필수 의존성 누락 시 pip install로 즉시 복구해야 합니다.
- 테스트 성공률, 남은 실패 테스트, 주요 이슈 및 해결 내역을 문서에 계속 업데이트합니다.

---

## 3) 근거문서

- **01_architecture_en.md**: 전체 시스템 구조, F2P 게임 메커니즘, API/DB 설계
- **03_emotion_feedback_en.md**: 감정 피드백 시스템 및 사용자 몰입 설계
- **04_adult_rewards_en.md**: 콘텐츠 언락 및 보상 구조
- **06_user_journey_en.md**: 유저 여정 및 온보딩 흐름
- **09_test_qa_en.md**: 테스트 및 품질 보증 기준, 주요 시나리오
- **12_game_dev_full_checklist_ko.md**: 전체 개발 체크리스트 및 최신 진행 현황
- **15_ai_assistant_test_guide.md**: 본 테스트 가이드 및 Codex 의뢰 프롬프트
- **21_security_authentication.md**: 인증/보안 설계 기준

---

## 4) 주의점

- **도박/카지노** 관련 용어, 기능, 메시지는 절대 사용하지 않습니다.  
  (예: "슬롯머신" → "미니게임", "카지노" → "F2P 게임" 등)
- **F2P(Free-to-Play) 게임**의 재미, 보상, 개인화, 미션, 실시간 피드백 등 긍정적 요소만 강조합니다.
- 테스트/코드/문서 모두 **Clean Architecture, SOLID 원칙, TDD, Zero-Error** 기준을 반드시 준수해야 합니다.
- PowerShell 명령어 사용 시 **; (세미콜론)으로 명령어 연결** (윈도우 환경)
- 모든 테스트는 **pytest**로 실행, 실패 시 즉시 원인 분석 및 수정
- **의존성 누락**(예: SQLAlchemy) 발생 시, pip install로 즉시 복구
- 테스트 성공률, 남은 과제, 주요 이슈는 항상 문서에 최신 상태로 반영
- **보안/개인정보 보호** 기준(21_security_authentication.md) 반드시 준수

---

## 📈 테스트 현황 및 명령어 예시

```powershell
# 전체 테스트 현황 확인
cd "C:\Users\task2\OneDrive\문서\GitHub\2025-2\auto202506-a\cc-webapp\backend"; python -m pytest --tb=no -q

# 백엔드 의존성 복구 예시
cd "C:\Users\task2\OneDrive\문서\GitHub\2025-2\auto202506-a\cc-webapp\backend"; pip install sqlalchemy

# 프론트엔드 빌드/실행 예시
cd "C:\Users\task2\OneDrive\문서\GitHub\2025-2\auto202506-a\cc-webapp-frontend"; npm install; npm run build; npm start
```
