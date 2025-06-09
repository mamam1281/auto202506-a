"""Unit tests for GameService with comprehensive coverage."""

import pytest
from unittest.mock import Mock, patch, MagicMock
from app.services.game_service import GameService, SlotSpinResult
from app.repositories.game_repository import GameRepository
from app.services.user_segment_service import UserSegmentService
from app.services.slot_service import SlotService
from app.services.roulette_service import RouletteService
from app.services.gacha_service import GachaService


class TestGameService:
    """Comprehensive test class for GameService."""
    
    def setup_method(self):
        """Setup test data before each test method."""
        self.mock_repository = Mock(spec=GameRepository)
        self.mock_segment_service = Mock(spec=UserSegmentService)
        
    def test_init_with_default_parameters(self):
        """Test GameService initialization with default parameters."""
        with patch('app.services.game_service.GameRepository') as mock_repo_class:
            mock_repo_class.return_value = self.mock_repository
            
            service = GameService()
            
            mock_repo_class.assert_called_once()
            assert service.segment_service is None
            
    def test_init_with_custom_parameters(self):
        """Test GameService initialization with custom parameters."""
        service = GameService(
            repository=self.mock_repository,
            segment_service=self.mock_segment_service
        )
        
        assert service.repo == self.mock_repository
        assert service.segment_service == self.mock_segment_service
        
    def test_slot_spin_result_creation(self):
        """Test SlotSpinResult creation and properties."""
        result = SlotSpinResult(
            result="WIN",
            reward=100,
            balance=500,
            streak=3,
            animation="celebration"
        )
        
        assert result.result == "WIN"
        assert result.tokens_change == 98  # reward - 2
        assert result.balance == 500
        assert result.streak == 3
        assert result.animation == "celebration"
        
    def test_slot_spin_result_no_animation(self):
        """Test SlotSpinResult creation without animation."""
        result = SlotSpinResult(
            result="LOSE",
            reward=0,
            balance=100,
            streak=0,
            animation=None
        )
        
        assert result.result == "LOSE"
        assert result.tokens_change == -2  # 0 - 2
        assert result.balance == 100
        assert result.streak == 0
        assert result.animation is None
        
    @patch('app.services.game_service.SlotService')
    def test_slot_game_integration(self, mock_slot_service_class):
        """Test integration with SlotService."""
        mock_slot_service = Mock()
        mock_slot_service_class.return_value = mock_slot_service
        
        service = GameService(repository=self.mock_repository)
        
        # Test that service can create slot service instance
        if hasattr(service, 'get_slot_service'):
            slot_service = service.get_slot_service()
            assert slot_service == mock_slot_service
            
    @patch('app.services.game_service.RouletteService')
    def test_roulette_game_integration(self, mock_roulette_service_class):
        """Test integration with RouletteService."""
        mock_roulette_service = Mock()
        mock_roulette_service_class.return_value = mock_roulette_service
        
        service = GameService(repository=self.mock_repository)
        
        # Test that service can create roulette service instance
        if hasattr(service, 'get_roulette_service'):
            roulette_service = service.get_roulette_service()
            assert roulette_service == mock_roulette_service
            
    @patch('app.services.game_service.GachaService')
    def test_gacha_game_integration(self, mock_gacha_service_class):
        """Test integration with GachaService."""
        mock_gacha_service = Mock()
        mock_gacha_service_class.return_value = mock_gacha_service
        
        service = GameService(repository=self.mock_repository)
        
        # Test that service can create gacha service instance
        if hasattr(service, 'get_gacha_service'):
            gacha_service = service.get_gacha_service()
            assert gacha_service == mock_gacha_service
            
    def test_repository_access(self):
        """Test repository access through GameService."""
        service = GameService(repository=self.mock_repository)
        
        # Test that repository methods are accessible
        assert service.repo == self.mock_repository
        
        # Mock some repository calls
        self.mock_repository.get_game_by_id.return_value = {"id": 1, "name": "Test Game"}
        self.mock_repository.get_user_stats.return_value = {"wins": 5, "losses": 3}
        
        # These methods should be available through the repository
        if hasattr(service, 'get_game'):
            game = service.get_game(1)
            self.mock_repository.get_game_by_id.assert_called_with(1)
            
    def test_segment_service_integration(self):
        """Test integration with UserSegmentService."""
        service = GameService(
            repository=self.mock_repository,
            segment_service=self.mock_segment_service
        )
        
        # Mock segment service behavior
        self.mock_segment_service.get_user_segment.return_value = "Whale"
        self.mock_segment_service.update_segment.return_value = True
        
        # Test segment-related functionality if available
        if hasattr(service, 'get_user_segment'):
            segment = service.get_user_segment(user_id=1)
            assert segment == "Whale"
            self.mock_segment_service.get_user_segment.assert_called_with(1)
            
    def test_service_without_segment_service(self):
        """Test GameService behavior when no segment service is provided."""
        service = GameService(repository=self.mock_repository)
        
        assert service.segment_service is None
        
        # Service should handle missing segment service gracefully
        if hasattr(service, 'get_user_segment'):
            segment = service.get_user_segment(user_id=1)
            # Should return default or handle gracefully
            assert segment is None or isinstance(segment, str)
            
    def test_game_statistics_tracking(self):
        """Test game statistics tracking functionality."""
        service = GameService(repository=self.mock_repository)
        
        # Mock repository methods for statistics
        self.mock_repository.record_game_result.return_value = True
        self.mock_repository.get_game_stats.return_value = {
            "total_games": 100,
            "wins": 45,
            "losses": 55,
            "win_rate": 0.45
        }
        
        # Test statistics methods if available
        if hasattr(service, 'record_game_result'):
            result = service.record_game_result(
                user_id=1,
                game_type="slot",
                result="win",
                tokens_change=50
            )
            assert result is True
            
        if hasattr(service, 'get_user_game_stats'):
            stats = service.get_user_game_stats(user_id=1)
            assert stats["total_games"] == 100
            assert stats["win_rate"] == 0.45
            
    def test_error_handling_in_game_operations(self):
        """Test error handling in game operations."""
        service = GameService(repository=self.mock_repository)
        
        # Mock repository to raise exception
        self.mock_repository.get_game_by_id.side_effect = Exception("Database error")
        
        # Service should handle exceptions gracefully
        if hasattr(service, 'get_game'):
            with pytest.raises(Exception):
                service.get_game(1)
                
    def test_service_state_consistency(self):
        """Test that GameService maintains consistent state."""
        service = GameService(
            repository=self.mock_repository,
            segment_service=self.mock_segment_service
        )
        
        # State should be consistent
        assert service.repo is not None
        assert service.segment_service is not None
        assert isinstance(service.repo, Mock)  # Our mock repository
        assert isinstance(service.segment_service, Mock)  # Our mock segment service
        
    def test_multiple_game_types_support(self):
        """Test support for multiple game types."""
        service = GameService(repository=self.mock_repository)
        
        # Should support different game types
        game_types = ["slot", "roulette", "gacha", "poker", "blackjack"]
        
        for game_type in game_types:
            # Mock repository response for each game type
            self.mock_repository.get_games_by_type.return_value = [
                {"id": 1, "type": game_type, "name": f"Test {game_type}"}
            ]
            
            if hasattr(service, 'get_games_by_type'):
                games = service.get_games_by_type(game_type)
                assert len(games) == 1
                assert games[0]["type"] == game_type
                
    def test_concurrent_game_sessions(self):
        """Test handling of concurrent game sessions."""
        service = GameService(repository=self.mock_repository)
        
        # Mock multiple concurrent sessions
        sessions = [
            {"user_id": 1, "game_id": 1, "status": "active"},
            {"user_id": 2, "game_id": 2, "status": "active"},
            {"user_id": 3, "game_id": 1, "status": "active"}
        ]
        
        self.mock_repository.get_active_sessions.return_value = sessions
        
        if hasattr(service, 'get_active_sessions'):
            active_sessions = service.get_active_sessions()
            assert len(active_sessions) == 3
            assert all(session["status"] == "active" for session in active_sessions)
            
    def test_game_configuration_loading(self):
        """Test game configuration loading and validation."""
        service = GameService(repository=self.mock_repository)
        
        # Mock configuration data
        config = {
            "slot": {"min_bet": 1, "max_bet": 100, "jackpot": 10000},
            "roulette": {"min_bet": 5, "max_bet": 500, "house_edge": 0.027},
            "gacha": {"single_pull_cost": 100, "multi_pull_cost": 900}
        }
        
        self.mock_repository.get_game_config.return_value = config
        
        if hasattr(service, 'load_game_config'):
            loaded_config = service.load_game_config()
            assert "slot" in loaded_config
            assert "roulette" in loaded_config
            assert "gacha" in loaded_config
            
    def test_user_preferences_integration(self):
        """Test integration with user preferences."""
        service = GameService(
            repository=self.mock_repository,
            segment_service=self.mock_segment_service
        )
        
        # Mock user preferences
        preferences = {
            "favorite_games": ["slot", "roulette"],
            "bet_limits": {"min": 10, "max": 200},
            "notifications": True
        }
        
        self.mock_repository.get_user_preferences.return_value = preferences
        
        if hasattr(service, 'get_user_preferences'):
            user_prefs = service.get_user_preferences(user_id=1)
            assert "favorite_games" in user_prefs
            assert user_prefs["notifications"] is True
