import type { Meta, StoryObj } from '@storybook/react';
import TabsDemo from './TabsDemo';

const meta: Meta<typeof TabsDemo> = {
  title: 'Examples/TabsDemo',
  component: TabsDemo,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Tabs 컴포넌트의 간격과 정렬을 확인할 수 있는 완전한 예제입니다. Card, Checkbox, RadioButton과 함께 사용된 모습을 볼 수 있습니다.'
      }
    }
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TabsDemo>;

export const Default: Story = {
  name: 'Tabs 간격 데모'
};

export const SpacingTest: Story = {
  name: '간격 테스트',
  parameters: {
    docs: {
      description: {
        story: '탭 라벨의 상하 패딩, 콘텐츠 영역과의 간격, Card 내부 요소들의 spacing이 올바르게 적용되었는지 확인할 수 있습니다.'
      }
    }
  }
};
