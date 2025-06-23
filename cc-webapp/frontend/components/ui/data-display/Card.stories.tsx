import type { Meta, StoryObj } from '@storybook/react';
import Card from './Card';
import { useState } from 'react';

const meta = {
  title: 'Components/Data Display/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '글래스모피즘과 네온 효과가 적용된 현대적인 카드 컴포넌트입니다.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'game', 'mission', 'reward', 'neon', 'gradient'],
      description: '카드의 시각적 변형'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: '카드 크기'
    },
    clickable: {
      control: 'boolean',
      description: '클릭 가능 여부'
    },
    neonEffect: {
      control: 'boolean',
      description: '네온 효과 활성화'
    },
    animated: {
      control: 'boolean',
      description: '애니메이션 활성화'
    },
    shadow: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
      description: '그림자 크기'
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      description: '패딩 크기'
    }
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 카드
export const Default: Story = {
  args: {
    children: (
      <div style={{ padding: '20px' }}>
        <h3 style={{ margin: '0 0 12px 0', color: 'white' }}>기본 카드</h3>
        <p style={{ margin: 0, color: '#D1D5DB' }}>
          글래스모피즘이 적용된 기본 카드입니다.
        </p>
      </div>
    ),
  },
};

// 게임 카드
export const GameCard: Story = {
  args: {
    variant: 'game',
    neonEffect: true,
    clickable: true,
    children: (
      <div style={{ padding: '20px' }}>
        <h3 style={{ margin: '0 0 12px 0', color: 'white' }}>🎯 룰렛 게임</h3>
        <p style={{ margin: '0 0 16px 0', color: '#D1D5DB' }}>
          행운의 룰렛을 돌려 토큰을 획득하세요!
        </p>
        <div style={{ 
          background: 'rgba(123, 41, 205, 0.2)', 
          padding: '8px 16px', 
          borderRadius: '8px',
          border: '1px solid rgba(123, 41, 205, 0.3)',
          color: '#7b29cd',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          플레이하기
        </div>
      </div>
    ),
  },
};

// 미션 카드
export const MissionCard: Story = {
  args: {
    variant: 'mission',
    neonEffect: true,
    children: (
      <div style={{ padding: '20px' }}>
        <h3 style={{ margin: '0 0 12px 0', color: 'white' }}>📋 일일 미션</h3>
        <p style={{ margin: '0 0 16px 0', color: '#D1D5DB' }}>
          매일 새로운 미션을 완료하고 보상을 받으세요.
        </p>
        <div style={{ 
          background: 'rgba(91, 48, 246, 0.1)', 
          padding: '8px', 
          borderRadius: '8px',
          marginBottom: '12px'
        }}>
          <div style={{ 
            background: 'rgba(91, 48, 246, 0.8)', 
            width: '70%', 
            height: '6px', 
            borderRadius: '3px'
          }} />
        </div>
        <span style={{ color: '#5b30f6', fontSize: '14px', fontWeight: 'bold' }}>
          진행률: 70%
        </span>
      </div>
    ),
  },
};

// 보상 카드
export const RewardCard: Story = {
  args: {
    variant: 'reward',
    neonEffect: true,
    clickable: true,
    children: (
      <div style={{ padding: '20px' }}>
        <h3 style={{ margin: '0 0 12px 0', color: 'white' }}>🎁 토큰 보상</h3>
        <p style={{ margin: '0 0 16px 0', color: '#D1D5DB' }}>
          미션 완료 보상으로 100 토큰을 받았습니다!
        </p>
        <div style={{ 
          background: 'rgba(128, 84, 242, 0.2)', 
          padding: '12px 20px', 
          borderRadius: '8px',
          border: '1px solid rgba(128, 84, 242, 0.3)',
          color: '#8054f2',
          fontSize: '16px',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          🪙 100 토큰 수령
        </div>
      </div>
    ),
  },
};

// 그라데이션 카드
export const GradientCard: Story = {
  args: {
    variant: 'gradient',
    neonEffect: true,
    children: (
      <div style={{ padding: '20px' }}>
        <h3 style={{ margin: '0 0 12px 0', color: 'white' }}>✨ 프리미엄 기능</h3>
        <p style={{ margin: '0 0 16px 0', color: '#D1D5DB' }}>
          특별한 그라데이션 효과가 적용된 프리미엄 카드입니다.
        </p>
        <div style={{ 
          background: 'linear-gradient(45deg, #7b29cd, #8054f2)', 
          padding: '8px 16px', 
          borderRadius: '8px',
          color: 'white',
          fontSize: '14px',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          업그레이드
        </div>
      </div>
    ),
  },
};

// 크기별 카드
export const Sizes: Story = {
  args: {
    size: 'sm',
    // other props that are required for the story
  },
  /**
   * @description
   * 크기별 카드 예시입니다. small, medium, large 3가지 크기의 카드가 표시됩니다.
   */
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Card size="sm">
        <div style={{ padding: '12px' }}>
          <h4 style={{ margin: '0 0 8px 0', color: 'white' }}>Small</h4>
          <p style={{ margin: 0, color: '#D1D5DB', fontSize: '12px' }}>작은 카드</p>
        </div>
      </Card>
      <Card size="md">
        <div style={{ padding: '16px' }}>
          <h4 style={{ margin: '0 0 8px 0', color: 'white' }}>Medium</h4>
          <p style={{ margin: 0, color: '#D1D5DB', fontSize: '14px' }}>중간 카드</p>
        </div>
      </Card>
      <Card size="lg">
        <div style={{ padding: '20px' }}>
          <h4 style={{ margin: '0 0 8px 0', color: 'white' }}>Large</h4>
          <p style={{ margin: 0, color: '#D1D5DB', fontSize: '16px' }}>큰 카드</p>
        </div>
      </Card>
    </div>
  ),
};

// 상호작용 테스트
export const Interactive: Story = {
  args: {
    clickable: true,
    neonEffect: true,
    animated: true,
    children: (
      <div style={{ padding: '20px' }}>
        <h3 style={{ margin: '0 0 12px 0', color: 'white' }}>🎮 상호작용 카드</h3>
        <p style={{ margin: '0 0 16px 0', color: '#D1D5DB' }}>
          클릭, 호버, 애니메이션이 모두 활성화된 카드입니다.
        </p>
        <div style={{ 
          background: 'rgba(123, 41, 205, 0.2)', 
          padding: '8px 16px', 
          borderRadius: '8px',
          border: '1px solid rgba(123, 41, 205, 0.3)',
          color: '#7b29cd',
          fontSize: '14px',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          클릭해보세요!
        </div>
      </div>
    ),
    onClick: () => alert('카드가 클릭되었습니다!'),
  },
};

// 애니메이션 비활성화
export const NoAnimation: Story = {
  args: {
    animated: false,
    children: (
      <div style={{ padding: '20px' }}>
        <h3 style={{ margin: '0 0 12px 0', color: 'white' }}>정적 카드</h3>
        <p style={{ margin: 0, color: '#D1D5DB' }}>
          애니메이션이 비활성화된 카드입니다.
        </p>
      </div>
    ),
  },
};

// 카드 내부 버튼 상호작용 예시
export const WithButtonInteraction: Story = {
  args: {
    clickable: true,
    children: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h3 style={{ color: 'white', margin: 0 }}>카드 + 버튼 상호작용</h3>
        <CardButtonDemo />
      </div>
    )
  }
};

function CardButtonDemo() {
  const [count, setCount] = useState(0);
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <button
        style={{ padding: '8px 16px', borderRadius: 8, background: '#a78bfa', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
        onClick={e => { e.stopPropagation(); setCount(c => c + 1); }}
      >
        버튼 클릭 (+1)
      </button>
      <span style={{ color: '#fff', fontWeight: 700 }}>카운트: {count}</span>
    </div>
  );
}
