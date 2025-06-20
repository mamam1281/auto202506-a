import type { Meta, StoryObj } from '@storybook/react';
import Button from '../Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Basic/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '재사용 가능한 버튼 컴포넌트. 다양한 변형과 상태를 지원합니다.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'gradient', 'success', 'warning', 'error'],
      description: '버튼의 시각적 스타일',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: '버튼의 크기',
    },
    iconPosition: {
      control: 'select',
      options: ['left', 'right'],
      description: '아이콘의 위치',
    },
    loading: {
      control: 'boolean',
      description: '로딩 상태 표시',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    fullWidth: {
      control: 'boolean',
      description: '전체 너비 사용',
    },
    iconOnly: {
      control: 'boolean',
      description: '아이콘만 표시',
    },
    onClick: { action: 'clicked' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 버튼
export const Default: Story = {
  args: {
    children: '기본 버튼',
    variant: 'primary',
    size: 'md',
  },
};

// 모든 변형
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="gradient">Gradient</Button>
      <Button variant="success">Success</Button>
      <Button variant="warning">Warning</Button>
      <Button variant="error">Error</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '사용 가능한 모든 버튼 변형들',
      },
    },
  },
};

// 모든 크기
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '사용 가능한 모든 버튼 크기들',
      },
    },
  },
};

// 아이콘 버튼
export const WithIcon: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Button icon={<span>🚀</span>} iconPosition="left">
        Left Icon
      </Button>
      <Button icon={<span>➡️</span>} iconPosition="right">
        Right Icon
      </Button>
      <Button icon={<span>⭐</span>} iconOnly />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '아이콘이 포함된 버튼들',
      },
    },
  },
};

// 상태별 버튼
export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Button>Normal</Button>
      <Button loading>Loading</Button>
      <Button disabled>Disabled</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '다양한 상태의 버튼들',
      },
    },
  },
};

// 전체 너비
export const FullWidth: Story = {
  render: () => (
    <div style={{ width: '300px' }}>
      <Button fullWidth variant="primary">
        전체 너비 버튼
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '컨테이너의 전체 너비를 사용하는 버튼',
      },
    },
  },
};

// 인터랙티브 테스트
export const Interactive: Story = {
  args: {
    children: '클릭해보세요',
    variant: 'gradient',
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: '클릭 가능한 인터랙티브 버튼',
      },
    },
  },
};

// 로딩 상태
export const Loading: Story = {
  args: {
    children: '로딩 중',
    loading: true,
    variant: 'primary',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '로딩 상태를 보여주는 버튼',
      },
    },
  },
};

// 비활성화 상태
export const Disabled: Story = {
  args: {
    children: '비활성화됨',
    disabled: true,
    variant: 'primary',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '비활성화된 버튼',
      },
    },
  },
};
