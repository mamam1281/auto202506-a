#!/bin/bash

# 🤖 GitHub Codex/외부 AI 전용 시작 스크립트
set -e

echo "🤖 Codex 환경에서 CC-WebApp을 시작합니다..."

# === Python 명령어 확인 ===
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "❌ Python이 설치되지 않았습니다"
    exit 1
fi

echo "🔧 사용할 Python 명령어: $PYTHON_CMD"

# === 환경변수 로드 ===
echo "🔧 환경변수 로드 중..."
if [ -f .env ]; then
    set -a
    source .env
    set +a
    echo "  ✅ 환경변수 로드 완료"
fi

# === 환경 설정 실행 ===
echo "🔧 기본 설정 스크립트 실행 중..."
bash setup.sh

# === 개발 서버 시작 ===
echo "🚀 개발 서버 시작 중..."

# 백그라운드에서 백엔드 서버 시작
echo "  🐍 FastAPI 백엔드 서버 시작..."
cd cc-webapp/backend
$PYTHON_CMD -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# 백그라운드에서 프론트엔드 서버 시작
echo "  ⚛️  React 프론트엔드 서버 시작..."
cd ../frontend
npm run dev -- --host 0.0.0.0 --port 3000 &
FRONTEND_PID=$!

# 서버 준비 대기
echo "⏳ 서버 준비 중... (10초 대기)"
sleep 10

# === 헬스 체크 ===
echo "🏥 헬스 체크 실행 중..."
cd ../../

# 백엔드 헬스 체크
if curl -s http://localhost:8000/health > /dev/null; then
    echo "  ✅ 백엔드 서버 정상 동작 (http://localhost:8000)"
    echo "  📖 API 문서: http://localhost:8000/docs"
else
    echo "  ❌ 백엔드 서버 연결 실패"
fi

# 프론트엔드 헬스 체크
if curl -s http://localhost:3000 > /dev/null; then
    echo "  ✅ 프론트엔드 서버 정상 동작 (http://localhost:3000)"
else
    echo "  ❌ 프론트엔드 서버 연결 실패"
fi

# === 기본 API 테스트 ===
echo "🧪 기본 API 테스트 실행 중..."
cd cc-webapp/backend

# 간단한 테스트 실행
$PYTHON_CMD -c "
import requests
import sys

try:
    # Health check
    response = requests.get('http://localhost:8000/health', timeout=5)
    if response.status_code == 200:
        print('  ✅ Health check 통과')
    else:
        print(f'  ⚠️  Health check 실패: {response.status_code}')
        
    # 기본 라우터 확인
    response = requests.get('http://localhost:8000/docs', timeout=5)
    if response.status_code == 200:
        print('  ✅ API 문서 접근 가능')
    else:
        print(f'  ⚠️  API 문서 접근 실패: {response.status_code}')
        
except Exception as e:
    print(f'  ❌ API 테스트 실패: {e}')
    print('  💡 서버가 아직 시작 중일 수 있습니다. 잠시 후 다시 시도하세요.')
" || echo "  ⚠️  requests 모듈이 없거나 서버 연결 실패"

# === 종료 처리 ===
echo ""
echo "🎯 서버가 백그라운드에서 실행 중입니다!"
echo "📋 유용한 명령어:"
echo "  - 백엔드 로그 확인: tail -f cc-webapp/backend/app.log"
echo "  - 프로세스 종료: kill $BACKEND_PID $FRONTEND_PID"
echo "  - 테스트 실행: cd cc-webapp/backend && python -m pytest tests/ -v"
echo ""
echo "🌐 접속 주소:"
echo "  - 백엔드 API: http://localhost:8000"
echo "  - API 문서: http://localhost:8000/docs"
echo "  - 프론트엔드: http://localhost:3000"

# 서버를 포그라운드로 가져와서 종료 신호 대기
trap "echo '🛑 서버 종료 중...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT TERM

echo "💡 Ctrl+C로 모든 서버를 종료할 수 있습니다."
wait
