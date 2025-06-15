"""퀴즈 테이블을 직접 생성하는 스크립트"""
import sqlite3
import os

def create_quiz_tables():
    # 데이터베이스 파일 경로
    db_path = "dev.db"
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Create quizzes table
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
        
        # Create quiz_questions table
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
        
        # Create quiz_options table
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
        
        # Create quiz_results table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS quiz_results (
                id INTEGER PRIMARY KEY,
                user_id INTEGER NOT NULL,
                quiz_id INTEGER NOT NULL,
                score INTEGER DEFAULT 0,
                max_score INTEGER NOT NULL,
                percentage INTEGER DEFAULT 0,
                time_taken INTEGER,
                completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id),
                FOREIGN KEY (quiz_id) REFERENCES quizzes (id)
            )
        """)
        
        # Create quiz_user_answers table
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
        
        # Create indexes
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_quizzes_title ON quizzes (title)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_quizzes_category ON quizzes (category)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_id ON quiz_questions (quiz_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_quiz_options_question_id ON quiz_options (question_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_quiz_results_user_id ON quiz_results (user_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_quiz_results_quiz_id ON quiz_results (quiz_id)")
        
        conn.commit()
        print("퀴즈 테이블들이 성공적으로 생성되었습니다.")
        
        # 테이블 목록 확인
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'quiz%'")
        tables = cursor.fetchall()
        print("생성된 퀴즈 테이블들:")
        for table in tables:
            print(f"  - {table[0]}")
            
    except Exception as e:
        print(f"오류 발생: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    create_quiz_tables()
