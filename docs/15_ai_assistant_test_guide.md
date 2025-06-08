# 🤖 AI Assistant Test Resolution Guide
## Casino-Club F2P 프로젝트 테스트 문제 해결 가이드

---

## 📋 **프로젝트 구성 현황 (2025.06.08 최신 업데이트)**

### 📂 **프로젝트 구조 개요**
```
c:\Users\c\2026\auto202506-a\
├── cc-webapp/
│   ├── backend/        # 백엔드 서비스 (Python)
│   │   ├── app/        # API 및 비즈니스 로직
│   │   └── tests/      # 테스트 스위트 (pytest)
│   └── docs/           # 프로젝트 문서
└── cc-webapp-frontend/ # 프론트엔드 (React) - 신규 추가!
```

### 🧪 **백엔드 테스트 현황**
- **총 테스트**: 100개
- **통과**: 83개 (83%)
- **실패**: 16개
- **스킵**: 1개
- **경고**: 13개 (주로 Pydantic V2 관련)

### 🌐 **프론트엔드 개발 현황 (최신)**
- **기술 스택**: React 18, Redux, Axios, Material UI
- **설치 상태**: 부분 설치 (react-scripts 미완료)
- **실행 상태**: `npm start` 실패 (react-scripts 찾을 수 없음)

---

## 🚨 **즉시 해결 필요한 이슈**

### 1️⃣ **백엔드 테스트 우선순위**
```
# 실패 테스트 Service별 분류 (최신)
- RewardService: 6개 실패 🔥 (1순위)
- NotificationService: 4개 실패 🔥 (2순위)
- AdultContentService: 3개 실패 🟡 (3순위)
- UnlockService: 3개 실패 🟡 (4순위)
```

### 2️⃣ **프론트엔드 설치 이슈**
```
❌ npm start 실패: 'react-scripts: not found'
- react-scripts 설치 미완료
- node_modules 구성 불완전
```

---

## 🎯 **현재 작업 우선순위**

### 🥇 **최우선: 백엔드 테스트 개선 (83% → 93%)**
- [x] FlashOffer 테스트 성공 패턴 확립 ✅
- [ ] **RewardService 테스트 6개 수정 (83% → 89%)** 🔥
- [ ] **NotificationService 테스트 4개 수정 (89% → 93%)** 🔥

### 🥈 **차순위: 프론트엔드 초기화 완료**
- [ ] **react-scripts 설치 문제 해결**
- [ ] **기본 컴포넌트 구조 설정**
- [ ] **백엔드 API 연동 기반 작업**

---

## 🛠️ **즉시 실행 계획**

### **백엔드 테스트 개선**
```bash
# 1. RewardService 문제 상세 분석
cd cc-webapp/backend
pytest tests/test_rewards.py -vv

# 2. RewardService FlashOffer 패턴 적용
# (페이지네이션 로직, 타임존 표준화, Mock 객체 최소화)
```

### **프론트엔드 설치 수정**
```bash
# 1. react-scripts 설치 문제 해결
cd cc-webapp-frontend
npm install react-scripts --save

# 2. 전체 의존성 재설치
rm -rf node_modules package-lock.json
npm install

# 3. 시작 테스트
npm start
```

---

## 📊 **업무 배분 제안**

### **🧪 AI 테스트 전문가 작업**
- **역할**: 백엔드 테스트 수정 및 성공률 향상
- **목표**: 16개 실패 테스트 해결 (83% → 100%)
- **우선순위**: RewardService (페이지네이션) → NotificationService

### **🎨 AI 프론트엔드 전문가 작업**
- **역할**: React 앱 초기화 문제 해결 및 구조 설정
- **목표**: 실행 가능한 프론트엔드 앱 구축
- **우선순위**: react-scripts 설치 → 폴더구조 → 기본 컴포넌트

---

## 📦 **프론트엔드 세부 정보 (OpenAI/Codex 환경 최적화)**

### **개발 환경 설정 문제**
```
❌ 현재 이슈: react-scripts 설치 미완료로 npm start 실패
❌ 원인: create-react-app 초기화 미완료
```

### **OpenAI/Codex 환경 최적화 방안**
```bash
# 1. CRA 대신 가벼운 대안 사용
# 2. 중첩 의존성 최소화
# 3. 기본 파일 구조만 수동 설정
```

### **환경 최적화 package.json**
```json
{
  "name": "cc-webapp-frontend",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@emotion/react": "^11.11.1",
    "@emotion/styled": "^11.11.0",
    "@mui/material": "^5.15.11",
    "axios": "^1.6.8",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.23.0"
  },
  "devDependencies": {
    "esbuild": "^0.19.5",
    "esbuild-plugin-inline-image": "^0.0.9",
    "serve": "^14.2.0",
    "servor": "^4.0.2"
  },
  "scripts": {
    "dev": "servor src index.html --reload --browse",
    "build": "esbuild src/index.jsx --bundle --outfile=dist/bundle.js --loader:.js=jsx",
    "serve": "serve -s dist"
  }
}
```

### **최소 파일 구조 (OpenAI/Codex 최적화)**
```
cc-webapp-frontend/
├── index.html               # 단일 HTML 파일
├── package.json             # 가벼운 구성
├── src/
│   ├── index.jsx            # 진입점
│   ├── App.jsx              # 메인 컴포넌트
│   ├── services/
│   │   └── api.js           # API 연동
│   └── components/
│       ├── shared/          # 공통 컴포넌트
│       └── pages/           # 페이지 컴포넌트
└── dist/                    # 빌드 출력
```

### **OpenAI/Codex 환경용 기본 HTML**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Casino-Club F2P</title>
</head>
<body>
  <div id="root"></div>
  <script src="./src/index.jsx" type="module"></script>
</body>
</html>
```

### **진입점 코드 (index.jsx)**
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### **간소화된 API 연동**
```javascript
// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 기본 요청 함수들
export const apiService = {
  get: (url) => api.get(url).then(response => response.data),
  post: (url, data) => api.post(url, data).then(response => response.data),
  put: (url, data) => api.put(url, data).then(response => response.data),
  delete: (url) => api.delete(url).then(response => response.data),
};
```

---

## 🛠️ **OpenAI/Codex 환경 최적화 실행 계획**

### **즉시 실행 명령어 (프론트엔드 - OpenAI/Codex 최적화)**
```bash
# 작업 디렉토리 생성
mkdir -p c:\Users\c\2026\auto202506-a\cc-webapp-frontend\src\components\shared
mkdir -p c:\Users\c\2026\auto202506-a\cc-webapp-frontend\src\components\pages
mkdir -p c:\Users\c\2026\auto202506-a\cc-webapp-frontend\src\services
mkdir -p c:\Users\c\2026\auto202506-a\cc-webapp-frontend\dist

# 기본 파일 생성
touch c:\Users\c\2026\auto202506-a\cc-webapp-frontend\index.html
touch c:\Users\c\2026\auto202506-a\cc-webapp-frontend\src\index.jsx
touch c:\Users\c\2026\auto202506-a\cc-webapp-frontend\src\App.jsx
touch c:\Users\c\2026\auto202506-a\cc-webapp-frontend\src\services\api.js

# 간소화된 패키지 설치
cd c:\Users\c\2026\auto202506-a\cc-webapp-frontend
npm init -y
npm install react react-dom axios
npm install --save-dev esbuild servor
```

### **개발 환경 테스트**
```bash
# 개발 서버 실행 (CRA 없이)
cd c:\Users\c\2026\auto202506-a\cc-webapp-frontend
npx servor src index.html --browse
```

---

## 📝 **외부 AI(OpenAI/Codex)용 프롬프트 템플릿**

### 1️⃣ **백엔드 테스트 수정 프롬프트**

```
Casino-Club F2P 프로젝트의 백엔드 테스트 중 RewardService 관련 테스트 6개가 실패하고 있습니다.

## 현재 상황
- 총 테스트: 100개 (83% 통과, 16개 실패)
- RewardService 테스트 6개 모두 페이지네이션 관련 AssertionError 발생
- FlashOfferService에 적용된 성공 패턴을 재사용해야 함

## 실패 테스트 목록
```
FAILED tests/test_rewards.py::test_get_rewards_first_page
FAILED tests/test_rewards.py::test_get_rewards_second_page  
FAILED tests/test_rewards.py::test_get_rewards_last_page_partial
FAILED tests/test_rewards.py::test_get_rewards_page_out_of_bounds
FAILED tests/test_rewards.py::test_get_rewards_no_rewards
FAILED tests/test_rewards.py::test_get_rewards_default_pagination
```
## 성공 패턴 (FlashOfferService에서 검증됨)
1. UTC 타임존 통일: `datetime.now(timezone.utc)` 사용
2. 모델 속성 정확한 매핑: 실제 DB 스키마와 일치시킴
3. Mock 객체 최소화: 필수 속성만 사용
4. 의존성 주입: 서비스 의존성 명시적 관리

## 요청사항
1. RewardService 테스트 6개를 분석하여 실패 원인 파악
2. 페이지네이션 로직을 FlashOffer 성공 패턴에 맞게 수정
3. 테스트 코드와 서비스 코드를 함께 제공

## 목표
- 6개 실패 테스트를 모두 통과시켜 통과율 83% → 89%로 향상
```

### 2️⃣ **프론트엔드 환경 설정 프롬프트**

```
Casino-Club F2P 프로젝트의 프론트엔드 환경 설정이 필요합니다. react-scripts 설치 문제로 인해 가벼운 대안이 필요합니다.

## 현재 상황
- CRA로 프로젝트 생성 시도했으나 react-scripts 설치 불완전
- npm start 실행 시 "react-scripts: not found" 오류 발생

## 기존 package.json
```json
{
  "name": "cc-webapp-frontend",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@emotion/react": "^11.11.1",
    "@emotion/styled": "^11.11.0",
    "@mui/material": "^5.15.11",
    "@reduxjs/toolkit": "^2.1.0",
    "axios": "^1.6.8",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.1.2",
    "react-scripts": "5.0.1",
    "react-router-dom": "^6.23.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

## 요청사항
1. 가벼운 React 개발 환경 구성 (react-scripts 없이)
2. 핵심 의존성만 포함하는 최소 설정
3. API 연동을 위한 기본 구조 제공
4. OpenAI/Codex 환경에서 잘 작동하는 간소화된 구성

## 필요한 파일
- index.html (기본 HTML 엔트리포인트)
- package.json (간소화된 의존성)
- 기본 React 컴포넌트 (App.jsx, index.jsx)
- API 연동 유틸리티 (api.js)

## 목표
- 의존성 문제 없이 빠르게 실행 가능한 최소 프론트엔드 환경
- 백엔드 API와 연동 준비된 구조
```

---

## 🧪 **테스트 상세 분석 결과 (외부 AI용)**

### **RewardService 테스트 실패 분석**
```
# 실패 원인:
1. 페이지네이션 계산 로직 오류
2. 타임스탬프가 UTC 표준화 되지 않음
3. UserReward 모델 속성과 실제 DB 스키마 불일치
4. Mock 객체에 불필요한 속성으로 인한 불안정

# 해결 방향:
- FlashOfferService와 동일한 타임존 표준화
- 페이지네이션 로직 개선 (offset/limit 계산)
- UserReward Mock 객체 최소화 (필수 속성만)
```

### **NotificationService 테스트 실패 분석**
```
# 실패 원인:
1. 알림 상태(pending/processed) 관리 불일치
2. User 찾기 로직 오류
3. 순차 처리 보장 안됨

# 해결 방향:
- 알림 상태 전이 로직 개선
- 사용자 조회 로직 안정화
- 순차 처리 보장 메커니즘 추가
```

---

## 🚀 **특별 안내: 외부 AI 사용 시 주의사항**

1. **환경 제약 고려**: 외부 AI는 파일 시스템 직접 접근 불가
2. **파일 내용 제공**: 핵심 코드는 프롬프트에 포함
3. **단계적 접근**: 한 번에 모든 문제가 아닌 중요도별 해결
4. **명확한 지시**: "이 코드를 수정해서 테스트를 통과시켜주세요" 형태로 명확히

### **최적 프롬프트 형식**:
1. **상황 설명**: 명확한 문제 상태
2. **관련 코드**: 실패 코드와 의존 코드
3. **목표**: 구체적인 성공 기준
4. **제약 사항**: 환경 제약, 고려사항
