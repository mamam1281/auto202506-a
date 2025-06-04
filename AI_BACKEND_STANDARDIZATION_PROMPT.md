# 🤖 AI 백엔드 구조 표준화 프롬프트

## 📋 임무 요약
CC Webapp 프로젝트의 백엔드 구조를 표준화하여 하나의 일관된 구조로 통합하세요.

## 🚨 현재 문제점
1. **중복된 백엔드 구조**: `/app/`과 `/cc-webapp/backend/` 두 곳에 백엔드가 존재
2. **Import 경로 혼재**: 일부는 `from app.models import`를, 일부는 `from backend.app.models import` 사용
3. **Docker Compose 불일치**: 메인 docker-compose.yml은 `/app/`을 참조하지만 실제 코드는 `/cc-webapp/backend/`에 집중됨

## 🎯 표준화 목표
**최종 구조**: `/cc-webapp/backend/`를 메인 백엔드로 확정하고 `/app/`을 제거

## 📁 현재 파일 구조 현황

### 메인 루트 (`/`)
```
docker-compose.yml ← 현재 /app/ 참조 (수정 필요)
app/ ← 제거 대상
cc-webapp/
  └── backend/ ← 메인 백엔드 (유지)
      ├── app/
      │   ├── main.py
      │   ├── models.py
      │   ├── routers/
      │   └── utils/
      ├── tests/
      ├── alembic/
      └── requirements.txt
```

### 문제가 되는 Import 패턴들
```python
# 현재 문제있는 import들:
from backend.app.models import Base, User  # ❌ 경로 오류
from ..models import Base  # ❌ 상대경로 문제

# 표준화 후 올바른 import:
from app.models import Base, User  # ✅ 정확한 경로
```

## 🔧 구체적 실행 단계

### 1단계: Import 경로 수정 ✅
**수정 대상 파일들**:
- `cc-webapp/backend/tests/test_*.py` (모든 테스트 파일)
- `cc-webapp/backend/app/routers/*.py`
- `cc-webapp/backend/app/utils/*.py`

**수정 방법**:
```python
# Before (잘못된 예시):
from backend.app.models import Base, User, UserReward
from backend.app.main import app
from backend.app.database import get_db

# After (올바른 예시):
from app.models import Base, User, UserReward
from app.main import app
from app.database import get_db
```

### 2단계: Docker Compose 수정 ✅
**파일**: `/docker-compose.yml`

**현재 (잘못된 설정)**:
```yaml
backend:
  build: .
  volumes:
    - ./app:/app
```

**수정 후 (올바른 설정)**:
```yaml
backend:
  build: ./cc-webapp/backend
  volumes:
    - ./cc-webapp/backend/app:/app/app
```

### 3단계: 불필요한 파일 제거 ✅
**제거할 디렉토리**: `/app/`
- 메인 백엔드를 `/cc-webapp/backend/`로 확정했으므로 루트의 `/app/` 제거

### 4단계: 환경 변수 통합 ✅
**파일**: `.env`, `docker-compose.yml`

**백엔드 경로 환경 변수 추가**:
```env
BACKEND_PATH=./cc-webapp/backend
PYTHONPATH=/app
```

## 🧪 테스트 검증 방법

### 실행 전 체크리스트:
- [ ] 모든 import 문이 `app.` 형태로 시작하는지 확인
- [ ] `from backend.app.` 패턴이 남아있지 않은지 검색
- [ ] Docker Compose에서 올바른 경로를 참조하는지 확인

### 테스트 명령어:
```bash
# 1. Docker Compose 빌드 테스트
docker-compose build backend

# 2. 백엔드 컨테이너 시작 테스트
docker-compose up backend -d

# 3. 헬스체크 확인
curl http://localhost:8000/health

# 4. 단위 테스트 실행
docker-compose exec backend pytest tests/ -v

# 5. Import 에러 체크
docker-compose exec backend python -c "from app.models import Base; print('✅ Import 성공')"
```

## 📊 성공 기준

### ✅ 필수 달성 목표:
1. **Import 에러 제거**: `ModuleNotFoundError: No module named 'backend'` 해결
2. **Docker 실행 성공**: `docker-compose up backend` 오류 없이 실행
3. **테스트 통과**: 모든 pytest 테스트가 통과
4. **API 접근 가능**: `/health`, `/docs` 엔드포인트 정상 응답

### ⚠️ 실패 시 리포트 요구사항:
실패한 경우 다음 정보를 제공해주세요:

1. **어떤 단계에서 실패했는지**:
   - Import 수정 단계
   - Docker 설정 단계
   - 테스트 실행 단계

2. **구체적인 에러 메시지**:
   ```
   전체 에러 로그와 스택 트레이스 포함
   ```

3. **시도한 해결 방법**:
   - 어떤 파일을 수정했는지
   - 어떤 접근법을 시도했는지

4. **현재 상태**:
   - 수정된 파일 목록
   - 변경된 import 패턴들

## 🚀 후속 작업 안내

성공적으로 완료된 후, 다음 단계로 진행합니다:

### A. 핵심 기능 구현 (우선순위 높음)
1. **데이터베이스 스키마 완성**
2. **사이버 토큰 시스템 구현**
3. **도파민 루프 피드백 시스템**

### B. 게임 로직 구현 (우선순위 중간)
1. **가챠 시스템**
2. **슬롯머신 게임**
3. **성인 콘텐츠 언락 시스템**

### C. 외부 연동 (우선순위 낮음)
1. **본사 사이트 API 연동**
2. **실시간 알림 시스템**
3. **분석 및 모니터링**

## 💡 추가 힌트

### Python Path 이슈 해결:
만약 여전히 import 문제가 있다면:
```bash
# 컨테이너 내에서 PYTHONPATH 확인
docker-compose exec backend echo $PYTHONPATH

# 수동으로 설정 테스트
docker-compose exec backend python -c "import sys; sys.path.insert(0, '/app'); from app.models import Base"
```

### 상대 경로 vs 절대 경로:
```python
# ❌ 피해야 할 패턴:
from ..models import User
from ...database import get_db

# ✅ 권장 패턴:
from app.models import User
from app.database import get_db
```

---

**⚡ 실행 시 중요사항**: 
- 한 번에 모든 파일을 수정하지 말고 단계별로 진행
- 각 단계마다 `docker-compose build`로 검증
- 테스트가 실패하면 즉시 이전 단계로 되돌리기
- 모든 변경사항을 상세히 기록

**🔄 반복 개선**: 
첫 시도가 실패해도 괜찮습니다. 실패 원인을 분석하고 개선된 접근법으로 재시도하세요.
