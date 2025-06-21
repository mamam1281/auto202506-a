'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface SplashScreenProps {
  onComplete?: () => void;
  version?: string;
}

export function SplashScreen({ 
  onComplete, 
  version = '1.0.0' 
}: SplashScreenProps) {
  const [loadingStage, setLoadingStage] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const loadingStages = [
    '시스템 초기화 중...',
    '리소스 로딩 중...',
    '사용자 인증 확인 중...',
    '거의 완료되었습니다...'
  ];

  useEffect(() => {
    // 초기 페이드인 애니메이션
    const showTimer = setTimeout(() => {
      setShowContent(true);
    }, 300);

    // 로딩 단계 시뮬레이션
    const stageTimer = setInterval(() => {
      setLoadingStage(prev => {
        if (prev < loadingStages.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stageTimer);
          // 인증 확인 완료 시뮬레이션
          setTimeout(() => {
            setIsCheckingAuth(false);
            // 최종 단계 후 완료
            setTimeout(() => {
              onComplete?.();
            }, 1000);
          }, 1500);
          return prev;
        }
      });
    }, 1200);

    return () => {
      clearTimeout(showTimer);
      clearInterval(stageTimer);
    };
  }, [onComplete, loadingStages.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* 배경 글로우 효과 */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-2xl"
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.6, 0.3, 0.6]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* 메인 콘텐츠 */}
      <motion.div 
        className="relative z-10 flex flex-col items-center space-y-8"
        initial={{ opacity: 0, y: 30 }}
        animate={showContent ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        
        {/* 로고 섹션 */}
        <motion.div 
          className="relative group"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full opacity-20"
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          <div className="relative bg-card border border-border rounded-full p-8 shadow-xl backdrop-blur-sm">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-inner vip-glow">
              <motion.div 
                className="text-4xl font-bold text-primary-foreground"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                CJ
              </motion.div>
            </div>
          </div>
          
          {/* 회전하는 링 애니메이션 */}
          <motion.div 
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute inset-2 rounded-full border border-transparent border-r-accent/30"
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        {/* 앱 제목 */}
        <motion.div 
          className="text-center space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <motion.h1 
            className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
            animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ backgroundSize: "200% auto" }}
          >
            CJ Gaming
          </motion.h1>
          <p className="text-muted-foreground text-lg">
            VIP 전용 플랫폼
          </p>
        </motion.div>

        {/* 로딩 섹션 */}
        <motion.div 
          className="flex flex-col items-center space-y-6 min-h-[120px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <LoadingSpinner size="lg" variant="modern" className="text-primary" />
          
          <div className="text-center space-y-2">
            <motion.p 
              className="text-foreground font-medium"
              key={loadingStage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {loadingStages[loadingStage]}
            </motion.p>
            
            {/* 진행률 바 */}
            <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                initial={{ width: "0%" }}
                animate={{ 
                  width: `${((loadingStage + 1) / loadingStages.length) * 100}%` 
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            
            <p className="text-xs text-muted-foreground">
              {Math.round(((loadingStage + 1) / loadingStages.length) * 100)}% 완료
            </p>
          </div>
        </motion.div>

        {/* 인증 상태 */}
        {isCheckingAuth && (
          <motion.div 
            className="flex items-center space-x-2 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingSpinner size="sm" variant="dots" />
            <span>자격 증명 확인 중...</span>
          </motion.div>
        )}
      </motion.div>

      {/* 버전 정보 */}
      <motion.div 
        className="absolute bottom-8 left-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.6, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <motion.div 
            className="w-2 h-2 bg-primary rounded-full"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span>버전 {version}</span>
        </div>
      </motion.div>

      {/* 베타 배지 */}
      <motion.div 
        className="absolute top-8 right-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <motion.div 
          className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-3 py-1 rounded-full text-xs font-medium shadow-lg vip-glow"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          BETA
        </motion.div>
      </motion.div>
    </div>
  );
}