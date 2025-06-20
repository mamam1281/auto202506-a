"""Tests for AdultContentService."""

import pytest
from unittest.mock import MagicMock, AsyncMock
from datetime import datetime

from app.services.adult_content_service import (
    AdultContentService,
    ContentStageEnum,
    STAGE_DETAILS,
    USER_SEGMENT_ACCESS_ORDER
)
from app.models import UserSegment, AdultContent


@pytest.fixture
def mock_db():
    return MagicMock()


@pytest.fixture  
def mock_token_service():
    return MagicMock()


@pytest.fixture
def mock_age_verification_service():
    service = MagicMock()
    service.is_user_age_verified = AsyncMock()
    return service


@pytest.fixture
def mock_reward_service():
    return MagicMock()


@pytest.fixture
def adult_content_service(mock_db, mock_token_service, mock_age_verification_service, mock_reward_service):
    return AdultContentService(
        db=mock_db,
        token_service=mock_token_service,
        age_verification_service=mock_age_verification_service,
        reward_service=mock_reward_service
    )


class TestAdultContentService:
    """Test cases for AdultContentService."""

    @pytest.mark.asyncio
    async def test_get_content_access_level_basic(self, adult_content_service, mock_age_verification_service, mock_db):
        """Test basic content access level."""
        # Mock age verification to return True
        mock_age_verification_service.is_user_age_verified.return_value = True
        
        # Mock user segment query
        mock_segment = UserSegment(user_id=1, rfm_group="Medium")
        mock_db.query().filter().first.return_value = mock_segment
        
        result = adult_content_service.get_content_access_level(user_id=1, content_id=101)
        
        # Since Medium maps to PREMIUM level, expect ContentStageEnum.BASIC
        assert result == ContentStageEnum.BASIC

    def test_stage_details_has_order(self):
        """Test that STAGE_DETAILS contains 'order' key."""
        for stage, details in STAGE_DETAILS.items():
            assert "order" in details
            assert isinstance(details["order"], int)

    def test_user_segment_access_order_keys(self):
        """Test that USER_SEGMENT_ACCESS_ORDER has required keys."""
        required_keys = ["Low", "Medium", "High", "PREMIUM"]  # PREMIUM not Premium
        for key in required_keys:
            assert key in USER_SEGMENT_ACCESS_ORDER

    def test_get_gallery_for_user_stub(self, adult_content_service):
        """Test gallery stub method."""
        result = adult_content_service.get_gallery_for_user(user_id=1)
        assert result == []

    def test_get_user_unlock_history_stub(self, adult_content_service):
        """Test unlock history stub method."""
        result = adult_content_service.get_user_unlock_history(user_id=1)
        assert result == []
