'use client';

import { useState, useEffect } from 'react';
import { isPopupWindow } from '../../../utils/gamePopup';
import ProfileInfo from '../../../components/auth/ProfileInfo';
import '../../../styles/auth.css';

interface UserProfile {
  id: number;
  nickname: string;
  cyber_token_balance: number;
  rank?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPopup, setIsPopup] = useState(false);
  const [initialized, setInitialized] = useState(false);
  
  // 클라이언트 측에서만 팝업 여부를 확인
  useEffect(() => {
    setIsPopup(isPopupWindow());
    setInitialized(true);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
          throw new Error('로그인이 필요합니다');
        }
        
        const response = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('프로필 정보를 가져오는데 실패했습니다');
        }
        
        const data = await response.json();
        setProfile(data);
      } catch (err: any) {
        setError(err.message || '프로필을 로드할 수 없습니다');
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  return (
    <div className={`auth-container ${isPopup ? 'popup-mode' : ''}`}>
      <div className="auth-content">
        <div className="auth-header">
          <h1 className="auth-title">내 프로필</h1>
          {profile && (
            <p className="auth-subtitle">안녕하세요, {profile.nickname}님!</p>
          )}
        </div>
        
        {isLoading ? (
          <div className="loading-indicator">프로필을 불러오는 중...</div>
        ) : error ? (
          <div className="auth-error">{error}</div>
        ) : profile ? (
          <ProfileInfo profile={profile} />
        ) : (
          <div className="auth-error">프로필 정보를 찾을 수 없습니다</div>
        )}
      </div>
    </div>
  );
}
