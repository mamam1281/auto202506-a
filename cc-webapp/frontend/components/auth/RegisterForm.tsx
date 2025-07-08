'use client';

import { useState } from 'react';
import { User, Ticket, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface RegisterFormProps {
  onRegister: (nickname: string, inviteCode: string) => void;
  isLoading: boolean;
  error: string;
}

export default function RegisterForm({ onRegister, isLoading, error }: RegisterFormProps) {
  const [nickname, setNickname] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [codeVerificationStatus, setCodeVerificationStatus] = useState<null | 'checking' | 'valid' | 'invalid'>(null);

  const verifyInviteCode = async (code: string) => {
    if (code.length !== 6) {
      setCodeVerificationStatus(null);
      return;
    }

    setCodeVerificationStatus('checking');
    try {
      const response = await fetch(`/api/auth/verify-invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.valid) {
        setCodeVerificationStatus('valid');
      } else {
        setCodeVerificationStatus('invalid');
      }
    } catch (err) {
      setCodeVerificationStatus('invalid');
    }
  };

  const handleInviteCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value.toUpperCase();
    setInviteCode(code);
    if (code.length === 6) {
      verifyInviteCode(code);
    } else {
      setCodeVerificationStatus(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister(nickname, inviteCode);
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
          placeholder="사용할 닉네임을 입력하세요"
          required
          disabled={isLoading}
          maxLength={50}
        />
        <p className="input-hint">2-50자 사이의 닉네임을 사용하세요</p>
      </div>
      
      <div className="form-group">
        <label htmlFor="inviteCode" className="form-label">
          <Ticket size={16} strokeWidth={2} />
          초대코드
        </label>
        <div className="invite-code-input-container">
          <input
            type="text"
            id="inviteCode"
            className={`form-input invite-code ${
              codeVerificationStatus === 'valid' ? 'is-valid' : 
              codeVerificationStatus === 'invalid' ? 'is-invalid' : ''
            }`}
            value={inviteCode}
            onChange={handleInviteCodeChange}
            placeholder="초대코드 6자리"
            required
            disabled={isLoading}
            maxLength={6}
          />
          {codeVerificationStatus === 'checking' && (
            <span className="code-status checking">
              <Loader2 size={16} className="animate-spin mr-1" />
              확인 중...
            </span>
          )}
          {codeVerificationStatus === 'valid' && (
            <span className="code-status valid">
              <CheckCircle size={16} className="mr-1" />
              유효한 코드
            </span>
          )}
          {codeVerificationStatus === 'invalid' && (
            <span className="code-status invalid">
              <XCircle size={16} className="mr-1" />
              잘못된 코드
            </span>
          )}
        </div>
      </div>
      
      <button
        type="submit"
        className={`auth-button ${isLoading ? 'loading' : ''}`}
        disabled={isLoading || codeVerificationStatus !== 'valid'}
      >
        {isLoading ? (
          <>
            <Loader2 size={18} className="animate-spin mr-2" />
            가입 중...
          </>
        ) : '회원가입'}
      </button>
    </form>
  );
}
