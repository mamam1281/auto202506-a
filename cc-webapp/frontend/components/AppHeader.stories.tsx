import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import AppHeader, { AppHeaderProps } from './AppHeader';

const meta: Meta<typeof AppHeader> = {
  title: 'Layout/AppHeader',
  component: AppHeader,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '앱 상단 헤더 컴포넌트입니다. 로고, 포인트, 알림/설정 아이콘을 포함하며 반응형 레이아웃과 Safe Area를 지원합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    appName: {
      control: 'text',
      description: '앱 이름 (로고 텍스트)',
    },
    points: {
      control: 'number',
      description: '사용자 포인트',
    },
    hasNotifications: {
      control: 'boolean',
      description: '알림 여부 (벨 아이콘 색상 변경)',
    },
    showPointsOnMobile: {
      control: 'boolean',
      description: '모바일에서 포인트 표시 여부',
    },
    onNotificationsClick: {
      control: false,
      description: '알림 버튼 클릭 핸들러',
    },
    onSettingsClick: {
      control: false,
      description: '설정 버튼 클릭 핸들러',
    },
  },
};
export default meta;

type Story = StoryObj<typeof AppHeader>;

export const Default: Story = {
  args: {
    appName: 'GamePlatform',
    points: 25000,
    hasNotifications: false,
    showPointsOnMobile: true,
    onNotificationsClick: action('notifications clicked'),
    onSettingsClick: action('settings clicked'),
  },
};

export const WithNotifications: Story = {
  args: {
    appName: 'GamePlatform',
    points: 99999,
    hasNotifications: true,
    showPointsOnMobile: true,
    onNotificationsClick: action('notifications clicked'),
    onSettingsClick: action('settings clicked'),
  },
};

export const MobileNoPoints: Story = {
  args: {
    appName: 'GamePlatform',
    points: 1234,
    hasNotifications: false,
    showPointsOnMobile: false,
    onNotificationsClick: action('notifications clicked'),
    onSettingsClick: action('settings clicked'),
  },
};

export const HighPoints: Story = {
  args: {
    appName: 'GamePlatform',
    points: 9999999,
    hasNotifications: true,
    showPointsOnMobile: true,
    onNotificationsClick: action('notifications clicked'),
    onSettingsClick: action('settings clicked'),
  },
};

// 모바일 반응형 테스트
export const ResponsiveTest: Story = {
  args: {
    appName: 'GamePlatform',
    points: 42500,
    hasNotifications: true,
    showPointsOnMobile: true,
    onNotificationsClick: action('notifications clicked'),
    onSettingsClick: action('settings clicked'),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: '모바일 화면에서의 반응형 동작을 테스트합니다. 포인트 표시와 아이콘 배치를 확인하세요.',
      },
    },
  },
};

// 아이콘 크기 및 배치 테스트
export const IconSizeTest: Story = {
  args: {
    appName: 'GamePlatform',
    points: 15000,
    hasNotifications: true,
    showPointsOnMobile: true,
    onNotificationsClick: action('notifications clicked'),
    onSettingsClick: action('settings clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: '모든 아이콘이 24px 크기로 일관되게 표시되는지 확인합니다. Diamond, Bell, Settings 아이콘 모두 체크하세요.',
      },
    },
  },
};

// Safe Area 테스트 (시뮬레이션)
export const SafeAreaTest: Story = {
  args: {
    appName: 'GamePlatform',
    points: 78500,
    hasNotifications: false,
    showPointsOnMobile: true,
    onNotificationsClick: action('notifications clicked'),
    onSettingsClick: action('settings clicked'),
  },
  decorators: [
    (Story) => (
      <div style={{ 
        paddingTop: '44px', // iPhone 노치 시뮬레이션
        paddingLeft: '20px',
        paddingRight: '20px',
        background: 'linear-gradient(to bottom, #000 44px, transparent 44px)',
      }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Safe Area 지원을 테스트합니다. 노치나 Dynamic Island가 있는 기기에서의 레이아웃을 시뮬레이션합니다.',
      },
    },
  },
};
