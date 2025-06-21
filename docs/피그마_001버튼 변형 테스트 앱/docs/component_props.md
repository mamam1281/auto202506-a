# 컴포넌트 Props 정의

## 🔘 Button 컴포넌트

### Props 인터페이스
```typescript
export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  /** 버튼의 시각적 스타일 변형 */
  variant?: ButtonVariant;
  
  /** 버튼의 크기 (8px 그리드 기반) */
  size?: ButtonSize;
  
  /** 현재 상태 (애니메이션 제어용) */
  state?: ButtonState;
  
  /** 로딩 상태 여부 */
  loading?: boolean;
  
  /** 비활성화 상태 여부 */
  disabled?: boolean;
  
  /** 아이콘 요소 (Lucide React 아이콘 권장) */
  icon?: React.ReactNode;
  
  /** 아이콘 위치 */
  iconPosition?: 'left' | 'right';
  
  /** 아이콘만 표시 (정사각형 버튼) */
  iconOnly?: boolean;
  
  /** 전체 너비 사용 여부 */
  fullWidth?: boolean;
  
  /** 버튼 텍스트 또는 자식 요소 */
  children?: React.ReactNode;
  
  /** 추가 CSS 클래스 */
  className?: string;
}
```

### Type 정의
```typescript
export type ButtonVariant = 
  | 'primary'           // 메인 액션 (#F59E0B)
  | 'secondary'         // 보조 액션 (#333333)
  | 'accent'            // 강조 색상 (#ff4516)
  | 'success'           // 성공 상태 (#10B981)
  | 'error'             // 에러 상태 (#B90C29)
  | 'info'              // 정보 표시 (#135B79)
  | 'outline'           // 테두리만
  | 'text'              // 텍스트만
  | 'gradient'          // 메인 그라데이션
  | 'gradient-purple';  // 퍼플 그라데이션

export type ButtonSize = 
  | 'sm'    // 32px 높이, 터치 최적화
  | 'md'    // 40px 높이, 기본 크기
  | 'lg';   // 48px 높이, 중요한 액션용

export type ButtonState = 
  | 'default'   // 기본 상태
  | 'hover'     // 호버 상태
  | 'active'    // 활성 상태 (클릭 중)
  | 'disabled'  // 비활성화 상태
  | 'loading';  // 로딩 상태
```

### 사용 예시
```tsx
// 기본 사용법
<Button variant="primary" size="md" onClick={handleClick}>
  클릭하세요
</Button>

// 아이콘과 함께
<Button variant="gradient" size="lg" icon={<Download />} loading={isLoading}>
  다운로드
</Button>

// 아이콘 전용 버튼
<Button variant="secondary" size="sm" icon={<Settings />} iconOnly />

// 전체 너비 버튼
<Button variant="success" size="lg" fullWidth>
  제출하기
</Button>

// 커스텀 스타일
<Button 
  variant="outline" 
  size="md" 
  className="hover:bg-blue-500 transition-colors"
>
  커스텀 버튼
</Button>
```

### Props 검증 및 기본값
```typescript
const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',      // 기본: primary
  size = 'md',             // 기본: medium
  state = 'default',       // 기본: default
  loading = false,         // 기본: false
  disabled = false,        // 기본: false
  iconPosition = 'left',   // 기본: 왼쪽
  iconOnly = false,        // 기본: false
  fullWidth = false,       // 기본: false
  className = '',          // 기본: 빈 문자열
  ...props
}, ref) => {
  // 컴포넌트 로직
});
```

## 📝 Input 컴포넌트

### Props 인터페이스
```typescript
export interface InputProps extends Omit<HTMLMotionProps<'input'>, 'size'> {
  /** 인풋의 시각적 스타일 변형 */
  variant?: InputVariant;
  
  /** 인풋의 크기 (8px 그리드 기반) */
  size?: InputSize;
  
  /** 현재 상태 */
  state?: InputState;
  
  /** 라벨 텍스트 (자동 애니메이션 적용) */
  label?: string;
  
  /** 에러 메시지 */
  error?: string;
  
  /** 성공 메시지 */
  success?: string;
  
  /** 비활성화 상태 여부 */
  disabled?: boolean;
  
  /** 왼쪽 아이콘 */
  leftIcon?: React.ReactNode;
  
  /** 오른쪽 아이콘 */
  rightIcon?: React.ReactNode;
  
  /** 패스워드 보기/숨기기 토글 표시 */
  showPasswordToggle?: boolean;
  
  /** 전체 너비 사용 여부 */
  fullWidth?: boolean;
  
  /** 추가 CSS 클래스 */
  className?: string;
  
  /** 컨테이너 추가 CSS 클래스 */
  containerClassName?: string;
}
```

### Type 정의
```typescript
export type InputVariant = 
  | 'default'    // 기본 스타일 (테두리)
  | 'search'     // 검색 인풋 (배경 + 검색 아이콘)
  | 'email'      // 이메일 인풋 (언더라인 + 유저 아이콘)
  | 'password'   // 패스워드 인풋 (언더라인 + 자물쇠 아이콘)
  | 'text'       // 텍스트 인풋 (테두리)
  | 'gradient';  // 그라데이션 언더라인

export type InputSize = 
  | 'sm'    // 32px 높이
  | 'md'    // 40px 높이
  | 'lg';   // 48px 높이

export type InputState = 
  | 'default'   // 기본 상태
  | 'focused'   // 포커스 상태
  | 'error'     // 에러 상태
  | 'disabled'  // 비활성화 상태
  | 'success';  // 성공 상태
```

### 사용 예시
```tsx
// 기본 사용법
<Input 
  variant="default" 
  size="md" 
  placeholder="텍스트를 입력하세요" 
/>

// 라벨과 함께
<Input 
  variant="email" 
  size="md" 
  label="이메일 주소"
  placeholder="user@example.com"
  fullWidth
/>

// 에러 상태
<Input 
  variant="email" 
  size="md" 
  label="이메일"
  error="올바른 이메일 형식이 아닙니다"
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

// 아이콘과 함께
<Input 
  variant="text" 
  size="md" 
  label="이름"
  leftIcon={<User />}
  fullWidth
/>

// 그라데이션 언더라인
<Input 
  variant="gradient" 
  size="lg" 
  label="특별한 인풋"
  placeholder="포커스해보세요"
  fullWidth
/>
```

## 🔄 LoadingSpinner 컴포넌트

### Props 인터페이스
```typescript
export interface LoadingSpinnerProps {
  /** 스피너 크기 */
  size?: LoadingSpinnerSize;
  
  /** 스피너 스타일 변형 */
  variant?: LoadingSpinnerVariant;
  
  /** 추가 CSS 클래스 */
  className?: string;
}

export type LoadingSpinnerSize = 
  | 'sm'    // 16px
  | 'md'    // 24px
  | 'lg';   // 32px

export type LoadingSpinnerVariant = 
  | 'modern'    // 현대적 스타일 (단색 링)
  | 'classic';  // 클래식 스타일 (그라데이션)
```

### 사용 예시
```tsx
// 기본 사용법
<LoadingSpinner size="md" variant="modern" />

// 다양한 크기
<div className="flex gap-4">
  <LoadingSpinner size="sm" variant="modern" />
  <LoadingSpinner size="md" variant="modern" />
  <LoadingSpinner size="lg" variant="modern" />
</div>

// 클래식 스타일
<LoadingSpinner size="lg" variant="classic" />
```

## 📊 ProgressLoader 컴포넌트

### Props 인터페이스
```typescript
export interface ProgressLoaderProps {
  /** 로딩 상태 여부 */
  isLoading: boolean;
  
  /** 전체 지속 시간 (밀리초) */
  duration?: number;
  
  /** 완료 시 콜백 함수 */
  onComplete?: () => void;
  
  /** 진행바 크기 */
  size?: ProgressLoaderSize;
  
  /** 추가 CSS 클래스 */
  className?: string;
}

export type ProgressLoaderSize = 
  | 'sm'    // 4px 높이, 작은 텍스트
  | 'md'    // 8px 높이, 기본 텍스트
  | 'lg';   // 12px 높이, 큰 텍스트
```

### 사용 예시
```tsx
// 기본 사용법
<ProgressLoader 
  isLoading={isUploading} 
  duration={3000}
  onComplete={() => setUploadComplete(true)}
  size="md"
/>

// 커스텀 지속 시간
<ProgressLoader 
  isLoading={isProcessing} 
  duration={5000}
  onComplete={handleProcessComplete}
  size="lg"
/>
```

## 🎯 공통 Props 패턴

### 크기 Props 패턴
```typescript
// 모든 컴포넌트에서 일관된 크기 시스템
type ComponentSize = 'sm' | 'md' | 'lg';

// 8px 그리드 기반 높이
const sizeHeights = {
  sm: '32px',  // var(--spacing-4)
  md: '40px',  // var(--spacing-5)
  lg: '48px'   // var(--spacing-6)
};
```

### 상태 Props 패턴
```typescript
// 공통 상태 타입
type ComponentState = 'default' | 'disabled' | 'loading' | 'error' | 'success';

// 상태별 시각적 피드백
const stateStyles = {
  default: 'opacity-100',
  disabled: 'opacity-50 cursor-not-allowed',
  loading: 'opacity-75',
  error: 'border-red-500 text-red-500',
  success: 'border-green-500 text-green-500'
};
```

### 레이아웃 Props 패턴
```typescript
// 공통 레이아웃 속성
interface LayoutProps {
  fullWidth?: boolean;      // 전체 너비 사용
  className?: string;       // 추가 스타일링
  children?: React.ReactNode; // 자식 요소
}
```

### 접근성 Props 패턴
```typescript
// 접근성 관련 속성
interface AccessibilityProps {
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  role?: string;
  tabIndex?: number;
}
```

## 🔧 Props 검증 및 기본값

### 런타임 검증 (선택사항)
```typescript
import { z } from 'zod';

// Props 스키마 정의
const ButtonPropsSchema = z.object({
  variant: z.enum(['primary', 'secondary', 'accent', 'success', 'error', 'info', 'outline', 'text', 'gradient', 'gradient-purple']).optional(),
  size: z.enum(['sm', 'md', 'lg']).optional(),
  loading: z.boolean().optional(),
  disabled: z.boolean().optional(),
  fullWidth: z.boolean().optional()
});

// 컴포넌트에서 검증
const Button = (props: ButtonProps) => {
  const validatedProps = ButtonPropsSchema.parse(props);
  // 컴포넌트 로직
};
```

### TypeScript Strict Mode 지원
```typescript
// 엄격한 타입 검사
interface StrictButtonProps {
  variant: ButtonVariant;     // 필수
  size: ButtonSize;          // 필수
  onClick: () => void;       // 필수
  children: React.ReactNode; // 필수
  loading?: boolean;         // 선택
  disabled?: boolean;        // 선택
}
```