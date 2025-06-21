'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './components/Button';
import { Input } from './components/Input';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ProgressLoader } from './components/ProgressLoader';
import { 
  Download, 
  Upload, 
  Heart, 
  ShoppingCart, 
  Play, 
  Settings, 
  User,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Check,
  Search,
  Mail,
  Lock,
  Phone,
  MapPin,
  Star,
  Zap,
  Camera,
  Send
} from 'lucide-react';
import ButtonOriginal from './imports/Button-2-89';
import InputOriginal from './imports/Input-5-325';
import DefaultSmall from './imports/DefaultSmall-1-24';

export default function App() {
  const [clickedButton, setClickedButton] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingButtons, setLoadingButtons] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    search: '',
    email: '',
    password: '',
    name: '',
    phone: '',
    address: ''
  });

  const handleButtonClick = (buttonName: string) => {
    setClickedButton(buttonName);
    setTimeout(() => setClickedButton(''), 2000);
  };

  const handleLoadingButtonClick = (buttonId: string) => {
    setLoadingButtons(prev => new Set(prev).add(buttonId));
    setTimeout(() => {
      setLoadingButtons(prev => {
        const newSet = new Set(prev);
        newSet.delete(buttonId);
        return newSet;
      });
      handleButtonClick(`${buttonId} 완료`);
    }, 2000);
  };

  const startProgressLoading = () => {
    setIsLoading(true);
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setClickedButton('진행률 로딩 완료!');
    setTimeout(() => setClickedButton(''), 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* 헤더 */}
      <header className="safe-top p-grid-2 md:p-grid-3 border-b border-[#333333]">
        <div className="container-responsive">
          <h1 className="font-['Exo'] font-bold mb-2">
            상용급 버튼 & 인풋 시스템
          </h1>
          <p className="text-[#D1D5DB] font-['Exo']">
            8px 그리드 시스템, 일관된 디자인, 웹&앱 최적화
          </p>
          {clickedButton && (
            <motion.div 
              className="mt-4 p-grid-2 bg-gradient-to-r from-[#6B46C1] to-[#8B5CF6] rounded-lg inline-block shadow-md"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <span className="font-['Exo'] font-semibold">
                "{clickedButton}" 실행됨!
              </span>
            </motion.div>
          )}
        </div>
      </header>

      <main className="safe-bottom p-grid-2 md:p-grid-3">
        <div className="container-responsive space-y-6">
          
          {/* 🎯 완전한 버튼 시스템 */}
          <section className="bg-[#2d2d2d] rounded-xl p-grid-3 border border-[#333333]">
            <h2 className="font-['Exo'] font-semibold mb-6">
              🎯 완전한 버튼 시스템 (상용급 최적화)
            </h2>
            
            <div className="space-y-8">
              
              {/* Primary & Secondary */}
              <div className="bg-[#1a1a1a] p-grid-3 rounded-lg border border-[#333333]">
                <h3 className="font-['Exo'] font-medium mb-4 text-[#F59E0B]">Primary & Secondary</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-grid-2">
                  <Button variant="primary" size="sm" onClick={() => handleButtonClick('primary-sm')}>
                    Primary
                  </Button>
                  <Button variant="primary" size="md" icon={<Download />} onClick={() => handleButtonClick('primary-download')}>
                    Download
                  </Button>
                  <Button variant="primary" size="lg" icon={<Save />} onClick={() => handleButtonClick('primary-save')}>
                    Save
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => handleButtonClick('secondary-sm')}>
                    Secondary
                  </Button>
                  <Button variant="secondary" size="md" icon={<Settings />} onClick={() => handleButtonClick('secondary-settings')}>
                    Settings
                  </Button>
                  <Button variant="secondary" size="lg" icon={<User />} onClick={() => handleButtonClick('secondary-user')}>
                    Profile
                  </Button>
                </div>
              </div>

              {/* Accent & Status Colors */}
              <div className="bg-[#1a1a1a] p-grid-3 rounded-lg border border-[#333333]">
                <h3 className="font-['Exo'] font-medium mb-4 text-[#ff4516]">Accent & Status Colors</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-grid-2">
                  <Button variant="accent" size="md" icon={<Zap />} onClick={() => handleButtonClick('accent')}>
                    Accent
                  </Button>
                  <Button variant="success" size="md" icon={<Check />} onClick={() => handleButtonClick('success')}>
                    Success
                  </Button>
                  <Button variant="error" size="md" icon={<X />} onClick={() => handleButtonClick('error')}>
                    Error
                  </Button>
                  <Button variant="info" size="md" icon={<Send />} onClick={() => handleButtonClick('info')}>
                    Info
                  </Button>
                  <Button variant="outline" size="md" onClick={() => handleButtonClick('outline')}>
                    Outline
                  </Button>
                  <Button variant="text" size="md" onClick={() => handleButtonClick('text')}>
                    Text
                  </Button>
                </div>
              </div>

              {/* 특별 그라데이션 (2개만) */}
              <div className="bg-[#1a1a1a] p-grid-3 rounded-lg border border-[#333333]">
                <h3 className="font-['Exo'] font-medium mb-4 text-[#8B5CF6]">✨ 특별 그라데이션 (상용급 톤)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-grid-2">
                  <Button variant="gradient" size="lg" icon={<Star />} onClick={() => handleButtonClick('gradient-main')}>
                    Main Gradient
                  </Button>
                  <Button variant="gradient-purple" size="lg" icon={<Heart />} onClick={() => handleButtonClick('gradient-purple')}>
                    Purple Magic
                  </Button>
                </div>
              </div>

              {/* 기본 디자인 컬러 버튼들 */}
              <div className="bg-[#1a1a1a] p-grid-3 rounded-lg border border-[#333333]">
                <h3 className="font-['Exo'] font-medium mb-4 text-[#D1D5DB]">기본 디자인 컬러 버튼들</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-grid-2">
                  <Button variant="info" size="lg" icon={<Send />} onClick={() => handleButtonClick('blue')}>
                    Ocean Blue
                  </Button>
                  <Button variant="success" size="lg" icon={<Check />} onClick={() => handleButtonClick('green')}>
                    Nature Green
                  </Button>
                  <Button variant="accent" size="lg" icon={<Camera />} onClick={() => handleButtonClick('orange')}>
                    Warm Orange
                  </Button>
                  <Button variant="error" size="lg" icon={<Heart />} onClick={() => handleButtonClick('red')}>
                    Energy Red
                  </Button>
                </div>
              </div>

              {/* 아이콘 전용 버튼들 */}
              <div className="bg-[#1a1a1a] p-grid-3 rounded-lg border border-[#333333]">
                <h3 className="font-['Exo'] font-medium mb-4">아이콘 전용 버튼 (터치 최적화)</h3>
                <div className="flex flex-wrap gap-grid-2">
                  <Button variant="gradient" size="sm" icon={<Plus />} iconOnly onClick={() => handleButtonClick('icon-plus')} />
                  <Button variant="gradient-purple" size="sm" icon={<Heart />} iconOnly onClick={() => handleButtonClick('icon-heart')} />
                  <Button variant="info" size="md" icon={<Download />} iconOnly onClick={() => handleButtonClick('icon-download')} />
                  <Button variant="success" size="md" icon={<Check />} iconOnly onClick={() => handleButtonClick('icon-check')} />
                  <Button variant="accent" size="lg" icon={<Camera />} iconOnly onClick={() => handleButtonClick('icon-camera')} />
                  <Button variant="error" size="lg" icon={<Star />} iconOnly onClick={() => handleButtonClick('icon-star')} />
                  <Button variant="primary" size="md" icon={<Play />} iconOnly onClick={() => handleButtonClick('icon-play')} />
                  <Button variant="secondary" size="md" icon={<Settings />} iconOnly onClick={() => handleButtonClick('icon-settings')} />
                </div>
              </div>

              {/* 상태별 데모 (부드러운 톤) */}
              <div className="bg-[#1a1a1a] p-grid-3 rounded-lg border border-[#333333]">
                <h3 className="font-['Exo'] font-medium mb-4">상태별 데모 (Default/Hover/Active/Disabled/Loading)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-grid-3">
                  <div className="space-y-3">
                    <Button variant="gradient" size="md" onClick={() => handleButtonClick('gradient-default')} fullWidth>
                      Gradient Default
                    </Button>
                    <Button variant="gradient-purple" size="md" disabled fullWidth>
                      Gradient Disabled
                    </Button>
                    <Button 
                      variant="primary" 
                      size="md" 
                      loading={loadingButtons.has('primary-loading')} 
                      onClick={() => handleLoadingButtonClick('primary-loading')}
                      fullWidth
                    >
                      Primary Loading
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <Button variant="success" size="md" icon={<Save />} onClick={() => handleButtonClick('success-save')} fullWidth>
                      Success Save
                    </Button>
                    <Button variant="info" size="md" icon={<Upload />} onClick={() => handleButtonClick('info-upload')} fullWidth>
                      Info Upload
                    </Button>
                    <Button variant="accent" size="md" icon={<Heart />} onClick={() => handleButtonClick('accent-like')} fullWidth>
                      Accent Like
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 📱 인풋 시스템 */}
          <section className="bg-[#2d2d2d] rounded-xl p-grid-3 border border-[#333333]">
            <h2 className="font-['Exo'] font-semibold mb-6">
              📱 완전한 인풋 시스템
            </h2>
            
            <div className="space-y-6">
              
              {/* Figma vs 구현 비교 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-grid-3">
                <div className="bg-[#1a1a1a] p-grid-3 rounded-lg border border-[#333333]">
                  <h3 className="font-['Exo'] font-medium mb-4">원본 Figma 디자인</h3>
                  <div className="flex items-center justify-center py-8">
                    <InputOriginal />
                  </div>
                </div>
                
                <div className="bg-[#1a1a1a] p-grid-3 rounded-lg border border-[#333333]">
                  <h3 className="font-['Exo'] font-medium mb-4">구현된 인풋 시스템</h3>
                  <div className="space-y-4">
                    <Input
                      variant="search"
                      size="md"
                      placeholder="Welcome back"
                      fullWidth
                    />
                    <Input
                      variant="email"
                      size="md"
                      label="Email"
                      placeholder="Email"
                      fullWidth
                    />
                    <Input
                      variant="password"
                      size="md"
                      label="Password"
                      type="password"
                      placeholder="Password"
                      showPasswordToggle
                      fullWidth
                    />
                  </div>
                </div>
              </div>

              {/* 크기별 & 상태별 데모 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-grid-3">
                <div className="bg-[#1a1a1a] p-grid-3 rounded-lg border border-[#333333]">
                  <h3 className="font-['Exo'] font-medium mb-4">크기별 인풋 (8px 그리드)</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-[#D1D5DB] mb-2 block">Small (32px)</label>
                      <Input variant="search" size="sm" placeholder="Small search" fullWidth />
                    </div>
                    <div>
                      <label className="text-sm text-[#D1D5DB] mb-2 block">Medium (40px)</label>
                      <Input variant="search" size="md" placeholder="Medium search" fullWidth />
                    </div>
                    <div>
                      <label className="text-sm text-[#D1D5DB] mb-2 block">Large (48px)</label>
                      <Input variant="search" size="lg" placeholder="Large search" fullWidth />
                    </div>
                  </div>
                </div>

                <div className="bg-[#1a1a1a] p-grid-3 rounded-lg border border-[#333333]">
                  <h3 className="font-['Exo'] font-medium mb-4">상태별 인풋</h3>
                  <div className="space-y-4">
                    <Input
                      variant="email"
                      size="md"
                      label="정상 상태"
                      placeholder="user@example.com"
                      fullWidth
                    />
                    <Input
                      variant="email"
                      size="md"
                      label="에러 상태"
                      placeholder="invalid-email"
                      error="올바른 이메일 형식이 아닙니다"
                      fullWidth
                    />
                    <Input
                      variant="gradient"
                      size="md"
                      label="그라데이션 언더라인"
                      placeholder="포커스해보세요"
                      fullWidth
                    />
                  </div>
                </div>
              </div>

              {/* 모든 Variant 데모 */}
              <div className="bg-[#1a1a1a] p-grid-3 rounded-lg border border-[#333333]">
                <h3 className="font-['Exo'] font-medium mb-4">모든 인풋 Variant</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-grid-3">
                  <div className="space-y-4">
                    <Input
                      variant="default"
                      size="md"
                      label="Default Input"
                      placeholder="기본 스타일"
                      fullWidth
                    />
                    <Input
                      variant="search"
                      size="md"
                      placeholder="검색어를 입력하세요..."
                      fullWidth
                    />
                    <Input
                      variant="text"
                      size="md"
                      label="Text Input"
                      placeholder="일반 텍스트"
                      leftIcon={<User />}
                      fullWidth
                    />
                  </div>
                  <div className="space-y-4">
                    <Input
                      variant="email"
                      size="md"
                      label="Email Input"
                      type="email"
                      placeholder="your@email.com"
                      fullWidth
                    />
                    <Input
                      variant="password"
                      size="md"
                      label="Password Input"
                      type="password"
                      placeholder="비밀번호를 입력하세요"
                      showPasswordToggle
                      fullWidth
                    />
                    <Input
                      variant="gradient"
                      size="md"
                      label="Gradient Input"
                      placeholder="그라데이션 언더라인"
                      leftIcon={<Mail />}
                      fullWidth
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 🚀 실제 사용 예시 */}
          <section className="bg-[#2d2d2d] rounded-xl p-grid-3 border border-[#333333]">
            <h2 className="font-['Exo'] font-semibold mb-6">
              🚀 실제 사용 예시
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-grid-3">
              
              {/* 로그인 폼 */}
              <div className="bg-[#1a1a1a] p-grid-3 rounded-lg border border-[#333333]">
                <h3 className="font-['Exo'] font-medium mb-4">로그인 폼</h3>
                <div className="space-y-4">
                  <Input
                    variant="email"
                    size="md"
                    label="이메일"
                    type="email"
                    placeholder="이메일을 입력하세요"
                    fullWidth
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                  <Input
                    variant="password"
                    size="md"
                    label="비밀번호"
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    showPasswordToggle
                    fullWidth
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-grid-2 pt-4">
                    <Button
                      variant="gradient"
                      size="lg"
                      fullWidth
                      loading={loadingButtons.has('login')}
                      onClick={() => handleLoadingButtonClick('login')}
                    >
                      로그인
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      fullWidth
                      onClick={() => handleButtonClick('회원가입')}
                    >
                      회원가입
                    </Button>
                  </div>
                </div>
              </div>

              {/* 프로필 설정 폼 */}
              <div className="bg-[#1a1a1a] p-grid-3 rounded-lg border border-[#333333]">
                <h3 className="font-['Exo'] font-medium mb-4">프로필 설정</h3>
                <div className="space-y-4">
                  <Input
                    variant="text"
                    size="md"
                    label="이름"
                    placeholder="홍길동"
                    leftIcon={<User />}
                    fullWidth
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                  <Input
                    variant="text"
                    size="md"
                    label="전화번호"
                    placeholder="010-0000-0000"
                    leftIcon={<Phone />}
                    fullWidth
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                  <Input
                    variant="gradient"
                    size="md"
                    label="주소"
                    placeholder="서울시 강남구..."
                    leftIcon={<MapPin />}
                    fullWidth
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-grid-2 pt-4">
                    <Button
                      variant="success"
                      size="lg"
                      fullWidth
                      icon={<Save />}
                      loading={loadingButtons.has('save-profile')}
                      onClick={() => handleLoadingButtonClick('save-profile')}
                    >
                      저장
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      fullWidth
                      icon={<X />}
                      onClick={() => handleButtonClick('취소')}
                    >
                      취소
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 🔄 로딩 시스템 */}
          <section className="bg-[#2d2d2d] rounded-xl p-grid-3 border border-[#333333]">
            <h2 className="font-['Exo'] font-semibold mb-6">🔄 로딩 시스템</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-grid-3">
              
              {/* 진행률 로딩 */}
              <div className="bg-[#1a1a1a] p-grid-3 rounded-lg border border-[#333333]">
                <h3 className="font-['Exo'] font-medium mb-4">진행률 로딩</h3>
                <div className="text-center space-y-4">
                  {isLoading ? (
                    <ProgressLoader
                      isLoading={isLoading}
                      duration={3000}
                      onComplete={handleLoadingComplete}
                      size="md"
                    />
                  ) : (
                    <Button
                      variant="info"
                      size="lg"
                      icon={<Upload />}
                      onClick={startProgressLoading}
                      fullWidth
                    >
                      업로드 시작
                    </Button>
                  )}
                </div>
              </div>

              {/* 스피너 로딩 */}
              <div className="bg-[#1a1a1a] p-grid-3 rounded-lg border border-[#333333]">
                <h3 className="font-['Exo'] font-medium mb-4">스피너 로딩</h3>
                <div className="space-y-4">
                  <div className="flex justify-center gap-grid-2">
                    <LoadingSpinner size="sm" variant="modern" />
                    <LoadingSpinner size="md" variant="modern" />
                    <LoadingSpinner size="lg" variant="modern" />
                  </div>
                  <div className="flex justify-center gap-grid-2">
                    <LoadingSpinner size="sm" variant="classic" />
                    <LoadingSpinner size="md" variant="classic" />
                    <LoadingSpinner size="lg" variant="classic" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 📚 개발 가이드 */}
          <section className="bg-[#2d2d2d] rounded-xl p-grid-3 border border-[#333333]">
            <h2 className="font-['Exo'] font-semibold mb-6">📚 개발 가이드</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-grid-3">
              
              {/* Button 사용법 */}
              <div className="bg-[#1a1a1a] p-grid-3 rounded-lg border border-[#333333]">
                <h3 className="font-['Exo'] font-medium mb-3">Button 사용법</h3>
                <pre className="bg-[#0a0a0a] p-grid-2 rounded text-xs text-green-400 overflow-x-auto">
{`import { Button } from './components/Button';

// 기본 디자인 컬러 버튼
<Button 
  variant="primary"      // F59E0B
  size="md"
  icon={<Download />}
  loading={isLoading}
  fullWidth
  onClick={handleClick}
>
  다운로드
</Button>

// 특별 그라데이션 (상용급 톤)
<Button variant="gradient" size="lg">
  Main Gradient
</Button>

<Button variant="gradient-purple" size="md">
  Purple Magic
</Button>

// 기본 컬러들
<Button variant="success">Success</Button>
<Button variant="error">Error</Button>
<Button variant="info">Info</Button>
<Button variant="accent">Accent</Button>`}
                </pre>
              </div>

              {/* Props 설명 */}
              <div className="bg-[#1a1a1a] p-grid-3 rounded-lg border border-[#333333]">
                <h3 className="font-['Exo'] font-medium mb-3">Button Variants (상용급 최적화)</h3>
                <div className="space-y-2 text-sm text-[#D1D5DB]">
                  <div><code className="text-[#F59E0B]">primary</code>: 메인 액션 (#F59E0B)</div>
                  <div><code className="text-[#333333]">secondary</code>: 보조 액션 (#333333)</div>
                  <div><code className="text-[#ff4516]">accent</code>: 강조 색상 (#ff4516)</div>
                  <div><code className="text-[#10B981]">success</code>: 성공 상태 (#10B981)</div>
                  <div><code className="text-[#B90C29]">error</code>: 에러 상태 (#B90C29)</div>
                  <div><code className="text-[#135B79]">info</code>: 정보 표시 (#135B79)</div>
                  <div><code className="text-[#7C3AED]">gradient</code>: 메인 그라데이션 (보라)</div>
                  <div><code className="text-[#A78BFA]">gradient-purple</code>: 퍼플 매직</div>
                  <div className="mt-3 text-xs text-[#A0A0A0]">
                    • 상용급 밝기와 톤으로 최적화<br/>
                    • 과도한 빛번짐 제거<br/>
                    • 일관된 디자인 시스템 적용
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 원본 Figma 디자인 */}
          <section className="bg-[#2d2d2d] rounded-xl p-grid-3 border border-[#333333]">
            <h2 className="font-['Exo'] font-semibold mb-6">원본 Figma 디자인</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-grid-3">
              <div className="bg-[#1a1a1a] p-grid-3 rounded-lg border border-[#333333]">
                <h3 className="font-['Exo'] font-medium mb-3">원본 버튼 디자인</h3>
                <ButtonOriginal />
              </div>
              <div className="bg-[#1a1a1a] p-grid-3 rounded-lg border border-[#333333]">
                <h3 className="font-['Exo'] font-medium mb-3">원본 기본 버튼</h3>
                <DefaultSmall />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}