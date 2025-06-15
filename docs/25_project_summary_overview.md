#!/usr/bin/env bash눈에 보기
# filepath: run.sh (업데이트됨)
# Casino-Club F2P 프로젝트 환경 설정
1. **백엔드 완성**: 상용 카지노 수준의 게임 로직 + 100% 테스트 통과 ✅
set -e론트엔드 미완성**: Next.js 서버만 실행, 실제 페이지/UI 전무 🚨
3. **다음 목표**: 4주 내 실제 플레이 가능한 MVP 완성 🎮
echo "🎰 Casino-Club F2P 환경 설정 시작..."
---
WORKDIR="${WORKDIR:-$(pwd)}"
cd "$WORKDIR"석**

# === 백엔드 환경 설정 (개선됨) ===고 |
echo "🔧 백엔드 환경 설정..."-|------|
cd "$WORKDIR/cc-webapp/backend"성 | 슬롯/룰렛/가챠, 100% 테스트 |
| **프론트엔드 UI** | **5%** | 🚨 미완성 | 서버만 실행, 실제 페이지 없음 |
if [ ! -d "venv" ]; then 🔄 진행중 | "not implemented yet" 상태 |
    python3 -m venv venv || python -m venv venvss 미구현 |
fi**AI/LLM** | **30%** | 🔄 진행중 | 환경설정만, 실제 코드 없음 |
| **인프라/배포** | **80%** | ✅ 완성 | Docker 완전 구성 |
source venv/bin/activate
pip install --upgrade pip

if [ ! -f "requirements.txt" ]; then
cat > requirements.txt << 'EOF'
# 🆕 필수 백엔드 의존성 (FastAPI 누락 해결) **완성된 주요 성과**
fastapi==0.104.1
uvicorn[standard]==0.24.0# **게임 로직 시스템**
sqlalchemy==2.0.23- **슬롯 머신**: Variable-Ratio 보상 + 스트릭 보너스 (96% 커버리지)
aiosqlite==0.19.0하우스 엣지 (100% 커버리지)  
pydantic==2.5.0stem + 등급별 확률 (91% 커버리지)
python-multipart==0.0.6커버리지)
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4**
pytest==7.4.3
pytest-asyncio==0.21.1화)
httpx==0.25.2*100% 게임서비스 커버리지**: 완벽한 안정성

# 🆕 추가 개발 도구### **아키텍처**
black==23.11.0e**: 위임 패턴으로 확장성 완벽 구현
isort==5.12.0보수 가능한 구조
flake8==6.1.0성
mypy==1.7.1
coverage==7.3.2
EOF
fi# 🚨 **미완성된 핵심 부분**

pip install -r requirements.txt

if [ ! -f ".env" ]; then
cat > .env << EOF:3000)
DATABASE_URL=sqlite:///./app.db
API_HOST=0.0.0.0
API_PORT=8000
SECRET_KEY=casino-club-f2p-secret-key-2025
CORS_ORIGINS=["http://localhost:3000"]

# 🆕 테스트 환경변수
TEST_DATABASE_URL=sqlite:///./test.db
TEST_MODE=false백엔드 API 호출 연동
DEBUG=true``
LOG_LEVEL=DEBUG
PI 연동**
# 🆕 게임 설정ython
SLOT_PAYOUT_RATE=0.95
ROULETTE_HOUSE_EDGE=0.027
INITIAL_TOKENS=1000def play_slot():
MAX_BET_AMOUNT=100  return {"message": "not implemented yet"}
EOF    
fi

# === 프론트엔드 환경 설정 (개선됨) ===
echo "🎨 프론트엔드 환경 설정..."
cd "$WORKDIR/cc-webapp/frontend"- **결제 시스템**: Stripe/PayPal 연동 미구현
미구현  
if [ ! -f "package.json" ]; then반 언락 미구현
cat > package.json << 'EOF'
{
  "name": "cc-webapp-frontend",
  "version": "1.0.0",주 로드맵**
  "private": true,
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start -p 3000",롯 게임 컴포넌트
    "lint": "next lint", 기본 네비게이션
    "test": "jest",
    "test:watch": "jest --watch",# **Week 2: API 연동** 🔗
    "test:coverage": "jest --coverage" ] 게임 엔드포인트 실제 구현
  },[ ] 프론트엔드-백엔드 연결
  "dependencies": {- [ ] 토큰 시스템 실시간 동작
    "next": "^14.0.4",기본 UI
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.8",
    "tailwindcss": "^3.3.6",ss 기본 구조
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",체 시스템 테스트
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/user-event": "^14.5.1",
    "eslint": "^8.57.0",*즉시 시작 가능한 작업**
    "eslint-config-next": "^14.0.4"
  } **🔥 최우선 (Week 1)**
} **메인 페이지 구현** (2일)
EOF   ```typescript
npm installe.js
elserd)
    # 🆕 누락된 의존성 추가 설치
    npm install next@^14.0.4 tailwindcss autoprefixer postcss
    npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom
fi

# 🆕 Next.js 설정 파일
if [ ! -f "next.config.js" ]; thenbapp/frontend/components/SlotMachine.jsx
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */  - 베팅 선택 (10/50/100 토큰)
const nextConfig = {- 스핀 버튼 + 애니메이션
  async rewrites() { ```
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/:path*',p/routers/games.py
      },
    ]
  },   ```
}

module.exports = nextConfig **프론트엔드-백엔드 연결 테스트**
EOF2. **룰렛/가챠 기본 UI**
fi테스트**

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
      colors: {인
        'casino-gold': '#FFD700', 패배 시 차감
        'casino-red': '#DC2626',
        'casino-green': '#059669',
      }
    },## **기술적 성과**
  },- **완전한 게임 플레이**: 클릭 한 번으로 실제 게임 체험
  plugins: [],트된 백엔드 로직  
}*확장성**: 룰렛/가챠 쉽게 추가 가능
EOF**사용자 경험**: 직관적이고 반응성 좋은 UI
fi

# 🆕 PostCSS 설정
if [ ! -f "postcss.config.js" ]; then## 📊 **성공 지표**
cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {}, 실시간 확인
    autoprefixer: {},- [ ] 기본 UI 완성 (메인 + 슬롯 페이지)
  },
}2 목표**
EOF/룰렛/가챠) 모두 플레이 가능
fi- [ ] 안정적인 반복 플레이 (오류 없음)
료
# 🆕 Jest 설정
if [ ! -f "jest.config.js" ]; then
cat > jest.config.js << 'EOF'- [ ] 수익화 시스템 기본 작동
const nextJest = require('next/jest')대화 기능
] 프로덕션 배포 준비 완료























































































































































echo "🔧 백엔드: http://localhost:8000"echo "📱 프론트엔드: http://localhost:3000"echo "🚀 서버 시작: ./start_servers.sh"echo "✅ 환경 설정 완료!"fichmod +x start_servers.shEOFwaittrap 'kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo "🛑 서버 종료됨"' INT TERM# 종료 핸들러echo "📋 API 문서: http://localhost:8000/docs"echo "🔧 백엔드: http://localhost:8000"echo "📱 프론트엔드: http://localhost:3000"echo "✅ 서버 시작 완료!"FRONTEND_PID=$!npm run dev &cd ../frontendecho "🎨 프론트엔드 시작 (포트 3000)..."# 프론트엔드 시작BACKEND_PID=$!uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &source venv/bin/activatecd cc-webapp/backendecho "🔧 백엔드 시작 (포트 8000)..."# 백엔드 시작echo "🎰 CC-Webapp 개발 서버 시작..."# 🚀 개발 서버 시작 스크립트#!/bin/bashcat > start_servers.sh << 'EOF'if [ ! -f "start_servers.sh" ]; thencd "$WORKDIR"# === 서버 시작 스크립트 개선 ===fi    echo "❌ Node.js 미설치"else    fi        npm list --depth=0 | head -10        echo "✅ package.json 존재"    if [ -f "package.json" ]; then    echo "✅ Node.js 설치됨: $(node --version)"if command -v node >/dev/null 2>&1; thencd "$WORKDIR/cc-webapp/frontend"# 프론트엔드 구조 확인"    print(f'❌ 백엔드 모듈 오류: {e}')except ImportError as e:    print('✅ 백엔드 핵심 모듈 정상')    import fastapi, uvicorn, sqlalchemytry:python -c "cd "$WORKDIR/cc-webapp/backend"# 백엔드 구조 확인echo "🔍 프로젝트 구조 검증..."# === 프로젝트 검증 ===fichmod +x test_runner.pyEOF    sys.exit(0 if success else 1)    success = run_tests()if __name__ == "__main__":    return result.returncode == 0        ], capture_output=False)        "-v", "--tb=short", "--color=yes"        sys.executable, "-m", "pytest",     result = subprocess.run([    # pytest 실행            return False        print("❌ FastAPI 모듈 누락 - pip install fastapi 실행")    except ImportError:        print(f"✅ FastAPI {fastapi.__version__} 설치됨")        import fastapi        # FastAPI 모듈 확인    try:        print("🧪 백엔드 테스트 시작...")def run_tests():import sysimport subprocess"""Usage: python test_runner.py백엔드 테스트 러너"""#!/usr/bin/env python3cat > test_runner.py << 'EOF'if [ ! -f "test_runner.py" ]; thencd "$WORKDIR/cc-webapp/backend"# 🆕 백엔드 테스트 스크립트echo "🔧 개발 도구 설정..."# === 개발 도구 설정 ===fiEOF}  @apply bg-gradient-to-r from-casino-gold to-yellow-500 text-black font-bold px-4 py-2 rounded-full;.token-display {}  @apply border-2 border-casino-gold bg-gray-800 rounded-lg;.slot-reel {}  @apply bg-gradient-to-r from-casino-gold to-yellow-600 text-black font-bold py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-200;.casino-button {}  @apply bg-gray-900 text-white;.casino-dark {/* 🎰 Casino 테마 CSS */@tailwind utilities;@tailwind components;@tailwind base;cat > app/globals.css << 'EOF'if [ ! -f "app/globals.css" ]; thenmkdir -p app# 🆕 글로벌 CSS (Tailwind 포함)fiEOFimport '@testing-library/jest-dom'cat > jest.setup.js << 'EOF'if [ ! -f "jest.setup.js" ]; thenfiEOFmodule.exports = createJestConfig(customJestConfig)}  testEnvironment: 'jest-environment-jsdom',  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],const customJestConfig = {})  dir: './',const createJestConfig = nextJest({
---

## 🎯 **핵심 메시지**

**현재**: 훌륭한 백엔드 + 비어있는 프론트엔드  
**목표**: 실제 플레이 가능한 완전한 게임  
**전략**: 프론트엔드 집중 → API 연동 → 수익화 → AI 통합

**예상 소요시간**: 4주  
**성공 확률**: 높음 (백엔드 완성으로 기술적 리스크 최소화)

---

**📅 작성일**: 2025.06.14  
**📊 데이터 기준**: 실제 테스트 및 코드 분석 결과  
**🔄 업데이트**: 주요 진전 시 갱신
