import type { Meta, StoryObj } from '@storybook/react';
import { Footer } from './Footer';

const meta: Meta<typeof Footer> = {
  title: 'UI/Layout/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '앱 하단의 푸터 컴포넌트'
      }
    }
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {
  render: () => (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 p-4 bg-slate-100 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">페이지 컨텐츠</h1>
          <p className="mb-2">이 영역은 페이지 본문 컨텐츠입니다.</p>
          <p>푸터는 항상 페이지 하단에 위치하게 됩니다.</p>
        </div>
      </div>
      <Footer />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '기본 푸터 컴포넌트'
      }
    }
  }
};

export const StandaloneFooter: Story = {
  parameters: {
    docs: {
      description: {
        story: '독립형 푸터 컴포넌트'
      }
    }
  }
};
