"""
단순 초대코드 기반 인증 시스템
- 복잡한 JWT, 비밀번호, 이메일 인증 제거
- 초대코드로 즉시 가입 → 모든 서비스 접근 가능
- 랭크 시스템으로 서비스 레벨 제어 (VIP, PREMIUM, STANDARD)
"""

from fastapi import HTTPException
from typing import Optional
from app.models import User, InviteCode
from app.database import get_db
import random
import string

class SimpleAuth:
    @staticmethod
    def generate_invite_code() -> str:
        """6자리 초대코드 생성"""
        return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))    
    @staticmethod
    def register_with_invite_code(invite_code: str, nickname: str, db) -> User:
        """초대코드로 즉시 가입 - 모든 서비스 접근 가능"""
        # 초대코드 유효성 검사
        invite = db.query(InviteCode).filter(
            InviteCode.code == invite_code,
            InviteCode.is_used == False
        ).first()
        
        if not invite:
            raise HTTPException(status_code=400, detail="잘못된 초대코드입니다")
        
        # 닉네임 중복 검사
        existing_user = db.query(User).filter(User.nickname == nickname).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="이미 사용중인 닉네임입니다")
        
        # 사용자 생성 - 즉시 모든 서비스 접근 가능
        user = User(
            nickname=nickname,
            invite_code=invite_code,
            rank="STANDARD",  # 기본 랭크
            cyber_token_balance=200
        )
        
        # 초대코드 사용 처리
        invite.is_used = True
        
        db.add(user)
        db.commit()
        db.refresh(user)
        
        return user
    
    @staticmethod
    def check_rank_access(user_rank: str, required_rank: str) -> bool:
        """랭크 기반 접근 제어"""
        rank_hierarchy = {
            "VIP": 3,
            "PREMIUM": 2, 
            "STANDARD": 1
        }
        
        user_level = rank_hierarchy.get(user_rank, 1)
        required_level = rank_hierarchy.get(required_rank, 1)
        
        return user_level >= required_level
