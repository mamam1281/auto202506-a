"""Tests for reward_utils module."""

import pytest
from unittest.mock import MagicMock, patch
from sqlalchemy.orm import Session
from datetime import datetime

from app.utils.reward_utils import (
    _check_eligibility_for_next_unlock_stage,
    calculate_daily_streak_reward,
    spin_gacha
)


@pytest.fixture
def mock_db():
    """Mock database session."""
    return MagicMock(spec=Session)


def test_check_eligibility_for_next_unlock_stage_eligible(mock_db):
    """Test eligibility check when user is eligible for next stage."""
    # Mock user with next stage available
    mock_unlock_query = MagicMock()
    mock_unlock_query.filter.return_value.order_by.return_value.first.return_value = MagicMock(stage=2)
    
    mock_content_query = MagicMock()
    mock_content_query.filter.return_value.first.return_value = MagicMock()  # Content exists
    
    mock_db.query.side_effect = [mock_unlock_query, mock_content_query]
    
    result = _check_eligibility_for_next_unlock_stage(123, mock_db)
    assert result == 3  # Next stage should be 3


def test_check_eligibility_for_next_unlock_stage_not_eligible(mock_db):
    """Test eligibility check when user is not eligible."""
    # Mock user with max stage reached
    mock_unlock_query = MagicMock()
    mock_unlock_query.filter.return_value.order_by.return_value.first.return_value = MagicMock(stage=3)
    
    mock_db.query.return_value = mock_unlock_query
    
    result = _check_eligibility_for_next_unlock_stage(123, mock_db)
    assert result is None


def test_calculate_daily_streak_reward_success(mock_db):
    """Test successful daily streak reward calculation."""
    # Mock user with streak count
    mock_user = MagicMock()
    mock_user.current_streak = 5
    
    mock_query = MagicMock()
    mock_query.filter.return_value.first.return_value = mock_user
    mock_db.query.return_value = mock_query
    
    with patch('app.utils.reward_utils.models') as mock_models:
        mock_models.User = MagicMock()
        mock_models.UserReward = MagicMock()
        
        result = calculate_daily_streak_reward(123, 5, mock_db)
        
        assert result is not None
        assert isinstance(result, dict)


def test_calculate_daily_streak_reward_no_user(mock_db):
    """Test daily streak reward when user doesn't exist."""
    mock_query = MagicMock()
    mock_query.filter.return_value.first.return_value = None
    mock_db.query.return_value = mock_query
    
    result = calculate_daily_streak_reward(123, 5, mock_db)
    assert result is None


def test_spin_gacha_success(mock_db):
    """Test successful gacha spin."""
    # Mock user with sufficient tokens
    mock_user = MagicMock()
    mock_user.tokens = 100
    
    mock_query = MagicMock()
    mock_query.filter.return_value.first.return_value = mock_user
    mock_db.query.return_value = mock_query
    
    with patch('app.utils.reward_utils.models') as mock_models:
        mock_models.User = MagicMock()
        mock_models.UserReward = MagicMock()
        
        with patch('app.utils.reward_utils.random.choices') as mock_choices:
            mock_choices.return_value = ["common_item"]
            
            result = spin_gacha(123, mock_db)
            
            assert isinstance(result, dict)
            assert "items" in result
            assert "tokens_spent" in result


def test_spin_gacha_insufficient_tokens(mock_db):
    """Test gacha spin with insufficient tokens."""
    # Mock user with insufficient tokens
    mock_user = MagicMock()
    mock_user.tokens = 5  # Less than required
    
    mock_query = MagicMock()
    mock_query.filter.return_value.first.return_value = mock_user
    mock_db.query.return_value = mock_query
    
    with patch('app.utils.reward_utils.models') as mock_models:
        mock_models.User = MagicMock()
        
        result = spin_gacha(123, mock_db)
        
        assert isinstance(result, dict)
        assert "error" in result


@pytest.mark.parametrize("streak_count,expected_bonus", [
    (1, True),
    (7, True), 
    (30, True),
    (0, False),
])
def test_calculate_daily_streak_reward_parametrized(mock_db, streak_count, expected_bonus):
    """Parametrized test for daily streak reward calculation."""
    mock_user = MagicMock()
    mock_user.current_streak = streak_count
    
    mock_query = MagicMock()
    mock_query.filter.return_value.first.return_value = mock_user if streak_count > 0 else None
    mock_db.query.return_value = mock_query
    
    with patch('app.utils.reward_utils.models') as mock_models:
        mock_models.User = MagicMock()
        mock_models.UserReward = MagicMock()
        
        result = calculate_daily_streak_reward(123, streak_count, mock_db)
        
        if expected_bonus:
            assert result is not None
        else:
            assert result is None


def test_spin_gacha_exception_handling(mock_db):
    """Test exception handling in gacha spin."""
    mock_db.query.side_effect = Exception("Database error")
    
    result = spin_gacha(123, mock_db)
    assert isinstance(result, dict)
    assert "error" in result
