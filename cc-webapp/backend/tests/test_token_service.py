"""Tests for token_service.py."""

import unittest
from unittest.mock import MagicMock, patch
import pytest
from sqlalchemy.orm import Session

from app.services.token_service import TokenService
from app.repositories.game_repository import GameRepository


class TestTokenService(unittest.TestCase):
    """Test case for TokenService class."""

    def setUp(self):
        """Set up test fixtures before each test method."""
        self.mock_repo = MagicMock(spec=GameRepository)
        self.mock_db = MagicMock(spec=Session)
        self.token_service = TokenService(db=self.mock_db, repository=self.mock_repo)

    def test_init_with_repository(self):
        """Test initialization with a provided repository."""
        assert self.token_service.repository == self.mock_repo
        assert self.token_service.db == self.mock_db

    def test_init_without_repository(self):
        """Test initialization without a repository creates a new one."""
        with patch('app.services.token_service.GameRepository') as mock_repo_class:
            mock_repo_instance = MagicMock()
            mock_repo_class.return_value = mock_repo_instance
            
            service = TokenService(db=self.mock_db)
            
            mock_repo_class.assert_called_once()
            assert service.repository == mock_repo_instance
            assert service.db == self.mock_db

    def test_token_key_generation(self):
        """Test the token key generation for a user."""
        user_id = 123
        expected_key = "user:123:cyber_token_balance"
        assert self.token_service._token_key(user_id) == expected_key

    def test_get_token_balance_success(self):
        """Test successful token balance retrieval."""
        self.mock_repo.get_streak.return_value = 100
        balance = self.token_service.get_token_balance(user_id=123)
        self.mock_repo.get_streak.assert_called_once_with(123)
        assert balance == 100

    def test_get_token_balance_exception(self):
        """Test token balance retrieval with exception."""
        self.mock_repo.get_streak.side_effect = Exception("Database error")
        balance = self.token_service.get_token_balance(user_id=123)
        self.mock_repo.get_streak.assert_called_once_with(123)
        assert balance == 0

    def test_add_tokens_success(self):
        """Test successful token addition."""
        self.mock_repo.get_streak.return_value = 100
        new_balance = self.token_service.add_tokens(user_id=123, amount=50)
        
        self.mock_repo.get_streak.assert_called_once_with(123)
        self.mock_repo.set_streak.assert_called_once_with(123, 150)
        assert new_balance == 150

    def test_add_tokens_exception(self):
        """Test token addition with exception."""
        self.mock_repo.get_streak.return_value = 100
        self.mock_repo.set_streak.side_effect = Exception("Database error")
        
        with patch('app.services.token_service.logger') as mock_logger:
            result = self.token_service.add_tokens(user_id=123, amount=50)
            
            self.mock_repo.get_streak.assert_called_once_with(123)
            self.mock_repo.set_streak.assert_called_once_with(123, 150)
            mock_logger.error.assert_called_once()
            assert "Failed to add tokens" in mock_logger.error.call_args[0][0]
            assert result == 100  # Should return current_balance in case of error

    def test_deduct_tokens_success(self):
        """Test successful token deduction."""
        self.mock_repo.get_streak.return_value = 100
        new_balance = self.token_service.deduct_tokens(user_id=123, amount=50)
        
        self.mock_repo.get_streak.assert_called_once_with(123)
        self.mock_repo.set_streak.assert_called_once_with(123, 50)
        assert new_balance == 50

    def test_deduct_tokens_insufficient(self):
        """Test token deduction with insufficient tokens."""
        self.mock_repo.get_streak.return_value = 30
        
        with patch('app.services.token_service.logger') as mock_logger:
            result = self.token_service.deduct_tokens(user_id=123, amount=50)
            
            self.mock_repo.get_streak.assert_called_once_with(123)
            self.mock_repo.set_streak.assert_not_called()
            mock_logger.warning.assert_called_once()
            assert "Insufficient tokens" in mock_logger.warning.call_args[0][0]
            assert result is None

    def test_deduct_tokens_exception(self):
        """Test token deduction with exception."""
        self.mock_repo.get_streak.return_value = 100
        self.mock_repo.set_streak.side_effect = Exception("Database error")
        
        with patch('app.services.token_service.logger') as mock_logger:
            result = self.token_service.deduct_tokens(user_id=123, amount=50)
            
            self.mock_repo.get_streak.assert_called_once_with(123)
            self.mock_repo.set_streak.assert_called_once_with(123, 50)
            mock_logger.error.assert_called_once()
            assert "Failed to deduct tokens" in mock_logger.error.call_args[0][0]
            assert result is None


# Pytest-style tests for integration scenarios
@pytest.fixture
def token_service_with_mocks():
    """Fixture to create a TokenService with mocked dependencies."""
    mock_repo = MagicMock(spec=GameRepository)
    mock_db = MagicMock(spec=Session)
    service = TokenService(db=mock_db, repository=mock_repo)
    return service, mock_repo, mock_db


def test_token_service_full_flow(token_service_with_mocks):
    """Test a full flow of token operations."""
    service, mock_repo, mock_db = token_service_with_mocks
    
    # Setup initial balance
    mock_repo.get_streak.return_value = 100
    
    # Check initial balance
    balance = service.get_token_balance(user_id=123)
    assert balance == 100
    
    # Add tokens
    new_balance = service.add_tokens(user_id=123, amount=50)
    assert new_balance == 150
    
    # Update mock to reflect new balance
    mock_repo.get_streak.return_value = 150
    
    # Deduct tokens
    final_balance = service.deduct_tokens(user_id=123, amount=75)
    assert final_balance == 75


def test_token_service_error_recovery(token_service_with_mocks):
    """Test error recovery in token operations."""
    service, mock_repo, mock_db = token_service_with_mocks
    
    # First call succeeds
    mock_repo.get_streak.return_value = 100
    
    # Second call fails
    mock_repo.set_streak.side_effect = [Exception("Database error"), None]
    
    # Try to add tokens - should fail but recover
    result = service.add_tokens(user_id=123, amount=50)
    assert result == 100  # Original balance
    
    # Reset mock for next operation
    mock_repo.set_streak.side_effect = None
    
    # Try again - should succeed
    mock_repo.get_streak.return_value = 100
    result = service.add_tokens(user_id=123, amount=50)
    assert result == 150
