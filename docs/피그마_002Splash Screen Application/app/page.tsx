'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SplashScreen } from '@/components/splash-screen';
import { InviteCodePage } from '@/components/invite-code-page';
import { SignupPage } from '@/components/signup-page';
import { Dashboard } from '@/components/dashboard';
import { useAuthStore } from '@/store/auth-store';
import { User } from '@/types/user';

type AppState = 'splash' | 'invite' | 'signup' | 'dashboard';

export default function Home() {
  const [currentState, setCurrentState] = useState<AppState>('splash');
  const [inviteCode, setInviteCode] = useState('');
  const { user, setUser, clearUser, isLoading } = useAuthStore();

  // 앱 초기화 및 자동 로그인 체크
  useEffect(() => {
    // 다크모드 강제 적용 (VIP 플랫폼 컨셉)
    document.documentElement.classList.add('dark');
    
    // 저장된 사용자 데이터 확인
    const initializeAuth = async () => {
      try {
        const savedUser = localStorage.getItem('cj_user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('사용자 데이터 로딩 오류:', error);
        localStorage.removeItem('cj_user');
      }
    };

    initializeAuth();
  }, [setUser]);

  // 스플래시 화면 완료 핸들러
  const handleSplashComplete = () => {
    if (user) {
      setCurrentState('dashboard');
    } else {
      setCurrentState('invite');
    }
  };

  // 초대코드 검증 완료 핸들러
  const handleValidInviteCode = (code: string) => {
    setInviteCode(code);
    setCurrentState('signup');
  };

  // 회원가입 완료 핸들러
  const handleSignupComplete = (userData: User) => {
    setUser(userData);
    localStorage.setItem('cj_user', JSON.stringify(userData));
    setCurrentState('dashboard');
  };

  // 로그아웃 핸들러
  const handleLogout = () => {
    clearUser();
    setInviteCode('');
    localStorage.removeItem('cj_user');
    setCurrentState('invite');
  };

  // 초대코드 페이지로 이동
  const goToInvite = () => {
    setCurrentState('invite');
  };

  // 페이지 전환 애니메이션 설정
  const pageVariants = {
    initial: { 
      opacity: 0, 
      y: 20,
      scale: 0.98
    },
    in: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    out: { 
      opacity: 0, 
      y: -20,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: [0.55, 0.055, 0.675, 0.19]
      }
    }
  };

  // 로딩 중일 때는 스플래시 화면 표시
  if (isLoading || currentState === 'splash') {
    return (
      <motion.div
        key="splash"
        variants={pageVariants}
        initial="initial"
        animate="in"
        exit="out"
      >
        <SplashScreen 
          onComplete={handleSplashComplete}
          version="1.0.0-beta"
        />
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {currentState === 'invite' && (
        <motion.div
          key="invite"
          variants={pageVariants}
          initial="initial"
          animate="in"
          exit="out"
        >
          <InviteCodePage
            onValidCode={handleValidInviteCode}
            onBack={() => setCurrentState('dashboard')}
          />
        </motion.div>
      )}

      {currentState === 'signup' && (
        <motion.div
          key="signup"
          variants={pageVariants}
          initial="initial"
          animate="in"
          exit="out"
        >
          <SignupPage
            inviteCode={inviteCode}
            onComplete={handleSignupComplete}
            onBack={() => setCurrentState('invite')}
          />
        </motion.div>
      )}

      {currentState === 'dashboard' && (
        <motion.div
          key="dashboard"
          variants={pageVariants}
          initial="initial"
          animate="in"
          exit="out"
        >
          <Dashboard
            user={user}
            onLogout={handleLogout}
            onGoToInvite={goToInvite}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}