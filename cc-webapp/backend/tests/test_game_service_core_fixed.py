"""추가 테스트: game_service.py의 코어 기능 테스트와 미커버 영역 테스트."""

import unittest
import random
from unittest.mock import MagicMock, patch
from sqlalchemy.orm import Session

import pytest
from app.services.game_service import GameService
from app.services.slot_service import SlotService, SlotSpinResult
from app.services.roulette_service import RouletteService, RouletteSpinResult
from app.services.gacha_service import GachaService, GachaPullResult
from app.repositories.game_repository import GameRepository

class TestGameServiceDelegation(unittest.TestCase):
    """GameService의 위임 패턴 테스트 클래스."""

    def setUp(self):
        """테스트를 위한 기본 설정."""
        self.mock_repo = MagicMock(spec=GameRepository)
        self.mock_db = MagicMock(spec=Session)
        
        # 모킹된 서비스 준비
        self.mock_slot_service = MagicMock(spec=SlotService)
        self.mock_roulette_service = MagicMock(spec=RouletteService)
        self.mock_gacha_service = MagicMock(spec=GachaService)
        
        # 서비스 객체 생성
        self.service = GameService(repository=self.mock_repo)
        
        # 모킹된 서비스로 교체
        self.service.slot_service = self.mock_slot_service
        self.service.roulette_service = self.mock_roulette_service
        self.service.gacha_service = self.mock_gacha_service

    def test_init_creates_all_services(self):
        """초기화 시 모든 서비스가 생성되는지 테스트."""
        service = GameService()
        
        self.assertIsInstance(service.slot_service, SlotService)
        self.assertIsInstance(service.roulette_service, RouletteService)
        self.assertIsInstance(service.gacha_service, GachaService)
        self.assertIsInstance(service.repo, GameRepository)

    def test_slot_spin_delegates_to_slot_service(self):
        """slot_spin 메서드가 슬롯 서비스에 위임하는지 테스트."""
        # 테스트 데이터 준비
        user_id = 123
        expected_result = MagicMock(spec=SlotSpinResult)
        self.mock_slot_service.spin.return_value = expected_result
        
        # 메서드 실행
        result = self.service.slot_spin(user_id, self.mock_db)
        
        # 검증
        self.mock_slot_service.spin.assert_called_once_with(user_id, self.mock_db)
        self.assertEqual(result, expected_result)

    def test_roulette_spin_delegates_to_roulette_service(self):
        """roulette_spin 메서드가 룰렛 서비스에 위임하는지 테스트."""
        # 테스트 데이터 준비
        user_id = 123
        bet = 10
        bet_type = "number"
        value = "7"
        expected_result = MagicMock(spec=RouletteSpinResult)
        self.mock_roulette_service.spin.return_value = expected_result
        
        # 메서드 실행
        result = self.service.roulette_spin(user_id, bet, bet_type, value, self.mock_db)
        
        # 검증
        self.mock_roulette_service.spin.assert_called_once_with(user_id, bet, bet_type, value, self.mock_db)
        self.assertEqual(result, expected_result)

    def test_gacha_pull_delegates_to_gacha_service(self):
        """gacha_pull 메서드가 가챠 서비스에 위임하는지 테스트."""
        # 테스트 데이터 준비
        user_id = 123
        count = 10
        expected_result = MagicMock(spec=GachaPullResult)
        self.mock_gacha_service.pull.return_value = expected_result
        
        # 메서드 실행
        result = self.service.gacha_pull(user_id, count, self.mock_db)
        
        # 검증
        self.mock_gacha_service.pull.assert_called_once_with(user_id, count, self.mock_db)
        self.assertEqual(result, expected_result)
        
    def test_null_repository_creates_default(self):
        """repository가 None일 때 기본 저장소가 생성되는지 테스트."""
        with patch('app.services.game_service.GameRepository') as mock_repo_class:
            mock_repo_instance = MagicMock()
            mock_repo_class.return_value = mock_repo_instance
            
            service = GameService(repository=None)
            
            mock_repo_class.assert_called_once()
            self.assertEqual(service.repo, mock_repo_instance)

    def test_error_propagation_from_slot_service(self):
        """슬롯 서비스에서 발생한 오류가 전파되는지 테스트."""
        # 에러 설정
        error_msg = "Insufficient tokens"
        self.mock_slot_service.spin.side_effect = ValueError(error_msg)
        
        # 오류가 전파되는지 확인
        with self.assertRaises(ValueError) as context:
            self.service.slot_spin(123, self.mock_db)
        
        self.assertEqual(str(context.exception), error_msg)

    def test_error_propagation_from_roulette_service(self):
        """룰렛 서비스에서 발생한 오류가 전파되는지 테스트."""
        # 에러 설정
        error_msg = "Invalid bet type"
        self.mock_roulette_service.spin.side_effect = ValueError(error_msg)
        
        # 오류가 전파되는지 확인
        with self.assertRaises(ValueError) as context:
            self.service.roulette_spin(123, 10, "invalid", "value", self.mock_db)
        
        self.assertEqual(str(context.exception), error_msg)

    def test_error_propagation_from_gacha_service(self):
        """가챠 서비스에서 발생한 오류가 전파되는지 테스트."""
        # 에러 설정
        error_msg = "Invalid pull count"
        self.mock_gacha_service.pull.side_effect = ValueError(error_msg)
        
        # 오류가 전파되는지 확인
        with self.assertRaises(ValueError) as context:
            self.service.gacha_pull(123, -1, self.mock_db)
        
        self.assertEqual(str(context.exception), error_msg)


# 추가 pytest 스타일 테스트
@pytest.fixture
def mocked_game_service():
    """모킹된 서비스들을 포함한 GameService 픽스쳐."""
    mock_repo = MagicMock(spec=GameRepository)
    mock_slot_service = MagicMock(spec=SlotService)
    mock_roulette_service = MagicMock(spec=RouletteService)
    mock_gacha_service = MagicMock(spec=GachaService)
    
    service = GameService(repository=mock_repo)
    service.slot_service = mock_slot_service
    service.roulette_service = mock_roulette_service
    service.gacha_service = mock_gacha_service
    
    return service, mock_repo, mock_slot_service, mock_roulette_service, mock_gacha_service


def test_service_initialization():
    """서비스 초기화 테스트."""
    service = GameService()
    
    # 모든 필수 서비스가 초기화되었는지 확인
    assert hasattr(service, 'slot_service')
    assert hasattr(service, 'roulette_service')
    assert hasattr(service, 'gacha_service')
    assert hasattr(service, 'repo')
    
    assert isinstance(service.slot_service, SlotService)
    assert isinstance(service.roulette_service, RouletteService)
    assert isinstance(service.gacha_service, GachaService)
    assert isinstance(service.repo, GameRepository)


def test_integration_between_services(mocked_game_service):
    """서비스들 간의 통합 테스트."""
    service, _, mock_slot_service, mock_roulette_service, mock_gacha_service = mocked_game_service
    mock_db = MagicMock(spec=Session)
    
    # 각 서비스의 예상 결과 설정
    mock_slot_result = MagicMock(spec=SlotSpinResult)
    mock_roulette_result = MagicMock(spec=RouletteSpinResult)
    mock_gacha_result = MagicMock(spec=GachaPullResult)
    
    mock_slot_service.spin.return_value = mock_slot_result
    mock_roulette_service.spin.return_value = mock_roulette_result
    mock_gacha_service.pull.return_value = mock_gacha_result
    
    # 모든 게임 서비스 호출 테스트
    slot_result = service.slot_spin(user_id=123, db=mock_db)
    roulette_result = service.roulette_spin(user_id=123, bet=10, bet_type="number", value="7", db=mock_db)
    gacha_result = service.gacha_pull(user_id=123, count=5, db=mock_db)
    
    # 모든 서비스 호출 확인
    mock_slot_service.spin.assert_called_once()
    mock_roulette_service.spin.assert_called_once()
    mock_gacha_service.pull.assert_called_once()
    
    # 결과가 예상대로인지 확인
    assert slot_result == mock_slot_result
    assert roulette_result == mock_roulette_result
    assert gacha_result == mock_gacha_result
