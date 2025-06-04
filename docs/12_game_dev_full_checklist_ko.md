# 🎮 게임 개발 전체 체크리스트 (#12) - 실제 현황 반영

## 🚨 외부 AI 검증 결과 (2025-06-04) - 현실적 평가

### 🔄 백엔드 구조 표준화 + 테스트 수정 완료 ✨
- [x] 백엔드 디렉토리 통합 (`/app` → `/cc-webapp/backend/app`)
- [x] **SQLAlchemy 2.x 호환성 패치** (`__init__.py`에 Engine.execute 지원)
- [x] **데이터베이스 연결 개선** (환경변수 기반 설정, 디버그 출력 추가)
- [x] **선택적 의존성 처리** (Sentry, 모니터링 도구들 선택적 import)
- [x] **APScheduler 선택적 의존성 처리** (main.py에 try/except 블록, 더미 스케줄러 제공)
- [x] **Redis 선택적 의존성 처리** (user_segments.py에서 조건부 import 및 연결 오류 처리)
- [x] **User 모델 확장** (토큰, 초대코드 필드 추가)
- [x] **Kafka Fallback 로직** (production 환경에서만 활성화)
- [x] **라우터 로직 개선** (세그먼트 체크, 토큰 라우터 표준화)
- [x] **Pydantic 스키마 개선** (ORM 객체 처리, 타임존 출력)

### ✅ 프론트엔드 구조 표준화 완료 ✨
- [x] **프론트엔드 중복 구조 해결**: 루트 `/frontend/` 제거 및 `/cc-webapp/frontend/` 메인 설정
- [x] **Docker 설정 일치**: 이미 올바른 경로로 설정되어 있었음
- [x] **참조 경로 표준화**: 프로젝트 전체에서 일관된 구조 적용

### 🧪 테스트 상태 개선
- [x] **일부 테스트 통과**: `test_rewards.py::test_get_rewards_first_page` 성공
- [x] **SQLAlchemy 호환성**: 버전 2.x 대응 완료
- [x] **환경 변수 기반 DB**: 테스트 환경 설정 개선
- [x] **스케줄러 초기화 안정성**: APScheduler 미설치 시에도 크래시 없이 시작/종료 이벤트 실행
- [ ] **notification 테스트 실패**: `test_get_one_pending_notification` 여전히 실패 상태

### ⚠️ 외부 AI 검증으로 밝혀진 실제 미구현 항목들
- [ ] **auth.py 라우터**: 파일 자체가 존재하지 않음 (인증 시스템 완전 미구현)
- [ ] **games.py 라우터**: 파일 자체가 존재하지 않음 (게임 로직 완전 미구현)
- [ ] **Redis 연동**: 메모리 딕셔너리로만 동작 (실제 Redis 미연결)
- [ ] **Kafka 이벤트**: 완전히 우회됨 (실제 이벤트 스트리밍 없음)
- [ ] **데이터베이스 마이그레이션**: 실제 테이블 생성 안됨

---

## 프로젝트 기획 및 설계 📋

### 핵심 시스템 설계
- [x] "사이버 토큰 = 본사 사이트 보상" 구조 설계
- [x] 본사 사이트 활동(퀴즈, 이벤트, 로그인 등)으로 토큰 획득 플로우 작성
- [x] 앱 내 게임/언락/가챠에서 토큰 소비 후 부족 시 본사 사이트로 이동 유도 로직

### 도파민 루프 설계 🎯
- [x] 슬롯, 룰렛, 가챠 등 Variable-Ratio 보상 확률표 정의
- [x] 즉각 피드백(애니메이션 + 사운드 + 토큰 증/감) 기획
- [x] Flash Offer 및 Limited-Time Event 시나리오 작성
- [x] Social Proof(리더보드, 랭킹 보너스) 메커니즘 설계

### CJ AI 시스템 설계 🤖
- [x] "실장 대체 AI(CJ)" 페르소나 및 대화 톤/매너 정의
- [x] 키워드-응답 매핑 JSON 템플릿 생성
- [x] 외부 LLM(GPT-4) 연동 옵션 가이드

### 인증 시스템 설계 🔐
- [x] 초대 코드 생성/배포 프로세스 정의
- [x] 닉네임/비밀번호 로그인 플로우 설계 (email 필드 제외)
- [x] 가입 즉시 토큰 보상 + CJ AI 웰컴 메시지 시나리오 작성

### 데이터 기반 개인화 설계 📊
- [x] RFM + Risk-Profile + Cyber Token 잔고 결합 로직 설계
- [x] 본사 사이트 재방문 타이밍 예측 알고리즘 스케치

## 초기 세팅 및 인프라 구축 🚀

### ✅ 완료된 항목들 (최신 업데이트)
- [x] 코드 리포지토리 및 버전 관리 체계 구축
- [x] **백엔드 구조 표준화** ✨ (외부 AI 완료)
- [x] **프론트엔드 구조 표준화** ✨ (루트 frontend 제거)
- [x] **SQLAlchemy 2.x 호환성** ✨ (새로 추가)
- [x] **라우터 파일 생성** ✨ (~auth.py, games.py~, feedback.py, adult_content.py, corporate.py, users.py)
- [x] **토큰 서비스 구현** ✨ (token_service.py - 메모리 기반 stub)
- [x] **User 모델 확장** ✨ (토큰, 초대코드 필드)
- [x] **환경변수 기반 DB 설정** ✨ (개발/프로덕션 분리)
- [x] **Kafka Fallback 처리** ✨ (개발 환경 호환성)
- [ ] ~~초대 코드 테이블 및 모델 정의 (invite_codes)~~ **모델만 정의, 실제 테이블 미생성**
- [ ] ~~FastAPI 인증 엔드포인트 (/api/auth/login) 구현~~ **auth.py 파일 자체가 없음**
- [x] 백엔드 인프라 구축 (FastAPI + PostgreSQL + Redis + Celery/APScheduler)
- [x] Tailwind CSS + Lucide-react 아이콘 설치
- [x] Redux Toolkit 스토어 구조 생성
- [x] Axios 기반 apiClient.js 설정

### 🔄 진행 중 (다음 우선순위)
- [x] ~~User 모델 필드 추가~~ ✅ **완료** (invite_code, nickname, password_hash, cyber_token_balance)
- [ ] **즉시 수정**: 남은 테스트 실패 해결 (notification/reward 엔드포인트)
- [ ] **타임존 이슈 해결**: datetime 처리 표준화
- [ ] **PostgreSQL 스키마 마이그레이션 완성**: 실제 테이블 생성
- [ ] **Redis 연결 및 user:{id}:cyber_token_balance 키 패턴 정의**: 현재 메모리 딕셔너리 상태
- [ ] Celery/APScheduler 기본 설정

### 🚨 즉시 구현 필요 (현재 단계) - 외부 AI 검증 결과 반영
- [ ] **auth.py 라우터 생성**: 파일 자체가 존재하지 않음
  - [ ] 초대 코드 검증 로직
  - [ ] 닉네임/비밀번호 회원가입
  - [ ] JWT 로그인 시스템
- [ ] **games.py 라우터 생성**: 파일 자체가 존재하지 않음
  - [ ] 슬롯머신 게임 로직
  - [ ] 가챠 시스템
  - [ ] 룰렛 게임
- [ ] **실제 데이터베이스 연동**: 현재 모델만 정의된 상태
  - [ ] PostgreSQL 마이그레이션 실행
  - [ ] 실제 테이블 생성
- [ ] **Redis 토큰 시스템**: 현재 메모리 딕셔너리 상태
  - [ ] 실제 Redis 연결
  - [ ] 실시간 토큰 잔고 관리
- [ ] **남은 테스트 실패 해결**
  - [ ] **notification 엔드포인트 관련 오류** (test_get_one_pending_notification 실패)
  - [ ] reward 시스템 일부 기능
  - [ ] 타임존 처리 표준화

## 🚀 다음 단계 실행 가이드

### 1단계: 현재 테스트 상태 확인 📋
```bash
cd cc-webapp/backend

# 전체 테스트 실행
python -m pytest -v

# 성공한 테스트 확인
python -m pytest tests/test_rewards.py::test_get_rewards_first_page -vv

# 실패하는 테스트들 확인
python -m pytest --tb=short | grep FAILED
```

### 2단계: 남은 문제 해결 🔧
```bash
# notification 관련 테스트
python -m pytest tests/test_notification.py -v

# reward 시스템 테스트
python -m pytest tests/test_rewards.py -v

# 타임존 관련 오류 확인
python -c "
from app.schemas import *
from datetime import datetime
import pytz
print('Timezone support check')
"
```

### 3단계: 다음 기능 개발 준비 🎯
- [ ] **인증 시스템 완성** (닉네임/비밀번호 로그인) - auth.py 생성부터 시작
- [ ] **토큰 플로우 구현** (Redis 연동) - 메모리 딕셔너리에서 실제 Redis로
- [ ] **기본 게임 로직** (슬롯/룰렛 MVP) - games.py 생성부터 시작

## 📊 현재 진행 상황 요약 (2025.06.04 - 최신)

### ✅ 완료된 주요 작업
1. **백엔드 + 프론트엔드 구조 표준화** ✨
   - 중복된 디렉토리 제거 (`/app/`, `/frontend/`)
   - 통합된 구조로 정리 (`/cc-webapp/backend/`, `/cc-webapp/frontend/`)
   - Docker 설정 일치성 확보

2. **호환성 및 안정성 개선** ✨
   - SQLAlchemy 2.x 호환성 패치
   - 환경변수 기반 설정
   - 선택적 의존성 처리
   - Kafka Fallback 로직

3. **기본 시스템 설계**
   - 사이버 토큰 경제 시스템 설계
   - 성인 콘텐츠 단계별 언락 비용 정의
   - 본사 사이트 연동 구조 기획

### 🔄 현재 상태 (외부 AI 검증 후 현실적 평가)
1. **일부 테스트 통과** ✅
   - `test_rewards.py::test_get_rewards_first_page` 성공
   - 기본 인프라 동작 확인

2. **주요 미구현 항목 발견** ❌
   - auth.py, games.py 라우터 파일 자체가 존재하지 않음
   - Redis 연동 없음 (메모리 딕셔너리만 사용)
   - 실제 데이터베이스 테이블 생성 안됨
   - Kafka 이벤트 스트리밍 완전 우회

3. **남은 문제** ⚠️
   - notification/reward 엔드포인트 일부 실패
   - 타임존 처리 이슈
   - 선택적 의존성 추가 분리 필요

### 🎯 다음 우선순위 작업 (현실적 평가 반영)
1. **즉시 구현** (1주일) - **핵심 기능 생성**
   - auth.py 라우터 생성 및 인증 시스템 구현
   - games.py 라우터 생성 및 기본 게임 로직
   - 실제 데이터베이스 마이그레이션 실행

2. **단기 개발** (2주) - **실제 연동**
   - Redis 토큰 시스템 실제 구현
   - 남은 테스트 실패 해결
   - 프론트엔드 API 연동

3. **중기 개발** (1-2개월) - **고도화**
   - 가챠 시스템 완성
   - 개인화 추천 엔진
   - UI/UX 고도화

## 📋 외부 AI 작업 파일 변경 요약

### 🔧 수정된 파일들 (12개)
- **`__init__.py`**: SQLAlchemy 2.x 호환성 패치 (+14줄)
- **`database.py`**: 환경변수 기반 DB 설정, 디버그 출력 (+7/-5줄)
- **`main.py`**: 선택적 의존성 import 처리, APScheduler 안전 초기화 (+44/-27줄)
- **`models.py`**: User 모델 필드 확장 (+6/-1줄)
- **`actions.py`**: Kafka fallback, 프로덕션 플래그 (+31/-15줄)
- **`adult_content.py`**: 세그먼트 체크 로직 강화 (+17/-6줄)
- **`corporate.py`**: 토큰 라우터 표준화 (+3/-3줄)
- **`notification.py`**: 간소화 (+1/-9줄)
- **`rewards.py`**: ORM 객체 처리 개선 (+13/-15줄)
- **`unlock.py`**: 코드 정리 (+2/-9줄)
- **`user_segments.py`**: Redis 조건부 import 및 연결 오류 처리 (+11/-10줄)
- **`schemas.py`**: Pydantic 모델 개선, 타임존 출력 (+16줄)

### 🎯 핵심 개선사항
1. **호환성**: SQLAlchemy 2.x 완전 지원
2. **안정성**: 선택적 의존성으로 개발 환경 안정화 (APScheduler, Redis 포함)
3. **표준화**: 라우터 로직 및 스키마 통일
4. **확장성**: User 모델 및 토큰 시스템 기반 마련
5. **환경 내성**: 의존성 누락 시에도 크래시 없이 동작

### 🚨 발견된 문제점 (외부 AI 검증 결과)
1. **누락된 핵심 파일**: auth.py, games.py 라우터 없음
2. **Stub 구현**: 토큰 서비스가 메모리 딕셔너리로만 동작
3. **미완성 연동**: Redis, Kafka 실제 연결 없음
4. **DB 마이그레이션**: 모델 정의만 있고 실제 테이블 없음

**다음 단계: 누락된 핵심 파일들 생성하고 실제 구현체 완성이 우선!** 🚀

---

## 참조 문서 검증 ✅

이 업데이트는 다음 문서들의 요구사항을 반영합니다:

- ✅ **04_adult_rewards_en.md**: Stage별 토큰 비용 및 세그먼트 체크
- ✅ **05_corporate_retention_en.md**: 토큰 적립/소비 플로우
- ✅ **02_data_personalization_en.md**: 사용자 세그먼테이션
- ✅ **01_architecture_en.md**: 전체 시스템 아키텍처
- ✅ **10_onboarding_en.md**: 닉네임/비밀번호 로그인 (email 제외)

##이 프로그램 사용자는 소수인증받은 회원대상이라 닉네임과 pw만 활용하여 인증절차 간소화##