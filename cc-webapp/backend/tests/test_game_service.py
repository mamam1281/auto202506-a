"""Game service tests to validate core game functionality."""

import pytest
from unittest.mock import MagicMock, patch
from sqlalchemy.orm import Session

from app.services.game_service import GameService
from app.repositories.game_repository import GameRepository
from app.services.user_segment_service import UserSegmentService
from app.services.slot_service import SlotService
from app.services.roulette_service import RouletteService
from app.services.gacha_service import GachaService


class TestGameService:
    """Test game service functionality."""

    def setup_method(self):
        """Initialize test environment."""
        self.repo = MagicMock(spec=GameRepository)
        self.segment_service = MagicMock(spec=UserSegmentService)
        self.slot_service = MagicMock(spec=SlotService) 
        self.roulette_service = MagicMock(spec=RouletteService)
        self.gacha_service = MagicMock(spec=GachaService)
        self.db = MagicMock(spec=Session)
        
        # Create service with mocked dependencies
        self.service = GameService(repository=self.repo)
        self.service.slot_service = self.slot_service
        self.service.roulette_service = self.roulette_service
        self.service.gacha_service = self.gacha_service

    def test_slot_spin(self):
        """Test slot spin delegates to slot service."""
        # Arrange
        user_id = 1
        expected_result = MagicMock()
        self.slot_service.spin.return_value = expected_result
        
        # Act
        result = self.service.slot_spin(user_id, self.db)
        
        # Assert
        self.slot_service.spin.assert_called_once_with(user_id, self.db)
        assert result == expected_result

    def test_roulette_spin(self):
        """Test roulette spin delegates to roulette service."""
        # Arrange
        user_id = 1
        bet = 10
        bet_type = "color"
        value = "red"
        expected_result = MagicMock()
        self.roulette_service.spin.return_value = expected_result
        
        # Act
        result = self.service.roulette_spin(user_id, bet, bet_type, value, self.db)
        
        # Assert
        self.roulette_service.spin.assert_called_once_with(user_id, bet, bet_type, value, self.db)
        assert result == expected_result

    def test_gacha_pull(self):
        """Test gacha pull delegates to gacha service."""
        # Arrange
        user_id = 1
        count = 10
        expected_result = MagicMock()
        self.gacha_service.pull.return_value = expected_result
        
        # Act
        result = self.service.gacha_pull(user_id, count, self.db)
        
        # Assert
        self.gacha_service.pull.assert_called_once_with(user_id, count, self.db)
        assert result == expected_result

    def test_initialization_defaults(self):
        """Test service initializes with default dependencies."""
        # Act
        service = GameService()
        
        # Assert
        assert service.repo is not None
        assert isinstance(service.slot_service, SlotService)
        assert isinstance(service.roulette_service, RouletteService)
        assert isinstance(service.gacha_service, GachaService)


class TestGameServiceIntegration:
    """Integration tests for GameService with real dependencies."""
    
    @pytest.fixture
    def db(self):
        """Provide test database session."""
        # This would normally use a fixture that sets up a test DB
        return MagicMock(spec=Session)
    
    @pytest.fixture
    def service(self, db):
        """Create a GameService with real dependencies for integration testing."""
        repo = GameRepository()
        return GameService(repository=repo)
    
    def test_full_game_flow(self, service, db):
        """Test complete game flow from service to DB and back."""
        # This is a placeholder for a more complete integration test
        # In a real test, we'd use a test DB and verify actual DB state changes
        user_id = 1
        
        # Test would include setup of test data in DB
        
        # Execute the service methods
        # (Requires a properly set up test DB, disabled for now)
        # slot_result = service.slot_spin(user_id, db)
        # assert slot_result is not None
        
        # Validate DB state changes
        pass
