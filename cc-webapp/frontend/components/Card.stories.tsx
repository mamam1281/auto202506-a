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
      <div>
        <p className="text-[var(--color-text-secondary)] text-[var(--font-size-sm)]">
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
      <div className="space-y-3">
        <p className="text-[var(--color-text-secondary)] text-[var(--font-size-sm)]">
          특별한 혜택을 확인해보세요!
        </p>        <div className="flex gap-2">
          <Button variant="animated" size="md">확인하기</Button>
          <Button variant="glass" size="md">나중에</Button>
        </div>
      </div>
    ),
  },
};

// 헤더 우측 요소가 있는 카드
export const WithHeaderRight: Story = {
  args: {
    title: '알림 설정',
    headerRight: (      <Button iconOnly variant="text" size="md" onClick={action('settings clicked')}>
        <Settings size={16} />
      </Button>
    ),
    children: (        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[var(--color-text-secondary)] text-[var(--font-size-sm)]">푸시 알림</span>
            <Button variant="primary" size="md">켜기</Button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--color-text-secondary)] text-[var(--font-size-sm)]">이메일 알림</span>
            <Button variant="glass" size="md">끄기</Button>
          </div>
        </div>
    ),
  },
};

// 클릭 가능한 카드
export const Clickable: Story = {
  args: {
    title: '클릭 가능한 카드',
    onClick: action('card clicked'),
    children: (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Star size={16} className="text-yellow-400" />
          <span className="text-[var(--color-text-secondary)] text-[var(--font-size-sm)]">
            프리미엄 기능 체험하기
          </span>
        </div>
        <p className="text-[var(--color-text-secondary)] text-[var(--font-size-xs)]">
          카드를 클릭하면 호버 리프트 효과와 함께 이벤트가 발생합니다.
        </p>
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
        <div className="p-[var(--spacing-4)] border-b border-[var(--border)]">
          <h3 className="text-[var(--font-size-h3)] font-[var(--font-weight-semibold)] text-[var(--card-foreground)]">
            커스텀 레이아웃
          </h3>
        </div>
        <div className="p-[var(--spacing-3)]">
          <p className="text-[var(--color-text-secondary)] text-[var(--font-size-sm)]">
            noPadding 옵션을 사용하여 내부에서 직접 패딩을 제어할 수 있습니다.
          </p>
        </div>        <div className="p-[var(--spacing-2)] bg-[var(--color-purple-primary)]/10 rounded-b-[var(--radius-lg)]">
          <Button variant="animated" size="md" className="w-full">
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
    headerRight: (      <div className="flex gap-1">
        <Button iconOnly variant="text" size="md" onClick={action('bell clicked')}>
          <Bell size={14} />
        </Button>
        <Button iconOnly variant="text" size="md" onClick={action('close clicked')}>
          <X size={14} />
        </Button>
      </div>
    ),
    children: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-[var(--color-purple-primary)]/10 rounded-[var(--radius-md)]">
            <div className="text-[var(--font-size-h2)] font-[var(--font-weight-bold)] text-[var(--color-purple-primary)]">
              1,234
            </div>
            <div className="text-[var(--font-size-xs)] text-[var(--color-text-secondary)]">
              총 포인트
            </div>
          </div>
          <div className="text-center p-3 bg-green-500/10 rounded-[var(--radius-md)]">
            <div className="text-[var(--font-size-h2)] font-[var(--font-weight-bold)] text-green-400">
              89%
            </div>
            <div className="text-[var(--font-size-xs)] text-[var(--color-text-secondary)]">
              승률
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-[var(--font-size-sm)]">
            <span className="text-[var(--color-text-secondary)]">이번 주 진행률</span>
            <span className="text-[var(--foreground)]">78%</span>
          </div>
          <div className="w-full bg-[var(--border)] rounded-full h-2">
            <div className="bg-[var(--color-purple-primary)] h-2 rounded-full" style={{ width: '78%' }}></div>          </div>
        </div>
      </div>
    ),
  },
};

// 4x4 그리드 데모
export const GridDemo: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-[var(--spacing-3)] max-w-7xl">
      {/* 첫 번째 행 */}
      <Card title="간단한 알림">
        <p className="text-[var(--color-text-secondary)] text-[var(--font-size-sm)]">
          새로운 업데이트가 있습니다.
        </p>
      </Card>
      
      <Card 
        title="액션 카드" 
        onClick={action('action card clicked')}
      >
        <div className="space-y-2">
          <p className="text-[var(--color-text-secondary)] text-[var(--font-size-sm)]">
            클릭하여 세부 정보를 확인하세요.
          </p>
          <Button variant="animated" size="md">자세히 보기</Button>
        </div>
      </Card>
      
      <Card 
        title="설정" 
        headerRight={
          <Button iconOnly variant="text" size="md">
            <Settings size={16} />
          </Button>
        }
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[var(--font-size-sm)]">다크 모드</span>
            <Button variant="glass" size="md">켜기</Button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--font-size-sm)]">알림</span>
            <Button variant="primary" size="md">설정</Button>
          </div>
        </div>
      </Card>

      <Card title="포인트">
        <div className="text-center">
          <div className="text-[var(--font-size-h2)] font-[var(--font-weight-bold)] text-[var(--color-purple-primary)]">
            1,234
          </div>
          <div className="text-[var(--font-size-xs)] text-[var(--color-text-secondary)]">
            현재 포인트
          </div>
        </div>
      </Card>

      {/* 두 번째 행 */}
      <Card title="승률 통계">
        <div className="text-center">
          <div className="text-[var(--font-size-h2)] font-[var(--font-weight-bold)] text-green-400">
            89%
          </div>
          <div className="text-[var(--font-size-xs)] text-[var(--color-text-secondary)]">
            전체 승률
          </div>
        </div>
      </Card>

      <Card 
        title="빠른 시작"
        onClick={action('quick start clicked')}
      >
        <div className="space-y-2">
          <p className="text-[var(--color-text-secondary)] text-[var(--font-size-sm)]">
            즐겨하는 게임을 바로 시작하세요.
          </p>
          <Button variant="glass" size="md" className="w-full">시작하기</Button>
        </div>
      </Card>

      <Card title="알림 설정">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[var(--font-size-sm)]">푸시 알림</span>
            <Button variant="success" size="md">ON</Button>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[var(--font-size-sm)]">이메일</span>
            <Button variant="outline" size="md">OFF</Button>
          </div>
        </div>
      </Card>

      <Card title="최근 활동">
        <div className="space-y-1">
          <div className="text-[var(--font-size-sm)] text-[var(--foreground)]">슬롯 게임</div>
          <div className="text-[var(--font-size-xs)] text-[var(--color-text-secondary)]">10분 전</div>
          <div className="text-[var(--font-size-sm)] text-[var(--foreground)]">카드 게임</div>
          <div className="text-[var(--font-size-xs)] text-[var(--color-text-secondary)]">1시간 전</div>
        </div>
      </Card>

      {/* 세 번째 행 */}
      <Card title="프로필">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-[var(--font-size-sm)]">레벨</span>
            <span className="text-[var(--color-purple-primary)] font-medium">15</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--font-size-sm)]">경험치</span>
            <span className="text-[var(--foreground)]">75%</span>
          </div>
          <div className="w-full bg-[var(--border)] rounded-full h-1">
            <div className="bg-[var(--color-purple-primary)] h-1 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>
      </Card>

      <Card 
        title="이벤트"
        onClick={action('event clicked')}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Star size={16} className="text-yellow-400" />
            <span className="text-[var(--font-size-sm)]">특별 이벤트</span>
          </div>
          <p className="text-[var(--color-text-secondary)] text-[var(--font-size-xs)]">
            참여하고 특별 보상을 받으세요!
          </p>
        </div>
      </Card>

      <Card title="도움말">
        <div className="space-y-2">
          <p className="text-[var(--color-text-secondary)] text-[var(--font-size-sm)]">
            게임 방법과 팁을 확인하세요.
          </p>
          <Button variant="animated" size="md" className="w-full">가이드 보기</Button>
        </div>
      </Card>

      <Card title="보상함">
        <div className="text-center space-y-2">
          <div className="text-[var(--font-size-lg)] font-[var(--font-weight-semibold)]">🎁</div>
          <p className="text-[var(--font-size-sm)]">받을 보상이 있습니다!</p>
          <Button variant="primary" size="md">받기</Button>
        </div>
      </Card>

      {/* 네 번째 행 */}
      <Card title="게임 모드">
        <div className="space-y-2">
          <Button variant="glass" size="md" className="w-full">클래식</Button>
          <Button variant="outline" size="md" className="w-full">터보</Button>
        </div>
      </Card>

      <Card title="친구 목록">
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-[var(--font-size-sm)]">온라인</span>
            <span className="text-green-400 text-[var(--font-size-xs)]">3명</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[var(--font-size-sm)]">오프라인</span>
            <span className="text-[var(--color-text-secondary)] text-[var(--font-size-xs)]">12명</span>
          </div>
        </div>
      </Card>

      <Card 
        title="랭킹"
        onClick={action('ranking clicked')}
      >
        <div className="space-y-2">
          <div className="text-center">
            <div className="text-[var(--font-size-lg)] font-[var(--font-weight-bold)] text-[var(--color-accent-yellow)]">
              #7
            </div>
            <div className="text-[var(--font-size-xs)] text-[var(--color-text-secondary)]">
              현재 순위
            </div>
          </div>
        </div>
      </Card>

      <Card title="공지사항">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Bell size={14} className="text-[var(--color-purple-primary)]" />
            <span className="text-[var(--font-size-sm)]">새 소식</span>
          </div>
          <p className="text-[var(--color-text-secondary)] text-[var(--font-size-xs)]">
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
