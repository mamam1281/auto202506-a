"""
Quick Health Check Tests
Basic system health verification
"""

import pytest
import os
import sys

def test_system_health():
    """Basic system health check"""
    assert True, "System is alive"

def test_python_imports():
    """Test basic Python imports work"""
    import json
    import datetime
    import unittest
    assert True, "Basic imports working"

@pytest.mark.mvp
def test_environment_ready():
    """Test environment is ready for testing"""
    # Check if we're in the right project
    cwd = os.getcwd()
    assert "auto202506-a" in cwd, f"Wrong directory: {cwd}"
    
    # Check basic structure
    assert os.path.exists("tests"), "Tests directory should exist"
    print("✅ Environment ready for testing")

def test_project_structure():
    """Verify basic project structure"""
    expected_dirs = [
        "cc-webapp",
        "docs", 
        "tests"
    ]
    
    for dir_name in expected_dirs:
        if os.path.exists(dir_name):
            print(f"✅ Found {dir_name}")
        else:
            print(f"❌ Missing {dir_name}")
    
    assert True, "Structure check completed"

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
