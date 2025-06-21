# 상태 전환 다이어그램

## 🔘 Button 상태 전환

### 상태 다이어그램
```mermaid
stateDiagram-v2
    [*] --> Default
    
    Default --> Hover : 마우스 진입
    Default --> Loading : loading=true
    Default --> Disabled : disabled=true
    
    Hover --> Default : 마우스 이탈
    Hover --> Active : 마우스 클릭
    Hover --> Loading : loading=true
    
    Active --> Hover : 마우스 릴리즈
    Active --> Default : 마우스 이탈
    
    Loading --> Default : loading=false
    Loading --> Disabled : disabled=true
    
    Disabled --> Default : disabled=false
    
    Default --> [*]
```

### 상태별 속성
```typescript
interface ButtonStateMap {
  default: {
    scale: 1;
    opacity: 1;
    cursor: 'pointer';
    userInteraction: true;
  };
  
  hover: {
    scale: 1.01;
    opacity: 1;
    cursor: 'pointer';
    userInteraction: true;
    shadow: 'enhanced';
  };
  
  active: {
    scale: 0.99;
    opacity: 1;
    cursor: 'pointer';
    userInteraction: true;
    shadow: 'inner';
  };
  
  loading: {
    scale: 1;
    opacity: 0.8;
    cursor: 'not-allowed';
    userInteraction: false;
    icon: 'spinner';
  };
  
  disabled: {
    scale: 1;
    opacity: 0.5;
    cursor: 'not-allowed';
    userInteraction: false;
  };
}
```

### 전환 조건 및 타이밍
```typescript
const buttonTransitions = {
  // Default → Hover (150ms)
  defaultToHover: {
    trigger: 'mouseEnter',
    duration: 150,
    easing: 'easeOut',
    properties: ['scale', 'shadow']
  },
  
  // Hover → Active (100ms)
  hoverToActive: {
    trigger: 'mouseDown',
    duration: 100,
    easing: 'easeInOut',
    properties: ['scale']
  },
  
  // Any → Loading (200ms)
  anyToLoading: {
    trigger: 'loading=true',
    duration: 200,
    easing: 'easeOut',
    properties: ['opacity', 'cursor']
  },
  
  // Any → Disabled (instant)
  anyToDisabled: {
    trigger: 'disabled=true',
    duration: 0,
    properties: ['opacity', 'cursor', 'userInteraction']
  }
};
```

## 📝 Input 상태 전환

### 상태 다이어그램
```mermaid
stateDiagram-v2
    [*] --> Default
    
    Default --> Focused : 포커스 진입
    Default --> Error : error 메시지 설정
    Default --> Success : success 메시지 설정
    Default --> Disabled : disabled=true
    
    Focused --> Default : 포커스 이탈 (값 없음)
    Focused --> Filled : 포커스 이탈 (값 있음)
    Focused --> Error : 검증 실패
    
    Filled --> Focused : 포커스 재진입
    Filled --> Error : 검증 실패
    Filled --> Success : 검증 성공
    
    Error --> Focused : 포커스 진입
    Error --> Default : error 메시지 제거
    Error --> Success : 검증 성공
    
    Success --> Focused : 포커스 진입
    Success --> Default : success 메시지 제거
    Success --> Error : 검증 실패
    
    Disabled --> Default : disabled=false
    
    Default --> [*]
    Filled --> [*]
    Error --> [*]
    Success --> [*]
```

### 상태별 시각적 변화
```typescript
interface InputStateMap {
  default: {
    borderColor: 'var(--color-neutral-dark-gray)';
    backgroundColor: 'var(--color-primary-charcoal)';
    labelPosition: 'placeholder';
    underlineVisible: false;
  };
  
  focused: {
    borderColor: 'var(--color-gradient-2)';
    backgroundColor: 'var(--color-primary-charcoal)';
    labelPosition: 'top';
    underlineVisible: true; // gradient variant만
    scale: 1.01;
    shadow: 'focus-ring';
  };
  
  filled: {
    borderColor: 'var(--color-neutral-dark-gray)';
    backgroundColor: 'var(--color-primary-charcoal)';
    labelPosition: 'top';
    underlineVisible: false;
  };
  
  error: {
    borderColor: 'var(--color-semantic-error)';
    backgroundColor: 'var(--color-semantic-error)/10';
    labelPosition: 'top';
    labelColor: 'var(--color-semantic-error)';
    messageVisible: true;
    messageType: 'error';
  };
  
  success: {
    borderColor: 'var(--color-semantic-success)';
    backgroundColor: 'var(--color-semantic-success)/10';
    labelPosition: 'top';
    labelColor: 'var(--color-semantic-success)';
    messageVisible: true;
    messageType: 'success';
  };
  
  disabled: {
    borderColor: 'var(--color-neutral-dark-gray)/50';
    backgroundColor: 'var(--color-primary-charcoal)/50';
    opacity: 0.5;
    cursor: 'not-allowed';
    userInteraction: false;
  };
}
```

### 라벨 애니메이션 전환
```typescript
const labelTransitions = {
  // Placeholder → Top (포커스 시)
  placeholderToTop: {
    duration: 200,
    easing: 'easeOut',
    properties: {
      y: 'from-center to-top',
      scale: 'from-1 to-0.85',
      color: 'from-muted to-primary'
    }
  },
  
  // Top → Placeholder (값 없이 포커스 해제)
  topToPlaceholder: {
    duration: 200,
    easing: 'easeOut',
    properties: {
      y: 'from-top to-center',
      scale: 'from-0.85 to-1',
      color: 'from-primary to-muted'
    }
  }
};
```

## 🔄 LoadingSpinner 상태 전환

### 상태 다이어그램
```mermaid
stateDiagram-v2
    [*] --> Hidden
    
    Hidden --> Spinning : 로딩 시작
    Spinning --> Hidden : 로딩 완료
    
    Spinning --> Spinning : 계속 회전
```

### 애니메이션 속성
```typescript
const spinnerStates = {
  hidden: {
    opacity: 0,
    display: 'none'
  },
  
  spinning: {
    opacity: 1,
    display: 'block',
    animation: {
      rotate: '0deg to 360deg',
      duration: '1s',
      iteration: 'infinite',
      easing: 'linear'
    }
  }
};
```

## 📊 ProgressLoader 상태 전환

### 상태 다이어그램
```mermaid
stateDiagram-v2
    [*] --> Idle
    
    Idle --> Preparing : isLoading=true
    Preparing --> Uploading : progress > 30%
    Uploading --> Finalizing : progress > 70%
    Finalizing --> Complete : progress = 100%
    Complete --> Idle : onComplete() 호출
    
    note right of Preparing : "파일을 준비하고 있습니다..."
    note right of Uploading : "업로드 중입니다..."
    note right of Finalizing : "거의 완료되었습니다..."
    note right of Complete : "업로드 완료!"
```

### 진행률별 메시지 및 스타일
```typescript
interface ProgressStateMap {
  idle: {
    visible: false;
    progress: 0;
    message: '';
  };
  
  preparing: {
    visible: true;
    progress: '0% - 30%';
    message: '파일을 준비하고 있습니다...';
    barColor: 'var(--color-gradient-1)';
    textColor: 'var(--color-text-secondary-gray)';
  };
  
  uploading: {
    visible: true;
    progress: '30% - 70%';
    message: '업로드 중입니다...';
    barColor: 'var(--color-gradient-2)';
    textColor: 'var(--color-text-secondary-gray)';
  };
  
  finalizing: {
    visible: true;
    progress: '70% - 99%';
    message: '거의 완료되었습니다...';
    barColor: 'var(--color-gradient-3)';
    textColor: 'var(--color-text-secondary-gray)';
  };
  
  complete: {
    visible: true;
    progress: '100%';
    message: '업로드 완료!';
    barColor: 'var(--color-semantic-success)';
    textColor: 'var(--color-semantic-success)';
    celebration: true; // 완료 애니메이션
  };
}
```

## 🎯 복합 상태 관리

### 폼 상태 전환
```mermaid
stateDiagram-v2
    [*] --> FormIdle
    
    FormIdle --> FormFilling : 첫 번째 필드 포커스
    FormFilling --> FormValidating : 제출 버튼 클릭
    FormValidating --> FormError : 검증 실패
    FormValidating --> FormSubmitting : 검증 성공
    FormSubmitting --> FormSuccess : 제출 성공
    FormSubmitting --> FormError : 제출 실패
    
    FormError --> FormFilling : 수정 시작
    FormSuccess --> FormIdle : 폼 리셋
    
    note right of FormValidating : 모든 필드 검증
    note right of FormSubmitting : 서버 요청 중
    note right of FormSuccess : 성공 메시지 표시
```

### 폼 상태별 UI 변화
```typescript
interface FormStateMap {
  idle: {
    submitButton: { disabled: false, loading: false, text: '제출' };
    inputs: { state: 'default' };
    messages: { visible: false };
  };
  
  filling: {
    submitButton: { disabled: false, loading: false, text: '제출' };
    inputs: { state: 'interactive' };
    messages: { visible: false };
  };
  
  validating: {
    submitButton: { disabled: true, loading: false, text: '검증 중...' };
    inputs: { state: 'readonly' };
    messages: { visible: false };
  };
  
  submitting: {
    submitButton: { disabled: true, loading: true, text: '제출 중...' };
    inputs: { state: 'disabled' };
    messages: { visible: false };
  };
  
  error: {
    submitButton: { disabled: false, loading: false, text: '다시 시도' };
    inputs: { state: 'error' };
    messages: { visible: true, type: 'error' };
  };
  
  success: {
    submitButton: { disabled: true, loading: false, text: '완료' };
    inputs: { state: 'success' };
    messages: { visible: true, type: 'success' };
  };
}
```

## 🔧 상태 관리 구현

### React Hook 기반 상태 관리
```typescript
// 버튼 상태 훅
export const useButtonState = (initialProps: ButtonProps) => {
  const [state, setState] = useState<ButtonState>('default');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleMouseEnter = () => {
    if (state === 'default' && !isLoading) {
      setState('hover');
    }
  };
  
  const handleMouseLeave = () => {
    if (state === 'hover' || state === 'active') {
      setState('default');
    }
  };
  
  const handleMouseDown = () => {
    if (state === 'hover') {
      setState('active');
    }
  };
  
  const handleMouseUp = () => {
    if (state === 'active') {
      setState('hover');
    }
  };
  
  return {
    state,
    isLoading,
    setIsLoading,
    handlers: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp
    }
  };
};

// 인풋 상태 훅
export const useInputState = (initialProps: InputProps) => {
  const [state, setState] = useState<InputState>('default');
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState('');
  
  const handleFocus = () => {
    setIsFocused(true);
    setState('focused');
  };
  
  const handleBlur = () => {
    setIsFocused(false);
    setState(value ? 'filled' : 'default');
  };
  
  const handleChange = (newValue: string) => {
    setValue(newValue);
    if (state === 'error' && newValue) {
      setState('focused');
    }
  };
  
  return {
    state,
    isFocused,
    value,
    setValue,
    setState,
    handlers: {
      onFocus: handleFocus,
      onBlur: handleBlur,
      onChange: handleChange
    }
  };
};
```

### 상태 전환 로깅 (개발용)
```typescript
// 상태 변화 디버깅
export const useStateLogger = (componentName: string, state: string) => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${componentName}] State changed to: ${state}`);
    }
  }, [componentName, state]);
};

// 사용 예시
const Button = (props: ButtonProps) => {
  const [state, setState] = useState('default');
  useStateLogger('Button', state);
  
  // 컴포넌트 로직
};
```

이 문서들은 개발팀이 컴포넌트 시스템을 정확히 이해하고 일관되게 사용할 수 있도록 돕는 완전한 참조 자료입니다.