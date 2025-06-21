import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar, SidebarProvider } from './Sidebar';
import { AppProvider } from '../../../contexts/AppContext';

const meta: Meta<typeof Sidebar> = {
  title: 'UI/Layout/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '앱 네비게이션을 위한 사이드바 컴포넌트'
      }
    }
  },
  tags: ['autodocs'],  decorators: [
    (Story) => (
      <AppProvider>
        <SidebarProvider defaultOpen={true}>
          <div className="h-screen flex">
            <Story />
            <div className="flex-1 p-4 bg-slate-100 dark:bg-slate-900">
              <h1 className="text-2xl font-bold">메인 컨텐츠 영역</h1>
              <p className="mt-2">사이드바와 함께 사용되는 메인 컨텐츠 예시입니다.</p>
            </div>
          </div>
        </SidebarProvider>
      </AppProvider>
    ),
  ],
  argTypes: {
    className: {
      control: 'text',
      description: '추가 CSS 클래스'
    }
  },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '기본 사이드바 컴포넌트'
      }
    }
  }
};

export const WithCustomContent: Story = {
  render: () => (
    <Sidebar>
      <div className="p-4">
        <h2 className="text-xl font-bold">커스텀 사이드바</h2>
        <p className="mt-2 text-sm">사이드바에 커스텀 컨텐츠를 추가할 수 있습니다.</p>
        <div className="mt-4 space-y-2">
          <div className="p-2 bg-primary/10 rounded-md">메뉴 항목 1</div>
          <div className="p-2 bg-primary/10 rounded-md">메뉴 항목 2</div>
          <div className="p-2 bg-primary/10 rounded-md">메뉴 항목 3</div>
        </div>
      </div>
    </Sidebar>
  ),
  parameters: {
    docs: {
      description: {
        story: '커스텀 컨텐츠가 포함된 사이드바'
      }
    }
  }
};
