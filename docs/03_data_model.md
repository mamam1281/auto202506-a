# 데이터베이스 스키마 및 ERD

## 개요
CC F2P 프로젝트의 데이터베이스 스키마 정의 및 테이블 관계도입니다.

## 핵심 테이블

### 1. 사용자 관리

#### users
- **id** (INTEGER, PK, AUTO_INCREMENT): 사용자 고유 ID
- **username** (VARCHAR(50), UNIQUE, NOT NULL): 사용자명
- **email** (VARCHAR(100), UNIQUE): 이메일 주소
- **password_hash** (VARCHAR(255), NOT NULL): 해시된 비밀번호
- **invite_code** (VARCHAR(6), UNIQUE): 초대 코드
- **created_at** (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): 계정 생성 시간
- **updated_at** (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE): 수정 시간

#### user_segments
- **user_id** (INTEGER, PK, FK → users.id): 사용자 ID
- **rfm_group** (VARCHAR(10), DEFAULT 'Medium'): 사용자 세그먼트 (Whale/Medium/Low)
- **created_at** (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): 세그먼트 생성 시간
- **updated_at** (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE): 수정 시간

#### user_tokens
- **user_id** (INTEGER, PK, FK → users.id): 사용자 ID
- **balance** (INTEGER, NOT NULL, DEFAULT 100): 토큰 잔액
- **created_at** (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): 토큰 계정 생성 시간
- **updated_at** (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE): 토큰 잔액 수정 시간

### 2. 게임 시스템

#### user_actions
- **id** (INTEGER, PK, AUTO_INCREMENT): 액션 고유 ID
- **user_id** (INTEGER, NOT NULL, FK → users.id): 사용자 ID
- **action_type** (VARCHAR(50), NOT NULL): 액션 유형 (SLOT_SPIN, RPS_PLAY, GACHA_PULL, etc.)
- **value** (REAL): 관련 값 (베팅 금액, 보상 등)
- **metadata** (TEXT): 추가 정보 (JSON 형태)
- **created_at** (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): 액션 발생 시간

#### game_sessions
- **id** (INTEGER, PK, AUTO_INCREMENT): 세션 고유 ID
- **user_id** (INTEGER, NOT NULL, FK → users.id): 사용자 ID
- **game_type** (VARCHAR(20), NOT NULL): 게임 유형 (slot, rps, roulette, gacha)
- **start_time** (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): 세션 시작 시간
- **end_time** (TIMESTAMP): 세션 종료 시간
- **total_bet** (INTEGER, DEFAULT 0): 총 베팅 금액
- **total_win** (INTEGER, DEFAULT 0): 총 획득 금액
- **session_result** (VARCHAR(10)): 세션 결과 (win/lose/draw)

### 3. Quiz 시스템

#### quizzes
- **id** (INTEGER, PK, AUTO_INCREMENT): 퀴즈 고유 ID
- **title** (VARCHAR(200), NOT NULL): 퀴즈 제목
- **description** (TEXT): 퀴즈 설명
- **category** (VARCHAR(50)): 퀴즈 카테고리
- **difficulty** (VARCHAR(20), DEFAULT 'medium'): 난이도 (easy/medium/hard)
- **time_limit** (INTEGER): 제한 시간 (초)
- **max_attempts** (INTEGER, DEFAULT 3): 최대 시도 횟수
- **is_active** (BOOLEAN, DEFAULT true): 활성화 여부
- **created_at** (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): 생성 시간
- **updated_at** (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE): 수정 시간

#### quiz_questions
- **id** (INTEGER, PK, AUTO_INCREMENT): 질문 고유 ID
- **quiz_id** (INTEGER, NOT NULL, FK → quizzes.id): 퀴즈 ID
- **question_text** (TEXT, NOT NULL): 질문 내용
- **question_type** (VARCHAR(20), NOT NULL): 질문 유형 (multiple_choice/true_false/text)
- **points** (INTEGER, DEFAULT 10): 문제 배점
- **order_num** (INTEGER, NOT NULL): 질문 순서
- **is_required** (BOOLEAN, DEFAULT true): 필수 답변 여부

#### quiz_options
- **id** (INTEGER, PK, AUTO_INCREMENT): 선택지 고유 ID
- **question_id** (INTEGER, NOT NULL, FK → quiz_questions.id): 질문 ID
- **option_text** (TEXT, NOT NULL): 선택지 내용
- **is_correct** (BOOLEAN, DEFAULT false): 정답 여부
- **order_num** (INTEGER, NOT NULL): 선택지 순서

#### quiz_results
- **id** (INTEGER, PK, AUTO_INCREMENT): 결과 고유 ID
- **user_id** (INTEGER, NOT NULL, FK → users.id): 사용자 ID
- **quiz_id** (INTEGER, NOT NULL, FK → quizzes.id): 퀴즈 ID
- **score** (INTEGER, NOT NULL): 획득 점수
- **max_score** (INTEGER, NOT NULL): 최대 점수
- **percentage** (REAL, NOT NULL): 정답률 (%)
- **time_taken** (INTEGER): 소요 시간 (초)
- **attempt_number** (INTEGER, DEFAULT 1): 시도 횟수
- **completed_at** (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): 완료 시간

#### quiz_user_answers
- **id** (INTEGER, PK, AUTO_INCREMENT): 답변 고유 ID
- **result_id** (INTEGER, NOT NULL, FK → quiz_results.id): 퀴즈 결과 ID
- **question_id** (INTEGER, NOT NULL, FK → quiz_questions.id): 질문 ID
- **selected_option_id** (INTEGER, FK → quiz_options.id): 선택한 옵션 ID (객관식용)
- **text_answer** (TEXT): 텍스트 답변 (주관식용)
- **is_correct** (BOOLEAN, NOT NULL): 정답 여부
- **points_earned** (INTEGER, DEFAULT 0): 획득 점수

### 4. AI 및 감정 분석

#### emotion_analysis
- **id** (INTEGER, PK, AUTO_INCREMENT): 분석 고유 ID
- **user_id** (INTEGER, NOT NULL, FK → users.id): 사용자 ID
- **session_id** (VARCHAR(100)): 채팅 세션 ID
- **text_input** (TEXT, NOT NULL): 입력 텍스트
- **detected_emotion** (VARCHAR(50)): 감지된 감정
- **confidence_score** (REAL): 신뢰도 점수 (0.0-1.0)
- **analysis_method** (VARCHAR(20)): 분석 방법 (local_llm/openai/claude)
- **created_at** (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): 분석 시간

## 테이블 관계도

```
users
├── user_segments (1:1)
├── user_tokens (1:1)
├── user_actions (1:N)
├── game_sessions (1:N)
├── quiz_results (1:N)
└── emotion_analysis (1:N)

quizzes
├── quiz_questions (1:N)
└── quiz_results (1:N)

quiz_questions
└── quiz_options (1:N)

quiz_results
└── quiz_user_answers (1:N)

quiz_user_answers
├── quiz_questions (N:1)
└── quiz_options (N:1)
```

## 인덱스 설계

### 성능 최적화를 위한 주요 인덱스
- **users**: idx_username, idx_email, idx_invite_code
- **user_actions**: idx_user_id_action_type, idx_created_at
- **game_sessions**: idx_user_id_game_type, idx_start_time
- **quiz_results**: idx_user_id_quiz_id, idx_completed_at
- **emotion_analysis**: idx_user_id_created_at, idx_session_id

## 데이터 정합성 규칙

1. **외래 키 제약조건**: 모든 FK는 CASCADE DELETE/UPDATE 설정
2. **토큰 잔액**: 음수 불가 (CHECK 제약조건)
3. **퀴즈 점수**: 0 이상 max_score 이하 (CHECK 제약조건)
4. **감정 신뢰도**: 0.0-1.0 범위 (CHECK 제약조건)

## 마이그레이션 이력

### v1.0.0 (Initial Schema)
- 기본 사용자 관리 테이블
- 게임 액션 로깅 테이블

### v1.1.0 (Quiz System)
- 퀴즈 관련 5개 테이블 추가
- 복합 키 및 외래 키 제약조건 설정

### v1.2.0 (RPS Game Enhancement)
- user_tokens 테이블 추가
- user_segments 테이블 추가
- game_sessions 테이블 추가

### v1.3.0 (AI Enhancement)
- emotion_analysis 테이블 추가
- 감정 분석 메타데이터 필드 확장
