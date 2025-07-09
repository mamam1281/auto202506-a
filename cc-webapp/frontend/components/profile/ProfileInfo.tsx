'use client';

import { useState } from 'react';
import type { UserProfile } from './types';

interface ProfileInfoProps {
  profile: UserProfile;
}

export default function ProfileInfo({ profile }: ProfileInfoProps) {
  // 기본 랭크가 없는 경우 "STANDARD"로 표시
  const userRank = profile.rank || 'STANDARD';
  
  // 랭크에 따른 스타일 클래스
  const getRankClass = (rank: string) => {
    switch (rank.toUpperCase()) {
      case 'VIP':
        return 'rank-vip';
      case 'PREMIUM':
        return 'rank-premium';
      case 'STANDARD':
      default:
        return 'rank-standard';
    }
  };

  return (
    <div className="profile-info">
      <div className="profile-section">
        <div className="profile-avatar">
          {profile.nickname.charAt(0).toUpperCase()}
        </div>
        
        <div className="profile-details">
          <h2 className="profile-nickname">{profile.nickname}</h2>
          <div className={`profile-rank ${getRankClass(userRank)}`}>
            {userRank}
          </div>
        </div>
      </div>
      
      <div className="profile-stats">
        <div className="stats-item">
          <span className="stats-label">사이버 토큰</span>
          <span className="stats-value token-balance">
            <span className="token-icon">💰</span>
            {profile.cyber_token_balance}
          </span>
        </div>
      </div>
      
      <div className="profile-actions">
        <button className="profile-button primary">게임 시작</button>
        <button className="profile-button secondary">설정</button>
      </div>
    </div>
  );
}
      
      <div className="profile-actions">
        <button className="profile-button primary">게임 시작</button>
        <button className="profile-button secondary">설정</button>
      </div>
    </div>
  );
}
