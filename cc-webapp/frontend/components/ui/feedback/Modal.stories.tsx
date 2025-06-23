import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Modal from './Modal';

const meta: Meta<typeof Modal> = {
  title: 'UI/Feedback/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Modal 컴포넌트 - 오버레이와 함께 표시되는 모달 다이얼로그'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: '모달 표시 여부'
    },
    onClose: {
      action: 'closed',
      description: '모달 닫기 콜백'
    },
    title: {
      control: 'text',
      description: '모달 제목'
    },
    children: {
      control: 'text',
      description: '모달 내용'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: '모달 크기'
    },
    showCloseButton: {
      control: 'boolean',
      description: '닫기 버튼 표시 여부'
    },
    backdrop: {
      control: 'select',
      options: ['blur', 'dark', 'light'],
      description: '배경 스타일'
    },
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

const ModalWrapper = ({ children, ...args }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        모달 열기
      </button>
      <Modal
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        {children}
      </Modal>
    </div>
  );
};

export const Default: Story = {
  render: (args) => (
    <ModalWrapper {...args}>
      <p>기본 모달 내용입니다.</p>
    </ModalWrapper>
  ),
  args: {
    title: '기본 모달',
  }
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <ModalWrapper title="Small Modal" size="sm">
        <p>작은 크기의 모달입니다.</p>
      </ModalWrapper>
      <ModalWrapper title="Medium Modal" size="md">
        <p>중간 크기의 모달입니다.</p>
      </ModalWrapper>
      <ModalWrapper title="Large Modal" size="lg">
        <p>큰 크기의 모달입니다.</p>
      </ModalWrapper>
      <ModalWrapper title="Extra Large Modal" size="xl">
        <p>매우 큰 크기의 모달입니다.</p>
      </ModalWrapper>
    </div>
  )
};

export const WithContent: Story = {
  render: (args) => (
    <ModalWrapper {...args}>
      <div className="space-y-4">
        <p>상세한 모달 내용입니다.</p>
        <div className="flex justify-end space-x-2">
          <button className="px-4 py-2 bg-gray-500 text-white rounded">취소</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded">확인</button>
        </div>
      </div>
    </ModalWrapper>
  ),
  args: {
    title: '확인 모달',
    size: 'md',
  }
};