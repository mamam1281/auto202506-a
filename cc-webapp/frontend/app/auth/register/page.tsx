'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import RegisterForm from '../../../components/auth/RegisterForm';
import { isPopupWindow } from '../../../utils/gamePopup';
import '../../../styles/auth.css';

export default function RegisterPage() {
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

  const handleRegister = async (nickname: string, inviteCode: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nickname, invite_code: inviteCode }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || '회원가입에 실패했습니다.');
      }
      
      // 회원가입 성공 후 홈으로 리디렉션
      router.push('/');
    } catch (err: any) {
      setError(err.message || '회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`auth-container ${initialized ? (isPopup ? 'popup-mode' : '') : ''} ${initialized ? 'auth-initialized' : 'auth-initializing'}`}>
      <div className="auth-content">
        <div className="auth-header">
          <h1 className="auth-title">회원가입</h1>
          <p className="auth-subtitle">초대코드와 닉네임을 입력하세요</p>
        </div>
        
        <RegisterForm 
          onRegister={handleRegister} 
          isLoading={isLoading} 
          error={error} 
        />
        
        <div className="auth-footer">
          <p>이미 계정이 있으신가요? <Link href="/auth/login" className="auth-link">로그인</Link></p>
        </div>
      </div>
    </div>
  );
}
