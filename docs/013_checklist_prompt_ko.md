# 📋 개발 검증 체크리스트 프롬프트

## 문서 참조 검증 체크리스트 ✅

새로운 기능이나 코드를 작성하기 전에 반드시 아래 문서들과의 정합성을 확인하세요:

### 핵심 문서 참조
- [ ] **도파민 루프 메커니즘** (01_architecture_en.md)
  - Variable-Ratio 보상 시스템
  - 즉각적 피드백 구조
  - 한정 이벤트 타이밍

- [ ] **사용자 세분화 규칙** (02_data_personalization_en.md)
  - RFM 기반 세그먼테이션
  - 리스크 프로필 분석
  - 사이버 토큰 잔고 연동

- [ ] **감정 피드백 패턴** (03_emotion_feedback_en.md)
  - 승리/패배 시 피드백
  - AI 대화 톤앤매너
  - 멀티미디어 피드백

- [ ] **성인 콘텐츠 진행** (04_adult_rewards_en.md)
  - 단계별 언락 시스템
  - 세그먼트별 접근 권한
  - 토큰 소비 구조

- [ ] **본사 사이트 리텐션** (05_corporate_retention_en.md)
  - 토큰 획득/소비 흐름
  - 크로스 플랫폼 연동
  - 재방문 유도 로직

### 검증 방법
1. 각 항목을 하나씩 체크
2. 문서 내용과 충돌되는 부분이 없는지 확인
3. 핵심 설계 원칙 준수 여부 검토
4. 참조한 문서 명시적으로 표기

### 사용 예시
```plaintext
Before providing your response, confirm that it aligns with:
[ ] Dopamine loop mechanics from 01_architecture_en.md
[ ] User segmentation rules from 02_data_personalization_en.md
[ ] Emotion feedback patterns from 03_emotion_feedback_en.md
[ ] Adult content progression from 04_adult_rewards_en.md
[ ] Corporate site retention flow from 05_corporate_retention_en.md

Your response must explicitly reference which documents were consulted.
```

## 활용 지침 📝

### 적용 시점
- 새로운 API 엔드포인트 설계 시
- UI 컴포넌트 개발 시
- 게임 로직 구현 시
- 보상 시스템 수정 시

### 주의사항
- 모든 응답은 참조한 문서를 명시적으로 언급해야 함
- 문서 간 상충되는 내용이 발견되면 즉시 보고
- 검증 결과는 반드시 기록으로 남길 것

이 체크리스트를 통해 프로젝트의 일관성을 유지하고, 핵심 설계 원칙이 모든 개발 과정에서 준수되도록 관리합니다.
