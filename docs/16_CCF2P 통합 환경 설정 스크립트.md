#!/usr/bin/env bash
# filepath: run.sh
# Casino-Club F2P 프로젝트 환경 설정

set -e

echo "🎰 Casino-Club F2P 환경 설정 시작..."

WORKDIR="${WORKDIR:-$(pwd)}"
cd "$WORKDIR"

# === 백엔드 환경 설정 ===
echo "🔧 백엔드 환경 설정..."
cd "$WORKDIR/cc-webapp/backend"

if [ ! -d "venv" ]; then
    python3 -m venv venv || python -m venv venv
fi

source venv/bin/activate
pip install --upgrade pip

if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
else
    pip install fastapi uvicorn sqlalchemy aiosqlite pytest pytest-asyncio pydantic python-multipart python-jose[cryptography] passlib[bcrypt]
fi

if [ ! -f ".env" ]; then
cat > .env << EOF
DATABASE_URL=sqlite:///./app.db
API_HOST=0.0.0.0
API_PORT=8000
SECRET_KEY=casino-club-f2p-secret-key-2025
CORS_ORIGINS=["http://localhost:3000"]
EOF
fi

# === 프론트엔드 환경 설정 ===
echo "🎨 프론트엔드 환경 설정..."
cd "$WORKDIR/cc-webapp-frontend"

if [ ! -f "package.json" ]; then
cat > package.json << 'EOF'
{
  "name": "cc-webapp-frontend",
  "scripts": { "start": "vite --port 3000 --host 0.0.0.0" },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@mui/material": "^5.15.11",
    "axios": "^1.6.8",
    "react-redux": "^9.1.0",
    "@reduxjs/toolkit": "^2.2.0"
  },
  "devDependencies": {
    "vite": "^5.1.0",
    "@vitejs/plugin-react": "^4.2.1"
  }
}
EOF
npm install
else
    if ! grep -q "react-redux" package.json; then
        npm install react-redux @reduxjs/toolkit
    fi
fi

if [ ! -f "vite.config.js" ]; then
cat > vite.config.js << 'EOF'
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
  }
})
EOF
fi

mkdir -p src

if [ ! -f "index.html" ]; then
cat > index.html << 'EOF'
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
fi

if [ ! -f "src/main.jsx" ]; then
cat > src/main.jsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
EOF
fi

if [ ! -f "src/App.jsx" ]; then
cat > src/App.jsx << 'EOF'
import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline, Container, Typography, Paper, Box } from '@mui/material'

const darkTheme = createTheme({
  palette: { mode: 'dark' },
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
            <Typography variant="body1">
              환경 설정 완료! 🚀
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

# === 서버 시작 ===
echo "🚀 서버 시작..."

cd "$WORKDIR/cc-webapp/backend"
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

cd "$WORKDIR/cc-webapp-frontend"
npm start &
FRONTEND_PID=$!

echo "✅ 환경 설정 완료!"
echo "📱 프론트엔드: http://localhost:3000"
echo "🔧 백엔드: http://localhost:8000"

# 계속 실행 상태 유지
wait