'use client';

import { Settings, ExternalLink } from 'lucide-react';
import { Button } from '../ui/basic/button';
import type { ProfileActionsProps } from './types';

export default function ProfileActions({ onLogout }: ProfileActionsProps) {
  const handleSettings = () => {
    console.log('Opening settings...');
    // Navigate to settings page
  };

  const handleVisitSite = () => {
    console.log('Visiting main site...');
    // Open main company site
    window.open('https://casinoclub.com', '_blank');
  };

  return (
    <div className="space-y-4">
      {/* 420px 너비 최적화 - 데일리 모달 스타일 통일 */}
      
      {/* Secondary Actions Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Settings */}
        <div className="rounded-xl p-4 relative overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-blue-500/5 pointer-events-none" />
          
          <div className="relative z-10 text-center space-y-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500/30 to-blue-600/30 rounded-xl 
                           flex items-center justify-center mx-auto border border-blue-500/50">
              <Settings className="w-5 h-5 text-blue-400" />
            </div>
            
            <Button
              onClick={handleSettings}
              variant="outline"
              className="w-full h-10 border-blue-400/30 text-blue-400 hover:bg-blue-400/10 
                         rounded-lg text-sm"
            >
              설정
            </Button>
          </div>
        </div>

        {/* External Site */}
        <div className="rounded-xl p-4 relative overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-purple-500/5 pointer-events-none" />
          
          <div className="relative z-10 text-center space-y-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500/30 to-purple-600/30 rounded-xl 
                           flex items-center justify-center mx-auto border border-purple-500/50">
              <ExternalLink className="w-5 h-5 text-purple-400" />
            </div>
            
            <Button
              onClick={handleVisitSite}
              variant="outline"
              className="w-full h-10 border-purple-400/30 text-purple-400 hover:bg-purple-400/10 
                         rounded-lg text-sm"
            >
              본사 사이트
            </Button>
          </div>
        </div>
      </div>

      {/* Logout Button 제거됨 */}
    </div>
  );
}
