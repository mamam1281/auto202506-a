# AI Assistant Test Guide

이 문서는 AI가 테스트 진행 상황을 빠르게 파악하고 다음 단계를 정리하기 위한 요약 가이드입니다.

## 현재 통계 (2025-06-08)
- 총 테스트: 100개
- 통과: 83개
- 실패: 16개
- 스킵: 1개
- 경고: 12개 (주로 Pydantic V2 관련)

## 실패 테스트 분포
- `test_rewards.py`: 6개 실패
- `test_notification.py`: 4개 실패
- `test_unlock.py`: 3개 실패
- `test_adult_content_service.py`: 3개 실패

## 즉시 실행 명령어
```bash
# 실패 테스트 파일별 분포 확인
pytest cc-webapp/backend/tests/ --tb=no -v | awk '/FAILED/{print $1}' \
    | cut -d':' -f1 | sort | uniq -c | sort -nr

# 전체 테스트 요약
pytest -q
```

## 다음 우선순위
1. Rewards 서비스 DB 스키마 불일치 해결
2. Notification 서비스 mock 데이터 점검
3. Unlock/AdultContent 서비스 의존성 정리
