"""Quiz 관련 모델"""
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy.sql import func

Base = declarative_base()


class Quiz(Base):
    """퀴즈 모델"""
    __tablename__ = "quizzes"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False, index=True)
    description = Column(Text)
    category = Column(String(100), index=True)
    difficulty = Column(String(20), default="easy")  # easy, medium, hard
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # 관계
    questions = relationship("QuizQuestion", back_populates="quiz", cascade="all, delete-orphan")
    results = relationship("QuizResult", back_populates="quiz")


class QuizQuestion(Base):
    """퀴즈 질문 모델"""
    __tablename__ = "quiz_questions"
    
    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False)
    question = Column(Text, nullable=False)
    question_type = Column(String(20), default="multiple_choice")  # multiple_choice, true_false, text
    order = Column(Integer, default=0)
    points = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # 관계
    quiz = relationship("Quiz", back_populates="questions")
    options = relationship("QuizOption", back_populates="question", cascade="all, delete-orphan")
    user_answers = relationship("QuizUserAnswer", back_populates="question")


class QuizOption(Base):
    """퀴즈 선택지 모델"""
    __tablename__ = "quiz_options"
    
    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("quiz_questions.id"), nullable=False)
    option_text = Column(Text, nullable=False)
    is_correct = Column(Boolean, default=False)
    order = Column(Integer, default=0)
    
    # 관계
    question = relationship("QuizQuestion", back_populates="options")


class QuizResult(Base):
    """퀴즈 결과 모델"""
    __tablename__ = "quiz_results"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False)
    score = Column(Integer, default=0)
    max_score = Column(Integer, nullable=False)
    percentage = Column(Integer, default=0)  # 0-100
    time_taken = Column(Integer)  # seconds
    completed_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # 관계
    user = relationship("User", back_populates="quiz_results")
    quiz = relationship("Quiz", back_populates="results")
    user_answers = relationship("QuizUserAnswer", back_populates="result")


class QuizUserAnswer(Base):
    """사용자 퀴즈 답변 모델"""
    __tablename__ = "quiz_user_answers"
    
    id = Column(Integer, primary_key=True, index=True)
    result_id = Column(Integer, ForeignKey("quiz_results.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("quiz_questions.id"), nullable=False)
    selected_option_id = Column(Integer, ForeignKey("quiz_options.id"))  # for multiple choice
    text_answer = Column(Text)  # for text questions
    is_correct = Column(Boolean, default=False)
    answered_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # 관계
    result = relationship("QuizResult", back_populates="user_answers")
    question = relationship("QuizQuestion", back_populates="user_answers")
    selected_option = relationship("QuizOption")
