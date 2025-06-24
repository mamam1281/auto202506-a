import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import Card from './Card';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '상용 서비스급 Modal 컴포넌트 - CSS Variables 완전 준수, 모바일 전체화면 + 스와이프 제스처 지원',
      },
    },
  },
  tags: ['autodocs'],  argTypes: {
    isOpen: { control: 'boolean' },
    title: { control: 'text' },
    description: { control: 'text' },
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl', 'full'] },
    variant: { control: 'select', options: ['default', 'ice', 'hologram', 'space', 'crystal'] },
    showCloseButton: { control: 'boolean' },
    allowSwipeClose: { control: 'boolean' },
    children: { control: false },
  },
};
export default meta;

type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (      <div className="p-4">
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal {...args} isOpen={open} onClose={() => setOpen(false)}>
          <div className="space-y-4">
            <h2 className="text-h3 font-semibold">Hello Modal!</h2>
            <p className="text-muted-foreground">
              데스크톱에서는 중앙 정렬, 모바일에서는 하단에서 올라오는 전체화면 모달입니다.
              모바일에서 아래로 스와이프하면 닫힙니다.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <Button variant="primary" onClick={() => setOpen(false)}>
                확인
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)}>
                취소
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  },
  args: {
    title: 'Modal Title',
    description: 'Modal description goes here.',
    size: 'md',
    showCloseButton: true,
    allowSwipeClose: true,
  },
};

export const Sizes: Story = {
  render: () => {
    const [openModal, setOpenModal] = useState<string | null>(null);
    const sizes: Array<{ size: any; name: string }> = [
      { size: 'sm', name: '작은 모달' },
      { size: 'md', name: '중간 모달' },
      { size: 'lg', name: '큰 모달' },
      { size: 'xl', name: '매우 큰 모달' },
    ];    return (
      <div className="p-4 space-y-3">
        {sizes.map(({ size, name }) => (
          <Button key={size} onClick={() => setOpenModal(size)} className="mr-2">
            {name} 열기
          </Button>
        ))}
        
        {sizes.map(({ size, name }) => (
          <Modal
            key={size}
            isOpen={openModal === size}
            onClose={() => setOpenModal(null)}
            size={size as any}
            title={`${name} (${size})`}
            description="각 크기별 모달을 확인해보세요. 모바일에서는 모두 전체화면으로 표시됩니다."
          >            <Card title={`${name} 콘텐츠`}>
              <p className="text-muted-foreground">
                이것은 {name}입니다. 데스크톱에서는 크기가 다르지만, 
                모바일에서는 모두 동일한 전체화면 경험을 제공합니다.
              </p>
            </Card>
          </Modal>
        ))}
      </div>
    );
  },
};

export const MobileOptimized: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (      <div className="p-4">
        <div className="space-y-3">
          <h3 className="text-h4 font-semibold">
            모바일 최적화 모달
          </h3>
          <p className="text-muted-foreground">
            모바일에서 테스트해보세요: 하단에서 올라오는 애니메이션과 스와이프로 닫기 기능을 확인할 수 있습니다.
          </p>
          <Button onClick={() => setOpen(true)}>모바일 모달 열기</Button>
        </div>
        
        <Modal 
          isOpen={open} 
          onClose={() => setOpen(false)}
          title="모바일 전용 모달"
          description="아래로 스와이프하여 닫을 수 있습니다"
          allowSwipeClose={true}
        >          <div className="space-y-4">
            <Card title="스와이프 제스처">
              <p className="text-muted-foreground">
                이 모달은 모바일에서 아래로 스와이프하여 닫을 수 있습니다. 
                상단의 인디케이터를 드래그해보세요.
              </p>
            </Card>
            
            <Card title="전체화면 경험">
              <p className="text-muted-foreground">
                모바일에서는 하단에서 올라오는 전체화면 모달로 표시되어 
                네이티브 앱과 같은 사용자 경험을 제공합니다.
              </p>
            </Card>
            
            <div className="flex gap-3 pt-2">
              <Button variant="primary" onClick={() => setOpen(false)} className="flex-1">
                확인
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
                취소
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  },
};

// ❄️ 얼음 글래스모피즘 모달
export const IceGlassmorphism: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div className="p-4">
        <Button onClick={() => setOpen(true)} variant="glass">❄️ 얼음 모달 열기</Button>
        <Modal {...args} isOpen={open} onClose={() => setOpen(false)} variant="ice">
          <div className="space-y-4">
            <h2 className="text-h3 font-semibold">❄️ 얼음 글래스모피즘</h2>
            <p className="text-muted-foreground">
              시원하고 깔끔한 얼음 같은 투명 효과를 가진 모달입니다.
              백드롭 필터와 밝은 테두리로 차가운 느낌을 연출합니다.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <Button variant="primary" onClick={() => setOpen(false)}>
                확인
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)}>
                취소
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  },
};

// ✨ 홀로그램 모달
export const HologramEffect: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div className="p-4">
        <Button onClick={() => setOpen(true)} variant="animated">✨ 홀로그램 모달 열기</Button>
        <Modal {...args} isOpen={open} onClose={() => setOpen(false)} variant="hologram">
          <div className="space-y-4">
            <h2 className="text-h3 font-semibold">✨ 홀로그램 효과</h2>
            <p className="text-muted-foreground">
              무지개 색상이 변화하며 홀로그램처럼 보이는 미래적인 모달입니다.
              색상 변화와 스캔 라인 효과가 포함되어 있습니다.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <Button variant="accent" onClick={() => setOpen(false)}>
                확인
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)}>
                취소
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  },
};

// 🌌 스페이스 워프 모달
export const SpaceWarpEffect: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div className="p-4">
        <Button onClick={() => setOpen(true)} variant="neon">🌌 스페이스 워프 모달 열기</Button>
        <Modal {...args} isOpen={open} onClose={() => setOpen(false)} variant="space">
          <div className="space-y-4">
            <h2 className="text-h3 font-semibold">🌌 스페이스 워프</h2>
            <p className="text-muted-foreground">
              우주 공간을 연상시키는 깊고 신비로운 배경의 모달입니다.
              별빛 파티클과 전기적 글로우 효과가 특징입니다.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <Button variant="primary" onClick={() => setOpen(false)}>
                확인
              </Button>
              <Button variant="text" onClick={() => setOpen(false)}>
                취소
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  },
};

// 💎 크리스탈 모달
export const CrystalEffect: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div className="p-4">
        <Button onClick={() => setOpen(true)} variant="glass">💎 크리스탈 모달 열기</Button>
        <Modal {...args} isOpen={open} onClose={() => setOpen(false)} variant="crystal">
          <div className="space-y-4">
            <h2 className="text-h3 font-semibold">💎 크리스탈 효과</h2>
            <p className="text-muted-foreground">
              크리스탈처럼 다각면 반사를 표현한 입체적인 모달입니다.
              내부 반사 패턴과 면 변화 애니메이션이 포함되어 있습니다.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <Button variant="info" onClick={() => setOpen(false)}>
                확인
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)}>
                취소
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  },
};

// 모든 효과 비교
export const AllEffectsDemo: Story = {
  render: (args) => {
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const effects = [
      { key: 'default', name: '기본', variant: 'default', emoji: '📋' },
      { key: 'ice', name: '얼음', variant: 'ice', emoji: '❄️' },
      { key: 'hologram', name: '홀로그램', variant: 'hologram', emoji: '✨' },
      { key: 'space', name: '스페이스', variant: 'space', emoji: '🌌' },
      { key: 'crystal', name: '크리스탈', variant: 'crystal', emoji: '💎' },
    ];

    return (
      <div className="p-4">
        <h3 className="text-h3 font-semibold mb-4">모든 모달 배경 효과 비교</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {effects.map((effect) => (
            <Button
              key={effect.key}
              onClick={() => setActiveModal(effect.key)}
              variant="outline"
              className="h-auto p-4 flex-col gap-2"
            >
              <span className="text-2xl">{effect.emoji}</span>
              <span className="text-sm">{effect.name}</span>
            </Button>
          ))}
        </div>
        
        {effects.map((effect) => (
          <Modal
            key={effect.key}
            {...args}
            isOpen={activeModal === effect.key}
            onClose={() => setActiveModal(null)}
            variant={effect.variant as any}
          >
            <div className="space-y-4">
              <h2 className="text-h3 font-semibold">
                {effect.emoji} {effect.name} 효과
              </h2>
              <p className="text-muted-foreground">
                이것은 {effect.name} 배경 효과를 사용한 모달입니다.
                각각의 효과는 완전히 다른 느낌과 스타일을 제공합니다.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <Button variant="primary" onClick={() => setActiveModal(null)}>
                  확인
                </Button>
                <Button variant="outline" onClick={() => setActiveModal(null)}>
                  취소
                </Button>
              </div>
            </div>
          </Modal>
        ))}
      </div>
    );
  },
};