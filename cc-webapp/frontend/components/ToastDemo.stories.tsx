import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ToastProvider, useToast } from '../contexts/ToastContext';
import Button from './Button';

// Toast 사용 예시를 위한 컴포넌트
const ToastDemo: React.FC = () => {
  const { showToast, clearAllToasts } = useToast();

  const handleSuccess = () => {
    showToast('성공적으로 저장되었습니다!', 'success');
  };

  const handleError = () => {
    showToast('오류가 발생했습니다. 다시 시도해주세요.', 'error');
  };

  const handleInfo = () => {
    showToast('새로운 메시지가 도착했습니다.', 'info');
  };

  const handleWarning = () => {
    showToast('주의: 이 작업은 되돌릴 수 없습니다.', 'warning');
  };

  const handleDefault = () => {
    showToast('일반적인 알림입니다.', 'default');
  };

  const handleLongMessage = () => {
    showToast('이것은 매우 긴 메시지입니다. 토스트 컴포넌트가 긴 텍스트를 어떻게 처리하는지 확인해보세요. 텍스트가 적절히 잘리거나 줄바꿈되는지 테스트합니다.', 'info', 5000);
  };

  const handleManualClose = () => {
    showToast('이 토스트는 수동으로 닫아야 합니다. X 버튼을 클릭하세요.', 'info', 0);
  };

  const handleMultiple = () => {
    showToast('첫 번째 토스트', 'success');
    setTimeout(() => showToast('두 번째 토스트', 'info'), 500);
    setTimeout(() => showToast('세 번째 토스트', 'warning'), 1000);
    setTimeout(() => showToast('네 번째 토스트', 'error'), 1500);
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Toast 컴포넌트 데모</h2>
      <div className="grid grid-cols-2 gap-4 max-w-md">
        <Button onClick={handleSuccess} variant="success" size="md">
          Success Toast
        </Button>
        <Button onClick={handleError} variant="error" size="md">
          Error Toast
        </Button>
        <Button onClick={handleInfo} variant="info" size="md">
          Info Toast
        </Button>
        <Button onClick={handleWarning} variant="accent" size="md">
          Warning Toast
        </Button>
        <Button onClick={handleDefault} variant="secondary" size="md">
          Default Toast
        </Button>
        <Button onClick={handleLongMessage} variant="primary" size="md">
          Long Message
        </Button>
        <Button onClick={handleManualClose} variant="outline" size="md">
          Manual Close
        </Button>
        <Button onClick={handleMultiple} variant="neon" size="md">
          Multiple Toasts
        </Button>
      </div>
      <div className="mt-6">
        <Button onClick={clearAllToasts} variant="text" size="md">
          Clear All Toasts
        </Button>
      </div>
    </div>
  );
};

const meta: Meta = {
  title: 'Examples/Toast Context Demo',
  component: ToastDemo,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'ToastProvider와 useToast 훅을 사용하여 Toast를 관리하는 예시입니다.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ToastProvider maxToasts={5} position="bottom-center">
        <Story />
      </ToastProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TopCenter: Story = {
  decorators: [
    (Story) => (
      <ToastProvider maxToasts={5} position="top-center">
        <Story />
      </ToastProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: '토스트가 화면 상단 중앙에 표시됩니다.',
      },
    },
  },
};

export const TopRight: Story = {
  decorators: [
    (Story) => (
      <ToastProvider maxToasts={5} position="top-right">
        <Story />
      </ToastProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: '토스트가 화면 상단 우측에 표시됩니다.',
      },
    },
  },
};

export const BottomRight: Story = {
  decorators: [
    (Story) => (
      <ToastProvider maxToasts={5} position="bottom-right">
        <Story />
      </ToastProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: '토스트가 화면 하단 우측에 표시됩니다.',
      },
    },
  },
};

export const LimitedToasts: Story = {
  decorators: [
    (Story) => (
      <ToastProvider maxToasts={3} position="bottom-center">
        <Story />
      </ToastProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: '최대 3개의 토스트만 표시됩니다. 새 토스트가 추가되면 오래된 것이 제거됩니다.',
      },
    },
  },
};
