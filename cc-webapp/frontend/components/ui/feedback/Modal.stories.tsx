import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Modal from './Modal';
import Button from '../basic/Button';

const meta: Meta<typeof Modal> = {
  title: 'Feedback/Modal',
  component: Modal,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    open: { control: 'boolean' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
    },
    variant: {
      control: 'select',
      options: ['default', 'glass', 'neon', 'game'],
    },
    showCloseButton: { control: 'boolean' },
    closeOnBackdropClick: { control: 'boolean' },
    closeOnEsc: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

// 기본 모달
export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    
    return (
      <>
        <Button onClick={() => setOpen(true)}>모달 열기</Button>
        <Modal
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          title="기본 모달"
          description="이것은 기본 모달입니다."
        >
          <p>모달 내용이 여기에 표시됩니다.</p>
          <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
            <Button variant="primary">확인</Button>
            <Button variant="secondary" onClick={() => setOpen(false)}>취소</Button>
          </div>
        </Modal>
      </>
    );
  },
};

// 크기 변형
export const Sizes: Story = {
  render: () => {
    const [size, setSize] = useState<'sm' | 'md' | 'lg' | 'xl' | 'full'>('md');
    const [open, setOpen] = useState(false);
    
    return (
      <>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {(['sm', 'md', 'lg', 'xl', 'full'] as const).map((s) => (
            <Button
              key={s}
              variant={size === s ? 'primary' : 'secondary'}
              onClick={() => {
                setSize(s);
                setOpen(true);
              }}
            >
              {s.toUpperCase()}
            </Button>
          ))}
        </div>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          size={size}
          title={`${size.toUpperCase()} 모달`}
          description={`${size} 크기의 모달입니다.`}
        >
          <p>이 모달의 크기는 {size}입니다.</p>
          <p>다양한 크기를 테스트해보세요.</p>
        </Modal>
      </>
    );
  },
};

// 타입 변형
export const Variants: Story = {
  render: () => {
    const [variant, setVariant] = useState<'default' | 'glass' | 'neon' | 'game'>('default');
    const [open, setOpen] = useState(false);
    
    return (
      <>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {(['default', 'glass', 'neon', 'game'] as const).map((v) => (
            <Button
              key={v}
              variant={variant === v ? 'primary' : 'secondary'}
              onClick={() => {
                setVariant(v);
                setOpen(true);
              }}
            >
              {v}
            </Button>
          ))}
        </div>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          variant={variant}
          title={`${variant} 모달`}
          description={`${variant} 스타일의 모달입니다.`}
        >
          <p>이 모달은 {variant} 스타일을 사용합니다.</p>
          <p>각 variant는 다른 시각적 스타일을 제공합니다.</p>
        </Modal>
      </>
    );
  },
};

// 게임 모달
export const GameModal: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    
    return (
      <>
        <Button variant="gradient" onClick={() => setOpen(true)}>
          게임 모달 열기
        </Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          variant="game"
          size="lg"
          title="🎮 게임 결과"
          description="축하합니다! 큰 승리를 거두셨습니다!"
        >
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
            <h3>1,000 토큰 획득!</h3>
            <p>연속 승리 보너스가 적용되었습니다.</p>
            <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Button variant="gradient">다시 플레이</Button>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                나가기
              </Button>
            </div>
          </div>
        </Modal>
      </>
    );
  },
};

// 긴 콘텐츠
export const LongContent: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    
    return (
      <>
        <Button onClick={() => setOpen(true)}>긴 콘텐츠 모달</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="스크롤 가능한 모달"
          description="긴 콘텐츠를 포함한 모달입니다."
        >
          {Array.from({ length: 20 }, (_, i) => (
            <p key={i} style={{ marginBottom: '16px' }}>
              이것은 {i + 1}번째 문단입니다. 모달의 스크롤 기능을 테스트하기 위한 긴 콘텐츠입니다. 
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          ))}
        </Modal>
      </>
    );
  },
};
