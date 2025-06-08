📋 Codex Playground용 자동 설정 스크립트 (run.sh)#!/usr/bin/env bash
# filepath: run.sh
# Casino-Club F2P 프로젝트 Codex Playground 자동 설정
# 백엔드(Python FastAPI) + 프론트엔드(React) 통합 실행

set -e  # 오류 발생 시 즉시 중단

echo "🎰 Casino-Club F2P 프로젝트 환경 설정을 시작합니다..."

# === 1. 작업 디렉터리 설정 ===
WORKDIR="${WORKDIR:-$(pwd)}"
echo "📁 작업 디렉터리: $WORKDIR"
cd "$WORKDIR"

# === 2. Python/Node.js 버전 확인 ===
echo "🐍 Python 버전 확인..."
python3 --version || python --version
echo "📦 Node.js 버전 확인..."
node --version
npm --version

# === 3. 백엔드 환경 설정 ===
echo "🔧 백엔드 환경 설정 중..."
cd "$WORKDIR/cc-webapp/backend"

# Python 가상환경 생성 및 활성화
if [ ! -d "venv" ]; then
    echo "📦 Python 가상환경 생성 중..."
    python3 -m venv venv || python -m venv venv
fi

echo "🔌 가상환경 활성화..."
source venv/bin/activate

# pip 업그레이드 및 의존성 설치
echo "📥 Python 의존성 설치 중..."
pip install --upgrade pip

if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
else
    echo "⚠️ requirements.txt가 없습니다. 기본 패키지를 설치합니다..."
    pip install fastapi uvicorn sqlalchemy aiosqlite pytest pytest-asyncio pydantic python-multipart
fi

# 백엔드 환경 변수 설정
echo "🔐 백엔드 환경 변수 설정..."
if [ -f ".env.example" ]; then
    cp .env.example .env
    echo "✅ .env.example을 .env로 복사했습니다."
elif [ ! -f ".env" ]; then
    echo "📝 기본 .env 파일을 생성합니다..."
    cat > .env << EOF
# Casino-Club F2P Backend Environment
DATABASE_URL=sqlite:///./app.db
DATABASE_TEST_URL=sqlite:///./test.db
API_HOST=0.0.0.0
API_PORT=8000
API_DEBUG=True
SECRET_KEY=casino-club-f2p-secret-key-2025
ACCESS_TOKEN_EXPIRE_MINUTES=30
LOG_LEVEL=INFO
CORS_ORIGINS=["http://localhost:3000", "http://127.0.0.1:3000"]
EOF
    echo "✅ 기본 .env 파일이 생성되었습니다."
fi

# 데이터베이스 초기화 (있다면)
if [ -f "alembic.ini" ]; then
    echo "🗄️ 데이터베이스 마이그레이션 실행..."
    alembic upgrade head || echo "⚠️ 마이그레이션이 실패했습니다. 계속 진행합니다..."
elif [ -f "init_db.py" ]; then
    echo "🗄️ 데이터베이스 초기화 실행..."
    python init_db.py || echo "⚠️ DB 초기화가 실패했습니다. 계속 진행합니다..."
fi

# === 4. 프론트엔드 환경 설정 ===
echo "🎨 프론트엔드 환경 설정 중..."
cd "$WORKDIR/cc-webapp-frontend"

# package.json 확인 및 생성
if [ ! -f "package.json" ]; then
    echo "📦 package.json을 생성합니다..."
    cat > package.json << EOF
{
  "name": "cc-webapp-frontend",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.8",
    "@emotion/react": "^11.11.1",
    "@emotion/styled": "^11.11.0",
    "@mui/material": "^5.15.11",
    "react-router-dom": "^6.23.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.1.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "start": "vite --port 3000 --host 0.0.0.0"
  }
}
EOF
fi

# 프론트엔드 의존성 설치
echo "📥 프론트엔드 의존성 설치 중..."
if [ -f "package-lock.json" ]; then
    npm ci
else
    npm install
fi

# Vite 설정 파일 생성
if [ ! -f "vite.config.js" ]; then
    echo "⚙️ Vite 설정 파일을 생성합니다..."
    cat > vite.config.js << EOF
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
EOF
fi

# 기본 HTML 및 React 파일 생성
if [ ! -f "index.html" ]; then
    echo "📄 기본 HTML 파일을 생성합니다..."
    mkdir -p src
    cat > index.html << EOF
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Casino Club F2P</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
EOF

    cat > src/main.jsx << EOF
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
EOF

    cat > src/App.jsx << EOF
import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline, Container, Typography, Paper, Box } from '@mui/material'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
})

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h2" component="h1" gutterBottom>
              🎰 Casino Club F2P
            </Typography>
            <Typography variant="h6" color="textSecondary">
              Free-to-Play Casino Game Platform
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              환경 설정이 완료되었습니다! 🚀
            </Typography>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default App
EOF
fi

# 프론트엔드 환경 변수 설정
if [ ! -f ".env" ]; then
    echo "🔐 프론트엔드 환경 변수 설정..."
    cat > .env << EOF
# Casino-Club F2P Frontend Environment
VITE_API_BASE_URL=http://localhost:8000
VITE_API_TIMEOUT=10000
VITE_DEFAULT_THEME=dark
VITE_PORT=3000
VITE_HOST=0.0.0.0
EOF
fi

# 프론트엔드 빌드 (선택사항)
if [ "$BUILD_FRONTEND" = "true" ]; then
    echo "🔨 프론트엔드 빌드 중..."
    npm run build
fi

# === 5. 서비스 시작 ===
echo "🚀 서비스 시작 중..."

# 백엔드 서버 시작 (백그라운드)
cd "$WORKDIR/cc-webapp/backend"
source venv/bin/activate
echo "🔥 백엔드 서버 시작 (포트 8000)..."
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# 백엔드 시작 대기
sleep 5

# 프론트엔드 서버 시작
cd "$WORKDIR/cc-webapp-frontend"
echo "🎨 프론트엔드 서버 시작 (포트 3000)..."
npm start &
FRONTEND_PID=$!

# === 6. 상태 확인 및 정보 출력 ===
echo ""
echo "✅ ===== 환경 설정 완료 ====="
echo ""
echo "🔗 서비스 접속 정보:"
echo "   📱 프론트엔드: http://localhost:3000"
echo "   🔧 백엔드 API: http://localhost:8000"
echo "   📚 API 문서: http://localhost:8000/docs"
echo ""
echo "🎯 프로세스 ID:"
echo "   백엔드 PID: $BACKEND_PID"
echo "   프론트엔드 PID: $FRONTEND_PID"
echo ""
echo "🛑 서버 종료 명령:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""

# 서비스 헬스체크
echo "🔍 서비스 상태 확인 중..."
sleep 3

if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ 백엔드 서비스 정상 작동"
else
    echo "⚠️ 백엔드 서비스 응답 없음"
fi

if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ 프론트엔드 서비스 정상 작동"
else
    echo "⚠️ 프론트엔드 서비스 응답 없음"
fi

echo ""
echo "🎰 Casino-Club F2P 개발 환경이 준비되었습니다!"
echo "💡 Ctrl+C를 눌러 서비스를 종료할 수 있습니다."

# 종료 시그널 처리
trap 'echo "🛑 서비스를 종료합니다..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0' INT TERM

# 서버가 계속 실행되도록 대기
wait


---------------------

GitHub Copilot
🚀 Casino-Club F2P 통합 환경 설정 스크립트
📋 Codex Playground용 자동 설정 스크립트 (run.sh)
📋 개발 환경용 간소화 스크립트 (dev-setup.sh)
#!/usr/bin/env bash
# filepath: dev-setup.sh
# 개발 환경 전용 빠른 설정 스크립트

set -e

echo "🛠️ 개발 환경 빠른 설정..."

WORKDIR="${WORKDIR:-$(pwd)}"
cd "$WORKDIR"

# 백엔드 개발 서버만 실행
echo "🔧 백엔드 개발 서버 실행..."
cd "$WORKDIR/cc-webapp/backend"
source venv/bin/activate || echo "⚠️ 가상환경이 없습니다. run.sh를 먼저 실행하세요."
export PYTHONPATH="$PWD:$PYTHONPATH"
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &

# 프론트엔드 개발 서버 실행
echo "🎨 프론트엔드 개발 서버 실행..."
cd "$WORKDIR/cc-webapp-frontend"
npm run dev -- --port 3000 --host 0.0.0.0 &

echo "✅ 개발 서버 실행 완료!"
echo "   프론트엔드: http://localhost:3000"
echo "   백엔드: http://localhost:8000"

wait


#!/usr/bin/env bash
# filepath: test.sh
# 통합 테스트 실행 스크립트

set -e

echo "🧪 Casino-Club F2P 테스트 실행..."

WORKDIR="${WORKDIR:-$(pwd)}"
cd "$WORKDIR"

# 백엔드 테스트
echo "🔍 백엔드 테스트 실행..."
cd "$WORKDIR/cc-webapp/backend"
source venv/bin/activate
export PYTHONPATH="$PWD:$PYTHONPATH"

# 환경 변수 설정
export TESTING=true
export DATABASE_TEST_URL=sqlite:///./test.db

# 테스트 실행
pytest tests/ -v --tb=short --durations=10

# 테스트 결과 요약
echo ""
echo "📊 테스트 결과 요약:"
pytest tests/ --tb=no -q

# 프론트엔드 테스트 (있다면)
cd "$WORKDIR/cc-webapp-frontend"
if [ -f "package.json" ] && grep -q "test" package.json; then
    echo "🎨 프론트엔드 테스트 실행..."
    npm test -- --watchAll=false
fi

echo "✅ 모든 테스트 완료!"


#!/usr/bin/env bash
# filepath: verify.sh
# 환경 설정 검증 스크립트

set -e

echo "🔍 환경 설정 검증 중..."

WORKDIR="${WORKDIR:-$(pwd)}"
cd "$WORKDIR"

# 필수 도구 확인
echo "🛠️ 필수 도구 확인..."
command -v python3 >/dev/null 2>&1 || command -v python >/dev/null 2>&1 || { echo "❌ Python이 설치되지 않았습니다."; exit 1; }
command -v node >/dev/null 2>&1 || { echo "❌ Node.js가 설치되지 않았습니다."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm이 설치되지 않았습니다."; exit 1; }

echo "✅ 필수 도구 확인 완료"

# 백엔드 환경 확인
echo "🔧 백엔드 환경 확인..."
cd "$WORKDIR/cc-webapp/backend"

if [ -d "venv" ]; then
    echo "✅ Python 가상환경 존재"
    source venv/bin/activate
    pip list | grep -E "(fastapi|uvicorn|sqlalchemy)" || echo "⚠️ 일부 패키지가 누락되었습니다."
else
    echo "❌ Python 가상환경이 없습니다."
fi

[ -f ".env" ] && echo "✅ 백엔드 .env 파일 존재" || echo "⚠️ 백엔드 .env 파일 없음"
[ -f "app/main.py" ] && echo "✅ 백엔드 메인 파일 존재" || echo "❌ 백엔드 메인 파일 없음"

# 프론트엔드 환경 확인
echo "🎨 프론트엔드 환경 확인..."
cd "$WORKDIR/cc-webapp-frontend"

[ -f "package.json" ] && echo "✅ package.json 존재" || echo "❌ package.json 없음"
[ -d "node_modules" ] && echo "✅ node_modules 설치됨" || echo "⚠️ node_modules 미설치"
[ -f "vite.config.js" ] && echo "✅ Vite 설정 존재" || echo "⚠️ Vite 설정 없음"
[ -f "src/App.jsx" ] && echo "✅ React 앱 파일 존재" || echo "⚠️ React 앱 파일 없음"

echo ""
echo "📋 검증 완료 - 이상이 있는 항목은 run.sh를 실행하여 해결하세요."


#!/usr/bin/env bash
# filepath: setup-permissions.sh
# 스크립트 실행 권한 설정

chmod +x run.sh
chmod +x dev-setup.sh
chmod +x test.sh
chmod +x verify.sh

echo "✅ 모든 스크립트에 실행 권한이 부여되었습니다."
echo ""
echo "🚀 사용 방법:"
echo "  ./run.sh        - 전체 환경 설정 및 서비스 시작"
echo "  ./dev-setup.sh  - 개발 서버만 빠르게 시작"
echo "  ./test.sh       - 테스트 실행"
echo "  ./verify.sh     - 환경 검증"


odex Playground 사용법
레포지토리에 run.sh 추가
Playground에서 프로젝트 열기
자동으로 환경 설정 및 서비스 시작
브라우저에서 확인:
Frontend: http://localhost:3000
Backend API: http://localhost:8000/docs


#!/usr/bin/env bash
# filepath: run.sh
# Casino-Club F2P 보안 강화 환경 설정

set -e

echo "🎰 Casino-Club F2P 보안 강화 환경 설정..."

WORKDIR="${WORKDIR:-$(pwd)}"
cd "$WORKDIR"

# 환경 모드 설정 (기본값: development)
ENVIRONMENT="${ENVIRONMENT:-development}"
echo "🔧 환경 모드: $ENVIRONMENT"

# === 백엔드 환경 설정 ===
cd "$WORKDIR/cc-webapp/backend"

# 가상환경 설정
if [ ! -d "venv" ]; then
    python3 -m venv venv || python -m venv venv
fi
source venv/bin/activate

# 기본 패키지 설치
pip install --upgrade pip
pip install fastapi uvicorn sqlalchemy aiosqlite pytest pytest-asyncio pydantic python-multipart python-jose[cryptography] passlib[bcrypt]

# 보안 강화된 .env 생성
if [ ! -f ".env.${ENVIRONMENT}" ]; then
    echo "🔐 $ENVIRONMENT 환경 설정 생성..."
    
    # JWT 비밀키 자동 생성
    JWT_SECRET=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))")
    
    cat > .env.${ENVIRONMENT} << EOF
# === 데이터베이스 설정 ===
DATABASE_URL=sqlite:///./cc_webapp_${ENVIRONMENT}.db
TEST_DATABASE_URL=sqlite:///./test_cc_webapp.db

# === 보안 설정 (중요: Secrets에서 관리) ===
JWT_SECRET_KEY=${JWT_SECRET}
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
JWT_REFRESH_TOKEN_EXPIRE_DAYS=7

# === 서버 설정 ===
API_HOST=0.0.0.0
API_PORT=8000
ENVIRONMENT=${ENVIRONMENT}
DEBUG=$( [ "$ENVIRONMENT" = "development" ] && echo "true" || echo "false" )

# === 캐시 설정 ===
REDIS_URL=redis://localhost:6379/0

# === 게임 설정 ===
INITIAL_TOKEN_AMOUNT=200
SLOT_TOKEN_COST=2
GACHA_TOKEN_COST=50

# === 로깅 설정 ===
LOG_LEVEL=$( [ "$ENVIRONMENT" = "development" ] && echo "DEBUG" || echo "INFO" )
LOG_FILE=logs/app_${ENVIRONMENT}.log

# === CORS 설정 ===
CORS_ORIGINS=["http://localhost:3000","http://127.0.0.1:3000"]
EOF
fi

# .env 심볼릭 링크 생성
ln -sf .env.${ENVIRONMENT} .env

# === 프론트엔드 환경 설정 ===
cd "$WORKDIR/cc-webapp-frontend"

# 보안 강화된 package.json
cat > package.json << EOF
{
  "name": "cc-webapp-frontend",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.8",
    "@emotion/react": "^11.11.1",
    "@emotion/styled": "^11.11.0",
    "@mui/material": "^5.15.11",
    "react-router-dom": "^6.23.0",
    "js-cookie": "^3.0.5"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.1.0",
    "@types/js-cookie": "^3.0.6"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "start": "vite"
  }
}
EOF

npm install

# 환경별 프론트엔드 설정
cat > .env.${ENVIRONMENT} << EOF
# === API 연동 설정 ===
VITE_API_URL=$( [ "$ENVIRONMENT" = "development" ] && echo "http://localhost:8000" || echo "https://your-domain.com" )
VITE_API_TIMEOUT=10000
VITE_WS_URL=$( [ "$ENVIRONMENT" = "development" ] && echo "ws://localhost:8000/ws" || echo "wss://your-domain.com/ws" )

# === 앱 정보 ===
VITE_APP_NAME=Casino Club F2P
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=${ENVIRONMENT}

# === 디버그 설정 ===
VITE_DEBUG_MODE=$( [ "$ENVIRONMENT" = "development" ] && echo "true" || echo "false" )

# === UI 설정 ===
VITE_DEFAULT_THEME=dark
VITE_SLOT_ANIMATION_DURATION=2000
VITE_GACHA_ANIMATION_DURATION=3000
VITE_FEEDBACK_DISPLAY_TIME=3000

# === 보안 설정 ===
VITE_USE_SECURE_COOKIES=$( [ "$ENVIRONMENT" = "production" ] && echo "true" || echo "false" )
VITE_CSRF_PROTECTION=true

# === 게임 UI 설정 ===
VITE_STAGE_1_COST=200
VITE_STAGE_2_COST=500
VITE_STAGE_3_COST=1000
EOF

ln -sf .env.${ENVIRONMENT} .env

# Vite 보안 강화 설정
cat > vite.config.js << EOF
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@emotion/react', '@emotion/styled']
        }
      }
    }
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  }
})
EOF

echo "✅ 보안 강화 환경 설정 완료!"


from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status, Depends, Request, Response
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os

# 환경 변수에서 보안 설정 로드
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
if not JWT_SECRET_KEY:
    raise ValueError("JWT_SECRET_KEY 환경변수가 설정되지 않았습니다.")

JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("JWT_REFRESH_TOKEN_EXPIRE_DAYS", "7"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer(auto_error=False)

class SecureTokenManager:
    """보안 강화된 토큰 관리자"""
    
    def create_access_token(self, data: dict) -> str:
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire, "type": "access"})
        return jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    
    def create_refresh_token(self, data: dict) -> str:
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
        to_encode.update({"exp": expire, "type": "refresh"})
        return jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    
    def verify_token(self, token: str, token_type: str = "access") -> dict:
        try:
            payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
            if payload.get("type") != token_type:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="토큰 타입이 올바르지 않습니다."
                )
            return payload
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="토큰이 유효하지 않습니다."
            )
    
    def set_secure_cookies(self, response: Response, access_token: str, refresh_token: str):
        """HttpOnly 쿠키로 토큰 설정"""
        is_production = os.getenv("ENVIRONMENT") == "production"
        
        response.set_cookie(
            key="access_token",
            value=f"Bearer {access_token}",
            max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            httponly=True,
            secure=is_production,
            samesite="strict"
        )
        
        response.set_cookie(
            key="refresh_token", 
            value=refresh_token,
            max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
            httponly=True,
            secure=is_production,
            samesite="strict"
        )

token_manager = SecureTokenManager()

async def get_current_user(request: Request):
    """쿠키에서 토큰 추출하여 사용자 인증"""
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="인증이 필요합니다."
        )
    
    # "Bearer " 접두사 제거
    if token.startswith("Bearer "):
        token = token[7:]
    
    payload = token_manager.verify_token(token)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="사용자 정보를 찾을 수 없습니다."
        )
    
    return {"user_id": user_id, "username": payload.get("username")}


        import axios from 'axios';
    import Cookies from 'js-cookie';
    
    const API_URL = import.meta.env.VITE_API_URL;
    const USE_SECURE_COOKIES = import.meta.env.VITE_USE_SECURE_COOKIES === 'true';
    
    // Axios 인스턴스 설정
    const api = axios.create({
      baseURL: API_URL,
      timeout: parseInt(import.meta.env.VITE_API_TIMEOUT),
      withCredentials: true, // 쿠키 자동 전송
    });
    
    // 보안 강화된 인증 관리자
    export class SecureAuthManager {
      
      async login(username, password) {
        try {
          const response = await api.post('/auth/login', {
            username,
            password
          });
          
          // 쿠키는 백엔드에서 자동 설정
          return {
            success: true,
            user: response.data.user
          };
        } catch (error) {
          return {
            success: false,
            error: error.response?.data?.detail || '로그인 실패'
          };
        }
      }
      
      async logout() {
        try {
          await api.post('/auth/logout');
          // 쿠키는 백엔드에서 자동 제거
          return { success: true };
        } catch (error) {
          console.error('로그아웃 오류:', error);
          return { success: false };
        }
      }
      
      async refreshToken() {
        try {
          const response = await api.post('/auth/refresh');
          return {
            success: true,
            user: response.data.user
          };
        } catch (error) {
          return { success: false };
        }
      }
      
      async checkAuth() {
        try {
          const response = await api.get('/auth/me');
          return {
            isAuthenticated: true,
            user: response.data
          };
        } catch (error) {
          return {
            isAuthenticated: false,
            user: null
          };
        }
      }
    }
    
    // 요청 인터셉터 (토큰 갱신)
    api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          const authManager = new SecureAuthManager();
          const refreshResult = await authManager.refreshToken();
          
          if (refreshResult.success) {
            return api(originalRequest);
          } else {
            // 리프레시 실패 시 로그인 페이지로 리다이렉트
            window.location.href = '/login';
          }
        }
        
        return Promise.reject(error);
      }
    );
    
    export { api };
    export default new SecureAuthManager();


        #!/usr/bin/env bash
    # filepath: setup-env.sh
    # 환경별 설정 관리
    
    set -e
    
    ENVIRONMENT=${1:-development}
    echo "🔧 $ENVIRONMENT 환경 설정..."
    
    case $ENVIRONMENT in
      development)
        export DEBUG=true
        export LOG_LEVEL=DEBUG
        export VITE_DEBUG_MODE=true
        export CORS_ORIGINS='["http://localhost:3000","http://127.0.0.1:3000"]'
        ;;
      production)
        export DEBUG=false
        export LOG_LEVEL=INFO
        export VITE_DEBUG_MODE=false
        export CORS_ORIGINS='["https://your-domain.com"]'
        ;;
      *)
        echo "❌ 지원하지 않는 환경: $ENVIRONMENT"
        echo "사용법: ./setup-env.sh [development|production]"
        exit 1
        ;;
    esac
    
    echo "✅ $ENVIRONMENT 환경 설정 완료"

    
GitHub Copilot
🔐 Casino-Club F2P 환경 변수 보안 강화 및 최적화
📋 현재 문제점 분석
보안 취약점: JWT_SECRET_KEY가 하드코딩됨
중복 설정: REDIS_PORT가 REDIS_URL과 중복
환경 미구분: development/production 환경값 혼재
로컬스토리지 XSS 위험: 토큰을 클라이언트에서 관리
🛠️ 수정된 환경 설정 스크립트
1. 보안 강화된 run.sh
2. 보안 강화된 백엔드 인증 설정
3. 보안 강화된 프론트엔드 인증
4. 환경별 설정 관리 스크립트
🔑 주요 보안 개선사항
JWT 비밀키 자동 생성: 하드코딩 제거
HttpOnly 쿠키: XSS 공격 방지
환경별 설정 분리: development/production 구분
토큰 자동 갱신: 사용자 경험 향상
CSRF 보호: SameSite 쿠키 설정
중복 변수 제거: REDIS_PORT 등 

# 프로덕션용 백엔드 (.env.production)
ENVIRONMENT=production
DEBUG=false
LOG_LEVEL=INFO
DATABASE_URL=postgresql://user:pass@host:5432/cc_webapp_prod
CORS_ORIGINS=["https://your-domain.com"]

# 프로덕션용 프론트엔드 (.env.production)
VITE_API_URL=https://your-domain.com
VITE_ENVIRONMENT=production
VITE_DEBUG_MODE=false
VITE_USE_SECURE_COOKIES=true
VITE_WS_URL=wss://your-domain.com/ws