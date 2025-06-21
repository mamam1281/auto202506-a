import React, { useState } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface SignupPageProps {
  inviteCode: string;
  onComplete: (userData: any) => void;
  onBack: () => void;
}

interface FormData {
  nickname: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
  agreePrivacy: boolean;
}

export const SignupPage: React.FC<SignupPageProps> = ({ inviteCode, onComplete, onBack }) => {
  const [formData, setFormData] = useState<FormData>({
    nickname: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    agreePrivacy: false
  });
  
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [nicknameAvailable, setNicknameAvailable] = useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    // 닉네임 검증
    if (!formData.nickname.trim()) {
      newErrors.nickname = '닉네임을 입력해주세요';
    } else if (formData.nickname.length < 2) {
      newErrors.nickname = '닉네임은 2자 이상이어야 합니다';
    } else if (formData.nickname.length > 12) {
      newErrors.nickname = '닉네임은 12자 이하여야 합니다';
    } else if (!/^[가-힣a-zA-Z0-9_]+$/.test(formData.nickname)) {
      newErrors.nickname = '닉네임은 한글, 영문, 숫자, 언더스코어만 사용 가능합니다';
    }

    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다';
    } else if (!/^(?=.*[a-zA-Z])(?=.*[0-9])/.test(formData.password)) {
      newErrors.password = '비밀번호는 영문과 숫자를 포함해야 합니다';
    }

    // 비밀번호 확인
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }

    // 약관 동의
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = '서비스 이용약관에 동의해주세요' as any;
    }
    
    if (!formData.agreePrivacy) {
      newErrors.agreePrivacy = '개인정보 처리방침에 동의해주세요' as any;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkNickname = async () => {
    if (!formData.nickname.trim() || formData.nickname.length < 2) {
      return;
    }

    setNicknameChecked(false);
    
    // 닉네임 중복 확인 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 데모용 사용 불가능한 닉네임들
    const unavailableNames = ['admin', 'test', 'user', '관리자', 'cj', 'gaming'];
    const isAvailable = !unavailableNames.includes(formData.nickname.toLowerCase());
    
    setNicknameAvailable(isAvailable);
    setNicknameChecked(true);
    
    if (!isAvailable) {
      setErrors(prev => ({ ...prev, nickname: '이미 사용 중인 닉네임입니다' }));
    } else {
      setErrors(prev => ({ ...prev, nickname: undefined }));
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 실시간 에러 제거
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // 닉네임이 변경되면 중복 확인 초기화
    if (field === 'nickname') {
      setNicknameChecked(false);
      setNicknameAvailable(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (!nicknameChecked) {
      setErrors(prev => ({ ...prev, nickname: '닉네임 중복 확인을 해주세요' }));
      return;
    }
    
    if (!nicknameAvailable) {
      setErrors(prev => ({ ...prev, nickname: '사용 가능한 닉네임으로 변경해주세요' }));
      return;
    }

    setIsSubmitting(true);

    try {
      // 회원가입 처리 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const userData = {
        id: Date.now(),
        nickname: formData.nickname,
        inviteCode: inviteCode,
        vip: true,
        joinDate: new Date().toISOString(),
        level: 1,
        tokens: 10000, // 신규 가입 보너스
        achievements: ['신규 VIP 멤버']
      };
      
      onComplete(userData);
    } catch (error) {
      setErrors({ password: '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.' } as any);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* 배경 효과 */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 animate-pulse"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse [animation-delay:1s]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-2xl animate-pulse [animation-delay:2s]"></div>

      {/* 메인 콘텐츠 */}
      <div className={`relative z-10 w-full max-w-md transition-all duration-1000 ${
        showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        
        {/* 헤더 */}
        <div className="text-center mb-6">
          <div className="mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mx-auto shadow-lg vip-glow">
              <div className="text-xl font-bold text-primary-foreground">
                CJ
              </div>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-1">
            VIP 회원가입
          </h1>
          <p className="text-sm text-muted-foreground">
            초대코드: <span className="font-mono text-primary">{inviteCode}</span>
          </p>
        </div>

        {/* 회원가입 폼 */}
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* 닉네임 */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-foreground">
                닉네임 <span className="text-destructive">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.nickname}
                  onChange={(e) => handleInputChange('nickname', e.target.value)}
                  placeholder="멋진닉네임"
                  maxLength={12}
                  className={`flex-1 px-3 py-2 bg-input-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm ${
                    errors.nickname ? 'border-destructive' : 'border-border'
                  }`}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={checkNickname}
                  disabled={!formData.nickname.trim() || formData.nickname.length < 2 || isSubmitting}
                  className="px-3 py-2 text-xs bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  중복확인
                </button>
              </div>
              {nicknameChecked && nicknameAvailable && (
                <p className="text-xs text-emerald-400 flex items-center gap-1">
                  <span>✓</span> 사용 가능한 닉네임입니다
                </p>
              )}
              {errors.nickname && (
                <p className="text-xs text-destructive">{errors.nickname}</p>
              )}
            </div>

            {/* 비밀번호 */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-foreground">
                비밀번호 <span className="text-destructive">*</span>
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="영문+숫자 6자 이상"
                className={`w-full px-3 py-2 bg-input-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm ${
                  errors.password ? 'border-destructive' : 'border-border'
                }`}
                disabled={isSubmitting}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password}</p>
              )}
            </div>

            {/* 비밀번호 확인 */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-foreground">
                비밀번호 확인 <span className="text-destructive">*</span>
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="비밀번호를 다시 입력해주세요"
                className={`w-full px-3 py-2 bg-input-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm ${
                  errors.confirmPassword ? 'border-destructive' : 'border-border'
                }`}
                disabled={isSubmitting}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">{errors.confirmPassword}</p>
              )}
            </div>

            {/* 약관 동의 */}
            <div className="space-y-3 pt-2">
              <div className="space-y-2">
                <label className="flex items-start gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
                    className="mt-0.5 w-3 h-3 accent-primary"
                    disabled={isSubmitting}
                  />
                  <span className={errors.agreeTerms ? 'text-destructive' : 'text-foreground'}>
                    [필수] 서비스 이용약관에 동의합니다
                  </span>
                </label>
                
                <label className="flex items-start gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreePrivacy}
                    onChange={(e) => handleInputChange('agreePrivacy', e.target.checked)}
                    className="mt-0.5 w-3 h-3 accent-primary"
                    disabled={isSubmitting}
                  />
                  <span className={errors.agreePrivacy ? 'text-destructive' : 'text-foreground'}>
                    [필수] 개인정보 처리방침에 동의합니다
                  </span>
                </label>
              </div>
            </div>

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 mt-6 ${
                isSubmitting
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <LoadingSpinner size="sm" variant="dots" />
                  <span>가입 처리 중...</span>
                </div>
              ) : (
                '🎉 VIP 회원가입 완료'
              )}
            </button>
          </form>
        </div>

        {/* 뒤로가기 */}
        <div className="mt-4 text-center">
          <button
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            disabled={isSubmitting}
          >
            ← 초대코드 입력으로 돌아가기
          </button>
        </div>

        {/* 신규 가입 혜택 */}
        <div className="mt-6 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-4">
          <div className="text-center">
            <div className="text-sm font-medium text-primary mb-2">
              🎁 신규 VIP 멤버 혜택
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>• 10,000 토큰 즉시 지급</div>
              <div>• VIP 전용 게임 3일 무료 체험</div>
              <div>• 신규 멤버 전용 보너스 이벤트</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};