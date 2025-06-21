import React, { useState } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface InviteCodePageProps {
  onValidCode: (code: string) => void;
  onBack: () => void;
}

export const InviteCodePage: React.FC<InviteCodePageProps> = ({ onValidCode, onBack }) => {
  const [code, setCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');
  const [showContent, setShowContent] = useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      setError('초대코드를 입력해주세요');
      return;
    }
    
    if (code.length < 6) {
      setError('초대코드는 최소 6자 이상이어야 합니다');
      return;
    }

    setIsValidating(true);
    setError('');

    // 초대코드 검증 시뮬레이션
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 데모용 유효한 코드들
      const validCodes = ['VIP2024', 'CJGAMING', 'PURPLE123', 'NEON2024'];
      
      if (validCodes.includes(code.toUpperCase())) {
        onValidCode(code.toUpperCase());
      } else {
        setError('유효하지 않은 초대코드입니다. 다시 확인해주세요.');
      }
    } catch (err) {
      setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setCode(value);
    if (error) setError('');
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
        <div className="text-center mb-8">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto shadow-lg vip-glow">
              <div className="text-2xl font-bold text-primary-foreground">
                CJ
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            VIP 초대코드
          </h1>
          <p className="text-muted-foreground">
            독점 VIP 멤버십을 위한<br/>
            초대코드를 입력해주세요
          </p>
        </div>

        {/* 초대코드 폼 */}
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="inviteCode" className="block font-medium text-foreground">
                초대코드
              </label>
              <div className="relative">
                <input
                  id="inviteCode"
                  type="text"
                  value={code}
                  onChange={handleCodeChange}
                  placeholder="VIP2024"
                  maxLength={12}
                  className={`w-full px-4 py-3 bg-input-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-center text-lg font-mono tracking-wider ${
                    error ? 'border-destructive animate-shake' : 'border-border'
                  } ${isValidating ? 'cursor-not-allowed' : ''}`}
                  disabled={isValidating}
                />
                {isValidating && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <LoadingSpinner size="sm" variant="modern" />
                  </div>
                )}
              </div>
              {error && (
                <p className="text-destructive text-sm flex items-center gap-1">
                  <span className="text-xs">⚠️</span>
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isValidating || !code.trim()}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                isValidating || !code.trim()
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {isValidating ? (
                <div className="flex items-center justify-center gap-2">
                  <LoadingSpinner size="sm" variant="dots" />
                  <span>검증 중...</span>
                </div>
              ) : (
                '코드 확인'
              )}
            </button>
          </form>
        </div>

        {/* 안내 메시지 */}
        <div className="mt-6 text-center space-y-4">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="text-sm text-primary font-medium mb-2">
              💎 VIP 멤버십 혜택
            </div>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• 독점 게임 및 토너먼트 참여</li>
              <li>• 프리미엄 보상 및 혜택</li>
              <li>• VIP 전용 고객 지원</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              초대코드가 없으신가요?
            </p>
            <button
              onClick={onBack}
              className="text-primary hover:text-accent text-sm font-medium transition-colors"
              disabled={isValidating}
            >
              ← 메인 화면으로 돌아가기
            </button>
          </div>
        </div>

        {/* 데모 힌트 */}
        <div className="mt-8 p-3 bg-accent/10 border border-accent/20 rounded-lg">
          <div className="text-xs text-accent-foreground">
            <div className="font-medium mb-1">🔍 데모용 유효한 코드:</div>
            <div className="font-mono text-[10px] text-muted-foreground">
              VIP2024, CJGAMING, PURPLE123, NEON2024
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};