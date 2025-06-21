import type { Meta, StoryObj } from '@storybook/react';
import { AppLayout } from './Applayout';
import { AppProvider } from '../../../contexts/AppContext';

const meta: Meta<typeof AppLayout> = {
  title: 'UI/Layout/AppLayout',
  component: AppLayout,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        component: '앱 전체 레이아웃을 구성하는 컴포넌트. 헤더, 사이드바, 메인 컨텐츠, 푸터를 포함'
      }
    }
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <AppProvider>
        <Story />
      </AppProvider>
    ),
  ],
  argTypes: {
    showSidebar: {
      control: 'boolean',
      description: '사이드바 표시 여부'
    },
    showFooter: {
      control: 'boolean',
      description: '푸터 표시 여부'
    },
    containerSize: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', '2xl', 'full'],
      description: '컨테이너 최대 너비'
    },
    variant: {
      control: 'select',
      options: ['default', 'dark', 'game'],
      description: '배경 스타일'
    },
    theme: {
      control: 'select',
      options: ['light', 'dark', 'system'],
      description: '앱 테마'
    }
  },
};

export default meta;
type Story = StoryObj<typeof AppLayout>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-6 bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700 shadow-xl">
        <h1 className="text-2xl font-bold mb-4 text-white">기본 앱 레이아웃</h1>
        <p className="mb-2 text-gray-200">이 영역에 페이지 컨텐츠가 들어갑니다.</p>
        <p className="text-gray-200">다양한 레이아웃 옵션을 사용해서 앱 디자인을 구성할 수 있습니다.</p>
      </div>
    ),
    showSidebar: true,
    showFooter: true,
    containerSize: 'xl',
    variant: 'dark',
    theme: 'dark',
  },
};

export const NoSidebar: Story = {
  args: {
    children: (
      <div className="p-6 bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700 shadow-xl">
        <h1 className="text-2xl font-bold mb-4 text-white">사이드바 없는 레이아웃</h1>
        <p className="mb-2 text-gray-200">사이드바를 제외한 레이아웃입니다.</p>
        <p className="text-gray-200">전체 너비를 활용해 컨텐츠를 표시합니다.</p>
      </div>
    ),
    showSidebar: false,
    showFooter: true,
    containerSize: 'xl',
    variant: 'dark',
    theme: 'dark',
  },
};

export const GameTheme: Story = {
  args: {
    children: (
      <div className="p-6 bg-slate-800/70 backdrop-blur-sm rounded-xl border border-purple-500/50 shadow-lg shadow-purple-500/30">
        <h1 className="text-2xl font-bold mb-4 text-purple-300">게임 테마 레이아웃</h1>
        <p className="mb-2 text-purple-100">게임 테마가 적용된 배경 스타일입니다.</p>
        <p className="text-purple-100">네온 컬러와 그라데이션으로 게임 플랫폼 분위기를 연출합니다.</p>
      </div>
    ),
    showSidebar: true,
    showFooter: true,
    containerSize: '2xl',
    variant: 'game',
    theme: 'dark',
  },
};

export const FullWidth: Story = {
  args: {
    children: (
      <div className="p-4 bg-card rounded-xl">
        <h1 className="text-2xl font-bold mb-4">전체 너비 레이아웃</h1>
        <p className="mb-2">최대 너비로 확장된 컨텐츠 영역입니다.</p>
        <p>대시보드나 데이터 테이블을 표시할 때 유용합니다.</p>
      </div>
    ),
    showSidebar: false,
    showFooter: true,
    containerSize: 'full',
    variant: 'dark',
    theme: 'dark',
  },
};
