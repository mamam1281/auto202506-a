# 🤖 외부 AI 실행 가이드

## 📋 임무 요약
CC Webapp 프로젝트의 백엔드 구조를 표준화하여 `ModuleNotFoundError: No module named 'backend'` 오류를 해결하고, 일관된 프로젝트 구조를 구축하세요.

## 🎯 선택 가능한 접근법

### 방법 1: 자동화 스크립트 사용 (권장) ⚡
```bash
# 1. 자동 수정 실행
bash fix_backend_structure.sh

# 2. 검증 실행
bash verify_backend_structure.sh

# 3. 결과 확인
curl http://localhost:8000/health
```

### 방법 2: 수동 수정 (세밀한 제어 필요시) 🔧
상세한 단계별 수정 방법은 `AI_BACKEND_STANDARDIZATION_PROMPT.md` 참조

## 📊 성공 기준
- [ ] `docker-compose up backend` 오류 없이 실행
- [ ] `curl http://localhost:8000/health` 응답 성공
- [ ] `pytest tests/` 테스트 통과
- [ ] Import 에러 완전 제거

## 🚨 실패 시 대응
1. **백업 복원**: `backup_[timestamp]/` 디렉토리에서 복원
2. **로그 분석**: 에러 메시지와 스택 트레이스 확인
3. **단계별 검증**: `verify_backend_structure.sh` 개별 항목 확인
4. **상세 리포트**: 실패 단계, 에러 메시지, 시도한 해결방법 기록

## 📈 다음 단계
성공 후 `PROJECT_ROADMAP.md`의 Phase 1.2 데이터베이스 스키마 작업 진행

---
**⏰ 예상 소요 시간**: 자동화 스크립트 사용 시 10-15분
**🔄 재시도**: 실패 시 백업에서 복원 후 재시도 가능
