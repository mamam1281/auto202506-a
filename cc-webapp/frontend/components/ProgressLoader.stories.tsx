import type { Meta, StoryObj } from '@storybook/react';
import { ProgressLoader, ProgressLoaderProps } from './ProgressLoader';
import React from 'react';

const meta: Meta<typeof ProgressLoader> = {
  title: 'Components/ProgressLoader',
  component: ProgressLoader,
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    size: { control: { type: 'select' }, options: ['sm', 'md', 'lg'] },
    variant: { control: { type: 'select' }, options: ['default', 'gradient', 'striped', 'pulsing'] },
  },
  decorators: [
    (Story) => (
      <div className="sb-container debug-outline">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof ProgressLoader>;

export const Default: Story = {
  args: { value: 60, size: 'md', variant: 'default' },
};
export const Gradient: Story = {
  args: { value: 80, size: 'md', variant: 'gradient' },
};
export const Striped: Story = {
  args: { value: 40, size: 'md', variant: 'striped' },
};
export const Pulsing: Story = {
  args: { value: 90, size: 'md', variant: 'pulsing' },
};
export const Large: Story = {
  args: { value: 75, size: 'lg', variant: 'gradient' },
};
export const Small: Story = {
  args: { value: 30, size: 'sm', variant: 'default' },
};

// 다양한 유형의 프로그레스 바를 한 번에 볼 수 있는 스토리
export const AllTypes = {
  render: () => (
    <div className="progress-group debug-outline">
      <h3 style={{ color: 'white', marginBottom: '16px' }}>기본 프로그레스 바</h3>
      <ProgressLoader value={60} size="sm" variant="default" />
      <ProgressLoader value={60} size="md" variant="default" />
      <ProgressLoader value={60} size="lg" variant="default" />

      <h3 style={{ color: 'white', marginTop: '24px', marginBottom: '16px' }}>그라데이션 프로그레스 바</h3>
      <ProgressLoader value={75} size="sm" variant="gradient" />
      <ProgressLoader value={75} size="md" variant="gradient" />
      <ProgressLoader value={75} size="lg" variant="gradient" />

      <h3 style={{ color: 'white', marginTop: '24px', marginBottom: '16px' }}>스트라이프 프로그레스 바</h3>
      <ProgressLoader value={45} size="sm" variant="striped" />
      <ProgressLoader value={45} size="md" variant="striped" />
      <ProgressLoader value={45} size="lg" variant="striped" />

      <h3 style={{ color: 'white', marginTop: '24px', marginBottom: '16px' }}>펄싱 프로그레스 바</h3>
      <ProgressLoader value={90} size="sm" variant="pulsing" />
      <ProgressLoader value={90} size="md" variant="pulsing" />
      <ProgressLoader value={90} size="lg" variant="pulsing" />
    </div>
  ),
};

// 다양한 스타일과 크기를 한번에 보여주는 예제
export const AllVariants = {
  render: () => (
    <div className="progress-group">
      <h3 style={{ color: 'white', marginBottom: '16px' }}>Default Style</h3>
      <ProgressLoader value={80} size="sm" variant="default" />
      <ProgressLoader value={60} size="md" variant="default" />
      <ProgressLoader value={40} size="lg" variant="default" />

      <h3 style={{ color: 'white', marginTop: '24px', marginBottom: '16px' }}>Gradient Style</h3>
      <ProgressLoader value={80} size="sm" variant="gradient" />
      <ProgressLoader value={60} size="md" variant="gradient" />
      <ProgressLoader value={40} size="lg" variant="gradient" />

      <h3 style={{ color: 'white', marginTop: '24px', marginBottom: '16px' }}>Striped Style</h3>
      <ProgressLoader value={80} size="sm" variant="striped" />
      <ProgressLoader value={60} size="md" variant="striped" />
      <ProgressLoader value={40} size="lg" variant="striped" />

      <h3 style={{ color: 'white', marginTop: '24px', marginBottom: '16px' }}>Pulsing Style</h3>
      <ProgressLoader value={80} size="sm" variant="pulsing" />
      <ProgressLoader value={60} size="md" variant="pulsing" />
      <ProgressLoader value={40} size="lg" variant="pulsing" />
    </div>
  ),
};
