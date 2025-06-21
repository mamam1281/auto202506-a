# 🚀 빠른 시작 가이드

## ⚡ 5분 안에 시작하기

### 1. 기본 컴포넌트 import
```tsx
// 필수 컴포넌트들
import { Button } from './components/Button';
import { Input } from './components/Input';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ProgressLoader } from './components/ProgressLoader';

// 아이콘 (Lucide React)
import { Download, Upload, User, Mail, Lock, Search } from 'lucide-react';
```

### 2. 기본 페이지 구조
```tsx
export default function MyPage() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* 헤더 */}
      <header className="safe-top p-grid-2 md:p-grid-3 border-b border-[#333333]">
        <div className="container-responsive">
          <h1>페이지 제목</h1>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="safe-bottom p-grid-2 md:p-grid-3">
        <div className="container-responsive">
          {/* 콘텐츠 */}
        </div>
      </main>
    </div>
  );
}
```

### 3. 빠른 버튼 사용법
```tsx
// 기본 버튼들
<Button variant="primary" size="md" onClick={handleClick}>
  기본 버튼
</Button>

// 아이콘 버튼
<Button variant="gradient" size="lg" icon={<Download />}>
  다운로드
</Button>

// 로딩 버튼
<Button variant="success" size="md" loading={isLoading}>
  저장 중...
</Button>

// 전체 너비 버튼
<Button variant="info" size="lg" fullWidth>
  제출하기
</Button>
```

### 4. 빠른 인풋 사용법
```tsx
// 이메일 인풋
<Input 
  variant="email" 
  size="md" 
  label="이메일"
  placeholder="user@example.com"
  fullWidth
/>

// 패스워드 인풋
<Input 
  variant="password" 
  size="md" 
  label="비밀번호"
  type="password"
  showPasswordToggle
  fullWidth
/>

// 검색 인풋
<Input 
  variant="search" 
  size="md" 
  placeholder="검색어를 입력하세요..."
  fullWidth
/>
```

### 5. 기본 레이아웃 패턴
```tsx
// 카드 레이아웃
<div className="bg-[#2d2d2d] rounded-xl p-grid-3 border border-[#333333]">
  <h2 className="mb-4">카드 제목</h2>
  <p className="text-[#D1D5DB] mb-4">카드 내용</p>
  <Button variant="primary">액션</Button>
</div>

// 그리드 레이아웃
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-grid-3">
  <div>아이템 1</div>
  <div>아이템 2</div>
  <div>아이템 3</div>
</div>

// 폼 레이아웃
<form className="space-y-grid-3">
  <Input label="이름" fullWidth />
  <Input label="이메일" type="email" fullWidth />
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-grid-2">
    <Button variant="primary" type="submit" fullWidth>제출</Button>
    <Button variant="outline" type="button" fullWidth>취소</Button>
  </div>
</form>
```

## 🎨 컬러 가이드

### 버튼 컬러 선택
```tsx
// 주요 액션 (CTA)
<Button variant="gradient">지금 시작하기</Button>
<Button variant="gradient-purple">특별 혜택</Button>

// 일반 액션
<Button variant="primary">확인</Button>      // 메인 액션
<Button variant="secondary">취소</Button>    // 보조 액션

// 상태별 액션
<Button variant="success">저장</Button>      // 성공
<Button variant="error">삭제</Button>        // 위험
<Button variant="info">정보</Button>         // 정보
<Button variant="accent">강조</Button>       // 강조
```

### 텍스트 컬러
```tsx
// 기본 텍스트: text-white
// 보조 텍스트: text-[#D1D5DB]
// 비활성 텍스트: text-[#A0A0A0]
// 에러 텍스트: text-[#B90C29]
// 성공 텍스트: text-[#10B981]
```

## 📱 반응형 가이드

### 모바일 우선 설계
```tsx
// 모바일: 1열, 태블릿: 2열, 데스크톱: 3열
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-grid-2">

// 모바일: 세로 배치, 데스크톱: 가로 배치
<div className="flex flex-col lg:flex-row gap-grid-2">

// 모바일: 전체 너비, 데스크톱: 자동 너비
<Button fullWidth className="lg:w-auto">
```

### 터치 최적화
```tsx
// 터치 친화적 크기 (최소 44px)
<Button size="md">  // 40px - 터치 가능
<Button size="lg">  // 48px - 터치 최적화

// 터치 간격
<div className="space-y-grid-2">  // 16px 간격
```

## 🔧 상태 관리 패턴

### 기본 상태 관리
```tsx
const [isLoading, setIsLoading] = useState(false);
const [formData, setFormData] = useState({
  email: '',
  password: ''
});

// 로딩 처리
const handleSubmit = async () => {
  setIsLoading(true);
  try {
    // API 호출
    await submitForm(formData);
  } finally {
    setIsLoading(false);
  }
};
```

### 폼 상태 관리
```tsx
const [errors, setErrors] = useState<Record<string, string>>({});

const handleInputChange = (field: string, value: string) => {
  setFormData(prev => ({ ...prev, [field]: value }));
  // 에러 제거
  if (errors[field]) {
    setErrors(prev => ({ ...prev, [field]: '' }));
  }
};
```

## 🎯 실전 팁

### 1. 컴포넌트 조합
```tsx
// 검색 영역
<div className="flex gap-grid-2">
  <Input 
    variant="search" 
    placeholder="검색..." 
    className="flex-1"
  />
  <Button variant="primary" icon={<Search />} iconOnly />
</div>

// 액션 버튼 그룹
<div className="flex gap-grid-2">
  <Button variant="outline" icon={<X />}>취소</Button>
  <Button variant="primary" icon={<Check />}>확인</Button>
</div>
```

### 2. 로딩 상태 처리
```tsx
// 버튼 로딩
<Button 
  variant="primary" 
  loading={isSubmitting}
  disabled={!isValid}
>
  {isSubmitting ? '제출 중...' : '제출하기'}
</Button>

// 페이지 로딩
{isLoading ? (
  <div className="flex justify-center p-grid-4">
    <LoadingSpinner size="lg" />
  </div>
) : (
  <Content />
)}
```

### 3. 에러 처리
```tsx
<Input 
  variant="email"
  label="이메일"
  error={errors.email}
  value={formData.email}
  onChange={(e) => handleInputChange('email', e.target.value)}
/>
```

## 📋 개발 체크리스트

### ✅ 시작 전 체크
- [ ] 필요한 컴포넌트 import 완료
- [ ] 기본 페이지 구조 설정
- [ ] 상태 관리 패턴 결정
- [ ] 반응형 브레이크포인트 확인

### ✅ 개발 중 체크
- [ ] 8px 그리드 시스템 준수
- [ ] 터치 최적화 (44px 최소 크기)
- [ ] 로딩 상태 처리
- [ ] 에러 상태 처리
- [ ] 접근성 고려 (키보드 탐색)

### ✅ 완료 전 체크
- [ ] 모바일 반응형 테스트
- [ ] 다크 테마 적용 확인
- [ ] 애니메이션 부드러움 확인
- [ ] 성능 최적화 (불필요한 리렌더링 방지)

이 가이드만으로도 바로 개발을 시작할 수 있습니다! 🚀