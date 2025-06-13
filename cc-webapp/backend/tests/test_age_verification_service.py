import unittest
from unittest.mock import MagicMock, patch
from datetime import datetime

from app.services.age_verification_service import AgeVerificationService
from app.models import User, AgeVerificationRecord
from app.schemas import AgeVerificationRequest # Assuming this is the correct schema name

class TestAgeVerificationService(unittest.TestCase):

    def setUp(self):
        self.mock_db_session = MagicMock()
        self.age_verification_service = AgeVerificationService(db=self.mock_db_session)

        # Mock User for successful user query
        self.mock_user = User(id=1, email="test@example.com")        # Default verification request
        self.verification_data_json = {"document_id": "12345", "country": "US"}
        self.verification_request = AgeVerificationRequest(
            user_id=1,
            verification_method="document",
            document_type="passport"
        )

    def test_record_verification_user_exists_document_method(self):
        self.mock_db_session.query(User).filter(User.id == 1).first.return_value = self.mock_user

        # Patch datetime.utcnow
        mock_now = datetime(2023, 1, 1, 12, 0, 0)
        with patch('app.services.age_verification_service.datetime') as mock_datetime:
            mock_datetime.utcnow.return_value = mock_now

            created_record = self.age_verification_service.record_verification(
                user_id=1,
                verification_request=self.verification_request
            )

            self.assertIsNotNone(created_record)
            self.mock_db_session.add.assert_called_once()
            self.mock_db_session.commit.assert_called_once()
            self.mock_db_session.refresh.assert_called_once_with(created_record)

            # Check that the object passed to add is an AgeVerificationRecord
            added_object = self.mock_db_session.add.call_args[0][0]
            self.assertIsInstance(added_object, AgeVerificationRecord)
            self.assertEqual(added_object.user_id, 1)
            self.assertEqual(added_object.verification_method, "document")
            self.assertEqual(added_object.verification_data, self.verification_data_json)
            self.assertEqual(added_object.verified_at, mock_now)
            self.assertFalse(added_object.is_valid) # Document method sets is_valid to False initially

    def test_record_verification_user_exists_phone_method(self):
        self.mock_db_session.query(User).filter(User.id == 1).first.return_value = self.mock_user
        phone_verification_request = AgeVerificationRequest(
            user_id=1,
            verification_method="phone",
            phone_number="+1234567890"
        )

        mock_now = datetime(2023, 1, 1, 12, 0, 0)
        with patch('app.services.age_verification_service.datetime') as mock_datetime:
            mock_datetime.utcnow.return_value = mock_now
            created_record = self.age_verification_service.record_verification(
                user_id=1,
                verification_request=phone_verification_request
            )
            self.assertIsNotNone(created_record)
            added_object = self.mock_db_session.add.call_args[0][0]
            self.assertTrue(added_object.is_valid) # Phone method sets is_valid to True

    def test_record_verification_user_not_found(self):
        self.mock_db_session.query(User).filter(User.id == 999).first.return_value = None

        result = self.age_verification_service.record_verification(
            user_id=999,
            verification_request=self.verification_request
        )
        self.assertIsNone(result)
        self.mock_db_session.add.assert_not_called()

    def test_get_verification_status_user_has_valid_record(self):
        mock_record = AgeVerificationRecord(user_id=1, is_valid=True, verified_at=datetime.utcnow())
        self.mock_db_session.query(AgeVerificationRecord) \
            .filter(AgeVerificationRecord.user_id == 1, AgeVerificationRecord.is_valid == True) \
            .order_by(AgeVerificationRecord.verified_at.desc()) \
            .first.return_value = mock_record

        status = self.age_verification_service.get_verification_status(user_id=1)
        self.assertEqual(status, mock_record)

    def test_get_verification_status_user_no_valid_record(self):
        self.mock_db_session.query(AgeVerificationRecord) \
            .filter(AgeVerificationRecord.user_id == 1, AgeVerificationRecord.is_valid == True) \
            .order_by(AgeVerificationRecord.verified_at.desc()) \
            .first.return_value = None

        status = self.age_verification_service.get_verification_status(user_id=1)
        self.assertIsNone(status)

    def test_is_user_age_verified_true(self):
        # Mock the get_verification_status to return a record
        with patch.object(self.age_verification_service, 'get_verification_status', return_value=MagicMock(spec=AgeVerificationRecord)) as mock_get_status:
            result = self.age_verification_service.is_user_age_verified(user_id=1)
            self.assertTrue(result)
            mock_get_status.assert_called_once_with(1)

    def test_is_user_age_verified_false(self):
        # Mock the get_verification_status to return None
        with patch.object(self.age_verification_service, 'get_verification_status', return_value=None) as mock_get_status:
            result = self.age_verification_service.is_user_age_verified(user_id=1)
            self.assertFalse(result)
            mock_get_status.assert_called_once_with(1)

if __name__ == '__main__':
    unittest.main(argv=['first-arg-is-ignored'], exit=False) # Added for better execution in some envs
