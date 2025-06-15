"""Quiz 서비스"""
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models import Quiz, QuizQuestion, QuizOption, QuizResult, QuizUserAnswer
from datetime import datetime


class QuizService:
    """퀴즈 관련 비즈니스 로직을 처리하는 서비스"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create_quiz(self, title: str, description: str = "", category: str = "", difficulty: str = "easy") -> Dict[str, Any]:
        """새 퀴즈 생성"""
        quiz = Quiz(
            title=title,
            description=description,
            category=category,
            difficulty=difficulty
        )
        self.db.add(quiz)
        self.db.commit()
        self.db.refresh(quiz)
        
        return {
            "id": quiz.id,
            "title": quiz.title,
            "description": quiz.description,
            "category": quiz.category,
            "difficulty": quiz.difficulty,
            "is_active": quiz.is_active,
            "created_at": quiz.created_at
        }
    
    def add_question(self, quiz_id: int, question: str, question_type: str = "multiple_choice", 
                    points: int = 1, order: int = 0) -> Dict[str, Any]:
        """퀴즈에 질문 추가"""
        quiz_question = QuizQuestion(
            quiz_id=quiz_id,
            question=question,
            question_type=question_type,
            points=points,
            order=order
        )
        self.db.add(quiz_question)
        self.db.commit()
        self.db.refresh(quiz_question)
        
        return {
            "id": quiz_question.id,
            "quiz_id": quiz_question.quiz_id,
            "question": quiz_question.question,
            "question_type": quiz_question.question_type,
            "points": quiz_question.points,
            "order": quiz_question.order
        }
    
    def add_option(self, question_id: int, option_text: str, is_correct: bool = False, 
                  order: int = 0) -> Dict[str, Any]:
        """질문에 선택지 추가"""
        option = QuizOption(
            question_id=question_id,
            option_text=option_text,
            is_correct=is_correct,
            order=order
        )
        self.db.add(option)
        self.db.commit()
        self.db.refresh(option)
        
        return {
            "id": option.id,
            "question_id": option.question_id,
            "option_text": option.option_text,
            "is_correct": option.is_correct,
            "order": option.order
        }
    
    def get_quiz(self, quiz_id: int) -> Optional[Dict[str, Any]]:
        """퀴즈 조회"""
        quiz = self.db.query(Quiz).filter(Quiz.id == quiz_id).first()
        if not quiz:
            return None
            
        questions = []
        for question in quiz.questions:
            options = []
            for option in question.options:
                options.append({
                    "id": option.id,
                    "option_text": option.option_text,
                    "is_correct": option.is_correct,
                    "order": option.order
                })
            
            questions.append({
                "id": question.id,
                "question": question.question,
                "question_type": question.question_type,
                "points": question.points,
                "order": question.order,
                "options": options
            })
        
        return {
            "id": quiz.id,
            "title": quiz.title,
            "description": quiz.description,
            "category": quiz.category,
            "difficulty": quiz.difficulty,
            "is_active": quiz.is_active,
            "questions": questions
        }
    
    def submit_quiz(self, user_id: int, quiz_id: int, answers: List[Dict[str, Any]], 
                   time_taken: int = 0) -> Dict[str, Any]:
        """퀴즈 답안 제출 및 결과 계산"""
        quiz = self.db.query(Quiz).filter(Quiz.id == quiz_id).first()
        if not quiz:
            raise ValueError("Quiz not found")
          # 점수 계산
        total_score: int = 0
        max_score: int = 0
        correct_answers: int = 0
        total_questions: int = len(quiz.questions)
        
        # 결과 생성
        result = QuizResult(
            user_id=user_id,
            quiz_id=quiz_id,
            score=0,  # 임시값
            max_score=0,  # 임시값
            percentage=0,  # 임시값
            time_taken=time_taken
        )
        self.db.add(result)
        self.db.commit()
        self.db.refresh(result)
        
        # 각 답안 처리
        for answer_data in answers:
            question_id = answer_data.get("question_id")
            selected_option_id = answer_data.get("selected_option_id")
            text_answer = answer_data.get("text_answer")
            
            question = self.db.query(QuizQuestion).filter(QuizQuestion.id == question_id).first()
            if not question:
                continue
                  max_score += int(question.points)
            is_correct = False
            
            if selected_option_id:
                option = self.db.query(QuizOption).filter(QuizOption.id == selected_option_id).first()
                if option and bool(option.is_correct):
                    is_correct = True
                    total_score += int(question.points)
                    correct_answers += 1
            
            # 답안 저장
            user_answer = QuizUserAnswer(
                result_id=result.id,
                question_id=question_id,
                selected_option_id=selected_option_id,
                text_answer=text_answer,
                is_correct=is_correct
            )
            self.db.add(user_answer)
        
        # 결과 업데이트
        percentage = int((total_score / max_score * 100)) if max_score > 0 else 0
        result.score = total_score
        result.max_score = max_score
        result.percentage = percentage
        
        self.db.commit()
        
        return {
            "result_id": result.id,
            "score": total_score,
            "max_score": max_score,
            "percentage": percentage,
            "correct_answers": correct_answers,
            "total_questions": total_questions,
            "time_taken": time_taken
        }
    
    def get_quiz_result(self, result_id: int) -> Optional[Dict[str, Any]]:
        """퀴즈 결과 조회"""
        result = self.db.query(QuizResult).filter(QuizResult.id == result_id).first()
        if not result:
            return None
        
        return {
            "id": result.id,
            "user_id": result.user_id,
            "quiz_id": result.quiz_id,
            "score": result.score,
            "max_score": result.max_score,
            "percentage": result.percentage,
            "time_taken": result.time_taken,
            "completed_at": result.completed_at
        }
