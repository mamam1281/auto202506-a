import type { Meta, StoryObj } from '@storybook/react';
import { Plus } from 'lucide-react';
import Button from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' },
    icon: { control: false },
    children: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
    size: 'md',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
    size: 'md',
  },
};

export const Accent: Story = {
  args: {
    children: 'Accent',
    variant: 'accent',
    size: 'md',
  },
};

export const Success: Story = {
  args: {
    children: 'Success',
    variant: 'success',
    size: 'md',
  },
};

export const Error: Story = {
  args: {
    children: 'Error',
    variant: 'error',
    size: 'md',
  },
};

export const Info: Story = {
  args: {
    children: 'Info',
    variant: 'info',
    size: 'md',
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
    size: 'md',
  },
};

export const Text: Story = {
  args: {
    children: 'Text',
    variant: 'text',
    size: 'md',
  },
};

export const Neon: Story = {
  args: {
    children: 'Neon',
    variant: 'neon',
    size: 'md',
  },
};

export const Glass: Story = {
  args: {
    children: 'Glass',
    variant: 'glass',
    size: 'md',
  },
};

export const Animated: Story = {
  args: {
    children: 'Animated',
    variant: 'animated',
    size: 'md',
  },
};

export const IconRight: Story = {
  args: {
    children: 'Icon Right',
    variant: 'primary',
    size: 'md',
    icon: Plus,
    iconPosition: 'right',
  },
};

export const IconOnly: Story = {
  args: {
    iconOnly: true,
    icon: Plus,
    variant: 'primary',
    size: 'md',
    rounded: false,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    variant: 'primary',
    size: 'md',
    disabled: true,
  },
};

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-2">
      {['primary','secondary','accent','success','error','info','outline','text','neon','glass','animated'].map((variant) => (
        // Replaced min-w-[120px] with theme variable min-w-mobile-content (120px)
        <div key={variant} className="min-w-mobile-content">
          <Button variant={variant as any} size={args.size} disabled={args.disabled}>
            {variant.charAt(0).toUpperCase() + variant.slice(1)}
          </Button>
        </div>
      ))}
    </div>
  ),
  args: {
    size: 'md',
    disabled: false,
  },
};
