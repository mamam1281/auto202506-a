import type { Meta, StoryObj } from '@storybook/react';
import Checkbox from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'UI/Forms/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    label: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: '기본 체크박스',
    checked: false,
    disabled: false,
    onChange: (checked: boolean) => console.log('Checkbox changed:', checked),
  },
};

export const Checked: Story = {
  args: {
    label: '체크된 상태',
    checked: true,
    disabled: false,
    onChange: (checked: boolean) => console.log('Checkbox changed:', checked),
  },
};

export const Disabled: Story = {
  args: {
    label: '비활성화된 체크박스',
    checked: false,
    disabled: true,
    onChange: (checked: boolean) => console.log('Checkbox changed:', checked),
  },
};

export const DisabledChecked: Story = {
  args: {
    label: '비활성화된 체크 상태',
    checked: true,
    disabled: true,
    onChange: (checked: boolean) => console.log('Checkbox changed:', checked),
  },
};

export const WithoutLabel: Story = {
  args: {
    checked: false,
    disabled: false,
    onChange: (checked: boolean) => console.log('Checkbox changed:', checked),
  },
};

export const LongLabel: Story = {
  args: {
    label: '이것은 매우 긴 레이블입니다. 체크박스와 레이블이 어떻게 정렬되는지 확인할 수 있습니다.',
    checked: false,
    disabled: false,
    onChange: (checked: boolean) => console.log('Checkbox changed:', checked),
  },
};

export const Multiple: Story = {
  render: () => (
    <div className="space-y-4">
      <Checkbox label="옵션 1" checked={true} onChange={(checked) => console.log('Option 1:', checked)} />
      <Checkbox label="옵션 2" checked={false} onChange={(checked) => console.log('Option 2:', checked)} />
      <Checkbox label="옵션 3" checked={true} onChange={(checked) => console.log('Option 3:', checked)} />
      <Checkbox label="비활성화된 옵션" checked={false} disabled={true} onChange={(checked) => console.log('Disabled option:', checked)} />
    </div>
  ),
};
