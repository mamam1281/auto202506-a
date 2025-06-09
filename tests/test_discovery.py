"""
Test Discovery Verification
Simple tests to ensure pytest can find and run tests
"""

import pytest
import os
import sys

def test_pytest_can_run():
    """Verify pytest can run this test"""
    assert True, "✅ Pytest is working!"

def test_file_location():
    """Verify test file location"""
    current_file = __file__
    print(f"📍 Current test file: {current_file}")
    assert "tests" in current_file
    assert current_file.endswith("test_discovery.py")

def test_working_directory():
    """Check current working directory"""
    cwd = os.getcwd()
    print(f"📁 Current working directory: {cwd}")
    assert "auto202506-a" in cwd or "2025-2" in cwd

def test_python_version():
    """Check Python version"""
    version = sys.version_info
    print(f"🐍 Python version: {version}")
    assert version >= (3, 8), f"Python too old: {version}"

@pytest.mark.mvp
def test_mvp_marker():
    """Test MVP marker works"""
    assert True, "✅ MVP marker test"

@pytest.mark.emotion  
def test_emotion_marker():
    """Test emotion marker works"""
    assert True, "✅ Emotion marker test"

class TestBasicClass:
    """Test class discovery"""
    
    def test_class_method(self):
        """Test class method discovery"""
        assert True, "✅ Class method test"

if __name__ == "__main__":
    print("🔍 Running discovery tests directly...")
    pytest.main([__file__, "-v"])
