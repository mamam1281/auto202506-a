'use client';

import { Play, Settings, LogOut, ExternalLink } from 'lucide-react';
import ActionButton from './ActionButton';
import type { ProfileActionsProps } from './types';

export default function ProfileActions({ onLogout }: ProfileActionsProps) {
  const handleGameStart = () => {
    console.log('Starting game...');
    // Navigate to game selection or main game
  };

  const handleSettings = () => {
    console.log('Opening settings...');
    // Navigate to settings page
  };

  const handleVisitSite = () => {
    console.log('Visiting main site...');
    // Open main company site
    window.open('https://company-site.com', '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Primary Action */}
      <ActionButton
        icon={Play}
        variant="primary"
        size="lg"
        fullWidth={true}
        onClick={handleGameStart}
      >
        게임 시작
      </ActionButton>

      {/* Secondary Actions */}
      <div className="grid grid-cols-2 gap-3">
        <ActionButton
          icon={Settings}
          variant="secondary"
          size="md"
          onClick={handleSettings}
        >
          설정
        </ActionButton>

        <ActionButton
          icon={ExternalLink}
          variant="secondary"
          size="md"
          onClick={handleVisitSite}
        >
          본사 사이트
        </ActionButton>
      </div>

      {/* Logout Button */}
      <ActionButton
        icon={LogOut}
        variant="danger"
        size="md"
        fullWidth={true}
        onClick={onLogout}
      >
        로그아웃
      </ActionButton>
    </div>
  );
}
