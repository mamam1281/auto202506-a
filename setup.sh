#!/bin/bash

# 🚀 CC-WebApp 외부 AI 환경 설정 스크립트
set -e

echo "🎮 CC-WebApp 환경 설정을 시작합니다..."

# === 1. 환경 정보 출력 ===
echo "📋 환경 정보:"

# Python 버전 확인 (다양한 명령어 시도)
if command -v python3 &> /dev/null; then
    echo "  - Python: $(python3 --version)"
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    echo "  - Python: $(python --version)"
    PYTHON_CMD="python"
else
    echo "  ❌ Python이 설치되지 않았습니다"
    exit 1
fi

# Node.js 버전 확인
if command -v node &> /dev/null; then
    echo "  - Node.js: $(node --version)"
    NODE_AVAILABLE=true
else
    echo "  ⚠️  Node.js가 설치되지 않았습니다 (프론트엔드 개발 시 필요)"
    NODE_AVAILABLE=false
fi

# npm 버전 확인
if command -v npm &> /dev/null; then
    echo "  - npm: $(npm --version)"
    NPM_AVAILABLE=true
else
    echo "  ⚠️  npm이 설치되지 않았습니다 (프론트엔드 개발 시 필요)"
    NPM_AVAILABLE=false
fi

echo "  - 현재 디렉토리: $(pwd)"

# === 2. 환경변수 설정 ===
echo "🔧 환경변수 설정 중..."
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "  ✅ .env 파일이 .env.example에서 복사되었습니다"
    else
        echo "  ⚠️  .env.example 파일이 없습니다. 기본 환경변수 생성 중..."
        cat > .env << 'EOF'
DATABASE_URL=sqlite:///./cc_webapp.db
TEST_DATABASE_URL=sqlite:///./test_cc_webapp.db
ENVIRONMENT=development
DEBUG=true
JWT_SECRET_KEY=dev-secret-key-change-in-production
INITIAL_TOKEN_AMOUNT=200
STAGE_1_COST=200
STAGE_2_COST=500
STAGE_3_COST=1000
EOF
        echo "  ✅ 기본 .env 파일이 생성되었습니다"
    fi
else
    echo "  ✅ .env 파일이 이미 존재합니다"
fi

# 환경변수 로드
if [ -f .env ]; then
    set -a
    source .env
    set +a
    echo "  ✅ 환경변수 로드 완료"
fi

# PYTHONPATH 설정
export PYTHONPATH=$PWD/cc-webapp/backend:$PYTHONPATH
echo "  ✅ PYTHONPATH 설정: $PYTHONPATH"

# === 3. 디렉토리 확인 ===
echo "🔍 디렉토리 구조 확인 중..."
BACKEND_DIR="cc-webapp/backend"
FRONTEND_DIR="cc-webapp/frontend"
if [ ! -d "$BACKEND_DIR" ]; then
    echo "  ❌ $BACKEND_DIR 디렉토리가 없습니다"
    exit 1
fi

if [ ! -d "$FRONTEND_DIR" ]; then
    echo "  ⚠️  $FRONTEND_DIR 디렉토리가 없습니다 (프론트엔드 개발 시 필요)"
    FRONTEND_AVAILABLE=false
else
    FRONTEND_AVAILABLE=true
fi

echo "  ✅ 백엔드 디렉토리 구조 확인 완료"

# === 4. Python 의존성 설치 ===
echo "🐍 Python 의존성 설치 중..."
cd "$BACKEND_DIR"

if [ -f requirements.txt ]; then
    $PYTHON_CMD -m pip install -r requirements.txt
    echo "  ✅ Python 패키지 설치 완료"
else
    echo "  ⚠️  requirements.txt가 없습니다. 기본 패키지만 설치합니다"
    $PYTHON_CMD -m pip install fastapi uvicorn sqlalchemy pydantic
fi

# === 5. Node.js 의존성 설치 (선택적) ===
if [ "$FRONTEND_AVAILABLE" = true ] && [ "$NPM_AVAILABLE" = true ]; then
    echo "📦 Node.js 의존성 설치 중..."
    cd "../../$FRONTEND_DIR"
    if [ -f package.json ]; then
        npm install
        echo "  ✅ Node.js 패키지 설치 완료"
    else
        echo "  ⚠️  package.json이 없습니다"
    fi
    cd "../../$BACKEND_DIR"
else
    echo "📦 Node.js 의존성 설치 건너뜀 (Node.js/npm 없음 또는 프론트엔드 디렉토리 없음)"
fi

# === 6. 데이터베이스 초기화 (선택적) ===
echo "🗃️  데이터베이스 설정 확인 중..."
# 현재 디렉토리: cc-webapp/backend
$PYTHON_CMD -c "
try:
    import sys
    sys.path.insert(0, '.')
    from app.database import engine, Base
    from app.models import User, UserAction, UserReward
    print('  ✅ 데이터베이스 모델 로드 성공')
    # 테스트 환경에서 테이블 생성
    if 'sqlite' in str(engine.url):
        Base.metadata.create_all(bind=engine)
        print('  ✅ SQLite 테이블 생성 완료')
except Exception as e:
    print(f'  ⚠️  데이터베이스 설정 확인 필요: {e}')
" || echo "  ⚠️  데이터베이스 모델 로드 실패 (정상 - 개발 진행 중)"

# === 7. 기본 테스트 실행 ===
echo "🧪 기본 테스트 실행 중..."
if [ -d tests ]; then
    $PYTHON_CMD -m pytest tests/ -v --tb=short || echo "  ⚠️  일부 테스트 실패 (정상 - 개발 진행 중)"
else
    echo "  ⚠️  tests 디렉토리가 없습니다. 테스트를 건너뜁니다"
fi

# === 8. API 서버 준비 확인 ===
echo "🌐 API 서버 준비 상태 확인 중..."
$PYTHON_CMD -c "
try:
    import sys
    sys.path.insert(0, '.')
    from app.main import app
    print('  ✅ FastAPI 앱 로드 성공')
except Exception as e:
    print(f'  ❌ FastAPI 앱 로드 실패: {e}')
" || echo "  ⚠️  FastAPI 앱 확인 실패"

# === 9. 설정 완료 안내 ===
cd ../../
echo ""
echo "🎉 CC-WebApp 환경 설정이 완료되었습니다!"
echo ""
echo "📋 서버 시작 명령어:"
echo "  백엔드: cd cc-webapp/backend && $PYTHON_CMD -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

if [ "$FRONTEND_AVAILABLE" = true ] && [ "$NPM_AVAILABLE" = true ]; then
    echo "  프론트엔드: cd cc-webapp/frontend && npm run dev"
else
    echo "  프론트엔드: Node.js/npm 설치 후 가능"
fi

echo ""
echo "🧪 테스트 실행:"
echo "  cd cc-webapp/backend && $PYTHON_CMD -m pytest tests/ -v"
echo ""
echo "📖 API 문서 확인:"
echo "  http://localhost:8000/docs (서버 시작 후)"
echo ""
echo "🔧 환경변수 수정이 필요한 경우 .env 파일을 편집하세요"
echo ""
echo "🔧 설정된 Python 명령어: $PYTHON_CMD"

if [ "$NODE_AVAILABLE" = false ] || [ "$NPM_AVAILABLE" = false ]; then
    echo ""
    echo "💡 프론트엔드 개발을 위해서는 Node.js와 npm 설치가 필요합니다:"
    echo "  - Node.js 18+ 설치 권장"
    echo "  - 설치 후 다시 setup.sh 실행"
fi
