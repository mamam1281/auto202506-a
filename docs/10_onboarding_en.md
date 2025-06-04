# 🚪 제한된 코드회원 온보딩 가이드

## 10.1. 진입 흐름 (초대 코드 기반 인증) 🔐

### 초대 코드 입력 페이지 (/)

#### 화면 설명
- 안내 텍스트: 
  - "이 앱은 제한된 코드회원 전용입니다. 관리자에게 초대 코드를 요청하세요."

#### 입력 필드 및 검증
- 입력: "초대 코드 (6자리)"
- 버튼: "다음"

#### 클라이언트 사이드 검증
```javascript
if (!/^[A-Z0-9]{6}$/.test(code)) {
  setError("유효한 초대 코드를 입력하세요.");
  return;
}
// 서버에 코드 유효성 확인 API 없으므로, 클라이언트에서 바로 다음 단계로 이동
navigate("/login");
```

### 닉네임/비밀번호 설정 페이지 (/login) 🔑

#### 화면 설명
- 안내 텍스트: 
  - "초대 코드를 입력했나요? 이제 닉네임과 비밀번호를 설정해주세요."

#### 입력 필드
- 닉네임 (영문/숫자, 3~12자)
- 비밀번호 (8~20자, 영문+숫자 필수)
- 비밀번호 확인

#### 입력 검증 및 API 호출
```javascript
if (nickname.length < 3 || nickname.length > 12) {
  setError("닉네임은 3~12자이어야 합니다.");
  return;
}
if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/.test(password)) {
  setError("비밀번호는 영문+숫자 포함 8~20자여야 합니다.");
  return;
}
if (password !== confirmPassword) {
  setError("비밀번호가 일치하지 않습니다.");
  return;
}
// API 호출
const resp = await axios.post("/api/auth/login", {
  invite_code: inviteCode,
  nickname,
  password
});
localStorage.setItem("access_token", resp.data.access_token);
navigate("/dashboard");
```

### 초기 토큰 지급 (Onboarding Reward) 🎁

#### 가입 보상 메커니즘
- 첫 로그인 시 CJ AI가 자동으로 "가입 축하 200토큰 지급"
- `/api/rewards`에 기록
  - `reward_type`: "ONBOARD_BONUS"
  - `reward_value`: "200_TOKEN"
- Redis 업데이트: `user:{id}:cyber_token_balance += 200`

## 10.2. CJ AI 온보딩 대사 예시 💬

### 첫 인사 및 환영 메시지
- "안녕하세요, {nickname}님! 코드회원 전용 앱에 오신 것을 환영합니다. 가입 축하로 200토큰을 드렸어요! 🎁"
- "지금 가지고 계신 토큰으로 슬롯을 돌려보세요. 첫 스핀은 무료로 도전 가능합니다!"
- "앱 사용 중 궁금한 점이 있으면 언제든 물어보세요. 제가 도와드리겠습니다. 😊"

## 10.3. UI/UX 핵심 포인트 🌈

### 1. 간결한 진입 흐름
- 초대 코드 입력 → 닉네임/비밀번호 → 즉시 대시보드 진입
- 단계 최소화로 사용자 경험 최적화

### 2. 심리적 보상 강화
- 가입 시점 즉시 토큰 지급
- CJ AI 웰컴 메시지로 도파민 분비 유도

### 3. 관계 중심 온보딩
- CJ AI의 첫 인사로 "친밀감" 형성
- 지속적인 대화 유도