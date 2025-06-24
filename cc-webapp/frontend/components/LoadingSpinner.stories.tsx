import type { Meta, StoryObj } from '@storybook/react';
import { LoadingSpinner, LoadingSpinnerProps } from './LoadingSpinner';

const meta: Meta<typeof LoadingSpinner> = {
  title: 'Components/LoadingSpinner',
  component: LoadingSpinner,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: { type: 'select' },
      options: ['modern', 'classic'],
    },
  },
};
export default meta;

type Story = StoryObj<typeof LoadingSpinner>;

export const ModernMd: Story = {
  args: {
    size: 'md',
    variant: 'modern',
  },
  render: (args) => (
    <div style={{ 
      padding: '2rem', 
      background: 'var(--color-background)', 
      borderRadius: '8px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100px'
    }}>
      <LoadingSpinner {...args} />
    </div>
  ),
};

export const ModernSm: Story = {
  args: {
    size: 'sm',
    variant: 'modern',
  },
  render: (args) => (
    <div style={{ 
      padding: '2rem', 
      background: 'var(--color-background)', 
      borderRadius: '8px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100px'
    }}>
      <LoadingSpinner {...args} />
    </div>
  ),
};

export const ModernLg: Story = {
  args: {
    size: 'lg',
    variant: 'modern',
  },
  render: (args) => (
    <div style={{ 
      padding: '2rem', 
      background: 'var(--color-background)', 
      borderRadius: '8px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100px'
    }}>
      <LoadingSpinner {...args} />
    </div>
  ),
};

export const ClassicMd: Story = {
  args: {
    size: 'md',
    variant: 'classic',
  },
  render: (args) => (
    <div style={{ 
      padding: '2rem', 
      background: 'var(--color-background)', 
      borderRadius: '8px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100px'
    }}>
      <LoadingSpinner {...args} />
    </div>
  ),
};

export const ClassicSm: Story = {
  args: {
    size: 'sm',
    variant: 'classic',
  },
  render: (args) => (
    <div style={{ 
      padding: '2rem', 
      background: 'var(--color-background)', 
      borderRadius: '8px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100px'
    }}>
      <LoadingSpinner {...args} />
    </div>
  ),
};

export const ClassicLg: Story = {
  args: {
    size: 'lg',
    variant: 'classic',
  },
  render: (args) => (
    <div style={{ 
      padding: '2rem', 
      background: 'var(--color-background)', 
      borderRadius: '8px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100px'
    }}>
      <LoadingSpinner {...args} />
    </div>
  ),
};

// 모든 크기 비교
export const AllSizes: Story = {
  render: (args) => (
    <div style={{ 
      display: 'flex', 
      gap: 32, 
      alignItems: 'center',
      padding: '2rem',
      background: 'var(--color-background)',
      borderRadius: '8px'
    }}>
      {['sm', 'md', 'lg'].map((size) => (
        <div key={size} style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: 16, fontSize: '16px', fontWeight: 600, color: 'var(--foreground)' }}>
            크기: {size.toUpperCase()}
          </div>
          <LoadingSpinner
            variant={args.variant}
            size={size as any}
          />
        </div>
      ))}
    </div>
  ),
  args: {
    variant: 'modern',
  },
};

// 모든 변형 비교
export const AllVariants: Story = {
  render: (args) => (
    <div style={{ 
      display: 'flex', 
      gap: 32, 
      alignItems: 'center',
      padding: '2rem',
      background: 'var(--color-background)',
      borderRadius: '8px'
    }}>
      {['modern', 'classic'].map((variant) => (
        <div key={variant} style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: 16, fontSize: '16px', fontWeight: 600, color: 'var(--foreground)' }}>
            {variant === 'modern' ? '모던' : '클래식'}
          </div>
          <LoadingSpinner
            variant={variant as any}
            size={args.size}
          />
        </div>
      ))}
    </div>
  ),
  args: {
    size: 'md',
  },
};

// 실제 사용 예시 - 버튼 내부에서 사용하는 경우
export const InButtonExample: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <button
        className="btn btn-primary btn-md"
        disabled
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <LoadingSpinner size="md" variant="modern" />
      </button>

      <button
        className="btn btn-secondary btn-md"
        disabled
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <LoadingSpinner size="md" variant="classic" />
      </button>

      <button
        className="btn btn-accent btn-lg"
        disabled
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <LoadingSpinner size="lg" variant="modern" />
      </button>
    </div>
  ),
};

// 다크 배경에서의 사용 예시
export const OnDarkBackground: Story = {
  render: () => (
    <div style={{
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      padding: '2rem',
      borderRadius: '12px',
      display: 'flex',
      gap: 24,
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: 8, fontSize: '14px', fontWeight: 500, color: 'white' }}>
          Modern
        </div>
        <LoadingSpinner size="md" variant="modern" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: 8, fontSize: '14px', fontWeight: 500, color: 'white' }}>
          Classic
        </div>
        <LoadingSpinner size="md" variant="classic" />
      </div>
    </div>
  ),
};
