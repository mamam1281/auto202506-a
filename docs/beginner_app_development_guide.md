# 🚀 첫 번째 개발자를 위한 상용 앱 개발 가이드

## 📚 **앱 개발이 뭔가요?**

### **간단히 설명하면:**
- **프론트엔드** = 사용자가 보는 화면 (버튼, 색깔, 디자인)
- **백엔드** = 뒤에서 돌아가는 로직 (데이터 저장, 계산)
- **UI/UX** = 예쁘고 사용하기 쉽게 만드는 것

**예시**: 카카오톡
- 프론트엔드: 채팅 화면, 버튼들
- 백엔드: 메시지 전송, 저장
- UI/UX: 사용하기 편한 디자인

---

## 📋 **1단계: 기획 (뭘 만들지 정하기)**

### ✅ **우리 프로젝트 기획 (CCF2P 게임 플랫폼)** - **2025.06.18 업데이트**

#### **1. 우리 앱이 뭘 하는 앱인가요?**
**"VIP 초대받은 사람들이 게임으로 토큰 모아서 성인 콘텐츠 언락하고 CJ AI와 채팅하는 앱"**

#### **2. 현재 구현 현황 (2025.06.18 기준)**
- ✅ **백엔드 완성도**: 80% (274개 테스트 100% 통과)
- ✅ **게임 시스템**: 100% (슬롯, 룰렛, 가챠, RPS 완전 구현)
- ✅ **토큰 시스템**: 100% (실제 DB 기반 완전 구현)
- ✅ **CJ AI 기반**: 90% (기본 구조 완성, WebSocket 연동)
- 🔄 **프론트엔드**: 70% (4개 게임 페이지 완성, 카드 시스템 설계중)
- 📋 **성인 콘텐츠**: 80% (VIP 시스템 구현, 연령 인증 완료)

#### **2. 핵심 기능 8개**
1. **🎫 VIP 초대 시스템** - 초대코드로만 가입 가능
2. **🎮 4가지 게임** - 슬롯머신, 룰렛, 가챠, 가위바위보
3. **💎 사이버 토큰** - 게임하고 토큰 획득/소비
4. **🤖 CJ AI 채팅** - 실장 대체 AI와 대화
5. **🔞 성인 콘텐츠** - 토큰으로 VIP 콘텐츠 언락
6. **📊 감정 분석** - AI가 사용자 감정 분석해서 맞춤 반응
7. **🏆 리워드 시스템** - 데일리 보너스, 연속 접속 보상
8. **🌐 본사 연동** - 토큰 부족 시 본사 사이트에서 충전

#### **3. 사용자 전체 사용 과정**

```
📱 앱 설치
   ↓
🎫 초대코드 입력 (VIP만 가능)
   ↓
👤 닉네임 + 비밀번호 설정
   ↓
🎉 CJ AI 웰컴 메시지 + 가입 축하 토큰 200💎 지급
   ↓
📊 대시보드 (메인 화면)
├── 💎 토큰 잔고 확인
├── 🎮 게임 선택 (4개 중 1개)
├── 🤖 CJ AI 채팅 버블 
└── 📈 오늘의 미션 카드들
   ↓
🎰 게임 플레이 (예: 슬롯머신)
├── 💰 베팅 금액 선택 (10💎, 20💎, 50💎)
├── 🎲 게임 실행 (스핀/베팅/뽑기)
├── 📊 CJ AI 감정 분석 ("흥미진진해 보이네요!")
└── 🎁 결과 (승리 시 토큰 획득, 실패 시 격려)
   ↓
💎 토큰 충분한가?
├── ✅ 충분 → 계속 게임 or 콘텐츠 언락
└── ❌ 부족 → 🌐 본사 사이트로 이동해서 토큰 충전
   ↓
🔞 성인 콘텐츠 언락 (토큰 소비)
├── 🎫 Stage 1 언락 (200💎)
├── 🎫 Stage 2 언락 (500💎)  
└── 🎫 Stage 3 언락 (1,000💎)
   ↓
🎊 VIP 콘텐츠 이용
├── 📱 앱에서 콘텐츠 감상
├── 🤖 CJ AI와 콘텐츠에 대한 대화
└── 💝 만족도에 따른 추가 토큰 보너스
   ↓
🔄 반복 사이클
├── 📅 데일리 체크인 (매일 50💎)
├── 🔥 연속 접속 보너스 (스트릭)
├── 🎪 플래시 오퍼 이벤트 (한정 시간 할인)
└── 🏆 리더보드 순위 경쟁
   ↓
💤 앱 종료 → 🔔 푸시 알림 → 📱 재접속
```

#### **4. 세부 기능별 사용자 여정**

**🎮 게임 플레이 상세 과정:**
```
게임 선택 → 베팅 설정 → CJ AI 응원 → 게임 실행 → 결과 확인 → 감정 피드백 → 다음 액션
```

**🤖 CJ AI 상호작용:**
```
사용자 액션 → AI 감정 분석 → 맞춤 메시지 → 사용자 반응 → 관계도 향상 → 특별 보너스
```

**🔞 성인 콘텐츠 언락:**
```
콘텐츠 발견 → 토큰 확인 → 언락 결정 → 결제 → 콘텐츠 이용 → 만족도 평가 → AI 피드백
```

**🌐 본사 연동 흐름:**
```
토큰 부족 감지 → 충전 알림 → 본사 사이트 이동 → 결제 → 토큰 충전 → 앱 복귀 → 게임 재개
```

### 📱 **전체 UI 페이지/컴포넌트 완전 분해 (개발 체크리스트)**

#### **🔐 A. 인증/접근 관련 페이지**

**A1. 스플래시 화면 (`/splash`)**
- [ ] 로고 애니메이션
- [ ] 로딩 스피너
- [ ] 앱 버전 표시
- [ ] 자동 로그인 체크

**A2. 초대코드 입력 페이지 (`/invite`)**
- [ ] 초대코드 입력 필드
- [ ] VIP 전용 메시지
- [ ] 코드 검증 버튼
- [ ] 오류 메시지 표시
- [ ] "초대받지 못했나요?" 링크

**A3. 회원가입 페이지 (`/signup`)**
- [ ] 닉네임 입력 필드
- [ ] 비밀번호 입력 필드  
- [ ] 비밀번호 확인 필드
- [ ] 약관 동의 체크박스
- [ ] 가입 완료 버튼
- [ ] 중복 확인 기능

**A4. 로그인 페이지 (`/login`)**
- [ ] 닉네임/이메일 입력
- [ ] 비밀번호 입력
- [ ] 로그인 버튼
- [ ] 비밀번호 찾기 링크
- [ ] 자동 로그인 체크박스

**A5. 웰컴 페이지 (`/welcome`)**
- [ ] CJ AI 캐릭터 애니메이션
- [ ] 가입 축하 메시지
- [ ] 200💎 지급 애니메이션
- [ ] "시작하기" 버튼
- [ ] 튜토리얼 스킵 옵션

#### **🏠 B. 메인 대시보드**

**B1. 대시보드 메인 (`/dashboard`)**
- [ ] 상단 헤더 (토큰 잔고, 프로필)
- [ ] CJ AI 채팅 버블 (항상 표시)
- [ ] 게임 선택 카드 4개
- [ ] 오늘의 미션 섹션
- [ ] 하단 네비게이션 바
- [ ] 리프레시 기능

**B2. 헤더 컴포넌트**
- [ ] 토큰 잔고 위젯 (💎 개수)
- [ ] 프로필 아바타
- [ ] 설정 버튼
- [ ] 알림 벨 (뱃지 포함)
- [ ] 충전 버튼 (토큰 부족 시 강조)

**B3. 하단 네비게이션**
- [ ] 홈 탭
- [ ] 게임 탭  
- [ ] AI 채팅 탭
- [ ] 콘텐츠 탭
- [ ] 내 정보 탭

#### **🎮 C. 게임 관련 페이지** - **2025.06.18 업데이트**

**C1. 게임 선택 페이지 (`/games`)** - **설계 완료**
- 🎨 **카드 컴포넌트 시스템 적용** (CardGame 사용)
- [ ] 게임 카드 그리드 (4개) - CardGame 컴포넌트로 구현
- [ ] 각 게임별 미리보기 이미지
- [ ] 최소 베팅 금액 표시
- [ ] 최근 플레이한 게임 하이라이트
- [ ] "새로운 게임" 뱃지

**C2. 슬롯머신 게임 (`/games/slot-machine`)** - **✅ 백엔드 100% 완성**
✅ **현실 체크: 백엔드 완전 구현됨, 프론트엔드 UI 개선 필요**
- [x] ✅ **완전한 슬롯 로직** (Variable-Ratio + DB 연동)
- [x] ✅ **토큰 베팅 시스템** (실제 DB 기반)
- [x] ✅ **스트릭 보너스** (7연패 시 100% 승리)
- [x] ✅ **세그먼트별 확률 조정**
- [ ] **프론트엔드 UI 고도화** (토큰 잔고 헤더 연동)
- [ ] **VIP 다크 테마** (네온 색상 + 고급 UI)
- [ ] **CJ AI 실시간 코멘트 박스**
- [ ] **승리/패배 이펙트** (상용 앱 수준)
- [ ] **사운드 효과** (배경음 + 효과음)

**C3. 룰렛 게임 (`/games/roulette`)** - **✅ 백엔드 100% 완성**
- [x] ✅ **완전한 룰렛 로직** (베팅 타입별 페이아웃)
- [x] ✅ **하우스 엣지 조정**
- [x] ✅ **실제 DB 토큰 연동**
- [ ] **프론트엔드 UI 구현** (룰렛 휠 애니메이션)
- [ ] 베팅 테이블 (숫자, 색깔)
- [ ] 베팅 칩 선택
- [ ] 스핀 버튼
- [ ] 결과 표시 애니메이션

**C4. 가챠 시스템 (`/games/gacha`)** - **✅ 백엔드 100% 완성**
- [x] ✅ **Pity System** (등급별 확률 보장)
- [x] ✅ **등급별 확률 테이블** (Legendary/Epic/Rare/Common)
- [x] ✅ **히스토리 기반 중복 방지**
- [x] ✅ **실제 DB 토큰 관리**
- [ ] **프론트엔드 UI 구현** (가챠 애니메이션)

**C5. RPS 게임 (`/games/rps`)** - **✅ 백엔드 100% 완성**
- [x] ✅ **가위바위보 베팅 시스템**
- [x] ✅ **승부 로직 + 완전 API 연동**
- [x] ✅ **실제 DB 토큰 관리**
- [ ] **프론트엔드 UI 구현** (RPS 게임 인터페이스)

#### **🤖 D. CJ AI 관련 UI**

**D1. AI 채팅 페이지 (`/ai-chat`)**
- [ ] CJ 캐릭터 아바타
- [ ] 채팅 메시지 리스트
- [ ] 메시지 입력창
- [ ] 음성 메시지 버튼
- [ ] 감정 이모티콘 퀵 버튼
- [ ] 대화 히스토리

**D2. AI 감정 분석 위젯**
- [ ] 현재 감정 상태 표시
- [ ] 감정 변화 그래프
- [ ] AI 추천 액션
- [ ] 감정별 맞춤 메시지
- [ ] 기분 개선 제안

**D3. AI 설정 페이지**
- [ ] CJ 성격 조절 슬라이더
- [ ] 반응 속도 설정
- [ ] 알림 빈도 설정
- [ ] 학습 데이터 관리
- [ ] 개인화 옵션

#### **🔞 E. 성인 콘텐츠 관련**

**E1. 콘텐츠 미리보기 (`/content`)**
- [ ] Stage별 썸네일 카드
- [ ] 언락 가격 표시 (200💎, 500💎, 1000💎)
- [ ] 잠금/해제 상태 표시
- [ ] 미리보기 이미지 (블러 처리)
- [ ] 연령 확인 경고

**E2. 언락 확인 모달**
- [ ] 언락 할 콘텐츠 정보
- [ ] 소비될 토큰 양
- [ ] 확인/취소 버튼
- [ ] 토큰 부족 시 충전 링크
- [ ] 재확인 메시지

**E3. 콘텐츠 뷰어**
- [ ] 풀스크린 이미지/비디오 플레이어
- [ ] 컨트롤 버튼 (재생/일시정지)
- [ ] CJ AI 실시간 코멘트
- [ ] 만족도 평가 버튼
- [ ] 다음/이전 콘텐츠 이동

**E4. 만족도 평가 모달**
- [ ] 별점 선택 (1-5)
- [ ] 한줄 코멘트 입력
- [ ] 보너스 토큰 지급 표시
- [ ] 유사 콘텐츠 추천
- [ ] AI 피드백 메시지

#### **💎 F. 토큰/결제 관련**

**F1. 토큰 충전 페이지 (`/recharge`)**
- [ ] 현재 잔고 표시
- [ ] 충전 패키지 옵션
- [ ] 본사 사이트 이동 버튼
- [ ] 충전 히스토리
- [ ] 보너스 이벤트 표시

**F2. 결제 프로세스**
- [ ] 외부 결제 사이트 연동
- [ ] 결제 상태 표시
- [ ] 성공/실패 페이지
- [ ] 영수증 표시
- [ ] 앱 복귀 버튼

**F3. 토큰 히스토리**
- [ ] 수입/지출 로그
- [ ] 날짜별 필터
- [ ] 카테고리별 분류
- [ ] 통계 차트
- [ ] CSV 내보내기

#### **🏆 G. 리워드/미션 시스템**

**G1. 미션 페이지 (`/missions`)**
- [ ] 데일리 미션 카드들
- [ ] 위클리 챌린지
- [ ] 스페셜 이벤트
- [ ] 진행도 프로그레스 바
- [ ] 보상 미리보기

**G2. 리워드 센터**
- [ ] 받을 수 있는 보상 리스트
- [ ] 보상 받기 버튼
- [ ] 애니메이션 효과
- [ ] 보상 히스토리
- [ ] 다음 보상 미리보기

**G3. 리더보드**
- [ ] 주간/월간 랭킹
- [ ] 내 순위 하이라이트
- [ ] 상위 유저 리스트
- [ ] 경쟁 보상 정보
- [ ] 친구 초대 기능

#### **⚙️ H. 설정/프로필 관련**

**H1. 프로필 페이지 (`/profile`)**
- [ ] 프로필 사진 변경
- [ ] 닉네임 수정
- [ ] 게임 통계 표시
- [ ] 가입일/레벨 정보
- [ ] 업적 배지

**H2. 설정 페이지 (`/settings`)**
- [ ] 알림 설정 토글
- [ ] 사운드 설정
- [ ] 언어 선택
- [ ] 개인정보 설정
- [ ] 계정 관리

**H3. 고객지원**
- [ ] FAQ 섹션
- [ ] 문의하기 폼
- [ ] 이용약관
- [ ] 개인정보처리방침
- [ ] 앱 버전 정보

#### **🔔 I. 알림/푸시 관련**

**I1. 알림 센터**
- [ ] 알림 메시지 리스트
- [ ] 읽음/안읽음 상태
- [ ] 카테고리별 분류
- [ ] 알림 삭제 기능
- [ ] 바로가기 링크

**I2. 푸시 알림 템플릿**
- [ ] 데일리 체크인 알림
- [ ] 토큰 충전 알림
- [ ] 새 콘텐츠 알림
- [ ] 이벤트 알림
- [ ] CJ AI 메시지 알림

#### **📊 J. 공통 UI 컴포넌트**

**J1. 로딩/에러 처리**
- [ ] 로딩 스피너/스켈레톤
- [ ] 에러 페이지 (404, 500)
- [ ] 네트워크 오류 처리
- [ ] 재시도 버튼
- [ ] 오프라인 모드 안내

**J2. 모달/팝업**
- [ ] 확인 다이얼로그
- [ ] 토스트 알림
- [ ] 바텀시트
- [ ] 이미지 갤러리
- [ ] 비디오 플레이어

**J3. 애니메이션 효과**
- [ ] 페이지 전환 애니메이션
- [ ] 토큰 획득 애니메이션
- [ ] 버튼 터치 피드백
- [ ] 카드 플립 효과
- [ ] 파티클 효과

---

### ✅ **페이지별 개발 우선순위**

**🔥 최우선 (MVP - 1-2주)**
❌ **현실 체크: 거의 모든 것이 처음부터 구현 필요**
1. A2, A3, A4: 초대코드 + 회원가입 + 로그인
2. B1, B2: 메인 대시보드 + 헤더 (토큰 시스템)
3. C2: 슬롯머신 **완전 재구현** (VIP 테마 + 토큰 베팅)
4. D1: 기본 AI 채팅 (CJ 캐릭터)
5. F1: 토큰 충전 페이지

🚨 **실제 개발 현황**: 
- ✅ **완성**: 없음 (기본 프로토타입만 존재)
- 🔄 **진행중**: SlotMachine 기본 로직 (30%)
- ❌ **미착수**: 토큰 시스템, AI, 대시보드, 로그인 등 95%

**⚡ 우선 (기능 확장 - 3-4주)**
1. C3, C4, C5: 룰렛, 가챠, 가위바위보
2. E1, E2, E3: 성인 콘텐츠 시스템
3. G1, G2: 미션 + 리워드 시스템
4. D2: AI 감정 분석

**📈 나중에 (고도화 - 5-8주)**
1. G3: 리더보드
2. H1, H2: 프로필 + 설정
3. I1, I2: 알림 시스템
4. J1, J2, J3: 고급 UI 컴포넌트

---

## 🚨 **현실 체크: 실제 프로젝트 상황**

### ❌ **현재 구현 상태 (정직한 평가)**
- **완성된 것**: 거의 없음 (SlotMachine 기본 로직 30% 정도)
- **토큰 시스템**: 0% (베팅, 잔고, 충전 모두 없음)
- **VIP 테마 디자인**: 0% (기본 회색 테마)
- **CJ AI**: 0% (실제 AI 연동 없음)
- **성인 콘텐츠**: 0% (관련 UI 없음)
- **대시보드**: 0% (메인 화면 없음)
- **로그인/회원가입**: 0%

### ✅ **실제 해야 할 일 (처음부터 시작)**

**1단계 (가장 기본): 토큰 시스템 + 헤더**
```bash
# 새로 만들어야 할 것들:
1. TokenBalance 헤더 컴포넌트 (💎1,250 표시)
2. 슬롯머신에 베팅 버튼 추가 (10💎, 20💎, 50💎)
3. 토큰 차감/추가 로직
4. VIP 다크 테마 색상 적용
```

**2단계: 메인 대시보드**
```bash
# 완전히 새로 구현:
1. 메인 페이지 레이아웃
2. 게임 선택 카드들
3. 하단 네비게이션
4. CJ AI 채팅 버블
```

**3단계: 로그인/회원가입**
```bash
# 0%에서 시작:
1. 초대코드 페이지
2. 회원가입 폼
3. 로그인 폼  
4. 인증 로직
```

**실제 작업량**: 위에 나열한 50+개 페이지/컴포넌트 중 **95%가 처음부터 구현 필요**

---

1단계: API 문서 이해 및 연동 계획 수립 (지금 바로 해야 할 일!)
가장 먼저 해야 할 일은 백엔드에서 제공하는 API 문서를 완벽하게 이해하는 것입니다.

백엔드 API 문서 확인: 백엔드 팀으로부터 API 명세서(Swagger, OpenAPI 문서 등)를 받아서 각 API 엔드포인트가 어떤 데이터를 주고받는지, 어떤 방식으로 호출해야 하는지 등을 상세히 확인해야 합니다.
우리 프로젝트의 경우: docs/openapi.yaml 파일에 OpenAPI 문서가 정의되어 있으니 이 파일을 먼저 살펴보세요. 이 문서가 백엔드와 프론트엔드 간의 약속이자 핵심 가이드가 될 것입니다.
프론트엔드에서 사용할 데이터 구조 파악: 화면에 어떤 정보를 표시해야 하는지, 사용자 입력은 어떤 형태로 백엔드로 보내야 하는지 등을 API 문서를 통해 미리 파악합니다.
API 연동 계획 수립:
어떤 페이지에서 어떤 API를 호출할지 정의합니다.
API 호출 시 필요한 데이터는 무엇이고, 응답 데이터는 어떻게 처리할지 큰 그림을 그립니다.
오류 처리 (예: 네트워크 오류, 서버 응답 오류)는 어떻게 할지 간단히 생각해둡니다.
2단계: UI/UX 디자인 및 프로토타이핑 (Figma 활용!)
이제 Figma를 활용할 차례입니다. API 문서를 기반으로 사용자가 실제로 보게 될 화면을 디자인합니다.

와이어프레임 & 목업 제작:
와이어프레임: 페이지의 큰 틀과 요소들의 배치를 그립니다. (예: 로그인 화면에는 입력창 2개, 로그인 버튼 1개)
목업: 와이어프레임에 실제 색상, 이미지, 폰트 등을 적용하여 실제 앱과 거의 흡사한 디자인을 만듭니다.
사용자 플로우 정의: 사용자가 앱을 어떻게 사용할지, 어떤 화면에서 다음 화면으로 넘어갈지 등의 흐름을 Figma에서 시각적으로 나타냅니다. (예: 로그인 -> 메인 대시보드 -> 가챠 게임 클릭 -> 가챠 게임 화면)
컴포넌트 단위 디자인: 반복적으로 사용될 UI 요소(버튼, 입력 필드, 카드 등)는 컴포넌트화하여 디자인합니다. 이는 나중에 React 컴포넌트 개발 시 재활용성을 높이는 데 도움이 됩니다.
우리 프로젝트의 경우: components 디렉토리에 이미 Gacha.jsx, RPSGame.jsx, Roulette.jsx, SlotMachine.jsx 등 기본적인 컴포넌트들이 정의되어 있습니다. Figma 디자인 시 이 컴포넌트들의 형태를 참고하거나, 필요에 따라 새롭게 디자인하여 기존 컴포넌트를 개선할 수 있습니다.
디자인 시스템 구축 (선택 사항이나 권장): 앱 전반에 걸쳐 일관된 디자인을 유지하기 위한 규칙(색상 팔레트, 폰트, 간격 등)을 Figma에 정의합니다. Tailwind CSS를 사용하고 있으므로, Figma 디자인과 Tailwind CSS 유틸리티 클래스 간의 매핑을 고려하면 좋습니다.
3단계: 프론트엔드 개발 환경 설정 및 프로젝트 초기화
우리 프로젝트는 이미 Next.js로 기본적인 설정이 되어 있으니, 필요한 의존성 설치만 하면 됩니다.

의존성 설치: cc-webapp/frontend 디렉토리로 이동하여 npm install 또는 yarn install 명령어를 실행하여 필요한 라이브러리들을 설치합니다.
개발 서버 실행: npm run dev 또는 yarn dev 명령어를 실행하여 개발 서버를 띄우고, 디자인한 내용을 바탕으로 UI가 잘 나오는지 확인하며 개발을 시작합니다.
4단계: 컴포넌트 기반 UI 개발
디자인된 내용을 바탕으로 React 컴포넌트를 개발합니다.

레이아웃 구성: app/layout.js 파일을 활용하여 앱 전체의 공통 레이아웃 (예: 헤더, 네비게이션 바, 푸터, 전역 알림)을 구현합니다.
페이지 및 라우트 구현: app 디렉토리 내의 각 서브 디렉토리 (app/gacha, app/profile 등)에 page.jsx 파일을 수정하거나 새로 생성하여 각 페이지의 UI를 구현합니다.
재사용 가능한 컴포넌트 개발: components/ 디렉토리에 Figma에서 디자인한 컴포넌트들을 React 컴포넌트로 구현합니다.
상태 관리: React의 useState, useEffect, useContext 훅을 활용하여 컴포넌트의 상태를 관리합니다. 복잡한 전역 상태 관리가 필요하다면 Zustand나 React Query와 같은 라이브러리를 고려할 수 있습니다.
5단계: API 연동 및 데이터 처리
이제 프론트엔드와 백엔드를 연결합니다.

apiClient.js 활용: utils/apiClient.js에 이미 Axios 기반의 API 클라이언트가 설정되어 있으므로, 이를 활용하여 백엔드 API를 호출합니다.
데이터 페칭: React 컴포넌트 내에서 useEffect 훅이나 서버 컴포넌트의 데이터 페칭 기능을 활용하여 API를 호출하고 데이터를 받아옵니다.
응답 데이터 처리: API 응답으로 받은 데이터를 UI에 맞게 가공하고 렌더링합니다.
사용자 입력 처리: 사용자 입력을 받아 유효성 검사를 수행하고, 이를 백엔드 API 호출에 필요한 형태로 변환하여 전송합니다.
6단계: 상태 관리 및 로직 구현 (게임 로직 등)
각 페이지 및 컴포넌트의 동적인 부분과 핵심 로직을 구현합니다.

게임 로직: 가챠, 룰렛, 가위바위보, 슬롯 머신 등 각 게임의 핵심 동작 로직을 components 디렉토리 내의 해당 컴포넌트 (Gacha.jsx, Roulette.jsx 등)에 구현합니다. rewardUtils.js와 같은 유틸리티 파일을 활용하여 보상 계산 등을 처리할 수 있습니다.
useEmotionFeedback 훅 활용: 사용자의 감정 변화에 따라 피드백을 제공하는 hooks/useEmotionFeedback.js 훅과 components/EmotionFeedback.jsx 컴포넌트를 활용하여 앱의 감성적인 상호작용 부분을 구현합니다.
알림 및 피드백: NotificationBanner.jsx 컴포넌트를 활용하여 사용자에게 중요한 정보나 이벤트 알림을 표시합니다.
7단계: 테스트 및 디버깅
개발한 기능이 올바르게 작동하는지 확인하고 오류를 수정합니다.

단위 테스트: Jest를 사용하여 각 컴포넌트나 유틸리티 함수의 개별적인 기능을 테스트합니다. (__tests__/EmotionFeedback.test.jsx, __tests__/rewardUtils.test.js, __tests__/useEmotionFeedback.test.js 참고)
통합 테스트: 여러 컴포넌트가 함께 작동하는 시나리오를 테스트합니다.
E2E 테스트: Cypress를 사용하여 실제 사용자의 흐름과 동일하게 앱 전체의 기능을 테스트합니다. (cypress/integration/cc_flow.spec.js 참고)
브라우저 개발자 도구 활용: 콘솔 로그, 네트워크 요청, 컴포넌트 상태 등을 확인하며 디버깅합니다.
8단계: 성능 최적화 및 배포 준비
앱의 성능을 개선하고 실제 서비스 환경에 배포하기 위한 준비를 합니다.

코드 최적화: 불필요한 렌더링 줄이기, 이미지 최적화, 코드 스플리팅 등을 고려합니다.
번들 사이즈 최적화: 웹팩 번들 분석기를 사용하여 불필요한 코드를 제거하고 번들 크기를 줄입니다.
환경 변수 설정: 개발, 테스트, 배포 환경에 따라 다른 API 엔드포인트 등의 환경 변수를 설정합니다. (next.config.mjs 및 .env.local 등 활용)