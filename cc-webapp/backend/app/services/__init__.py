# from .reward_service import RewardService  # 임시 주석 처리
# from .notification_service import NotificationService  # 임시 주석 처리  
# from .tracking_service import TrackingService  # 임시 주석 처리
from .game_service import GameService
# from .user_segment_service import UserSegmentService  # 임시 주석 처리
from .slot_service import SlotService  # SlotService 복구 - async 버전
# from .roulette_service import RouletteService  # 임시 주석 처리
# from .gacha_service import GachaService  # 임시 주석 처리
from .rps_service import RPSService  # 새로 추가
# from .quiz_service import QuizService  # 새로 추가 - 임시 주석 처리


# Optionally, make other services available for easier import if structured this way
# from .user_service import UserService
# from .auth_service import AuthService
# from .token_service import TokenService
# from .age_verification_service import AgeVerificationService
# from .adult_content_service import AdultContentService
# from .flash_offer_service import FlashOfferService
# from .vip_content_service import VIPContentService
# from .game_service import GameService
# from .user_activity_service import UserActivityService
# from .notification_service import NotificationService
# from .user_feedback_service import UserFeedbackService
# from .personalization_service import PersonalizationService
# from .rfm_service import RFMService
# from .segmentation_service import SegmentationService
# from .chat_service import ChatService

__all__ = [
    # "RewardService",  # 임시 주석 처리
    # "NotificationService", # 임시 주석 처리
    # "TrackingService", # 임시 주석 처리
    "GameService",
    # "UserSegmentService", # 임시 주석 처리
    # "SlotService",  # SlotService 삭제됨
    # "RouletteService", # 임시 주석 처리
    # "GachaService", # 임시 주석 처리
    "RPSService",  # 새로 추가
    # "QuizService"  # 새로 추가 - 임시 주석 처리

    # "UserService",
    # "AuthService",
    # "TokenService",
    # "AgeVerificationService",
    # "AdultContentService",
    # "FlashOfferService",
    # "VIPContentService",
    # "GameService",
    # "UserActivityService",
    # "NotificationService",
    # "UserFeedbackService",
    # "PersonalizationService",
    # "RFMService",
    # "SegmentationService",
    # "ChatService",
]
