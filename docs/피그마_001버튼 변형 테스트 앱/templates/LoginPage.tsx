import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 에러 제거
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다';
    }
    
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      // API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('로그인 성공:', formData);
      // 로그인 성공 후 리다이렉트 등
    } catch (error) {
      setErrors({ general: '로그인에 실패했습니다. 다시 시도해주세요.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex items-center justify-center">
      <div className="safe-area-inset w-full max-w-md p-grid-3">
        
        {/* 헤더 */}
        <div className="text-center mb-grid-4">
          <h1 className="font-['Exo'] font-bold mb-2">로그인</h1>
          <p className="text-[#D1D5DB] font-['Exo']">
            계정에 로그인하여 시작하세요
          </p>
        </div>

        {/* 로그인 폼 */}
        <div className="bg-[#2d2d2d] rounded-xl p-grid-3 border border-[#333333]">
          <form onSubmit={handleSubmit} className="space-y-grid-3">
            
            {/* 일반 에러 메시지 */}
            {errors.general && (
              <div className="bg-[#B90C29]/10 border border-[#B90C29]/20 rounded-lg p-grid-2">
                <p className="text-[#B90C29] text-sm font-['Exo']">
                  {errors.general}
                </p>
              </div>
            )}

            {/* 이메일 입력 */}
            <Input
              variant="email"
              size="lg"
              label="이메일"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={errors.email}
              disabled={isLoading}
              fullWidth
            />

            {/* 비밀번호 입력 */}
            <Input
              variant="password"
              size="lg"
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              error={errors.password}
              disabled={isLoading}
              showPasswordToggle
              fullWidth
            />

            {/* 로그인 버튼 */}
            <div className="pt-grid-2">
              <Button
                variant="gradient"
                size="lg"
                type="submit"
                loading={isLoading}
                disabled={isLoading}
                fullWidth
              >
                {isLoading ? '로그인 중...' : '로그인'}
              </Button>
            </div>

            {/* 추가 옵션 */}
            <div className="flex flex-col sm:flex-row gap-grid-2 justify-between items-center pt-grid-2">
              <button
                type="button"
                className="text-[#D1D5DB] text-sm font-['Exo'] hover:text-white transition-colors"
                disabled={isLoading}
              >
                비밀번호 찾기
              </button>
              <Button
                variant="text"
                size="sm"
                disabled={isLoading}
                onClick={() => console.log('회원가입 페이지로 이동')}
              >
                회원가입
              </Button>
            </div>
          </form>
        </div>

        {/* 소셜 로그인 (선택사항) */}
        <div className="mt-grid-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#333333]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-[#1a1a1a] px-2 text-[#A0A0A0] font-['Exo']">
                또는
              </span>
            </div>
          </div>
          
          <div className="mt-grid-3 grid grid-cols-1 gap-grid-2">
            <Button
              variant="outline"
              size="lg"
              disabled={isLoading}
              fullWidth
              onClick={() => console.log('구글 로그인')}
            >
              구글로 로그인
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}