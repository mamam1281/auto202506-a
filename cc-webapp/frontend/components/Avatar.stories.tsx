import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Avatar from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A customizable avatar component with multiple sizes, loading states, and fallback options.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Size of the avatar',
    },
    isActive: {
      control: 'boolean',
      description: 'Whether the avatar has an active state (neon glow)',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether the avatar is in loading state',
    },
    src: {
      control: 'text',
      description: 'URL of the avatar image',
    },
    alt: {
      control: 'text',
      description: 'Alt text for the avatar image',
    },
    fallback: {
      control: 'text',
      description: 'Fallback content when image fails to load',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic stories
export const Default: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    alt: 'John Doe',
    size: 'md',
  },
};

export const WithoutImage: Story = {
  args: {
    alt: 'User Avatar',
    size: 'md',
  },
};

export const WithFallbackText: Story = {
  args: {
    fallback: 'JD',
    alt: 'John Doe',
    size: 'md',
  },
};

export const Active: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    alt: 'John Doe',
    size: 'md',
    isActive: true,
  },
};

export const Loading: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    alt: 'John Doe',
    size: 'md',
    isLoading: true,
  },
};

// Size variants
export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-6">
      <div className="text-center">
        <Avatar
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
          alt="Small Avatar"
          size="sm"
        />
        <p className="mt-2 text-[var(--font-size-xs)] text-[var(--muted-foreground)]">Small</p>
      </div>
      <div className="text-center">
        <Avatar
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
          alt="Medium Avatar"
          size="md"
        />
        <p className="mt-2 text-[var(--font-size-xs)] text-[var(--muted-foreground)]">Medium</p>
      </div>
      <div className="text-center">
        <Avatar
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
          alt="Large Avatar"
          size="lg"
        />
        <p className="mt-2 text-[var(--font-size-xs)] text-[var(--muted-foreground)]">Large</p>
      </div>
      <div className="text-center">
        <Avatar
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
          alt="Extra Large Avatar"
          size="xl"
        />
        <p className="mt-2 text-[var(--font-size-xs)] text-[var(--muted-foreground)]">Extra Large</p>
      </div>
    </div>
  ),
};

// Fallback variants
export const FallbackOptions: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-[var(--font-size-body)] font-medium text-[var(--foreground)] mb-4">
          Fallback Types
        </h4>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <Avatar size="md" alt="Default Icon" />
            <p className="mt-2 text-[var(--font-size-xs)] text-[var(--muted-foreground)]">Default Icon</p>
          </div>
          <div className="text-center">
            <Avatar size="md" fallback="AB" alt="Text Fallback" />
            <p className="mt-2 text-[var(--font-size-xs)] text-[var(--muted-foreground)]">Text Fallback</p>
          </div>
          <div className="text-center">
            <Avatar size="md" fallback="🎮" alt="Emoji Fallback" />
            <p className="mt-2 text-[var(--font-size-xs)] text-[var(--muted-foreground)]">Emoji Fallback</p>
          </div>
        </div>
      </div>
    </div>
  ),
};

// States demo
export const States: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-[var(--font-size-body)] font-medium text-[var(--foreground)] mb-4">
          Avatar States
        </h4>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <Avatar
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
              alt="Normal State"
              size="lg"
            />
            <p className="mt-2 text-[var(--font-size-xs)] text-[var(--muted-foreground)]">Normal</p>
          </div>
          <div className="text-center">
            <Avatar
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
              alt="Active State"
              size="lg"
              isActive={true}
            />
            <p className="mt-2 text-[var(--font-size-xs)] text-[var(--muted-foreground)]">Active</p>
          </div>
          <div className="text-center">
            <Avatar
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
              alt="Loading State"
              size="lg"
              isLoading={true}
            />
            <p className="mt-2 text-[var(--font-size-xs)] text-[var(--muted-foreground)]">Loading</p>
          </div>
        </div>
      </div>
    </div>
  ),
};

// Interactive demo
export const Interactive: Story = {
  render: () => {
    const [avatarState, setAvatarState] = useState({
      size: 'md' as const,
      isActive: false,
      isLoading: false,
      hasImage: true,
    });

    const sampleImages = [
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    ];

    return (
      <div className="space-y-6">
        <div className="text-center">
          <Avatar
            src={avatarState.hasImage ? sampleImages[0] : undefined}
            fallback="JD"
            alt="Interactive Avatar"
            size={avatarState.size}
            isActive={avatarState.isActive}
            isLoading={avatarState.isLoading}
          />
        </div>

        <div className="space-y-4 max-w-md mx-auto">
          <div>
            <label className="block text-[var(--font-size-sm)] font-medium text-[var(--foreground)] mb-2">
              Size
            </label>
            <select
              value={avatarState.size}
              onChange={(e) => setAvatarState(prev => ({ ...prev, size: e.target.value as any }))}
              className="w-full p-2 bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--foreground)]"
            >
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
              <option value="xl">Extra Large</option>
            </select>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={avatarState.isActive}
                onChange={(e) => setAvatarState(prev => ({ ...prev, isActive: e.target.checked }))}
                className="rounded"
              />
              <span className="text-[var(--font-size-sm)] text-[var(--foreground)]">Active State</span>
            </label>
            
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={avatarState.isLoading}
                onChange={(e) => setAvatarState(prev => ({ ...prev, isLoading: e.target.checked }))}
                className="rounded"
              />
              <span className="text-[var(--font-size-sm)] text-[var(--foreground)]">Loading</span>
            </label>
            
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={avatarState.hasImage}
                onChange={(e) => setAvatarState(prev => ({ ...prev, hasImage: e.target.checked }))}
                className="rounded"
              />
              <span className="text-[var(--font-size-sm)] text-[var(--foreground)]">Show Image</span>
            </label>
          </div>
        </div>
      </div>
    );
  },
};
