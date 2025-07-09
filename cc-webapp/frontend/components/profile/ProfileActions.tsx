'use client';

import { Settings, LogOut, Home } from 'lucide-react';

interface ProfileActionsProps {
  onLogout: () => void;
}

export default function ProfileActions({ onLogout }: ProfileActionsProps) {
  const handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.close(); // 팝업 창 닫기
    }
  };

  return (
    <div className="flex flex-col gap-3 mt-auto">
      {/* 홈으로 돌아가기 */}
      <button
        onClick={handleGoHome}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[var(--color-purple-primary)] hover:bg-[var(--color-purple-secondary)] text-white font-medium transition-all duration-200 hover-lift"
      >
        <Home size={20} />
        홈으로 돌아가기
      </button>
      
      {/* 설정 */}
      <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl glassmorphism hover:bg-white/5 text-[var(--color-text-primary)] font-medium transition-all duration-200 hover-lift">
        <Settings size={20} />
        설정
      </button>
      
      {/* 로그아웃 */}
      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[var(--color-error)]/10 hover:bg-[var(--color-error)]/20 text-[var(--color-error)] border border-[var(--color-error)]/20 font-medium transition-all duration-200 hover-lift"
      >
        <LogOut size={20} />
        로그아웃
      </button>
    </div>
  );
}
