"""
Pytest configuration for all tests - unified location
"""

import pytest
import os
import sys
from unittest.mock import Mock, MagicMock

# Add project paths to Python path
project_root = os.path.dirname(os.path.dirname(__file__))
backend_path = os.path.join(project_root, 'cc-webapp', 'backend')

# Add paths for imports
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)
if project_root not in sys.path:
    sys.path.insert(0, project_root)

# Set test environment variables
os.environ.update({
    "TESTING": "true",
    "DATABASE_URL": "sqlite:///./test.db",
    "REDIS_URL": "redis://localhost:6379/1",
    "LOG_LEVEL": "DEBUG",
    "SECRET_KEY": "test-secret-key",
    "JWT_SECRET": "test-jwt-secret"
})

# Configure pytest markers
def pytest_configure(config):
    """Configure pytest markers"""
    markers = [
        "mvp: MVP level tests",
        "emotion: Emotion analysis tests", 
        "game: Game service tests",
        "auth: Authentication tests",
        "integration: Integration tests",
        "slow: Slow running tests",
        "unit: Unit tests"
    ]
    
    for marker in markers:
        config.addinivalue_line("markers", marker)

@pytest.fixture(scope="session", autouse=True)
def setup_test_environment():
    """Setup test environment"""
    print(f"\n🔧 Test environment setup")
    print(f"📁 Project root: {project_root}")
    print(f"📁 Backend path: {backend_path}")
    print(f"🐍 Python path entries: {len(sys.path)}")
    yield
    print(f"\n✅ Test environment cleanup")

@pytest.fixture
def sample_user():
    """Sample user data for tests"""
    return {
        "user_id": 1,
        "nickname": "test_user",
        "tokens": 100,
        "segment": "Medium",
        "invite_code": "ABC123"
    }

@pytest.fixture
def mock_dependencies():
    """Mock missing dependencies"""
    # Mock modules that might not exist
    mock_modules = [
        'app.database',
        'app.services.auth_service',
        'app.services.game_service',
        'app.main'
    ]
    
    for module_name in mock_modules:
        if module_name not in sys.modules:
            sys.modules[module_name] = MagicMock()
    
    return True
