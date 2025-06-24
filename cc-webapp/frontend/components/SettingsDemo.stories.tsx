import type { Meta, StoryObj } from '@storybook/react';
import SettingsDemo from './SettingsDemo';

const meta: Meta<typeof SettingsDemo> = {
  title: 'Examples/SettingsDemo',
  component: SettingsDemo,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '체크박스와 라디오 버튼의 정렬과 간격을 보여주는 설정 페이지 데모입니다.'
      }
    }
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SettingsDemo>;

export const Default: Story = {
  name: '설정 페이지 데모'
};

export const AlignmentTest: Story = {
  name: '정렬 테스트',
  parameters: {
    docs: {
      description: {
        story: '체크박스와 라디오 버튼의 아이콘-텍스트 정렬이 올바르게 되어 있는지 확인할 수 있습니다.'
      }
    }
  }
};
