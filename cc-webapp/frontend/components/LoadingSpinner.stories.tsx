import type { Meta, StoryObj } from '@storybook/react';
import { LoadingSpinner } from './LoadingSpinner';

const meta: Meta<typeof LoadingSpinner> = {
  title: 'Components/LoadingSpinner',
  component: LoadingSpinner,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'project-dark',
      values: [
        { name: 'project-dark', value: 'var(--color-primary-dark-navy)' },
        { name: 'project-charcoal', value: 'var(--color-primary-charcoal)' },
        { name: 'project-gradient', value: 'var(--gradient-dark)' },
      ],
    },
    docs: {
      description: {
        component: `
🔄 **로딩 스피너 컴포넌트**

사용자에게 로딩 상태를 시각적으로 전달하는 애니메이션 컴포넌트입니다.

### 특징
- 4가지 애니메이션 스타일 (Modern, Classic, Dots, Pulse)
- 4가지 크기 옵션 (sm, md, lg, xl)  
- 글래스모피즘 디자인과 일치하는 스타일
- 선택적 텍스트 표시
- 프로젝트 CSS 변수 시스템 사용

### 사용 예시
\`\`\`tsx
<LoadingSpinner variant="modern" size="lg" text="로딩 중..." />
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['modern', 'classic', 'dots', 'pulse'],
      description: '스피너 애니메이션 스타일',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
      description: '스피너 크기',
    },
    text: {
      control: { type: 'text' },
      description: '스피너와 함께 표시할 텍스트 (선택사항)',
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'accent', 'white', 'custom'],
      description: '스피너 색상 테마',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 🎯 기본 스토리
export const Default: Story = {
  args: {
    variant: 'modern',
    size: 'md',
  },
};

export const WithText: Story = {
  args: {
    variant: 'modern',
    size: 'lg',
    text: '로딩 중입니다...',
  },
  parameters: {
    docs: {
      description: {
        story: '텍스트가 포함된 로딩 스피너입니다.',
      },
    },
  },
};

// 🎯 변형별 스토리
export const ModernVariant: Story = {
  args: {
    variant: 'modern',
    size: 'lg',
    text: 'Modern Loading',
  },
  parameters: {
    docs: {
      description: {
        story: '🔥 현대적인 그라디언트 스타일의 스피너입니다.',
      },
    },
  },
};

export const ClassicVariant: Story = {
  args: {
    variant: 'classic',
    size: 'lg',
    text: 'Classic Loading',
  },
  parameters: {
    docs: {
      description: {
        story: '⚡ 클래식한 회전 스타일의 스피너입니다.',
      },
    },
  },
};

export const DotsVariant: Story = {
  args: {
    variant: 'dots',
    size: 'lg',
    text: 'Dots Loading',
  },
  parameters: {
    docs: {
      description: {
        story: '⚪ 점 3개가 순차적으로 움직이는 스피너입니다.',
      },
    },
  },
};

export const PulseVariant: Story = {
  args: {
    variant: 'pulse',
    size: 'lg',
    text: 'Pulse Loading',
  },
  parameters: {
    docs: {
      description: {
        story: '💓 맥박처럼 확대/축소되는 스피너입니다.',
      },
    },
  },
};

// 🎯 크기별 스토리
export const SizeComparison: Story = {
  render: () => (
    <div className="flex items-center justify-center gap-8 p-8">
      <div className="text-center space-y-2">
        <LoadingSpinner variant="modern" size="sm" />
        <p className="text-xs text-white/70">Small</p>
      </div>
      <div className="text-center space-y-2">
        <LoadingSpinner variant="modern" size="md" />
        <p className="text-xs text-white/70">Medium</p>
      </div>
      <div className="text-center space-y-2">
        <LoadingSpinner variant="modern" size="lg" />
        <p className="text-xs text-white/70">Large</p>
      </div>
      <div className="text-center space-y-2">
        <LoadingSpinner variant="modern" size="xl" />
        <p className="text-xs text-white/70">Extra Large</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '📏 모든 크기 옵션을 한눈에 보여줍니다.',
      },
    },
  },
};

// 🎯 모든 변형 비교
export const VariantComparison: Story = {
  render: () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-8">
      <div className="text-center space-y-4">
        <LoadingSpinner variant="modern" size="xl" />
        <p className="text-sm text-white/80 font-medium">Modern</p>
      </div>
      <div className="text-center space-y-4">
        <LoadingSpinner variant="classic" size="xl" />
        <p className="text-sm text-white/80 font-medium">Classic</p>
      </div>
      <div className="text-center space-y-4">
        <LoadingSpinner variant="dots" size="xl" />
        <p className="text-sm text-white/80 font-medium">Dots</p>
      </div>
      <div className="text-center space-y-4">
        <LoadingSpinner variant="pulse" size="xl" />
        <p className="text-sm text-white/80 font-medium">Pulse</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '🎨 모든 애니메이션 변형을 비교해서 볼 수 있습니다.',
      },
    },
  },
};

// 🎯 실제 사용 시나리오
export const LoadingStates: Story = {
  render: () => (
    <div className="space-y-8 p-8">
      {/* 데이터 로딩 시나리오 */}
      <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">데이터 불러오는 중</h3>
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner variant="modern" size="lg" text="사용자 정보를 불러오는 중..." />
        </div>
      </div>

      {/* 파일 업로드 시나리오 */}
      <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">파일 업로드</h3>
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner variant="dots" size="lg" text="파일을 업로드하는 중..." />
        </div>
      </div>

      {/* 서버 동기화 시나리오 */}
      <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">동기화</h3>
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner variant="pulse" size="lg" text="서버와 동기화 중..." />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '🔄 실제 앱에서 사용될 수 있는 다양한 로딩 시나리오들입니다.',
      },
    },
  },
};
