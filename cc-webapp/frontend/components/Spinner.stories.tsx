import type { Meta, StoryObj } from '@storybook/react';
import { LoadingSpinner } from './LoadingSpinner';
import React, { useState, useEffect } from 'react';

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

      {/* 게임 로딩 시나리오 */}
      <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">게임 로딩</h3>
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner variant="classic" size="lg" text="게임 데이터를 준비하는 중..." />
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

// 🎯 인터랙티브 데모
export const InteractiveDemo: Story = {
  render: () => {
    const [variant, setVariant] = useState<'modern' | 'classic' | 'dots' | 'pulse'>('modern');
    const [size, setSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');
    const [showText, setShowText] = useState(true);
    
    return (
      <div className="space-y-6 p-6 max-w-md">
        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">스피너 커스터마이징</h3>
          
          {/* 컨트롤 패널 */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">변형:</label>
              <select 
                value={variant} 
                onChange={(e) => setVariant(e.target.value as any)}
                className="w-full p-2 bg-black/30 border border-white/20 rounded text-white text-sm"
              >
                <option value="modern">Modern</option>
                <option value="classic">Classic</option>
                <option value="dots">Dots</option>
                <option value="pulse">Pulse</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">크기:</label>
              <select 
                value={size} 
                onChange={(e) => setSize(e.target.value as any)}
                className="w-full p-2 bg-black/30 border border-white/20 rounded text-white text-sm"
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
                <option value="xl">Extra Large</option>
              </select>
            </div>
            
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-white">
                <input 
                  type="checkbox" 
                  checked={showText} 
                  onChange={(e) => setShowText(e.target.checked)}
                  className="rounded"
                />
                텍스트 표시
              </label>
            </div>
          </div>
          
          {/* 스피너 미리보기 */}
          <div className="flex items-center justify-center py-8 bg-black/10 rounded-lg">
            <LoadingSpinner 
              variant={variant} 
              size={size} 
              text={showText ? `${variant} 로딩 중...` : undefined}
            />
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '🎮 스피너의 다양한 옵션을 실시간으로 테스트해볼 수 있는 인터랙티브 데모입니다.',
      },
    },
  },
};

// 🎯 성능 테스트 (여러 스피너 동시 실행)
export const PerformanceTest: Story = {
  render: () => (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-4 p-6">
      {[...Array(12)].map((_, index) => (
        <div key={index} className="text-center space-y-2">
          <LoadingSpinner 
            variant={['modern', 'classic', 'dots', 'pulse'][index % 4] as any}
            size={['sm', 'md'][index % 2] as any}
          />
          <p className="text-xs text-white/60">#{index + 1}</p>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '⚡ 여러 스피너가 동시에 실행될 때의 성능을 테스트할 수 있습니다.',
      },
    },
  },
};
