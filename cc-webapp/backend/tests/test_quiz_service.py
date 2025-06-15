"""퀴즈 서비스 테스트"""
import pytest
import sqlite3
import os
from app.services.quiz_service import QuizService, Quiz, QuizQuestion, QuizResult


@pytest.fixture
def quiz_service():
    """퀴즈 서비스 테스트 인스턴스"""
    test_db = "test_quiz.db"
    
    # 테스트용 DB 생성
    conn = sqlite3.connect(test_db)
    cursor = conn.cursor()
    
    # 테이블 생성
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS quizzes (
            id INTEGER PRIMARY KEY,
            title VARCHAR(200) NOT NULL,
            description TEXT,
            category VARCHAR(100),
            difficulty VARCHAR(20) DEFAULT 'easy',
            is_active BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS quiz_questions (
            id INTEGER PRIMARY KEY,
            quiz_id INTEGER NOT NULL,
            question TEXT NOT NULL,
            question_type VARCHAR(20) DEFAULT 'multiple_choice',
            "order" INTEGER DEFAULT 0,
            points INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (quiz_id) REFERENCES quizzes (id)
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS quiz_options (
            id INTEGER PRIMARY KEY,
            question_id INTEGER NOT NULL,
            option_text TEXT NOT NULL,
            is_correct BOOLEAN DEFAULT 0,
            "order" INTEGER DEFAULT 0,
            FOREIGN KEY (question_id) REFERENCES quiz_questions (id)
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS quiz_results (
            id INTEGER PRIMARY KEY,
            user_id INTEGER NOT NULL,
            quiz_id INTEGER NOT NULL,
            score INTEGER DEFAULT 0,
            max_score INTEGER NOT NULL,
            percentage INTEGER DEFAULT 0,
            time_taken INTEGER,
            completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS quiz_user_answers (
            id INTEGER PRIMARY KEY,
            result_id INTEGER NOT NULL,
            question_id INTEGER NOT NULL,
            selected_option_id INTEGER,
            text_answer TEXT,
            is_correct BOOLEAN DEFAULT 0,
            answered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (result_id) REFERENCES quiz_results (id),
            FOREIGN KEY (question_id) REFERENCES quiz_questions (id),
            FOREIGN KEY (selected_option_id) REFERENCES quiz_options (id)
        )
    """)
    
    conn.commit()
    conn.close()
    
    service = QuizService(test_db)
    
    yield service
    
    # 테스트 후 정리
    if os.path.exists(test_db):
        os.remove(test_db)


@pytest.mark.asyncio
async def test_create_quiz(quiz_service):
    """퀴즈 생성 테스트"""
    quiz = await quiz_service.create_quiz(
        title="Python 기초 퀴즈",
        description="Python 기본 문법에 대한 퀴즈입니다",
        category="programming",
        difficulty="easy"
    )
    
    assert quiz.id is not None
    assert quiz.title == "Python 기초 퀴즈"
    assert quiz.description == "Python 기본 문법에 대한 퀴즈입니다"
    assert quiz.category == "programming"
    assert quiz.difficulty == "easy"
    assert quiz.is_active is True


@pytest.mark.asyncio
async def test_get_quiz_not_found(quiz_service):
    """존재하지 않는 퀴즈 조회 테스트"""
    quiz = await quiz_service.get_quiz(999)
    assert quiz is None


@pytest.mark.asyncio
async def test_get_quiz_empty(quiz_service):
    """빈 퀴즈 조회 테스트"""
    # 퀴즈 생성
    quiz = await quiz_service.create_quiz("빈 퀴즈")
    
    # 질문 없는 퀴즈 조회
    retrieved_quiz = await quiz_service.get_quiz(quiz.id)
    assert retrieved_quiz is not None
    assert retrieved_quiz.title == "빈 퀴즈"
    assert retrieved_quiz.questions == []


@pytest.mark.asyncio
async def test_get_quizzes_empty(quiz_service):
    """빈 퀴즈 목록 조회 테스트"""
    quizzes = await quiz_service.get_quizzes()
    assert quizzes == []


@pytest.mark.asyncio
async def test_get_quizzes_with_data(quiz_service):
    """퀴즈 목록 조회 테스트"""
    # 여러 퀴즈 생성
    await quiz_service.create_quiz("퀴즈 1", category="math")
    await quiz_service.create_quiz("퀴즈 2", category="science")
    await quiz_service.create_quiz("퀴즈 3", category="math")
    
    # 전체 조회
    all_quizzes = await quiz_service.get_quizzes()
    assert len(all_quizzes) == 3
    
    # 카테고리별 조회
    math_quizzes = await quiz_service.get_quizzes(category="math")
    assert len(math_quizzes) == 2
    
    science_quizzes = await quiz_service.get_quizzes(category="science")
    assert len(science_quizzes) == 1


@pytest.mark.asyncio
async def test_submit_quiz_not_found(quiz_service):
    """존재하지 않는 퀴즈 제출 테스트"""
    with pytest.raises(ValueError, match="Quiz not found"):
        await quiz_service.submit_quiz(
            user_id=1,
            quiz_id=999,
            answers=[]
        )


@pytest.mark.asyncio
async def test_submit_quiz_no_questions(quiz_service):
    """질문 없는 퀴즈 제출 테스트"""
    quiz = await quiz_service.create_quiz("빈 퀴즈")
    
    with pytest.raises(ValueError, match="Quiz has no questions"):
        await quiz_service.submit_quiz(
            user_id=1,
            quiz_id=quiz.id,
            answers=[]
        )


@pytest.mark.asyncio 
async def test_quiz_service_basic_flow(quiz_service):
    """퀴즈 서비스 기본 플로우 테스트"""
    # 1. 퀴즈 생성
    quiz = await quiz_service.create_quiz(
        title="기본 수학 퀴즈",
        description="기본 수학 문제",
        category="math",
        difficulty="easy"
    )
    
    # 2. 수동으로 질문과 선택지 추가 (향후 개선)
    async with quiz_service._get_connection() as conn:
        # 질문 1 추가
        cursor = await conn.execute(
            "INSERT INTO quiz_questions (quiz_id, question, points) VALUES (?, ?, ?)",
            (quiz.id, "2 + 2 = ?", 1)
        )
        q1_id = cursor.lastrowid
        
        # 선택지 추가
        await conn.execute(
            "INSERT INTO quiz_options (question_id, option_text, is_correct) VALUES (?, ?, ?)",
            (q1_id, "3", False)
        )
        await conn.execute(
            "INSERT INTO quiz_options (question_id, option_text, is_correct) VALUES (?, ?, ?)",
            (q1_id, "4", True)
        )
        correct_option_cursor = await conn.execute(
            "INSERT INTO quiz_options (question_id, option_text, is_correct) VALUES (?, ?, ?)",
            (q1_id, "5", False)
        )
        
        await conn.commit()
    
    # 3. 퀴즈 조회 (질문 포함)
    full_quiz = await quiz_service.get_quiz(quiz.id)
    assert full_quiz is not None
    assert len(full_quiz.questions) == 1
    assert full_quiz.questions[0].question == "2 + 2 = ?"
    assert len(full_quiz.questions[0].options) == 3
    
    # 4. 정답 선택지 찾기
    correct_option_id = None
    for option in full_quiz.questions[0].options:
        if option["option_text"] == "4":
            correct_option_id = option["id"]
            break
    
    assert correct_option_id is not None
    
    # 5. 퀴즈 제출 (정답)
    result = await quiz_service.submit_quiz(
        user_id=1,
        quiz_id=quiz.id,
        answers=[{
            "question_id": q1_id,
            "selected_option_id": correct_option_id
        }],
        time_taken=30
    )
    
    assert result.score == 1
    assert result.max_score == 1
    assert result.percentage == 100
    assert result.time_taken == 30
    assert len(result.answers) == 1
    assert result.answers[0]["is_correct"] is True


# 헬퍼 메서드 추가
async def _get_connection(self):
    """테스트용 DB 연결 헬퍼"""
    import aiosqlite
    return aiosqlite.connect(self.db_path)

# QuizService에 헬퍼 메서드 추가
QuizService._get_connection = _get_connection
