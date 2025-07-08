'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoginForm from '../../../components/auth/LoginForm';
import { isPopupWindow } from '../../../utils/gamePopup';
import '../../../styles/auth.css';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPopup, setIsPopup] = useState(false);
  const [initialized, setInitialized] = useState(false);
  
  // 클라이언트 측에서만 팝업 여부를 확인
  useEffect(() => {
    setIsPopup(isPopupWindow());
    setInitialized(true);
  }, []);

  const handleLogin = async (nickname: string, password: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nickname, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || '로그인에 실패했습니다.');
      }
      
      // 로컬 스토리지에 토큰 저장
      localStorage.setItem('accessToken', data.access_token);
      
      // 로그인 성공 후 리디렉션
      router.push('/');
    } catch (err: any) {
      setError(err.message || '로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`auth-container ${initialized ? (isPopup ? 'popup-mode' : '') : ''} ${initialized ? 'auth-initialized' : 'auth-initializing'}`}>
      <div className="auth-content">
        <div className="auth-header">
          <h1 className="auth-title">로그인</h1>
          <p className="auth-subtitle">서비스를 이용하려면 로그인하세요</p>
        </div>
        
        <LoginForm 
          onLogin={handleLogin} 
          isLoading={isLoading} 
          error={error} 
          autoFillTestAccount={true}
        />
        
        <div className="auth-footer">
          <p>계정이 없으신가요? <Link href="/auth/register" className="auth-link">회원가입</Link></p>
        </div>
      </div>
    </div>
  );
}
