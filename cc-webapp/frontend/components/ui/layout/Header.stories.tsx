import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './Header';
// AppProvider가 전역 데코레이터로 등록되어 있으므로 여기서 제거

const meta: Meta<typeof Header> = {
  title: 'UI/Layout/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '앱 상단의 헤더 컴포넌트'
      }
    }
  },  tags: ['autodocs'],  // 전역 데코레이터에서 이미 AppProvider를 사용하므로 여기서는 제거
  // decorators: [],
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
  render: () => (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900">
      <Header />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">페이지 컨텐츠</h1>
          <p className="mb-2">이 영역은 헤더 아래의 페이지 본문 컨텐츠입니다.</p>
          <p>헤더는 항상 페이지 상단에 고정되어 있습니다.</p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '기본 헤더 컴포넌트'
      }
    }
  }
};

export const StandaloneHeader: Story = {
  parameters: {
    docs: {
      description: {
        story: '독립형 헤더 컴포넌트'
      }
    }
  }
};
