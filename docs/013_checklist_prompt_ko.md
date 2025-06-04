#
# 📁 Project Files Update Checklist

## 1. app 폴더 구조 수정 📂

### 현재 구조를 다음과 같이 확장:

/app ├── routers/ # API 라우트 모듈 ├── models/ # DB 모델 ├── services/ # 비즈니스 로직 ├── core/ # 핵심 설정/유틸리티 ├── dependencies/ # FastAPI dependencies └── tests/ # 테스트 코드

# 2. /app/routers/ 폴더 체크리스트 ✅

### 필요한 라우터 파일들:
- [ ] auth.py (인증/인가)
  - 초대 코드 검증
  - 로그인/회원가입
  - JWT 토큰 관리

- [ ] games.py (미니게임)
  - 슬롯머신
  - 룰렛
  - 가위바위보
  - 가챠 시스템

- [ ] feedback.py (감정 피드백)
  - 도파민 루프 트리거
  - AI 응답 생성
  - 토큰 증감 처리

- [ ] adult_content.py (성인 콘텐츠)
  - 단계별 언락
  - 세그먼트 체크
  - 플래시 오퍼

- [ ] corporate.py (본사 연동)
  - 토큰 획득/소비
  - 사이트 방문 기록
  - 이벤트 참여

- [ ] users.py (사용자 관리)
  - 프로필
  - 세그먼트
  - 토큰 잔고

## 3. /app/main.py 체크리스트 ✅

- [ ] FastAPI 앱 설정
  ```python
  # 기존 코드에 추가 필요:
  from fastapi import FastAPI
  from fastapi.middleware.cors import CORSMiddleware
  from .core.config import settings

<input disabled="" type="checkbox"> 미들웨어 설정

CORS
인증
로깅
에러 핸들링
<input disabled="" type="checkbox"> 라우터 등록

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(games_router, prefix="/api/games", tags=["games"])
app.include_router(feedback_router, prefix="/api/feedback", tags=["feedback"])
# ... 기타 라우터
<input disabled="" type="checkbox"> Redis/Kafka 연결

4. /app/schemas.py 체크리스트 ✅
필요한 Pydantic 모델:
<input disabled="" type="checkbox"> 인증 관련

<input disabled="" type="checkbox"> 게임 관련

<input disabled="" type="checkbox"> 감정 피드백

<input disabled="" type="checkbox"> 성인 콘텐츠

검증 결과:
<input checked="" disabled="" type="checkbox"> Dopamine loop mechanics (01_architecture_en.md)

게임 결과 스키마에 반영
피드백 시스템 통합
<input checked="" disabled="" type="checkbox"> User segmentation (02_data_personalization_en.md)

RFM 관련 필드 추가
세그먼트 레벨 검증 로직
<input checked="" disabled="" type="checkbox"> Emotion feedback (03_emotion_feedback_en.md)

감정 상태 필드 추가
AI 응답 스키마 정의
<input checked="" disabled="" type="checkbox"> Adult content (04_adult_rewards_en.md)

단계별 언락 스키마
티켓 시스템 통합
<input checked="" disabled="" type="checkbox"> Corporate retention (05_corporate_retention_en.md)

토큰 흐름 관련 필드
사이트 방문 연동



 📋 개발 검증 체크리스트 프롬프트

## 문서 참조 검증 체크리스트 ✅

새로운 기능이나 코드를 작성하기 전에 반드시 아래 문서들과의 정합성을 확인하세요:

### 핵심 문서 참조
- [ ] **도파민 루프 메커니즘** (01_architecture_en.md)
  - Variable-Ratio 보상 시스템
  - 즉각적 피드백 구조
  - 한정 이벤트 타이밍

- [ ] **사용자 세분화 규칙** (02_data_personalization_en.md)
  - RFM 기반 세그먼테이션
  - 리스크 프로필 분석
  - 사이버 토큰 잔고 연동

- [ ] **감정 피드백 패턴** (03_emotion_feedback_en.md)
  - 승리/패배 시 피드백
  - AI 대화 톤앤매너
  - 멀티미디어 피드백

- [ ] **성인 콘텐츠 진행** (04_adult_rewards_en.md)
  - 단계별 언락 시스템
  - 세그먼트별 접근 권한
  - 토큰 소비 구조

- [ ] **본사 사이트 리텐션** (05_corporate_retention_en.md)
  - 토큰 획득/소비 흐름
  - 크로스 플랫폼 연동
  - 재방문 유도 로직

### 검증 방법
1. 각 항목을 하나씩 체크
2. 문서 내용과 충돌되는 부분이 없는지 확인
3. 핵심 설계 원칙 준수 여부 검토
4. 참조한 문서 명시적으로 표기

### 사용 예시
```plaintext
Before providing your response, confirm that it aligns with:
[ ] Dopamine loop mechanics from 01_architecture_en.md
[ ] User segmentation rules from 02_data_personalization_en.md
[ ] Emotion feedback patterns from 03_emotion_feedback_en.md
[ ] Adult content progression from 04_adult_rewards_en.md
[ ] Corporate site retention flow from 05_corporate_retention_en.md

Your response must explicitly reference which documents were consulted.
```

## 활용 지침 📝

### 적용 시점
- 새로운 API 엔드포인트 설계 시
- UI 컴포넌트 개발 시
- 게임 로직 구현 시
- 보상 시스템 수정 시

### 주의사항
- 모든 응답은 참조한 문서를 명시적으로 언급해야 함
- 문서 간 상충되는 내용이 발견되면 즉시 보고
- 검증 결과는 반드시 기록으로 남길 것

이 체크리스트를 통해 프로젝트의 일관성을 유지하고, 핵심 설계 원칙이 모든 개발 과정에서 준수되도록 관리합니다.

# 📋 백엔드 파일 구조 검증 체크리스트

## 문서 참조 검증 ✅
새로운 코드를 작성하기 전에 반드시 아래 문서들과의 정합성을 확인하세요:

### 핵심 문서 참조 목록
- [ ] **시스템 아키텍처** (01_architecture_en.md)
  - FastAPI + PostgreSQL + Redis + Kafka 구조
  - 데이터 플로우 및 이벤트 스트리밍
  - 실시간 처리 로직

- [ ] **데이터 개인화** (02_data_personalization_en.md)
  - RFM 세그먼테이션
  - 사이버 토큰 플로우
  - 실시간 추천 엔진

- [ ] **감정 피드백** (03_emotion_feedback_en.md)
  - AI 응답 생성
  - 도파민 루프 트리거
  - 실시간 피드백

- [ ] **성인 콘텐츠** (04_adult_rewards_en.md)
  - 단계별 언락 로직
  - 가챠 시스템
  - 토큰 소비

- [ ] **본사 연동** (05_corporate_retention_en.md)
  - 크로스 플랫폼 토큰 흐름
  - 리텐션 트리거
  - API 연동

## 백엔드 파일 구조 검증 🗂️

### /backend 루트 파일
- [ ] **Dockerfile**
  - Python 3.9 기반
  - PostgreSQL 클라이언트 설치
  - 환경 변수 설정
  - 마이그레이션 실행

- [ ] **entrypoint.sh**
  - DB 연결 대기
  - Alembic 마이그레이션
  - FastAPI 실행

- [ ] **requirements.txt**
  - FastAPI
  - SQLAlchemy
  - Redis
  - Kafka
  - 기타 의존성

- [ ] **.env**
  - DB 연결 정보
  - Redis/Kafka 설정
  - JWT 시크릿
  - 환경 설정

### /backend/app 구조
- [ ] **main.py**
  - FastAPI 앱 초기화
  - 미들웨어 설정
  - 라우터 등록
  - 이벤트 핸들러

- [ ] **routers/**
  - auth.py (인증/인가)
  - games.py (미니게임)
  - feedback.py (감정 피드백)
  - adult_content.py (성인 콘텐츠)
  - corporate.py (본사 연동)

- [ ] **models/**
  - user.py
  - action.py
  - reward.py
  - content.py
  - segment.py

- [ ] **schemas/**
  - auth.py
  - game.py
  - feedback.py
  - content.py
  - corporate.py

### /backend/alembic
- [ ] **versions/**
  - 유저 모델 마이그레이션
  - 토큰 관련 테이블
  - 성인 콘텐츠 테이블
  - 게임 로그 테이블

### /backend/scripts
- [ ] **kafka_consumers/**
  - 유저 액션 소비자
  - 이벤트 프로세서
  - 알림 발송기

### /backend/tests
- [ ] **test_auth.py**
- [ ] **test_games.py**
- [ ] **test_feedback.py**
- [ ] **test_content.py**
- [ ] **test_corporate.py**

## 검증 방법 📝

### 1. 파일 구조 검증
```bash
tree backend/
```
실행 후 위 구조와 일치하는지 확인

### 2. 코드 정합성 검증
각 파일 수정 시:
1. 관련 문서 체크리스트 확인
2. 기존 기능 영향도 검토
3. 테스트 케이스 작성/수정

### 3. API 스펙 검증
Swagger UI (`/docs`)에서:
- 모든 엔드포인트 정상 작동
- 응답 스키마 일치
- 인증 흐름 정상

## 사용 예시 💡

```python
# 파일 수정 전 체크리스트:
Before modifying backend files, confirm alignment with:
[ ] System architecture from 01_architecture_en.md
[ ] Data flow patterns from 02_data_personalization_en.md
[ ] Feedback system from 03_emotion_feedback_en.md
[ ] Adult content logic from 04_adult_rewards_en.md
[ ] Corporate integration from 05_corporate_retention_en.md

# 파일 구조 체크:
[ ] File exists in correct location
[ ] Imports follow project structure
[ ] Models/schemas properly referenced
[ ] Tests updated/added
```

이 체크리스트를 통해 백엔드 코드의 일관성을 유지하고, 핵심 설계 원칙이 모든 파일에서 준수되도록 관리합니다.
