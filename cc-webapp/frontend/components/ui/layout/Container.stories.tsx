import type { Meta, StoryObj } from '@storybook/react';
import { Container } from './Container';

const meta: Meta<typeof Container> = {
  title: 'UI/Layout/Container',
  component: Container,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '컨텐츠를 담고 적절한 간격과 정렬을 제공하는 컨테이너 컴포넌트'
      }
    }
  },
  tags: ['autodocs'],  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', '2xl', 'full'],
      description: '컨테이너 최대 너비'
    },
    variant: {
      control: 'select',
      options: ['default', 'dark', 'glass', 'card', 'gradient'],
      description: '컨테이너 스타일'
    },
    padding: {
      control: 'select',
      options: [true, false, 'sm', 'md', 'lg'],
      description: '내부 여백'
    },
    animate: {
      control: 'boolean',
      description: '애니메이션 활성화'
    },
    animationPreset: {
      control: 'select',
      options: ['fade', 'slide', 'zoom', 'bounce', 'none'],
      description: '애니메이션 프리셋'
    },
    className: {
      control: 'text',
      description: '추가 CSS 클래스'
    },
    responsive: {
      control: 'boolean',
      description: '반응형 패딩 활성화'
    }
  },
};

export default meta;
type Story = StoryObj<typeof Container>;

export const Default: Story = {
  args: {
    children: (
      <div className="h-40 flex items-center justify-center bg-muted/30 rounded-lg">
        <p>기본 컨테이너</p>
      </div>
    ),
    size: 'xl',
    variant: 'default',
    padding: 'md',
    animate: true,
    animationPreset: 'fade',
    responsive: true,
  },
};

export const Card: Story = {
  args: {
    children: (
      <div className="h-40 flex items-center justify-center">
        <p>카드 스타일 컨테이너</p>
      </div>
    ),
    size: 'md',
    variant: 'card',
    padding: 'md',
    animate: true,
    animationPreset: 'zoom',
    responsive: true,
  },
};

export const Glass: Story = {
  args: {
    children: (
      <div className="h-40 flex items-center justify-center">
        <p>글래스 모프즘 스타일 컨테이너</p>
      </div>
    ),
    size: 'lg',
    variant: 'glass',
    padding: 'lg',
    animate: true,
    animationPreset: 'slide',
    responsive: true,
  },
};

export const Gradient: Story = {
  args: {
    children: (
      <div className="h-40 flex items-center justify-center text-white">
        <p>그라데이션 배경의 컨테이너</p>
      </div>
    ),
    size: 'full',
    variant: 'gradient',
    padding: 'sm',
    animate: true,
    animationPreset: 'bounce',
    responsive: true,
  },
};
