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
        <Button onClick={() => setOpen(true)}>Open Modal</Button>        <Modal {...args} isOpen={open} onClose={() => setOpen(false)}>
          <div className="p-6 text-center space-y-4">
            <h2 className="text-lg font-semibold">Hello Modal!</h2>
            <p className="text-muted-foreground">This is a modal content area.</p>
            <div className="flex justify-center gap-3 pt-4">
              <Button variant="primary" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>
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
            size={size}          >
            <div className="p-6 text-center space-y-4">
              <h2 className="text-lg font-semibold">Hello {size} Modal!</h2>
              <div className="flex justify-center gap-3 pt-4">
                <Button variant="primary" onClick={() => setOpen(null)}>
                  Close
                </Button>
              </div>
            </div>
          </Modal>
        ))}
      </div>
    );
  },
};
