import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { 
  User, Mail, Lock, Check, X, AlertCircle, Settings, 
  TrendingUp, Play, Clock, Star, Gift, Trophy, Bell,
  Eye, EyeOff, MessageSquare, Home, Gamepad2
} from 'lucide-react';

import { 
  BaseCard as Card
} from './Basecard';
import Button from './Button';
import ButtonGroup from './ButtonGroup';
import { Input } from './Input';
import Avatar from './Avatar';

// Card 하위 컴포넌트들을 직접 정의
const CardHeader = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className || ''}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight text-card-foreground ${className || ''}`} {...props}>
    {children}
  </h3>
);

const CardDescription = ({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={`text-sm text-muted-foreground ${className || ''}`} {...props}>
    {children}
  </p>
);

const CardContent = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`p-6 pt-0 ${className || ''}`} {...props}>
    {children}
  </div>
);

const CardFooter = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`flex items-center p-6 pt-0 ${className || ''}`} {...props}>
    {children}
  </div>
);

const CardAction = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`flex items-center justify-end space-x-2 ${className || ''}`} {...props}>
    {children}
  </div>
);

const meta: Meta<typeof Card> = {
  title: 'Components/CardSystemV2',
  component: Card,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '완전히 새로운 모바일 우선 반응형 설계와 modern-mesh-card Glassmorphism 효과를 적용한 범용 Card 시스템입니다. 모든 카드 타입을 지원하며, 중앙 정렬 레이아웃과 유연한 그리드 시스템을 제공합니다.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// 1. 입력 / 폼 카드 (Input / Form Card) - 완전 개편
export const InputFormCard: Story = {
  args: {
    children: (
      <div className="w-full">
        <CardHeader className="text-center border-b">
          <CardTitle className="text-h3 font-semibold">로그인</CardTitle>
          <CardDescription className="text-sm mt-4">
            계정 정보를 입력해주세요
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 pt-6">
          <div className="w-full">
            <Input
              variant="email"
              size="md"
              placeholder="이메일을 입력하세요"
              className="text-center"
            />
          </div>
          <div className="w-full">
            <Input
              variant="password"
              size="md"
              placeholder="비밀번호를 입력하세요"
              className="text-center"
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex-col space-y-6">
          <ButtonGroup direction="vertical" gap="md" fullWidth>
            <Button 
              variant="primary" 
              size="md" 
              className="w-full py-3"
              rounded={false}
              onClick={action('login clicked')}
            >
              로그인
            </Button>
          </ButtonGroup>
        </CardFooter>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '사용자로부터 정보를 입력받는 완전히 개편된 폼 카드입니다. 모든 영역에 충분한 패딩이 적용되어 있습니다.',
      },
    },
  },
};

// 2. 피드백 메시지 카드 - 완전 개편
export const FeedbackMessageCard: Story = {
  args: {
    children: (
      <div className="w-full">
        <CardHeader className="text-center border-b">
          <div className="flex items-center justify-center">
            <Check className="size-5 text-success mr-2" />
            <CardTitle className="text-h3 font-semibold">성공!</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <p className="text-center text-text-secondary leading-relaxed">
            작업이 성공적으로 완료되었습니다. 
            이제 게임을 시작할 수 있습니다.
          </p>
        </CardContent>
        
        <CardFooter className="flex-col space-y-6">
          <ButtonGroup direction="vertical" gap="md" fullWidth>
            <Button 
              variant="primary" 
              size="md" 
              className="w-full py-3"
              rounded={false}
              onClick={action('continue clicked')}
            >
              계속하기
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="w-full py-2"
              rounded={false}
              onClick={action('close clicked')}
            >
              닫기
            </Button>
          </ButtonGroup>
        </CardFooter>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '사용자에게 피드백을 제공하는 완전히 개편된 메시지 카드입니다. 성공, 오류, 정보 등의 상태를 표시할 수 있습니다.',
      },
    },
  },
};

// 3. 알림 액션 카드 - 완전 개편
export const NotificationActionCard: Story = {
  args: {
    children: (
      <div className="w-full">
        <CardHeader className="text-center border-b">
          <CardTitle className="text-h3 font-semibold">새 알림</CardTitle>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="flex items-start space-x-4">
            <Bell className="text-accent size-4 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-foreground font-medium mb-3">
                특별 보너스 지급!
              </h4>
              <p className="text-text-secondary text-sm leading-relaxed mb-3">
                오늘의 로그인 보너스로 500 포인트가 지급되었습니다. 
                지금 바로 확인해보세요!
              </p>
              <p className="text-text-secondary text-xs">5분 전</p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <ButtonGroup direction="horizontal" gap="md" fullWidth>
            <Button 
              variant="primary" 
              size="md" 
              className="flex-1 py-3"
              rounded={false}
              onClick={action('check bonus clicked')}
            >
              보너스 확인
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="px-4 py-3"
              rounded={false}
              onClick={action('dismiss clicked')}
            >
              <X className="size-4" />
            </Button>
          </ButtonGroup>
        </CardFooter>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '사용자에게 알림을 표시하고 액션을 요구하는 완전히 개편된 카드입니다. 알림 내용과 관련 액션 버튼을 포함합니다.',
      },
    },
  },
};

// 4. 포인트 정보 카드 - 완전 개편
export const PointInfoCard: Story = {
  args: {
    children: (
      <div className="w-full">
        <CardHeader className="text-center border-b">
          <CardTitle className="text-h3 font-semibold">내 포인트</CardTitle>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-4">12,450</div>
            <p className="text-text-secondary text-sm">보유 포인트</p>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-success font-semibold text-lg">+2,150</div>
              <div className="text-xs text-text-secondary mt-2">이번 주</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-accent font-semibold text-lg">사용</div>
              <div className="text-xs text-text-secondary mt-2">850P</div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex-col space-y-6">
          <Button 
            variant="primary" 
            size="md" 
            className="w-full py-3"
            onClick={action('add points clicked')}
          >
            포인트 충전
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="w-full py-2"
            onClick={action('history clicked')}
          >
            내역 보기
          </Button>
        </CardFooter>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '사용자의 포인트 정보를 표시하는 완전히 개편된 카드입니다. 현재 포인트, 주간 증감, 관련 액션을 포함합니다.',
      },
    },
  },
};

// 5. 프로필 카드 - 완전 개편
export const ProfileCard: Story = {
  args: {
    children: (
      <div className="w-full">
        <CardHeader className="text-center border-b">
          <CardTitle className="text-h3 font-semibold">내 프로필</CardTitle>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-6">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <Avatar
                size="xl"
                src="/api/placeholder/80/80"
                alt="GameMaster2025"
                fallback="GM"
              />
            </div>
            <h3 className="text-h3 font-semibold text-card-foreground">
              GameMaster2025
            </h3>
            <div className="space-y-3">
              <p className="text-sm text-text-secondary">레벨 15 · 프리미엄 멤버</p>
              <p className="text-sm text-text-secondary">가입일: 2024년 3월</p>
              <p className="text-sm text-text-secondary">총 플레이: 847회</p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex-col space-y-6">
          <Button 
            variant="primary" 
            size="md" 
            className="w-full py-3"
            onClick={action('edit profile clicked')}
          >
            프로필 수정
          </Button>
          
          <div className="flex w-full space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1 py-2"
              onClick={action('achievements clicked')}
            >
              업적 보기
            </Button>
            <Button 
              variant="glass" 
              size="sm"
              className="flex-1 py-2"
              onClick={action('settings clicked')}
            >
              설정
            </Button>
          </div>
        </CardFooter>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '사용자 프로필 정보를 표시하는 완전히 개편된 카드입니다. Avatar 컴포넌트를 사용하여 아바타, 닉네임, 정보, 관련 액션을 포함합니다.',
      },
    },
  },
};

// 6. 최근 활동 카드 - 완전 개편
export const RecentActivityCard: Story = {
  args: {
    children: (
      <div className="w-full">
        <CardHeader className="text-center border-b">
          <CardTitle className="text-h3 font-semibold">최근 활동</CardTitle>
        </CardHeader>
        
        <CardContent className="pt-6">
          <ul className="w-full space-y-3">
            <li className="flex justify-between items-center py-3 px-4 border-b border-border">
              <span className="text-left text-foreground">슬롯 게임</span>
              <div className="text-right">
                <div className="text-success text-sm font-medium">+250P</div>
                <div className="text-text-secondary text-xs mt-1">10분 전</div>
              </div>
            </li>
            <li className="flex justify-between items-center py-3 px-4 border-b border-border">
              <span className="text-left text-foreground">블랙잭</span>
              <div className="text-right">
                <div className="text-error text-sm font-medium">-100P</div>
                <div className="text-text-secondary text-xs mt-1">1시간 전</div>
              </div>
            </li>
            <li className="flex justify-between items-center py-3 px-4 border-b border-border">
              <span className="text-left text-foreground">룰렛</span>
              <div className="text-right">
                <div className="text-success text-sm font-medium">+450P</div>
                <div className="text-text-secondary text-xs mt-1">2시간 전</div>
              </div>
            </li>
            <li className="flex justify-between items-center py-3 px-4">
              <span className="text-left text-foreground">포커</span>
              <div className="text-right">
                <div className="text-success text-sm font-medium">+120P</div>
                <div className="text-text-secondary text-xs mt-1">어제</div>
              </div>
            </li>
          </ul>
        </CardContent>
        
        <CardFooter>
          <div className="flex w-full space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1 py-2"
              onClick={action('view all clicked')}
            >
              전체 보기
            </Button>
            <Button 
              variant="glass" 
              size="sm"
              className="flex-1 py-2"
              onClick={action('export clicked')}
            >
              내보내기
            </Button>
          </div>
        </CardFooter>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '사용자의 최근 게임 활동을 목록으로 표시하는 완전히 개편된 카드입니다. 리스트 아이템에 적절한 패딩을 적용하여 내용이 가장자리에 붙지 않도록 합니다.',
      },
    },
  },
};

// 7. 도움말 카드 - 완전 개편
export const HelpCard: Story = {
  args: {
    children: (
      <div className="w-full">
        <CardHeader className="text-center border-b">
          <CardTitle className="text-h3 font-semibold">도움말</CardTitle>
        </CardHeader>
        
        <CardContent className="pt-6">
          <ul className="w-full space-y-3">
            <li className="py-3 px-4 border-b border-border">
              <a href="#" className="text-left text-foreground hover:text-primary transition-colors flex items-center">
                <MessageSquare className="size-4 mr-3" />
                게임 방법 가이드
              </a>
            </li>
            <li className="py-3 px-4 border-b border-border">
              <a href="#" className="text-left text-foreground hover:text-primary transition-colors flex items-center">
                <Settings className="size-4 mr-3" />
                계정 설정 도움말
              </a>
            </li>
            <li className="py-3 px-4 border-b border-border">
              <a href="#" className="text-left text-foreground hover:text-primary transition-colors flex items-center">
                <AlertCircle className="size-4 mr-3" />
                자주 묻는 질문
              </a>
            </li>
            <li className="py-3 px-4">
              <a href="#" className="text-left text-foreground hover:text-primary transition-colors flex items-center">
                <Mail className="size-4 mr-3" />
                고객 지원 문의
              </a>
            </li>
          </ul>
        </CardContent>
        
        <CardFooter>
          <Button 
            variant="outline" 
            size="md" 
            className="w-full py-3"
            onClick={action('contact support clicked')}
          >
            실시간 채팅 문의
          </Button>
        </CardFooter>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '도움말 링크와 지원 정보를 제공하는 완전히 개편된 카드입니다. 리스트 아이템에 적절한 패딩을 적용하고 아이콘 크기를 텍스트에 맞게 조정합니다.',
      },
    },
  },
};

// 8. 주간 랭킹 카드 - 완전 개편
export const RankingCard: Story = {
  args: {
    children: (
      <div className="w-full">
        <CardHeader className="text-center border-b">
          <div className="flex items-center justify-center">
            <Trophy className="size-6 text-accent mr-2" />
            <CardTitle className="text-h3 font-semibold">주간 랭킹</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <ul className="w-full space-y-3">
            <li className="flex justify-between items-center py-3 px-4 border-b border-border">
              <div className="flex items-center">
                <span className="text-left text-accent font-bold mr-3">🥇 1위</span>
                <span className="text-left text-foreground">TopGamer</span>
              </div>
              <span className="text-primary font-bold">32,540P</span>
            </li>
            <li className="flex justify-between items-center py-3 px-4 border-b border-border">
              <div className="flex items-center">
                <span className="text-left text-accent font-bold mr-3">🥈 2위</span>
                <span className="text-left text-foreground">LuckyWinner</span>
              </div>
              <span className="text-primary font-bold">26,120P</span>
            </li>
            <li className="flex justify-between items-center py-3 px-4 border-b border-border">
              <div className="flex items-center">
                <span className="text-left text-accent font-bold mr-3">🥉 3위</span>
                <span className="text-left text-foreground">SlotMaster</span>
              </div>
              <span className="text-primary font-bold">24,800P</span>
            </li>
            <li className="flex justify-between items-center py-3 px-4 bg-primary/10 rounded">
              <div className="flex items-center">
                <span className="text-left text-primary font-bold mr-3">7위</span>
                <span className="text-left text-primary font-medium">나 (GameMaster2025)</span>
              </div>
              <span className="text-primary font-bold">18,940P</span>
            </li>
          </ul>
        </CardContent>
        
        <CardFooter>
          <div className="flex w-full space-x-3">
            <Button 
              variant="primary" 
              size="md" 
              className="flex-1 py-3"
              onClick={action('view full ranking clicked')}
            >
              전체 랭킹 보기
            </Button>
            <Button 
              variant="glass" 
              size="sm"
              className="px-4 py-3"
              onClick={action('my stats clicked')}
            >
              내 통계
            </Button>
          </div>
        </CardFooter>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '이번 주 상위 랭킹과 현재 사용자의 순위를 표시하는 완전히 개편된 카드입니다. 리스트 아이템에 충분한 패딩을 추가하고 메달 이모티콘으로 시각적 효과를 강화합니다.',
      },
    },
  },
};

// 9. 빠른 시작 카드 - 완전 개편
export const QuickStartCard: Story = {
  args: {
    children: (
      <div className="w-full">
        <CardHeader className="text-center border-b">
          <CardTitle className="text-h3 font-semibold">빠른 시작</CardTitle>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-4">
          <Button 
            variant="glass" 
            size="md" 
            className="w-full flex items-center justify-center space-x-3 py-3"
            onClick={action('slot machine clicked')}
          >
            <Gamepad2 className="size-4" />
            <span>슬롯머신</span>
          </Button>
          <Button 
            variant="glass" 
            size="md" 
            className="w-full flex items-center justify-center space-x-3 py-3"
            onClick={action('blackjack clicked')}
          >
            <Play className="size-4" />
            <span>블랙잭</span>
          </Button>
          <Button 
            variant="glass" 
            size="md" 
            className="w-full flex items-center justify-center space-x-3 py-3"
            onClick={action('roulette clicked')}
          >
            <Star className="size-4" />
            <span>룰렛</span>
          </Button>
        </CardContent>
        
        <CardFooter>
          <Button 
            variant="primary" 
            size="md" 
            className="w-full py-3"
            onClick={action('all games clicked')}
          >
            모든 게임 보기
          </Button>
        </CardFooter>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '인기 게임을 빠르게 시작할 수 있는 완전히 개편된 카드입니다. 버튼 간에 적절한 간격을 두고 아이콘 크기를 조정합니다.',
      },
    },
  },
};

// 10. 승률 통계 카드 - 완전 개편
export const WinRateStatsCard: Story = {
  args: {
    children: (
      <div className="w-full">
        <CardHeader className="text-center border-b">
          <div className="flex items-center justify-center">
            <TrendingUp className="size-5 text-success mr-2" />
            <CardTitle className="text-h3 font-semibold">게임 통계</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-success">68%</div>
              <div className="text-xs text-text-secondary mt-2">승률</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">342</div>
              <div className="text-xs text-text-secondary mt-2">총 게임</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between py-2">
              <span className="text-sm text-text-secondary">슬롯머신</span>
              <span className="text-sm text-foreground">75% (120게임)</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-text-secondary">블랙잭</span>
              <span className="text-sm text-foreground">62% (89게임)</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-text-secondary">룰렛</span>
              <span className="text-sm text-foreground">71% (133게임)</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <div className="flex w-full space-x-3">
            <Button 
              variant="primary" 
              size="md" 
              className="flex-1 py-3"
              onClick={action('detailed stats clicked')}
            >
              상세 통계
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="px-4 py-3"
              onClick={action('reset stats clicked')}
            >
              초기화
            </Button>
          </div>
        </CardFooter>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '사용자의 게임 승률과 통계를 표시하는 완전히 개편된 카드입니다. 버튼 크기를 적절히 조정하고 간격을 확보합니다.',
      },
    },
  },
};

// 11. 공지사항 카드 - 완전 개편
export const AnnouncementCard: Story = {
  args: {
    children: (
      <div className="w-full">
        <CardHeader className="text-center border-b">
          <div className="flex items-center justify-center">
            <span className="text-2xl mr-2">📢</span>
            <CardTitle className="text-h3 font-semibold">중요 공지</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <ul className="w-full space-y-3">
            <li className="flex items-start py-3 px-4 border-b border-border">
              <span className="text-base mr-3 mt-1">🔥</span>
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground mb-2">새로운 게임 출시!</div>
                <div className="text-xs text-text-secondary">메가 슬롯 게임이 새롭게 추가되었습니다.</div>
                <div className="text-xs text-muted-foreground mt-1">2시간 전</div>
              </div>
            </li>
            <li className="flex items-start py-3 px-4 border-b border-border">
              <span className="text-base mr-3 mt-1">💰</span>
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground mb-2">보너스 이벤트</div>
                <div className="text-xs text-text-secondary">첫 입금 시 100% 보너스 지급!</div>
                <div className="text-xs text-muted-foreground mt-1">1일 전</div>
              </div>
            </li>
            <li className="flex items-start py-3 px-4">
              <span className="text-base mr-3 mt-1">⚙️</span>
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground mb-2">시스템 점검 안내</div>
                <div className="text-xs text-text-secondary">매주 화요일 새벽 2-4시 정기 점검</div>
                <div className="text-xs text-muted-foreground mt-1">3일 전</div>
              </div>
            </li>
          </ul>
        </CardContent>
        
        <CardFooter>
          <Button 
            variant="primary" 
            size="md" 
            className="w-full py-3"
            onClick={action('all announcements clicked')}
          >
            모든 공지사항 보기
          </Button>
        </CardFooter>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '중요한 공지사항과 업데이트 내용을 표시하는 완전히 개편된 카드입니다. 각 공지사항에 적절한 이모티콘과 타임스탬프를 포함하고 리스트 아이템에 충분한 패딩을 추가합니다.',
      },
    },
  },
};

// 12. 회원가입 카드 - 새로 추가
export const RegistrationCard: Story = {
  args: {
    children: (
      <div className="w-full">
        <CardHeader className="text-center border-b">
          <CardTitle className="text-h3 font-semibold">회원가입</CardTitle>
          <CardDescription className="text-sm mt-4">
            새 계정을 만들어 게임을 시작하세요
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-6">
          <div className="w-full">
            <Input
              variant="text"
              size="md"
              placeholder="사용자명"
              className="text-center"
            />
          </div>
          <div className="w-full">
            <Input
              variant="email"
              size="md"
              placeholder="이메일 주소"
              className="text-center"
            />
          </div>
          <div className="w-full">
            <Input
              variant="password"
              size="md"
              placeholder="비밀번호"
              className="text-center"
            />
          </div>
          <div className="w-full">
            <Input
              variant="password"
              size="md"
              placeholder="비밀번호 확인"
              className="text-center"
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex-col space-y-6">
          <Button 
            variant="primary" 
            size="md" 
            className="w-full py-3"
            onClick={action('register clicked')}
          >
            가입하기
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="w-full py-2"
            onClick={action('back to login clicked')}
          >
            로그인으로 돌아가기
          </Button>
        </CardFooter>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '신규 사용자 회원가입을 위한 폼 카드입니다. 인풋필드 중앙정렬이 적용되어 깔끔한 UI를 제공합니다.',
      },
    },
  },
};

// 13. 이벤트 카드 - 새로 추가
export const EventCard: Story = {
  args: {
    children: (
      <div className="w-full">
        <CardHeader className="text-center border-b">
          <div className="flex items-center justify-center">
            <span className="text-2xl mr-2">🎉</span>
            <CardTitle className="text-h3 font-semibold">특별 이벤트</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-6">
          <div className="rounded-lg overflow-hidden">
            <img 
              src="/api/placeholder/400/200" 
              alt="이벤트 배너" 
              className="w-full h-auto object-cover"
            />
          </div>
          
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-foreground">신규 회원 보너스</h4>
            <p className="text-sm text-text-secondary leading-relaxed">
              신규 가입 시 5,000 포인트를 즉시 지급해드립니다. 추가로 첫 입금 시 100% 보너스 혜택을 놓치지 마세요!
            </p>
            <div className="flex items-center text-xs text-accent">
              <Clock className="size-3 mr-1" />
              <span>이벤트 종료까지 3일 남음</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex-col space-y-6">
          <Button 
            variant="primary" 
            size="md" 
            className="w-full py-3"
            onClick={action('join event clicked')}
          >
            이벤트 참여하기
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="w-full py-2"
            onClick={action('details clicked')}
          >
            상세 정보 보기
          </Button>
        </CardFooter>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '특별 이벤트 정보를 표시하는 카드입니다. 이미지와 설명, 남은 시간 등의 정보를 포함합니다.',
      },
    },
  },
};

// 14. 결제 카드 - 새로 추가
export const PaymentCard: Story = {
  args: {
    children: (
      <div className="w-full">
        <CardHeader className="text-center border-b">
          <CardTitle className="text-h3 font-semibold">포인트 충전</CardTitle>
          <CardDescription className="text-sm mt-4">
            충전할 포인트 금액을 선택하세요
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
              <div className="text-lg font-semibold mb-1">5,000P</div>
              <div className="text-sm text-text-secondary">5,000원</div>
            </div>
            <div className="border border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
              <div className="text-lg font-semibold mb-1">10,000P</div>
              <div className="text-sm text-text-secondary">10,000원</div>
            </div>
            <div className="border border-primary rounded-lg p-4 text-center cursor-pointer bg-primary/5">
              <div className="text-lg font-semibold mb-1">30,000P</div>
              <div className="text-sm text-text-secondary">28,000원</div>
              <div className="text-xs text-success mt-1">+2,000P 보너스</div>
            </div>
            <div className="border border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
              <div className="text-lg font-semibold mb-1">50,000P</div>
              <div className="text-sm text-text-secondary">45,000원</div>
              <div className="text-xs text-success mt-1">+5,000P 보너스</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 border-t border-dashed border-border pt-4">
            <div className="text-sm font-medium">결제 방법:</div>
            <div className="flex items-center space-x-3 text-sm">
              <span className="cursor-pointer text-primary font-medium">카드</span>
              <span className="cursor-pointer text-text-secondary hover:text-primary">계좌이체</span>
              <span className="cursor-pointer text-text-secondary hover:text-primary">휴대폰</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex-col space-y-6">
          <Button 
            variant="primary" 
            size="md" 
            className="w-full py-3"
            onClick={action('payment clicked')}
          >
            30,000P 충전하기
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="w-full py-2"
            onClick={action('cancel clicked')}
          >
            취소
          </Button>
        </CardFooter>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '포인트 충전을 위한 결제 카드입니다. 다양한 금액 옵션과 결제 수단을 선택할 수 있습니다.',
      },
    },
  },
};
