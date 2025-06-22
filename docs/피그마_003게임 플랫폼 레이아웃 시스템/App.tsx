import { useEffect, useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppProvider, useLayout, useAuth } from './contexts/AppContext';
import { AppLayout } from './components/Layout/AppLayout';
import { GameLayout } from './components/Layout/GameLayout';
import { AuthLayout } from './components/Layout/AuthLayout';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { pageVariants, cardVariants, containerVariants, neonGlowVariants } from './lib/animations';

// 메모이제이션된 카드 컴포넌트
const LayoutCard = memo(({ 
  title, 
  description, 
  buttonText, 
  onClick, 
  disabled 
}: {
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
  disabled?: boolean;
}) => (
  <motion.div
    variants={cardVariants}
    initial="initial"
    animate="animate"
    whileHover="hover"
    whileTap="tap"
  >
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={onClick}
          variant="outline"
          className="w-full"
          disabled={disabled}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  </motion.div>
));

LayoutCard.displayName = 'LayoutCard';

// 메모이제이션된 컨텐츠 카드 컴포넌트
const ContentCard = memo(({ index }: { index: number }) => (
  <motion.div
    variants={cardVariants}
    initial="initial"
    animate="animate"
    whileHover="hover"
  >
    <Card className="h-32 flex items-center justify-center">
      <div className="text-center">
        <motion.div 
          className="w-12 h-12 bg-gradient-to-br from-[var(--neon-purple-3)] to-[var(--neon-purple-1)] rounded-lg mx-auto mb-2 flex items-center justify-center"
          variants={neonGlowVariants}
          initial="initial"
          animate="animate"
        >
          <span className="text-white font-bold">{index + 1}</span>
        </motion.div>
        <p className="text-sm text-muted-foreground">컨텐츠 {index + 1}</p>
      </div>
    </Card>
  </motion.div>
));

ContentCard.displayName = 'ContentCard';

function AppContent() {
  const { currentLayout, setLayout } = useLayout();
  const { isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // 서버 사이드 렌더링 방지
  }

  const renderAppLayout = () => (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="dark"
    >
      <AppLayout>
        <motion.div 
          className="space-y-8"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          <motion.div className="text-center" variants={cardVariants}>
            <h1 className="text-3xl font-bold mb-4">게임 플랫폼 레이아웃 시스템</h1>
            <p className="text-muted-foreground mb-8">
              다양한 레이아웃을 테스트해볼 수 있습니다.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={containerVariants}
          >
            <LayoutCard
              title="메인 앱 레이아웃"
              description="헤더, 사이드바, 푸터가 포함된 기본 레이아웃"
              buttonText="현재 레이아웃"
              onClick={() => setLayout('app')}
              disabled={currentLayout === 'app'}
            />

            <LayoutCard
              title="게임 레이아웃"
              description="풀스크린 게임을 위한 몰입형 레이아웃"
              buttonText="게임 레이아웃 보기"
              onClick={() => setLayout('game')}
            />

            <LayoutCard
              title="인증 레이아웃"
              description="로그인/회원가입을 위한 중앙 정렬 레이아웃"
              buttonText="인증 레이아웃 보기"
              onClick={() => setLayout('auth')}
            />
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            variants={containerVariants}
          >
            {Array.from({ length: 8 }, (_, i) => (
              <ContentCard key={i} index={i} />
            ))}
          </motion.div>
        </motion.div>
      </AppLayout>
    </motion.div>
  );

  const renderGameLayout = () => (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="dark"
    >
      <GameLayout
        gameTitle="테트리스 마스터"
        onBack={() => setLayout('app')}
      >
        <motion.div 
          className="flex items-center justify-center h-full bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)]"
          variants={cardVariants}
          initial="initial"
          animate="animate"
        >
          <div className="text-center p-8">
            <motion.div 
              className="w-24 h-24 bg-gradient-to-br from-[var(--neon-purple-3)] to-[var(--neon-purple-1)] rounded-2xl mx-auto mb-6 flex items-center justify-center"
              variants={neonGlowVariants}
              initial="initial"
              animate="animate"
            >
              <span className="text-white font-bold text-2xl">🎮</span>
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-4">게임 영역</h2>
            <p className="text-gray-400 mb-8">
              실제 게임이 여기에 렌더링됩니다.
            </p>
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button 
                onClick={() => setLayout('app')}
                className="bg-[var(--neon-purple-3)] hover:bg-[var(--neon-purple-2)] text-white"
              >
                메인으로 돌아가기
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </GameLayout>
    </motion.div>
  );

  const renderAuthLayout = () => (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="dark"
    >
      <AuthLayout
        title="로그인"
        subtitle="계정에 로그인하여 게임을 시작하세요"
      >
        <motion.div 
          className="space-y-6"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          <motion.div className="space-y-4" variants={cardVariants}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                className="bg-[var(--surface-glass)] border-[var(--surface-glass)] text-white placeholder:text-gray-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="bg-[var(--surface-glass)] border-[var(--surface-glass)] text-white placeholder:text-gray-400"
              />
            </div>
          </motion.div>

          <motion.div className="space-y-4" variants={cardVariants}>
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button 
                className="w-full bg-gradient-to-r from-[var(--neon-purple-3)] to-[var(--neon-purple-1)] text-white hover:from-[var(--neon-purple-4)] hover:to-[var(--neon-purple-2)]"
              >
                로그인
              </Button>
            </motion.div>
            
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button 
                variant="outline"
                className="w-full border-[var(--surface-glass)] text-white hover:bg-[var(--surface-glass)]"
                onClick={() => setLayout('app')}
              >
                메인으로 돌아가기
              </Button>
            </motion.div>
          </motion.div>

          <motion.div 
            className="text-center text-sm text-gray-400"
            variants={cardVariants}
          >
            계정이 없으신가요?{' '}
            <a href="#" className="text-[var(--neon-purple-3)] hover:text-[var(--neon-purple-2)]">
              회원가입
            </a>
          </motion.div>
        </motion.div>
      </AuthLayout>
    </motion.div>
  );

  return (
    <AnimatePresence mode="wait">
      {currentLayout === 'game' && renderGameLayout()}
      {currentLayout === 'auth' && renderAuthLayout()}
      {currentLayout === 'app' && renderAppLayout()}
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <div className="dark">
      <AppProvider>
        <AppContent />
      </AppProvider>
    </div>
  );
}