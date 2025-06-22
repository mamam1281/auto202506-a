import type { Meta, StoryObj } from '@storybook/react';
import BottomNav from './BottomNav';
import { usePathname } from 'next/navigation';

// usePathname을 모의 구현
jest.mock('next/navigation', () => ({
  usePathname: jest.fn()
}));

const meta = {
  title: 'Layout/BottomNav',
  component: BottomNav,
  parameters: {
    layout: 'fullscreen'
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ 
        minHeight: '100vh',
        background: 'var(--color-slate-900, #0f172a)',
        color: 'white',
        paddingTop: '80vh' // 하단 네비게이션을 잘 볼 수 있도록 상단에 여백을 둠
      }}>
        <Story />
      </div>
    )
  ],
} satisfies Meta<typeof BottomNav>;

export default meta;
type Story = StoryObj<typeof meta>;

// 각 스토리에 대해 다른 경로 설정
export const Home: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/'
      }
    }
  }
};

export const Games: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/games'
      }
    }
  }
};

export const Ranking: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/ranking'
      }
    }
  }
};

export const Profile: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/profile'
      }
    }
  }
};

// 특정 게임 세부 페이지 (게임 탭이 활성화됨)
export const GameDetail: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/games/slot-machine'
      }
    }
  }
};

// 커스텀 스타일의 하단 네비게이션
export const CustomStyle: Story = {
  render: (args) => {
    // Home 경로로 설정
    (usePathname as jest.Mock).mockReturnValue('/');
    
    return (
      <BottomNav 
        className="bg-gradient-to-r from-blue-900 to-purple-900 border-t-0"
        {...args}
      />
    );
  }
};
