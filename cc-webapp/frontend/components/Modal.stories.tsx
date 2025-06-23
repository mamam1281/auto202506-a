import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';

const meta: Meta<typeof Modal> = {
  title: 'Atomic/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean' },
    title: { control: 'text' },
    description: { control: 'text' },
    size: { control: 'select', options: ['sm', 'md', 'lg', 'full'] },
    showCloseButton: { control: 'boolean' },
    children: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(true);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal {...args} isOpen={open} onClose={() => setOpen(false)}>
          <div style={{ padding: 24, textAlign: 'center' }}>
            <h2 style={{ marginBottom: 12 }}>Hello Modal!</h2>
            <p>This is a modal content area.</p>
            <Button onClick={() => setOpen(false)}>
              <span style={{ marginTop: 16, display: 'inline-block' }}>Close</span>
            </Button>
          </div>
        </Modal>
      </>
    );
  },
  args: {
    title: 'Modal Title',
    description: 'Modal description goes here.',
    size: 'md',
    showCloseButton: true,
  },
};

export const Sizes: Story = {
  render: () => {
    const [open, setOpen] = useState<'sm' | 'md' | 'lg' | 'full' | null>(null);
    return (
      <div style={{ display: 'flex', gap: 12 }}>
        {(['sm', 'md', 'lg', 'full'] as const).map(size => (
          <Button key={size} onClick={() => setOpen(size)}>
            Open {size}
          </Button>
        ))}
        {(['sm', 'md', 'lg', 'full'] as const).map(size => (
          <Modal
            key={size}
            isOpen={open === size}
            onClose={() => setOpen(null)}
            title={`Modal ${size}`}
            size={size}
          >
            <div style={{ padding: 24, textAlign: 'center' }}>
              <h2>Hello {size} Modal!</h2>
              <Button onClick={() => setOpen(null)}>
                <span style={{ marginTop: 16, display: 'inline-block' }}>Close</span>
              </Button>
            </div>
          </Modal>
        ))}
      </div>
    );
  },
};
