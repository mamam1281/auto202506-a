import type { Meta, StoryObj } from '@storybook/react';
import { CJChatBubble } from './CJChatBubble';

const meta: Meta<typeof CJChatBubble> = {
  title: 'UI/Feedback/CJChatBubble',
  component: CJChatBubble,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'CJChatBubble - 글로벌 AI/도우미 챗버블 컴포넌트 (게임/메인/대시보드/설정 등 어디서든 사용)'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: ['bottom-right', 'bottom-left', 'top-right', 'top-left'],
      defaultValue: 'bottom-right',
      description: '챗버블 위치'
    },
    theme: {
      control: 'select',
      options: ['default', 'neon', 'minimal'],
      defaultValue: 'default',
      description: '테마 스타일'
    },
    title: { control: 'text', defaultValue: 'CJ Chat', description: '챗 타이틀' },
    placeholder: { control: 'text', defaultValue: '메시지를 입력하세요...', description: '입력창 플레이스홀더' },
    disabled: { control: 'boolean', defaultValue: false, description: '입력 비활성화' }
  }
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    position: 'bottom-right',
    theme: 'default',
    title: 'CJ Chat',
    placeholder: '메시지를 입력하세요...'
  }
};

export const NeonTheme: Story = {
  args: {
    position: 'bottom-left',
    theme: 'neon',
    title: '네온 챗',
    placeholder: 'AI에게 물어보세요!'
  }
};

export const MinimalTheme: Story = {
  args: {
    position: 'top-right',
    theme: 'minimal',
    title: '미니멀 챗',
    placeholder: '간단히 입력...'
  }
};

export const Disabled: Story = {
  args: {
    position: 'top-left',
    theme: 'default',
    title: '입력 비활성화',
    disabled: true
  }
};
