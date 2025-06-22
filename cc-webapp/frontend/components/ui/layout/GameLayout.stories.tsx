import type { Meta, StoryObj } from '@storybook/react';
import { GameLayout } from './GameLayout';

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
- **Game Header**: 게임 정보, 토큰 잔액, CJ AI 버튼
- **Unlock Status**: 성인 콘텐츠 단계별 언락 상태
- **Game Content**: 메인 게임 플레이 영역
- **CJ AI Panel**: 실시간 감정 피드백
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

// 카지노 게임 시뮬레이션 컴포넌트들
const SlotMachine = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    minHeight: '500px',
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    padding: '2rem'
  }}>
    <div style={{
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem'
    }}>
      {[1, 2, 3].map((reel) => (
        <div key={reel} style={{
          width: '120px',
          height: '150px',
          background: 'var(--color-slate-800)',
          border: '3px solid var(--neon-purple-3, #8b5cf6)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '3rem',
          boxShadow: '0 0 30px rgba(139, 92, 246, 0.3)'
        }}>
          🎰
        </div>
      ))}
    </div>
    
    <button style={{
      padding: '1rem 3rem',
      background: 'linear-gradient(135deg, var(--neon-purple-3, #8b5cf6), var(--neon-blue-3, #3b82f6))',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '1.25rem',
      fontWeight: '700',
      cursor: 'pointer',
      boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)'
    }}>
      SPIN (10 🪙)
    </button>
  </div>
);

const Roulette = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    minHeight: '500px',
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    padding: '2rem'
  }}>
    <div style={{
      width: '300px',
      height: '300px',
      borderRadius: '50%',
      background: `conic-gradient(
        from 0deg,
        #ef4444 0deg 45deg,
        #1f2937 45deg 90deg,
        #ef4444 90deg 135deg,
        #1f2937 135deg 180deg,
        #ef4444 180deg 225deg,
        #1f2937 225deg 270deg,
        #ef4444 270deg 315deg,
        #1f2937 315deg 360deg
      )`,
      border: '8px solid var(--neon-green-3, #22c55e)',
      marginBottom: '2rem',
      position: 'relative',
      boxShadow: '0 0 50px rgba(34, 197, 94, 0.3)'
    }}>
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '4px',
        height: '30px',
        background: 'white',
        borderRadius: '2px'
      }} />
    </div>
    
    <button style={{
      padding: '1rem 3rem',
      background: 'linear-gradient(135deg, var(--neon-green-3, #22c55e), var(--neon-blue-3, #3b82f6))',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '1.25rem',
      fontWeight: '700',
      cursor: 'pointer',
      boxShadow: '0 8px 32px rgba(34, 197, 94, 0.4)'
    }}>
      SPIN (20 🪙)
    </button>
  </div>
);

const RockPaperScissors = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    minHeight: '500px',
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    padding: '2rem'
  }}>
    <h3 style={{ color: 'white', marginBottom: '2rem', fontSize: '1.5rem' }}>
      선택하세요!
    </h3>
    
    <div style={{
      display: 'flex',
      gap: '2rem',
      marginBottom: '2rem'
    }}>
      {[
        { emoji: '✊', name: '바위' },
        { emoji: '✋', name: '보' },
        { emoji: '✌️', name: '가위' }
      ].map((choice) => (
        <button key={choice.name} style={{
          width: '120px',
          height: '120px',
          background: 'var(--color-slate-800)',
          border: '3px solid var(--neon-orange-3, #f97316)',
          borderRadius: '16px',
          fontSize: '3rem',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 0 20px rgba(249, 115, 22, 0.3)'
        }}>
          {choice.emoji}
        </button>
      ))}
    </div>
    
    <p style={{ color: 'var(--color-slate-400)', fontSize: '1rem' }}>
      게임 비용: 5 🪙
    </p>
  </div>
);

const GachaBox = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    minHeight: '500px',
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    padding: '2rem'
  }}>
    <div style={{
      width: '200px',
      height: '200px',
      background: 'linear-gradient(135deg, var(--neon-purple-3, #8b5cf6), var(--neon-pink-3, #ec4899))',
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '4rem',
      marginBottom: '2rem',
      boxShadow: '0 0 50px rgba(139, 92, 246, 0.5)',
      animation: 'pulse 2s infinite'
    }}>
      🎁
    </div>
    
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1rem',
      marginBottom: '2rem'
    }}>
      {['Common', 'Rare', 'Epic'].map((rarity, index) => (
        <div key={rarity} style={{
          padding: '0.75rem 1rem',
          background: index === 0 ? 'var(--color-slate-600)' : 
                     index === 1 ? 'var(--neon-blue-3, #3b82f6)' : 
                     'var(--neon-purple-3, #8b5cf6)',
          borderRadius: '8px',
          textAlign: 'center',
          fontSize: '0.875rem',
          fontWeight: '600'
        }}>
          {rarity}
        </div>
      ))}
    </div>
    
    <button style={{
      padding: '1rem 3rem',
      background: 'linear-gradient(135deg, var(--neon-pink-3, #ec4899), var(--neon-purple-3, #8b5cf6))',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '1.25rem',
      fontWeight: '700',
      cursor: 'pointer',
      boxShadow: '0 8px 32px rgba(236, 72, 153, 0.4)'
    }}>
      PULL (30 🪙)
    </button>
  </div>
);

/**
 * ## 슬롯머신 게임
 * 클래식 3-릴 슬롯머신 게임입니다.
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
 * ## 룰렛 게임
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
