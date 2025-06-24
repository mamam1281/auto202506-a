import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { X, Settings, Bell, Star } from 'lucide-react';
import Card from './Card';
import Button from './Button';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '범용적인 정보 표시를 위한 Card 컨테이너 컴포넌트입니다. glassmorphism-dark 스타일을 기본으로 적용하여 앱 전체의 시각적 통일성을 유지합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: '카드 상단에 표시될 제목',
    },
    headerRight: {
      control: false,
      description: '카드 헤더의 우측에 추가될 요소',
    },
    noPadding: {
      control: 'boolean',
      description: '기본 패딩 제거 옵션',
    },
    onClick: {
      control: false,
      description: '카드 클릭 시 이벤트 핸들러',
    },
    className: {
      control: 'text',
      description: '추가 CSS 클래스',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 카드
export const Default: Story = {
  args: {
    children: (
      <div>        <p className="text-text-secondary text-sm">
          기본 카드 컴포넌트입니다. 다양한 정보를 구조적으로 표시할 수 있습니다.
        </p>
      </div>
    ),
  },
};

// 제목이 있는 카드
export const WithTitle: Story = {
  args: {
    title: '오늘의 제안',
    children: (
      <div className="space-y-4">
        <p className="text-text-secondary text-sm leading-relaxed">
          특별한 혜택을 확인해보세요!
        </p>
        <div className="space-y-3">
          <p className="text-text-secondary text-xs">
            이벤트 기간: 2025년 6월 24일 - 7월 1일
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="primary" size="xs">혜택 받기</Button>
          <Button variant="outline" size="xs">나중에 보기</Button>
        </div>
      </div>
    ),
  },
};

// 헤더 우측 요소가 있는 카드
export const WithHeaderRight: Story = {
  args: {
    title: '알림 설정',
    headerRight: (
      <Button iconOnly variant="text" size="xs" onClick={action('settings clicked')}>
        <Settings className="size-icon-sm" />
      </Button>
    ),
    children: (
      <div className="space-y-4">
        <div className="flex items-center justify-between py-2">
          <span className="text-text-secondary text-sm">푸시 알림</span>
          <Button variant="primary" size="xs">켜기</Button>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-text-secondary text-sm">이메일 알림</span>
          <Button variant="glass" size="xs">끄기</Button>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-text-secondary text-sm">소리 알림</span>
          <Button variant="outline" size="xs">켜기</Button>
        </div>
      </div>
    ),
  },
};

// 클릭 가능한 카드
export const Clickable: Story = {
  args: {
    title: '🎮 클릭 가능한 카드',
    onClick: action('card clicked'),
    children: (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Star className="size-icon-sm text-yellow-400" />
          <span className="text-text-secondary text-sm">
            프리미엄 기능 체험하기
          </span>
        </div>
        <p className="text-text-secondary text-xs leading-relaxed">
          카드를 클릭하면 호버 리프트 효과와 함께 이벤트가 발생합니다.
        </p>
        <div className="text-center pt-2">
          <span className="text-primary text-caption font-medium">
            👆 카드를 클릭해보세요!
          </span>
        </div>
      </div>
    ),
  },
};

// 패딩 없는 카드
export const NoPadding: Story = {
  args: {
    noPadding: true,
    children: (
      <div>
        <div className="p-4 border-b border-border">
          <h4 className="text-h4 font-semibold text-card-foreground">
            커스텀 레이아웃
          </h4>
        </div>
        <div className="p-3">
          <p className="text-text-secondary text-sm">
            noPadding 옵션을 사용하여 내부에서 직접 패딩을 제어할 수 있습니다.
          </p>
        </div>
        <div className="p-2 bg-primary/10 rounded-b-lg">
          <Button variant="animated" size="xs" className="w-full">
            액션 버튼
          </Button>
        </div>
      </div>
    ),
  },
};

// 복합 콘텐츠 카드
export const Complex: Story = {
  args: {
    title: '게임 통계',
    headerRight: (
      <div className="flex gap-1">
        <Button iconOnly variant="text" size="xs" onClick={action('bell clicked')}>
          <Bell className="size-icon-xs" />
        </Button>
        <Button iconOnly variant="text" size="xs" onClick={action('close clicked')}>
          <X className="size-icon-xs" />
        </Button>
      </div>
    ),
    children: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-primary/10 rounded-md">
            <div className="text-h3 font-bold text-primary">
              1,234
            </div>
            <div className="text-xs text-text-secondary mt-1">
              총 포인트
            </div>
          </div>
          <div className="text-center p-3 bg-green-500/10 rounded-md">
            <div className="text-h3 font-bold text-green-400">
              89%
            </div>
            <div className="text-xs text-text-secondary mt-1">
              승률
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-text-secondary">이번 주 진행률</span>
            <span className="text-foreground font-medium">78%</span>
          </div>
          {/* Replaced bg-gray-700 with bg-muted. Assuming border-gray-600 is similar to border-border or border-muted. Using border-muted. */}
          <div className="w-full bg-muted rounded-full h-4 overflow-hidden border border-muted">
            <div 
              // Gradient colors mapped to theme variables:
              // from-purple-500 -> from-primary
              // via-blue-500 -> via-info
              // to-purple-400 -> to-neon-purple-4 (assuming neon-purple-4 is the closest for purple-400)
              className="bg-gradient-to-r from-primary via-info to-neon-purple-4 h-4 rounded-full transition-all duration-normal shadow-lg"
              style={{ width: '78%' }}
            ></div>
          </div>
        </div>
      </div>
    ),
  },
};

// 4x4 그리드 데모 (모바일 2열 강제 고정)
export const GridDemo: Story = {
  render: () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-7xl">
      {/* 첫 번째 행 */}
      <Card title="간단한 알림">
        <div className="py-2">
          <p className="text-text-secondary text-sm">
            새로운 업데이트가 있습니다.
          </p>
        </div>
      </Card>
      
      <Card 
        title="액션 카드" 
        onClick={action('action card clicked')}
      >
        <div className="space-y-2 py-2">
          <p className="text-text-secondary text-sm">
            클릭하여 세부 정보를 확인하세요.
          </p>
          <Button variant="animated" size="xs">자세히 보기</Button>
        </div>
      </Card>
      
      <Card 
        title="설정" 
        headerRight={
          <Button iconOnly variant="text" size="xs">
            <Settings className="size-icon-sm" />
          </Button>
        }
      >
        <div className="space-y-2 py-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">다크 모드</span>
            <Button variant="glass" size="xs">켜기</Button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">알림</span>
            <Button variant="primary" size="xs">설정</Button>
          </div>
        </div>
      </Card>      <Card title="포인트">
        <div className="text-center py-2">
          <div className="text-h3 font-bold text-primary">
            1,234
          </div>
          <div className="text-xs text-text-secondary mt-2">
            현재 포인트
          </div>
        </div>
      </Card>

      {/* 두 번째 행 */}
      <Card title="승률 통계">
        <div className="text-center py-2">
          <div className="text-h3 font-bold text-green-400">
            89%
          </div>
          <div className="text-xs text-text-secondary mt-2">
            전체 승률
          </div>
        </div>
      </Card>

      <Card 
        title="빠른 시작"
        onClick={action('quick start clicked')}
      >
        <div className="space-y-2 py-2">
          <p className="text-text-secondary text-sm">
            즐겨하는 게임을 바로 시작하세요.
          </p>
          <Button variant="glass" size="xs" className="w-full">시작하기</Button>
        </div>
      </Card>

      <Card title="알림 설정">
        <div className="space-y-2 py-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">푸시 알림</span>
            <Button variant="success" size="xs">ON</Button>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">이메일</span>
            <Button variant="outline" size="xs">OFF</Button>
          </div>
        </div>
      </Card>

      <Card title="최근 활동">
        <div className="space-y-2 py-2">
          <div className="text-sm text-foreground">슬롯 게임</div>
          <div className="text-xs text-text-secondary">10분 전</div>
          <div className="text-sm text-foreground">카드 게임</div>
          <div className="text-xs text-text-secondary">1시간 전</div>
        </div>
      </Card>      {/* 세 번째 행 */}
      <Card title="프로필">
        <div className="space-y-2 py-2">
          <div className="flex justify-between">
            <span className="text-sm">레벨</span>
            <span className="text-primary font-medium">15</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">경험치</span>
            <span className="text-foreground">75%</span>
          </div>
          <div className="w-full bg-border rounded-full h-1">
            <div className="bg-primary h-1 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>
      </Card>

      <Card 
        title="이벤트"
        onClick={action('event clicked')}
      >
        <div className="space-y-2 py-2">
          <div className="flex items-center gap-2">
            <Star className="size-icon-sm text-yellow-400" />
            <span className="text-sm">특별 이벤트</span>
          </div>
          <p className="text-text-secondary text-xs">
            참여하고 특별 보상을 받으세요!
          </p>
        </div>
      </Card>

      <Card title="도움말">
        <div className="space-y-2 py-2">
          <p className="text-text-secondary text-sm">
            게임 방법과 팁을 확인하세요.
          </p>
          <Button variant="animated" size="xs" className="w-full">가이드 보기</Button>
        </div>
      </Card>

      <Card title="보상함">
        <div className="text-center space-y-2 py-2">
          <div className="text-lg font-semibold">🎁</div>
          <p className="text-sm">받을 보상이 있습니다!</p>
          <Button variant="primary" size="xs">받기</Button>
        </div>
      </Card>      {/* 네 번째 행 */}
      <Card title="게임 모드">
        <div className="space-y-2 py-2">
          <Button variant="glass" size="xs" className="w-full">클래식</Button>
          <Button variant="outline" size="xs" className="w-full">터보</Button>
        </div>
      </Card>

      <Card title="친구 목록">
        <div className="space-y-2 py-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">온라인</span>
            <span className="text-green-400 text-xs">3명</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">오프라인</span>
            <span className="text-text-secondary text-xs">12명</span>
          </div>
        </div>
      </Card>

      <Card 
        title="랭킹"
        onClick={action('ranking clicked')}
      >
        <div className="space-y-2 py-2">
          <div className="text-center">
            <div className="text-lg font-bold text-accent-amber">
              #7
            </div>
            <div className="text-xs text-text-secondary">
              현재 순위
            </div>
          </div>
        </div>
      </Card>

      <Card title="공지사항">
        <div className="space-y-2 py-2">
          <div className="flex items-center gap-2">
            <Bell size={12} className="text-primary" />
            <span className="text-sm">새 소식</span>
          </div>
          <p className="text-text-secondary text-xs">
            업데이트 내역을 확인하세요.
          </p>
        </div>
      </Card>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: '4x4 안정적인 그리드 레이아웃으로 배치된 카드들입니다. modern-mesh-card 효과와 다양한 버튼 스타일이 적용되어 있습니다.',
      },
    },
  },
};

// 게임 통계 카드 (그리드 정렬 최적화)
export const GameStats: Story = {
  args: {
    title: '게임 통계',
    children: (      <div className="grid grid-cols-2 gap-y-5 gap-x-4 place-items-center text-center">
        {/* 총 포인트 섹션 */}
        <div className="py-3">
          <h4 className="text-h4 font-bold text-foreground mb-1">1,234</h4>
          <p className="text-text-secondary text-caption">총 포인트</p>
        </div>

        {/* 승률 섹션 */}
        <div className="py-3">
          <h4 className="text-h4 font-bold text-foreground mb-1">89%</h4>
          <p className="text-text-secondary text-caption">승률</p>
        </div>

        {/* 이번 주 진행률 섹션 (2열 차지) */}
        <div className="col-span-2 flex flex-col items-center mt-4 py-3">
          <p className="text-text-secondary text-caption mb-2">이번 주 진행률</p>
          <div className="w-full max-w-[200px] bg-muted rounded-full h-2 mb-2">
            <div className="bg-gradient-to-r from-accent-red to-accent-amber h-2 rounded-full" style={{width: '78%'}}></div>
          </div>
          <span className="text-foreground text-body">78%</span>
        </div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '게임 통계를 그리드로 정렬하여 표시하는 카드입니다. 2열 그리드로 통계 항목들을 균등하게 배치하고, 진행률 바는 2열을 차지하도록 구성되어 있습니다.',
      },
    },
  },
};

// 설정 항목 카드 (텍스트 간격 최적화)
export const SettingsCard: Story = {
  args: {
    title: '알림 설정',
    headerRight: (
      <Button iconOnly variant="text" size="xs" onClick={action('settings clicked')}>
        <Settings size={16} /> {/* --icon-sm is 16px */}
      </Button>
    ),
    children: (
      <div className="space-y-2">
        {/* 각 설정 항목에 명시적인 수직 패딩 추가 */}
        <div className="flex justify-between items-center py-2">
          <span className="text-foreground text-body">푸시 알림</span>
          <Button variant="primary" size="xs">켜기</Button>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-foreground text-body">이메일 알림</span>
          <Button variant="glass" size="xs">끄기</Button>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-foreground text-body">소리 알림</span>
          <Button variant="primary" size="xs">켜기</Button>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-foreground text-body">진동 알림</span>
          <Button variant="glass" size="xs">끄기</Button>
        </div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '설정 항목들을 표시하는 카드입니다. 각 항목에 명시적인 수직 패딩을 적용하여 텍스트 간 간격을 최적화했습니다.',
      },
    },
  },
};

// 버튼 그룹 세로 배치 카드
export const ButtonGroupVertical: Story = {
  args: {
    title: '버튼 그룹 세로 배치',
    children: (
      <div className="space-y-4">
        <p className="text-text-secondary text-sm">
          버튼들이 세로로 배치되며 충분한 간격을 가집니다.
        </p>
        <div className="btn-group-vertical">
          <Button variant="primary" size="xs">주요 액션</Button>
          <Button variant="secondary" size="xs">보조 액션</Button>
          <Button variant="outline" size="xs">선택사항</Button>
        </div>
      </div>
    ),
  },
};

// 버튼 그룹 가로 배치 카드
export const ButtonGroupInline: Story = {
  args: {
    title: '버튼 그룹 가로 배치',
    children: (
      <div className="space-y-4">
        <p className="text-text-secondary text-sm">
          버튼들이 가로로 배치되며 적절한 간격을 가집니다.
        </p>
        <div className="btn-group-inline">
          <Button variant="primary" size="xs">확인</Button>
          <Button variant="outline" size="xs">취소</Button>
        </div>
      </div>
    ),
  },
};

// 복잡한 버튼 섹션 카드
export const ButtonsSection: Story = {
  args: {
    title: '버튼 섹션 예시',
    children: (
      <div className="buttons-section">
        <p className="text-text-secondary text-sm text-center">
          버튼 섹션 스타일이 적용된 카드입니다.
        </p>
        <Button variant="primary" size="lg">메인 액션</Button>
        <Button variant="accent" size="md">특별 기능</Button>
        <div className="btn-group-inline">
          <Button variant="outline" size="sm">옵션 1</Button>
          <Button variant="outline" size="sm">옵션 2</Button>
        </div>
      </div>
    ),
  },
};
