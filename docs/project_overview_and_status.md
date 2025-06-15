# Casino-Club F2P 프로젝트 개요 및 개발 현황

---

## 1. 프로젝트 비전 및 목표

Casino-Club F2P는 사이버 토큰 기반의 차세대 F2P 카지노 게임 플랫폼을 지향합니다. 본 프로젝트는 도파민 루프, 실시간 보상, AI 감정 피드백, 성인 콘텐츠 언락 등 혁신적 기능을 결합하여, 사용자 몰입도와 수익성을 극대화하는 것을 목표로 합니다.

- **주요 타겟:** 2030년대 MZ세대, 글로벌 F2P 시장
- **핵심 가치:** 공정성, 확장성, 실시간 피드백, AI 기반 개인화
- **기술 스택:** Next.js 15+ (프론트엔드), FastAPI (백엔드), PostgreSQL, Redis, Docker, Kafka, 로컬 LLM

---

## 2. 전체 시스템 아키텍처

### 2.1 Clean Architecture & 위임 패턴
- **핵심 구조:**
  - Presentation(Next.js) → API Layer(FastAPI) → Service Layer(위임 패턴) → Repository Layer → DB
- **서비스 위임:**
  - game_service.py → slot_service.py, roulette_service.py, gacha_service.py
  - 각 서비스는 SOLID 원칙, 단일 책임, 테스트 주도 개발(TDD) 적용

### 2.2 주요 컴포넌트
- **프론트엔드:**
  - App Router 기반 페이지 구조(app/slot, app/roulette, app/gacha 등)
  - 공통 컴포넌트: EmotionFeedback, Notification, TokenDisplay, GameMenu 등
  - 서비스/유틸리티: axios 기반 API 연동, 토큰 관리, 사운드/애니메이션 등
- **백엔드:**
  - 게임 로직(슬롯, 룰렛, 가챠, RPS), 인증, 토큰, 추천, 성인콘텐츠, AI 감정 분석
  - Clean Architecture, 위임 패턴, 100% 테스트 커버리지
- **인프라:**
  - Docker Compose, CI/CD, 모니터링(Prometheus, Grafana), 환경변수 표준화

---

## 3. 개발 현황 및 완성도 분석 (2025.06 기준)

### 3.1 백엔드
- **완성도:** 93%
- **주요 구현:**
  - 게임 서비스(슬롯, 룰렛, 가챠, RPS) 완전 구현, 100% 테스트 커버리지
  - 인증(JWT), 토큰 시스템, 사용자 세그먼트, 성인 콘텐츠, AI 감정 분석(로컬 LLM)
  - Clean Architecture, SOLID, 위임 패턴, 코드 중복 0%, 레거시 코드 0%
- **미완성:**
  - 결제/수익화, 일부 실시간 이벤트, 일부 AI 대화 기능
  - 일부 엔드포인트(특히 신규 게임/이벤트)는 "not implemented yet" 상태

### 3.2 프론트엔드
- **완성도:** 10~15%
- **주요 구현:**
  - Next.js 15+ App Router 구조, Tailwind CSS, 기본 페이지(app/page, app/slot 등)
  - 로그인/토큰/게임 메뉴, 슬롯머신 UI, 공통 컴포넌트, axios API 연동
  - 테스트(Jest, Cypress), 사운드/애니메이션 등 부가 리소스
- **미완성:**
  - 퀴즈, 추천, 성인콘텐츠 등은 Stub/더미 UI, 실제 API 연동 미흡
  - 일부 컴포넌트(QuizForm 등)는 단순 UI만 존재, SlotMachine.jsx 등 일부 파일은 비어있음
  - 전체적으로 폴더/파일 구조는 기준에 맞으나, 백엔드 미구현 서비스와 연동되지 않은 UI가 일부 포함

### 3.3 인프라
- **완성도:** 80%
- **주요 구현:** Docker Compose, PostgreSQL, Redis, Kafka, CI/CD, 환경변수 관리, 모니터링
- **미완성:** 실시간 이벤트 스트림, 일부 운영 자동화, 프로덕션 배포 최적화

---

## 4. 미완성/Stub/더미 데이터 구간 상세

- **프론트엔드:**
  - 퀴즈(Quiz), 추천, 성인콘텐츠 등은 Stub/더미 UI, 실제 API 연동 미흡
  - 일부 게임/기능은 백엔드 엔드포인트가 완전히 구현되어야 정상 동작 가능
  - SlotMachine.jsx 등 일부 파일은 비어있음(중복/미사용 가능성)
- **백엔드:**
  - 일부 엔드포인트 "not implemented yet", 결제/수익화/AI 일부 미완성
  - 신규 게임/이벤트, 실시간 피드백, 고급 추천 등은 추가 구현 필요

---

## 5. 성공 지표 및 품질 기준

- **테스트 통과율:** 100% (게임 서비스)
- **전체 커버리지:** 75% 이상 목표
- **Clean Architecture, SOLID, 코드 중복 0%, 레거시 코드 0%**
- **실제 사용자 플로우:**
  1. 로그인 → 토큰 확인 → 게임 선택 → 플레이 → 결과/보상 실시간 반영
  2. 성인 콘텐츠 언락, AI 감정 피드백, 추천 등 고급 기능 단계적 적용

---

## 6. 환경설정/운영 가이드

- **프론트엔드:** 반드시 `cc-webapp/frontend`(Next.js 15+)만 사용, Vite/cc-webapp-frontend 폴더/파일 금지
- **백엔드:** FastAPI, Python 3.11+, requirements.txt, .env 환경변수
- **인프라:** Docker Compose, .env, CI/CD, 모니터링
- **실행 예시:**
  - PowerShell: `cd cc-webapp; docker-compose up -d`
  - 개발: `npm run dev` (프론트), `uvicorn app.main:app --reload` (백엔드)

---

## 7. 향후 로드맵 및 우선순위

### 7.1 1단계: 프론트엔드 실제 구현 (2주)
- 메인 페이지, 슬롯/룰렛/가챠/RPS/프로필/성인콘텐츠 실제 API 연동
- 퀴즈, 추천, 성인콘텐츠 등 Stub/더미 UI → 실제 백엔드 연동
- 불필요/중복/미사용 파일 정리

### 7.2 2단계: 비즈니스 로직/수익화/AI 고도화 (2주)
- 결제 시스템, Battle-Pass, 실시간 이벤트, AI 대화/추천/감정 피드백 고도화

### 7.3 3단계: 운영/배포/최적화 (1주)
- 전체 플로우 E2E 테스트, 성능 최적화, 프로덕션 배포, 모니터링 강화

---

## 8. 참고 문서 및 규정

- **아키텍처/모듈 설계:** docs/01_architecture_en.md, docs/15_component_architecture.md
- **테스트/품질:** docs/09-testing-guide.md, docs/06_test_cases.md
- **보안/인증:** docs/18_security_authentication_en.md, docs/21_compliance_verification_report.md
- **환경설정:** docs/13-environment-config.md, docs/16_CCF2P 통합 환경 설정 스크립트.md
- **외부 AI 온보딩/프롬프트:** docs/26_구체적인프론트앤드계획.md

---

## 9. 결론

Casino-Club F2P 프로젝트는 혁신적 F2P 게임 구조, Clean Architecture, AI 기반 개인화, 실시간 피드백 등 차별화된 경쟁력을 갖추고 있습니다. 현재 백엔드 코어는 상용 수준에 근접하나, 프론트엔드와 일부 부가 서비스의 실제 구현 및 연동이 시급합니다. 향후 4주 내 MVP 완성 및 품질 기준 달성을 목표로, 모든 개발자는 본 문서와 기준문서를 반드시 참고하여 일관된 품질과 구조를 유지해야 합니다.
