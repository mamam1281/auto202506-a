import type { Meta, StoryObj } from '@storybook/react';
import { Search, Mail, Lock, User } from 'lucide-react';
import Input from './Input';

const meta: Meta<typeof Input> = {
  title: 'UI/Basic/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Input 컴포넌트 - 성능 최적화된 2가지 효과 (Border Animation + Color Shift) + 타이핑 효과 지원'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'search', 'email', 'password', 'text'],
      description: '입력 필드 변형'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '크기'
    },
    state: {
      control: 'select',
      options: ['default', 'focused', 'error', 'disabled', 'success'],
      description: '상태'
    },
    label: {
      control: 'text',
      description: '라벨 텍스트'
    },
    placeholder: {
      control: 'text',
      description: '플레이스홀더 텍스트'
    },
    error: {
      control: 'text',
      description: '에러 메시지'
    },
    success: {
      control: 'text',
      description: '성공 메시지'
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태'
    },
    fullWidth: {
      control: 'boolean',
      description: '전체 너비 사용'
    },
    showPasswordToggle: {
      control: 'boolean',
      description: '패스워드 토글 버튼 표시'
    },
    tooltip: {
      control: 'text',
      description: '툴팁 텍스트'
    },
    tooltipPosition: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: '툴팁 위치'
    },
    enableTypingPlaceholder: {
      control: 'boolean',
      description: '타이핑 플레이스홀더 효과 활성화'
    },
    typingPlaceholders: {
      control: 'object',
      description: '타이핑 플레이스홀더 배열'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
    label: 'Default Input'
  }
};

// 크기별 스토리
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
      <Input size="sm" placeholder="Small input" label="Small (sm)" />
      <Input size="md" placeholder="Medium input" label="Medium (md)" />
      <Input size="lg" placeholder="Large input" label="Large (lg)" />
    </div>
  )
};

// 변형별 스토리
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
      <Input variant="default" placeholder="Default variant" label="Default" />
      <Input variant="search" placeholder="Search..." label="Search" />
      <Input variant="email" placeholder="Email address" label="Email" type="email" />
      <Input variant="password" placeholder="Password" label="Password" type="password" showPasswordToggle />
      <Input variant="text" placeholder="Text input" label="Text" />
    </div>
  )
};

// 상태별 스토리
export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
      <Input placeholder="Default state" label="Default" />
      <Input placeholder="Error state" label="Error" error="This field is required" />
      <Input placeholder="Success state" label="Success" success="Looks good!" />
      <Input placeholder="Disabled state" label="Disabled" disabled />
    </div>
  )
};

// 상호작용 효과 스토리 (2가지 효과)
export const InteractiveEffects: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '400px' }}>
      <div>
        <h3 style={{ color: '#e2e8f0', marginBottom: '1rem' }}>1. Border Animation + Color Shift</h3>
        <p style={{ color: '#94a3b8', marginBottom: '1rem', fontSize: '14px' }}>
          피그마_002Splash Screen 구현 수준과 동일한 인터랙션 효과
        </p>
        <Input 
          placeholder="Focus me to see both effects" 
          label="모든 효과 활성화"
          tooltip="Focus to see the effects!"
        />
      </div>
      <div>
        <h3 style={{ color: '#e2e8f0', marginBottom: '1rem' }}>2. 개별 효과 - Border Animation</h3>
        <Input 
          placeholder="Focus me to see border animation only" 
          label="Border Animation만 적용됨"
          disableColorShift={true}
        />
      </div>
      <div>
        <h3 style={{ color: '#e2e8f0', marginBottom: '1rem' }}>3. 개별 효과 - Color Shift</h3>
        <Input 
          placeholder="Focus me to see color shift only" 
          label="Color Shift만 적용됨"
          disableBorderAnimation={true}
        />
      </div>
      <div>
        <h3 style={{ color: '#e2e8f0', marginBottom: '1rem' }}>4. 상태 효과 - Error</h3>
        <Input 
          placeholder="Error state with color shift" 
          label="Error 상태 색상 전환"
          error="Red color shift applied"
        />
      </div>
      <div>
        <h3 style={{ color: '#e2e8f0', marginBottom: '1rem' }}>5. 상태 효과 - Success</h3>
        <Input 
          placeholder="Success state with color shift" 
          label="Success 상태 색상 전환"
          success="Green color shift applied"
        />
      </div>
    </div>
  )
};

// 타이핑 효과 스토리
export const TypingEffects: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '400px' }}>
      <div>
        <h3 style={{ color: '#e2e8f0', marginBottom: '1rem' }}>Single Typing Placeholder</h3>
        <Input 
          label="Single Typing"
          enableTypingPlaceholder
          typingPlaceholders={['Type your message here...']}
        />
      </div>
      <div>
        <h3 style={{ color: '#e2e8f0', marginBottom: '1rem' }}>Multiple Cycling Placeholders</h3>
        <Input 
          label="Multiple Typing"
          enableTypingPlaceholder
          typingPlaceholders={[
            'Search for users...',
            'Search for products...',
            'Search for anything...',
            'What are you looking for?'
          ]}
        />
      </div>
      <div>
        <h3 style={{ color: '#e2e8f0', marginBottom: '1rem' }}>Search with Typing Effect</h3>
        <Input 
          variant="search"
          label="Search Input"
          enableTypingPlaceholder
          typingPlaceholders={[
            'Find players...',
            'Search games...',
            'Look for rewards...'
          ]}
        />
      </div>
    </div>
  )
};

// 아이콘이 있는 스토리
export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
      <Input 
        leftIcon={<Search size={20} />} 
        placeholder="Custom left icon" 
        label="Custom Left Icon" 
      />
      <Input 
        rightIcon={<Mail size={20} />} 
        placeholder="Custom right icon" 
        label="Custom Right Icon" 
      />
      <Input 
        variant="password" 
        placeholder="Password with toggle" 
        label="Password Toggle" 
        type="password" 
        showPasswordToggle 
      />
    </div>
  )
};

// 툴팁 스토리
export const WithTooltips: Story = {
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '1fr 1fr', 
      gap: '2rem', 
      width: '600px',
      padding: '3rem'
    }}>
      <Input 
        placeholder="Hover for top tooltip" 
        label="Top Tooltip"
        tooltip="This is a top tooltip"
        tooltipPosition="top"
      />
      <Input 
        placeholder="Hover for bottom tooltip" 
        label="Bottom Tooltip"
        tooltip="This is a bottom tooltip"
        tooltipPosition="bottom"
      />
      <Input 
        placeholder="Hover for left tooltip" 
        label="Left Tooltip"
        tooltip="This is a left tooltip"
        tooltipPosition="left"
      />
      <Input 
        placeholder="Hover for right tooltip" 
        label="Right Tooltip"
        tooltip="This is a right tooltip"
        tooltipPosition="right"
      />
    </div>
  )
};

// 성능 테스트 스토리
export const PerformanceTest: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '400px' }}>
      <h3 style={{ color: '#e2e8f0', marginBottom: '1rem' }}>
        성능 최적화 테스트 - 10개 Input 동시 렌더링
      </h3>
      {Array.from({ length: 10 }, (_, i) => (
        <Input 
          key={i}
          placeholder={`Input ${i + 1}`}
          label={`Input ${i + 1}`}
          enableTypingPlaceholder
          typingPlaceholders={[
            `Optimized input ${i + 1}...`,
            `Performance test ${i + 1}...`
          ]}
        />
      ))}
    </div>
  )
};
