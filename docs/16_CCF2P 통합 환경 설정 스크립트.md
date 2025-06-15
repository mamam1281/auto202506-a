#!/usr/bin/env bash
# filepath: run.sh (업데이트됨)
# Casino-Club F2P 프로젝트 환경 설정

set -e

echo "🎰 Casino-Club F2P 환경 설정 시작..."

WORKDIR="${WORKDIR:-$(pwd)}"
cd "$WORKDIR"

# === 백엔드 환경 설정 (개선됨) ===
echo "🔧 백엔드 환경 설정..."
cd "$WORKDIR/cc-webapp/backend"

if [ ! -d "venv" ]; then
    python3 -m venv venv || python -m venv venv
fi

source venv/bin/activate
pip install --upgrade pip

if [ ! -f "requirements.txt" ]; then
cat > requirements.txt << 'EOF'
# 🆕 필수 백엔드 의존성 (FastAPI 누락 해결)
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
aiosqlite==0.19.0
pydantic==2.5.0
python-multipart==0.0.6
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
pytest==7.4.3
pytest-asyncio==0.21.1
httpx==0.25.2

# 🆕 추가 개발 도구
black==23.11.0
isort==5.12.0
flake8==6.1.0
mypy==1.7.1
coverage==7.3.2
EOF
fi

pip install -r requirements.txt

if [ ! -f ".env" ]; then
cat > .env << EOF
DATABASE_URL=sqlite:///./app.db
API_HOST=0.0.0.0
API_PORT=8000
SECRET_KEY=casino-club-f2p-secret-key-2025
CORS_ORIGINS=["http://localhost:3000"]

# 🆕 테스트 환경변수
TEST_DATABASE_URL=sqlite:///./test.db
TEST_MODE=false
DEBUG=true
LOG_LEVEL=DEBUG

# 🆕 게임 설정
SLOT_PAYOUT_RATE=0.95
ROULETTE_HOUSE_EDGE=0.027
INITIAL_TOKENS=1000
MAX_BET_AMOUNT=100
EOF
fi

# === 프론트엔드 환경 설정 (개선됨) ===
echo "🎨 프론트엔드 환경 설정..."
cd "$WORKDIR/cc-webapp/frontend"

if [ ! -f "package.json" ]; then
cat > package.json << 'EOF'
{
  "name": "cc-webapp-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start -p 3000",
    "lint": "next lint",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "dependencies": {
    "next": "^14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.8",
    "tailwindcss": "^3.3.6",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/user-event": "^14.5.1",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.0.4"
  }
}
EOF
npm install
else
    # 🆕 누락된 의존성 추가 설치
    npm install next@^14.0.4 tailwindcss autoprefixer postcss
    npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom
fi

# 🆕 Next.js 설정 파일
if [ ! -f "next.config.js" ]; then
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/:path*',
      },
    ]
  },
}

module.exports = nextConfig
EOF
fi

# 🆕 Tailwind CSS 설정
if [ ! -f "tailwind.config.js" ]; then
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'casino-gold': '#FFD700',
        'casino-red': '#DC2626',
        'casino-green': '#059669',
      }
    },
  },
  plugins: [],
}
EOF
fi

# 🆕 PostCSS 설정
if [ ! -f "postcss.config.js" ]; then
cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF
fi

# 🆕 Jest 설정
if [ ! -f "jest.config.js" ]; then
cat > jest.config.js << 'EOF'
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
}

module.exports = createJestConfig(customJestConfig)
EOF
fi

if [ ! -f "jest.setup.js" ]; then
cat > jest.setup.js << 'EOF'
import '@testing-library/jest-dom'
EOF
fi

# 🆕 글로벌 CSS (Tailwind 포함)
mkdir -p app
if [ ! -f "app/globals.css" ]; then
cat > app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 🎰 Casino 테마 CSS */
.casino-dark {
  @apply bg-gray-900 text-white;
}

.casino-button {
  @apply bg-gradient-to-r from-casino-gold to-yellow-600 text-black font-bold py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-200;
}

.slot-reel {
  @apply border-2 border-casino-gold bg-gray-800 rounded-lg;
}

.token-display {
  @apply bg-gradient-to-r from-casino-gold to-yellow-500 text-black font-bold px-4 py-2 rounded-full;
}
EOF
fi

# === 개발 도구 설정 ===
echo "🔧 개발 도구 설정..."

# 🆕 백엔드 테스트 스크립트
cd "$WORKDIR/cc-webapp/backend"
if [ ! -f "test_runner.py" ]; then
cat > test_runner.py << 'EOF'
#!/usr/bin/env python3
"""
백엔드 테스트 러너
Usage: python test_runner.py
"""
import subprocess
import sys

def run_tests():
    print("🧪 백엔드 테스트 시작...")
    
    try:
        # FastAPI 모듈 확인
        import fastapi
        print(f"✅ FastAPI {fastapi.__version__} 설치됨")
    except ImportError:
        print("❌ FastAPI 모듈 누락 - pip install fastapi 실행")
        return False
    
    # pytest 실행
    result = subprocess.run([
        sys.executable, "-m", "pytest", 
        "-v", "--tb=short", "--color=yes"
    ], capture_output=False)
    
    return result.returncode == 0

if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)
EOF
chmod +x test_runner.py
fi

# === 프로젝트 검증 ===
echo "🔍 프로젝트 구조 검증..."

# 백엔드 구조 확인
cd "$WORKDIR/cc-webapp/backend"
python -c "
try:
    import fastapi, uvicorn, sqlalchemy
    print('✅ 백엔드 핵심 모듈 정상')
except ImportError as e:
    print(f'❌ 백엔드 모듈 오류: {e}')
"

# 프론트엔드 구조 확인
cd "$WORKDIR/cc-webapp/frontend"
if command -v node >/dev/null 2>&1; then
    echo "✅ Node.js 설치됨: $(node --version)"
    if [ -f "package.json" ]; then
        echo "✅ package.json 존재"
        npm list --depth=0 | head -10
    fi
else
    echo "❌ Node.js 미설치"
fi

# === 서버 시작 스크립트 개선 ===
cd "$WORKDIR"
if [ ! -f "start_servers.sh" ]; then
cat > start_servers.sh << 'EOF'
#!/bin/bash
# 🚀 개발 서버 시작 스크립트

echo "🎰 CC-Webapp 개발 서버 시작..."

# 백엔드 시작
echo "🔧 백엔드 시작 (포트 8000)..."
cd cc-webapp/backend
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# 프론트엔드 시작
echo "🎨 프론트엔드 시작 (포트 3000)..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "✅ 서버 시작 완료!"
echo "📱 프론트엔드: http://localhost:3000"
echo "🔧 백엔드: http://localhost:8000"
echo "📋 API 문서: http://localhost:8000/docs"

# 종료 핸들러
trap 'kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo "🛑 서버 종료됨"' INT TERM

wait
EOF
chmod +x start_servers.sh
fi

echo "✅ 환경 설정 완료!"
echo "🚀 서버 시작: ./start_servers.sh"
echo "📱 프론트엔드: http://localhost:3000"
echo "🔧 백엔드: http://localhost:8000"