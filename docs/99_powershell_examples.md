# PowerShell 명령어 예시

- 백엔드 가상환경 생성 및 패키지 설치
cd cc-webapp/backend; python -m venv venv; .\venv\Scripts\Activate.ps1; python -m pip install fastapi uvicorn sqlalchemy aiosqlite pytest

- 프론트엔드 의존성 설치
cd cc-webapp/frontend; npm install