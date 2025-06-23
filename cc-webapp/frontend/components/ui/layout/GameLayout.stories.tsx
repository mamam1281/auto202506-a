import type { Meta, StoryObj } from '@storybook/react';
import { GameLayout } from './GameLayout';
import { SlotMachine } from '../game/slot-machine/SlotMachine';

// 더미 컴포넌트 선언 (import 바로 아래)
const Roulette = () => <div style={{color:'#fff',textAlign:'center',padding:'2rem'}}>Roulette 컴포넌트 미구현</div>;
const RockPaperScissors = () => <div style={{color:'#fff',textAlign:'center',padding:'2rem'}}>RPS 컴포넌트 미구현</div>;
const GachaBox = () => <div style={{color:'#fff',textAlign:'center',padding:'2rem'}}>GachaBox 컴포넌트 미구현</div>;

/**
 * # GameLayout 컴포넌트 스토리북
 * 
 * 카지노 클럽 F2P 프로젝트의 게임 전용 레이아웃 컴포넌트입니다.
 * 사이버 토큰 시스템, CJ AI 피드백, 성인 콘텐츠 언락에 최적화되었습니다.
 * 
 * ## 주요 특징
 * - **사이버 토큰 시스템**: 실시간 잔액 표시 및 소모/획득 피드백
 * - **CJ AI 통합**: 게임 결과에 따른 감정 피드백
 * - **성인 콘텐츠 언락**: 단계별 언락 상태 표시 (200/500/1000 토큰)
 * - **카지노 게임 특화**: 슬롯/룰렛/가위바위보/가챠 최적화
 * - **확률 정보**: 투명한 확률 공개 시스템
 * - **모던 UI 옵션**: AppBar, Container, BottomNav 컴포넌트 통합
 */
const meta = {
  title: 'Layout/GameLayout',
  component: GameLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
GameLayout은 카지노 클럽 F2P 프로젝트의 게임 플레이에 특화된 레이아웃 컴포넌트입니다.

### 구성 요소
- **게임 헤더/AppBar**: 게임 정보, 토큰 잔액, CJ AI 버튼 (클래식 헤더 또는 모던 AppBar 선택 가능)
- **Unlock Status**: 성인 콘텐츠 단계별 언락 상태
- **Game Content**: 메인 게임 플레이 영역 (Container로 감싸기 가능)
- **CJ AI Panel**: 실시간 감정 피드백
- **BottomNav**: 옵션으로 하단 네비게이션 통합 가능

### 모던/클래식 모드
GameLayout은 두 가지 스타일로 사용할 수 있습니다:
- **클래식 모드**: 기존 게임 헤더 사용
- **모던 모드**: AppBar, Container, BottomNav 컴포넌트 통합
- **Token Alert**: 토큰 부족 시 충전 안내

### 카지노 게임 종류
- **slot**: 슬롯머신 (10 토큰)
- **roulette**: 룰렛 (20 토큰)
- **rps**: 가위바위보 (5 토큰)
- **gacha**: 가챠박스 (30 토큰)

### 사용 예시
\`\`\`tsx
<GameLayout
  gameType="slot"
  tokenBalance={1250}
  tokenCost={10}
  onBack={() => router.push('/dashboard')}
>
  <SlotMachine />
</GameLayout>
\`\`\`
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    gameType: {
      control: 'select',
      options: ['slot', 'roulette', 'rps', 'gacha'],
      description: '게임 종류'
    },
    gameTitle: {
      control: 'text',
      description: '게임 제목 (선택사항)'
    },
    tokenBalance: {
      control: 'number',
      description: '사용자 사이버 토큰 잔액'
    },
    tokenCost: {
      control: 'number',
      description: '게임당 토큰 비용'
    },
    showCJAI: {
      control: 'boolean',
      description: 'CJ AI 패널 표시 여부'
    },
    showUnlockStatus: {
      control: 'boolean',
      description: '성인 콘텐츠 언락 상태 표시'
    },
    showHistory: {
      control: 'boolean',
      description: '게임 히스토리 버튼 표시'
    },
    showProbability: {
      control: 'boolean',
      description: '확률 정보 버튼 표시'
    }
  },
} satisfies Meta<typeof GameLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * ## 슬롯머신 게임 (클래식 스타일)
 * 전통적인 헤더를 사용하는 클래식 3-릴 슬롯머신 게임입니다.
 */
export const SlotGame: Story = {
  args: {
    gameType: 'slot',
    tokenBalance: 1500,
    tokenCost: 10,
    children: <SlotMachine />
  }
};

/**
 * ## 슬롯머신 게임 (모던 스타일)
 * AppBar와 Container를 사용하는 현대적인 스타일의 슬롯머신 게임입니다.
 */
export const ModernSlotGame: Story = {
  args: {
    gameType: 'slot',
    gameTitle: '네온 슬롯',
    tokenBalance: 1500,
    tokenCost: 10,
    children: <SlotMachine />,
    useAppBar: true,
    containerSize: 'md',
    noContentPadding: false
  }
};

/**
 * ## 룰렛 게임 (클래식 스타일)
 * 카지노 룰렛 게임입니다.
 */
export const RouletteGame: Story = {
  args: {
    gameType: 'roulette',
    tokenBalance: 800,
    tokenCost: 20,
    children: <Roulette />
  }
};

/**
 * ## 룰렛 게임 (모던 스타일)
 * AppBar를 사용하는 룰렛 게임입니다.
 */
export const ModernRouletteGame: Story = {
  args: {
    gameType: 'roulette',
    gameTitle: '디지털 룰렛',
    tokenBalance: 800,
    tokenCost: 20,
    children: <Roulette />,
    useAppBar: true,
    containerSize: 'full'
  }
};

/**
 * ## 가위바위보 게임
 * 간단한 가위바위보 게임입니다.
 */
export const RPSGame: Story = {
  args: {
    gameType: 'rps',
    tokenBalance: 250,
    tokenCost: 5,
    children: <RockPaperScissors />
  }
};

/**
 * ## 가챠박스 게임
 * 아이템 뽑기 가챠 시스템입니다.
 */
export const GachaGame: Story = {
  args: {
    gameType: 'gacha',
    tokenBalance: 2000,
    tokenCost: 30,
    children: <GachaBox />
  }
};

/**
 * ## 토큰 부족 상황
 * 토큰이 부족한 상황을 보여줍니다.
 */
export const InsufficientTokens: Story = {
  args: {
    gameType: 'slot',
    tokenBalance: 5,
    tokenCost: 10,
    children: <SlotMachine />
  }
};

/**
 * ## 모든 기능 활성화
 * CJ AI, 언락 상태, 히스토리, 확률 정보 모두 표시합니다.
 */
export const FullFeatures: Story = {
  args: {
    gameType: 'gacha',
    gameTitle: '프리미엄 가챠박스',
    tokenBalance: 3500,
    tokenCost: 30,
    showCJAI: true,
    showUnlockStatus: true,
    showHistory: true,
    showProbability: true,
    children: <GachaBox />
  }
};

/**
 * ## 미니멀 UI
 * 필수 요소만 표시하는 깔끔한 인터페이스입니다.
 */
export const MinimalUI: Story = {
  args: {
    gameType: 'rps',
    tokenBalance: 100,
    tokenCost: 5,
    showCJAI: false,
    showUnlockStatus: false,
    showHistory: false,
    showProbability: false,
    children: <RockPaperScissors />
  }
};

/**
 * ## 모던 UI + 모바일 네비게이션
 * AppBar와 BottomNav를 함께 사용하는 완전한 모바일 레이아웃입니다.
 */
export const MobileLayout: Story = {
  args: {
    gameType: 'slot',
    gameTitle: '모바일 슬롯',
    tokenBalance: 2500,
    tokenCost: 10,
    children: <SlotMachine />,
    useAppBar: true,
    containerSize: 'full',
    showBottomNav: true  }
};
