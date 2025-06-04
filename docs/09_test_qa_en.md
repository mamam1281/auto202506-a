# Testing & QA Document

## 9.1. Testing Strategy
- **Unit Tests:**  
  - Test individual functions: reward logic, emotion feedback, DB CRUD  
  - Use pytest + fixtures

- **Integration Tests:**  
  - FastAPI TestClient 활용  
  - `/api/actions` → Redis & DB 업데이트 검증  
  - `/api/feedback` → 올바른 피드백 메시지 반환

- **End-to-End (E2E) Tests:**  
  - Playwright 또는 Cypress 사용  
  - 사용자 플로우: 슬롯 플레이 → 승리/패배 시 보상 & 콘텐츠 언락 확인  
  - 로그인/로그아웃, JWT 재발급 시나리오 검증

## 9.2. Sample Test Cases
1. **User Action Logging**  
   - 요청: `POST /api/actions`  
   - 기대: `user_actions` 테이블에 레코드 생성 & Redis 키(`streak_count`, `last_action_ts`) 업데이트

2. **Reward Logic**  
   - 시나리오: streak_count = 5 → 확률이 0.10 + 0.05 = 0.15 수준  
   - 다수 반복 실행 후 통계적 확률 확인

3. **Emotion Feedback**  
   - 요청: `{ "user_id": 1, "action_type": "GAME_FAIL" }`  
   - 기대:  
     ```json
     {
       "emotion": "frustration",
       "message": "Don’t worry! You can beat it next time."
     }
     ```

4. **Adult Content Unlock**  
   - 시나리오:  
     - 세그먼트 “Medium” 사용자가 Stage 2 요청 시 403 반환  
     - Stage 1 해제 후 Stage 2 요청 시 정상 반환

5. **Webapp ↔ HQ Site Integration**  
   - 웹앱 → HQ 사이트 링크 클릭 시 `site_visits` 레코드 생성  
   - HQ → 웹앱 링크 클릭 시 `user_actions`에 “SITE_TO_WEBAPP” 기록

## 9.3. CI Pipeline Setup
- **GitHub Actions:**  
  1. Push 시 `pip install -r requirements.txt`  
  2. Lint (flake8), Format (black) 검사  
  3. pytest 실행 (coverage ≥ 80%)  
  4. ESLint + Prettier 검사 (프론트엔드)  
  5. Infrastructure check (terraform/AWS CloudFormation)

- **Sentry Integration:**  
  - FastAPI 예외 발생 시 자동 보고  
  - React 빌드/런타임 에러 → Sentry SDK 연결

- **Automated Test Schedule:**  
  - 매일 새벽 3시 E2E 테스트 (Cypress/Playwright) 실행
