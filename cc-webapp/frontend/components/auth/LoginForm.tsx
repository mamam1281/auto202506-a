'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { User, KeyRound, Loader2 } from 'lucide-react';

interface LoginFormProps {
  onLogin: (nickname: string, password: string) => void;
  isLoading: boolean;
  error: string;
  autoFillTestAccount?: boolean;
}

export default function LoginForm({ 
  onLogin, 
  isLoading, 
  error,
  autoFillTestAccount = false 
}: LoginFormProps) {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  
  // 테스트 계정 자동 입력
  useEffect(() => {
    const useTestAccount = autoFillTestAccount || searchParams?.get('test') === 'true';
    if (useTestAccount) {
      setNickname('test001');
      setPassword('1234');
    }
  }, [autoFillTestAccount, searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(nickname, password);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {error && <div className="auth-error">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="nickname" className="form-label">
          <User size={16} strokeWidth={2} />
          닉네임
        </label>
        <input
          type="text"
          id="nickname"
          className="form-input"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임을 입력하세요"
          required
          disabled={isLoading}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="password" className="form-label">
          <KeyRound size={16} strokeWidth={2} />
          비밀번호
        </label>
        <div className="password-input-container">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            required
            disabled={isLoading}
          />
          <button 
            type="button" 
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '숨기기' : '표시'}
          </button>
        </div>
      </div>
      
      <button
        type="submit"
        className={`auth-button ${isLoading ? 'loading' : ''}`}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 size={18} className="animate-spin mr-2" />
            로그인 중...
          </>
        ) : '로그인'}
      </button>
    </form>
  );
}
