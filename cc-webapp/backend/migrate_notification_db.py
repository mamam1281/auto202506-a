import sqlite3
import os

# 기존 테스트 DB 삭제하고 새로 생성
db_path = 'test_notification.db'
if os.path.exists(db_path):
    os.remove(db_path)
    print('Deleted old test notification DB')

# 새로운 스키마로 테이블 생성
conn = sqlite3.connect(db_path)
try:
    # 새로운 User 테이블 생성 (email 없이)
    conn.execute('''
        CREATE TABLE users (
            id INTEGER PRIMARY KEY,
            nickname VARCHAR(100) NOT NULL,
            invite_code VARCHAR(10) NOT NULL,
            rank VARCHAR(20) DEFAULT "STANDARD",
            cyber_token_balance INTEGER DEFAULT 200,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Notifications 테이블 생성
    conn.execute('''
        CREATE TABLE notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            message TEXT NOT NULL,
            is_sent BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            sent_at TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    conn.commit()
    print('Created new test notification DB with updated schema')
except Exception as e:
    print(f'Error creating tables: {e}')
finally:
    conn.close()
