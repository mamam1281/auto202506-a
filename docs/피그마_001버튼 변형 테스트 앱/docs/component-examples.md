# 🎨 컴포넌트 사용 예시 모음

## 🔘 Button 컴포넌트 예시

### 1. 기본 사용법
```tsx
// 가장 기본적인 버튼
<Button variant="primary" size="md" onClick={handleClick}>
  클릭하세요
</Button>

// 아이콘과 함께
<Button variant="gradient" size="lg" icon={<Download />}>
  다운로드
</Button>

// 로딩 상태
<Button variant="success" size="md" loading={isLoading}>
  {isLoading ? '저장 중...' : '저장'}
</Button>
```

### 2. 실전 패턴들

#### 폼 제출 버튼
```tsx
<div className="flex gap-grid-2 pt-grid-3">
  <Button 
    variant="primary" 
    size="lg" 
    type="submit"
    loading={isSubmitting}
    disabled={!isFormValid}
    className="flex-1"
  >
    {isSubmitting ? '제출 중...' : '제출하기'}
  </Button>
  <Button 
    variant="outline" 
    size="lg" 
    type="button"
    onClick={onCancel}
    disabled={isSubmitting}
  >
    취소
  </Button>
</div>
```

#### 액션 버튼 그룹
```tsx
<div className="flex gap-grid-2">
  <Button variant="success" size="sm" icon={<Check />}>
    승인
  </Button>
  <Button variant="error" size="sm" icon={<X />}>
    거절
  </Button>
  <Button variant="outline" size="sm" icon={<Edit />}>
    수정
  </Button>
</div>
```

#### 플로팅 액션 버튼
```tsx
<Button 
  variant="gradient" 
  size="lg" 
  icon={<Plus />} 
  iconOnly
  className="fixed bottom-6 right-6 rounded-full shadow-lg"
  onClick={handleAddNew}
>
</Button>
```

#### 탭 스타일 버튼
```tsx
<div className="flex border-b border-[#333333]">
  {tabs.map((tab) => (
    <Button
      key={tab.id}
      variant={activeTab === tab.id ? "primary" : "text"}
      size="md"
      onClick={() => setActiveTab(tab.id)}
      className="rounded-none border-b-2 border-transparent hover:border-[#7C3AED]"
    >
      {tab.label}
    </Button>
  ))}
</div>
```

## 📝 Input 컴포넌트 예시

### 1. 기본 사용법
```tsx
// 기본 텍스트 입력
<Input 
  variant="default" 
  size="md" 
  label="이름"
  placeholder="홍길동"
  fullWidth
/>

// 이메일 입력
<Input 
  variant="email" 
  size="md" 
  label="이메일"
  type="email"
  placeholder="user@example.com"
  fullWidth
/>

// 패스워드 입력
<Input 
  variant="password" 
  size="md" 
  label="비밀번호"
  type="password"
  showPasswordToggle
  fullWidth
/>
```

### 2. 실전 패턴들

#### 검색 인터페이스
```tsx
<div className="flex gap-grid-2">
  <Input 
    variant="search" 
    size="md" 
    placeholder="검색어를 입력하세요..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="flex-1"
  />
  <Button 
    variant="primary" 
    size="md" 
    icon={<Search />}
    onClick={handleSearch}
  >
    검색
  </Button>
</div>
```

#### 폼 검증 예시
```tsx
<Input 
  variant="email"
  size="md"
  label="이메일"
  type="email"
  value={formData.email}
  onChange={(e) => handleInputChange('email', e.target.value)}
  error={errors.email}
  success={!errors.email && formData.email ? '유효한 이메일입니다' : undefined}
  fullWidth
/>
```

#### 파일 업로드 스타일
```tsx
<div className="relative">
  <Input 
    variant="default"
    size="lg"
    label="파일 선택"
    placeholder="파일을 선택하세요..."
    value={selectedFile?.name || ''}
    readOnly
    fullWidth
  />
  <input
    type="file"
    onChange={handleFileSelect}
    className="absolute inset-0 opacity-0 cursor-pointer"
  />
</div>
```

#### 동적 입력 필드
```tsx
{fields.map((field, index) => (
  <div key={field.id} className="flex gap-grid-2 items-end">
    <Input 
      variant="default"
      size="md"
      label={`항목 ${index + 1}`}
      value={field.value}
      onChange={(e) => updateField(field.id, e.target.value)}
      className="flex-1"
    />
    <Button 
      variant="error" 
      size="md" 
      icon={<Trash2 />} 
      iconOnly
      onClick={() => removeField(field.id)}
    />
  </div>
))}
```

## 🔄 로딩 컴포넌트 예시

### 1. LoadingSpinner 사용법
```tsx
// 기본 스피너
<LoadingSpinner size="md" variant="modern" />

// 전체 화면 로딩
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
  <div className="bg-[#2d2d2d] p-grid-4 rounded-xl">
    <LoadingSpinner size="lg" variant="modern" className="mx-auto mb-grid-2" />
    <p className="text-center text-[#D1D5DB] font-['Exo']">
      데이터를 불러오는 중...
    </p>
  </div>
</div>

// 인라인 로딩
<div className="flex items-center gap-grid-2">
  <LoadingSpinner size="sm" variant="modern" />
  <span className="text-sm text-[#D1D5DB]">처리 중...</span>
</div>
```

### 2. ProgressLoader 사용법
```tsx
// 파일 업로드 진행률
<ProgressLoader 
  isLoading={isUploading}
  duration={uploadDuration}
  onComplete={handleUploadComplete}
  size="md"
  className="mt-grid-2"
/>

// 다단계 프로세스
<div className="space-y-grid-2">
  <div className="flex justify-between text-sm">
    <span>단계 {currentStep}/3</span>
    <span>{Math.round(progress)}%</span>
  </div>
  <ProgressLoader 
    isLoading={isProcessing}
    duration={processSteps[currentStep].duration}
    onComplete={handleStepComplete}
    size="lg"
  />
</div>
```

## 🎨 레이아웃 패턴

### 1. 카드 레이아웃
```tsx
// 기본 카드
<div className="bg-[#2d2d2d] rounded-xl p-grid-3 border border-[#333333]">
  <h3 className="font-['Exo'] font-medium mb-grid-2">카드 제목</h3>
  <p className="text-[#D1D5DB] mb-grid-3">카드 내용입니다.</p>
  <div className="flex gap-grid-2">
    <Button variant="primary" size="sm">확인</Button>
    <Button variant="outline" size="sm">취소</Button>
  </div>
</div>

// 통계 카드
<div className="bg-[#2d2d2d] rounded-xl p-grid-3 border border-[#333333] hover:border-[#444444] transition-colors">
  <div className="flex items-center justify-between mb-2">
    <span className="text-[#D1D5DB] text-sm font-['Exo']">총 사용자</span>
    <Users className="text-[#7C3AED]" size={20} />
  </div>
  <div className="font-['Exo'] font-bold text-2xl mb-1">1,234</div>
  <div className="text-[#10B981] text-sm font-['Exo']">
    +12% 지난 주 대비
  </div>
</div>
```

### 2. 모달 레이아웃
```tsx
// 확인 모달
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-grid-2">
  <div className="bg-[#2d2d2d] rounded-xl p-grid-3 border border-[#333333] max-w-md w-full">
    <h3 className="font-['Exo'] font-medium mb-grid-2">정말 삭제하시겠습니까?</h3>
    <p className="text-[#D1D5DB] text-sm mb-grid-4">
      이 작업은 되돌릴 수 없습니다.
    </p>
    <div className="flex gap-grid-2 justify-end">
      <Button variant="outline" size="md" onClick={onCancel}>
        취소
      </Button>
      <Button variant="error" size="md" onClick={onConfirm}>
        삭제하기
      </Button>
    </div>
  </div>
</div>

// 폼 모달
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-grid-2">
  <div className="bg-[#2d2d2d] rounded-xl p-grid-3 border border-[#333333] max-w-lg w-full max-h-[80vh] overflow-y-auto">
    <div className="flex items-center justify-between mb-grid-3">
      <h3 className="font-['Exo'] font-medium">새 프로젝트 생성</h3>
      <Button variant="text" size="sm" icon={<X />} iconOnly onClick={onClose} />
    </div>
    
    <form className="space-y-grid-3">
      <Input label="프로젝트 이름" placeholder="멋진 프로젝트" fullWidth />
      <Input label="설명" placeholder="프로젝트 설명을 입력하세요" fullWidth />
      
      <div className="flex gap-grid-2 pt-grid-2">
        <Button variant="primary" size="md" type="submit" fullWidth>
          생성하기
        </Button>
        <Button variant="outline" size="md" type="button" onClick={onClose} fullWidth>
          취소
        </Button>
      </div>
    </form>
  </div>
</div>
```

### 3. 리스트 레이아웃
```tsx
// 아이템 리스트
<div className="space-y-grid-2">
  {items.map((item) => (
    <div key={item.id} className="flex items-center gap-grid-3 p-grid-2 bg-[#2d2d2d] rounded-lg border border-[#333333] hover:border-[#444444] transition-colors">
      <div className="flex-1">
        <h4 className="font-['Exo'] font-medium">{item.title}</h4>
        <p className="text-[#D1D5DB] text-sm">{item.description}</p>
      </div>
      <div className="flex gap-grid-1">
        <Button variant="outline" size="sm" icon={<Edit />} iconOnly />
        <Button variant="error" size="sm" icon={<Trash2 />} iconOnly />
      </div>
    </div>
  ))}
</div>

// 그리드 아이템
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-grid-3">
  {items.map((item) => (
    <div key={item.id} className="bg-[#2d2d2d] rounded-xl p-grid-3 border border-[#333333] hover:border-[#444444] transition-all hover:scale-105">
      <div className="aspect-video bg-[#1a1a1a] rounded-lg mb-grid-2"></div>
      <h4 className="font-['Exo'] font-medium mb-1">{item.title}</h4>
      <p className="text-[#D1D5DB] text-sm mb-grid-3">{item.description}</p>
      <Button variant="primary" size="sm" fullWidth>
        자세히 보기
      </Button>
    </div>
  ))}
</div>
```

## 🎯 고급 패턴

### 1. 상태 기반 UI
```tsx
const renderContent = () => {
  switch (pageState) {
    case 'loading':
      return (
        <div className="flex flex-col items-center justify-center py-grid-8">
          <LoadingSpinner size="lg" variant="modern" />
          <p className="mt-grid-2 text-[#D1D5DB] font-['Exo']">
            데이터를 불러오는 중...
          </p>
        </div>
      );
    
    case 'empty':
      return (
        <div className="text-center py-grid-8">
          <div className="text-[#A0A0A0] mb-grid-3">
            <Inbox size={48} className="mx-auto" />
          </div>
          <h3 className="font-['Exo'] font-medium mb-2">데이터가 없습니다</h3>
          <p className="text-[#D1D5DB] mb-grid-4">
            첫 번째 항목을 추가해보세요
          </p>
          <Button variant="primary" size="md" icon={<Plus />}>
            새 항목 추가
          </Button>
        </div>
      );
    
    case 'error':
      return (
        <div className="text-center py-grid-8">
          <div className="text-[#B90C29] mb-grid-3">
            <AlertCircle size={48} className="mx-auto" />
          </div>
          <h3 className="font-['Exo'] font-medium mb-2">오류가 발생했습니다</h3>
          <p className="text-[#D1D5DB] mb-grid-4">
            데이터를 불러올 수 없습니다
          </p>
          <Button variant="primary" size="md" onClick={handleRetry}>
            다시 시도
          </Button>
        </div>
      );
    
    default:
      return <ContentComponent />;
  }
};
```

### 2. 반응형 컴포넌트 조합
```tsx
// 데스크톱: 사이드바, 모바일: 드로어
<div className="flex">
  {/* 사이드바 (데스크톱) */}
  <aside className="hidden lg:flex w-64 bg-[#2d2d2d] border-r border-[#333333] flex-col">
    <nav className="p-grid-2 space-y-1">
      {menuItems.map((item) => (
        <Button
          key={item.id}
          variant={activeItem === item.id ? "primary" : "text"}
          size="md"
          icon={item.icon}
          fullWidth
          className="justify-start"
        >
          {item.label}
        </Button>
      ))}
    </nav>
  </aside>

  {/* 메인 콘텐츠 */}
  <main className="flex-1 min-w-0">
    {/* 모바일 헤더 */}
    <div className="lg:hidden p-grid-2 border-b border-[#333333]">
      <Button 
        variant="outline" 
        size="sm" 
        icon={<Menu />} 
        onClick={toggleMobileMenu}
      >
        메뉴
      </Button>
    </div>
    
    <div className="p-grid-3">
      {/* 콘텐츠 */}
    </div>
  </main>
</div>
```

이 예시들을 참고하여 다양한 UI 패턴을 구현할 수 있습니다! 🎨