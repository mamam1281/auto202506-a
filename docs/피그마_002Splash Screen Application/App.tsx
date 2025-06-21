import React, { useState, useEffect } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { InviteCodePage } from './components/InviteCodePage';
import { SignupPage } from './components/SignupPage';

type AppState = 'splash' | 'invite' | 'signup' | 'dashboard';

interface User {
  id: number;
  nickname: string;
  inviteCode: string;
  vip: boolean;
  joinDate: string;
  level: number;
  tokens: number;
  achievements: string[];
}

export default function App() {
  const [currentState, setCurrentState] = useState<AppState>('splash');
  const [user, setUser] = useState<User | null>(null);
  const [inviteCode, setInviteCode] = useState('');

  // 앱 초기화 및 자동 로그인 체크
  useEffect(() => {
    // 다크모드 강제 적용 (앱/웹 환경 대응)
    document.documentElement.classList.add('dark');
    
    // localStorage에서 사용자 데이터 확인
    const savedUser = localStorage.getItem('cj_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('저장된 사용자 데이터 파싱 오류:', error);
        localStorage.removeItem('cj_user');
      }
    }
  }, []);

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
    setUser(null);
    setInviteCode('');
    localStorage.removeItem('cj_user');
    setCurrentState('invite');
  };

  // 초대코드 페이지로 이동
  const goToInvite = () => {
    setCurrentState('invite');
  };

  // 현재 상태에 따른 렌더링
  if (currentState === 'splash') {
    return (
      <SplashScreen 
        onComplete={handleSplashComplete}
        version="1.0.0-beta"
      />
    );
  }

  if (currentState === 'invite') {
    return (
      <InviteCodePage
        onValidCode={handleValidInviteCode}
        onBack={() => setCurrentState('dashboard')}
      />
    );
  }

  if (currentState === 'signup') {
    return (
      <SignupPage
        inviteCode={inviteCode}
        onComplete={handleSignupComplete}
        onBack={() => setCurrentState('invite')}
      />
    );
  }

  // 대시보드 (메인 화면)
  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center vip-glow">
              <span className="text-sm font-bold text-primary-foreground">CJ</span>
            </div>
            <div>
              <h1 className="text-lg font-bold">CJ Gaming</h1>
              <p className="text-xs text-muted-foreground">VIP 전용 플랫폼</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="text-right text-sm">
                  <p className="font-medium">{user.nickname}님</p>
                  <p className="text-xs text-primary">LV.{user.level} VIP</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-emerald-400 font-mono">{user.tokens.toLocaleString()}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">미로그인</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="container mx-auto px-4 py-8">
        {user ? (
          <div className="space-y-8">
            {/* 환영 섹션 */}
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  환영합니다, {user.nickname}님! 🎉
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  VIP 전용 게임 플랫폼에서 특별한 경험을 시작하세요.<br/>
                  독점 게임, 프리미엄 보상, 그리고 커뮤니티가 기다리고 있습니다.
                </p>
              </div>
              
              {/* VIP 배지 */}
              <div className="flex justify-center">
                <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg vip-glow">
                  💎 VIP 멤버 • 초대코드: {user.inviteCode}
                </div>
              </div>
            </div>

            {/* 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary/30 transition-colors">
                <div className="text-2xl font-bold text-primary">{user.tokens.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">보유 토큰</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 text-center hover:border-accent/30 transition-colors">
                <div className="text-2xl font-bold text-accent">LV.{user.level}</div>
                <div className="text-sm text-muted-foreground">현재 레벨</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 text-center hover:border-emerald-500/30 transition-colors">
                <div className="text-2xl font-bold text-emerald-400">{user.achievements.length}</div>
                <div className="text-sm text-muted-foreground">업적 달성</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 text-center hover:border-amber-500/30 transition-colors">
                <div className="text-2xl font-bold text-amber-400">
                  {Math.floor((Date.now() - new Date(user.joinDate).getTime()) / (1000 * 60 * 60 * 24))}
                </div>
                <div className="text-sm text-muted-foreground">가입 경과일</div>
              </div>
            </div>

            {/* 빠른 액션 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-6 hover:scale-[1.02] transition-transform cursor-pointer">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mx-auto">
                    <span className="text-xl">🎮</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-primary">VIP 게임 플레이</h3>
                    <p className="text-sm text-muted-foreground">독점 게임들을 즐겨보세요</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-xl p-6 hover:scale-[1.02] transition-transform cursor-pointer">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto">
                    <span className="text-xl">🏆</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-400">토너먼트 참가</h3>
                    <p className="text-sm text-muted-foreground">VIP 전용 토너먼트</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-6 hover:scale-[1.02] transition-transform cursor-pointer">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto">
                    <span className="text-xl">🎁</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-400">보상 수령</h3>
                    <p className="text-sm text-muted-foreground">일일 보상 및 특별 혜택</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 최근 업적 */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">🏅</span>
                최근 달성한 업적
              </h3>
              <div className="space-y-2">
                {user.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                      <span className="text-xs">🌟</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{achievement}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(user.joinDate).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">인증이 필요합니다</h2>
              <p className="text-muted-foreground">
                VIP 게임 플랫폼에 접속하려면<br/>
                초대코드가 필요합니다.
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={goToInvite}
                className="w-full px-4 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all font-medium"
              >
                초대코드 입력하기
              </button>
            </div>
            
            <p className="text-xs text-muted-foreground">
              VIP 초대를 받지 못하셨나요?<br/>
              고객지원팀에 문의해 주세요.
            </p>
          </div>
        )}
      </main>

      {/* 푸터 */}
      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center space-y-4">
          <div className="flex justify-center items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-xs font-bold text-primary-foreground">CJ</span>
            </div>
            <span className="font-medium">CJ Gaming</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; 2024 CJ Gaming. VIP 전용 플랫폼 • 모든 권리 보유
          </p>
          <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
            <button className="hover:text-foreground transition-colors">이용약관</button>
            <button className="hover:text-foreground transition-colors">개인정보처리방침</button>
            <button className="hover:text-foreground transition-colors">고객지원</button>
          </div>
        </div>
      </footer>
    </div>
  );
}