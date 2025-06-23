import type { Meta, StoryObj } from '@storybook/react';
import { AppLayout } from './Applayout';

/**
 * # AppLayout 컴포넌트 스토리북
 * 
 * Figma 003 게임 플랫폼 레이아웃 시스템의 메인 애플리케이션 레이아웃입니다.
 * AppBar, Sidebar, BottomNav를 통합한 완전한 앱 레이아웃을 제공합니다.
 * 
 * ## 주요 특징
 * - **통합 레이아웃**: AppBar + Sidebar + Main + BottomNav 완전 통합
 * - **모바일 친화적**: 안전 영역 처리 및 바텀 네비게이션
 * - **반응형 디자인**: 모바일, 태블릿, 데스크톱 최적화
 * - **사이드바 상태 관리**: 확장/축소 상태 자동 관리
 * - **Safe Area 지원**: 노치 및 하단 제스처 영역 자동 처리
 */
const meta: Meta<typeof AppLayout> = {
  title: 'Layout/AppLayout',
  component: AppLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
AppLayout은 게임 플랫폼의 메인 애플리케이션 레이아웃입니다.

### 구성 요소
- **AppBar**: 상단 앱바, 페이지 제목, 내비게이션 액션, 시스템 상태바 영역 처리
- **Sidebar**: 메인 메뉴, 게임 카테고리, 사용자 정보
- **Main**: 페이지별 콘텐츠 영역
- **BottomNav**: 모바일용 하단 네비게이션 바, 하단 안전 영역 자동 처리

### 사용 예시
\`\`\`tsx
<AppLayout>
  <h1>게임 대시보드</h1>
  <p>메인 콘텐츠가 여기에 들어갑니다.</p>
</AppLayout>
\`\`\`
        `
      }
    }
  },
  tags: ['autodocs'],
  // 모든 스토리에 기본값 적용
  args: {
    showBottomNavOnDesktop: true, // Storybook에서 바텀네비 강제 표시
  },argTypes: {
    children: {
      description: '메인 콘텐츠 영역에 들어갈 내용'
    },
    showAppBar: {
      control: 'boolean',
      description: '앱바 표시 여부'
    },
    showSidebar: {
      control: 'boolean', 
      description: '사이드바 표시 여부'
    },    showBottomNav: {
      control: 'boolean',
      description: '바텀 네비게이션 표시 여부'
    },    showBottomNavOnDesktop: {
      control: 'boolean',
      description: '데스크톱에서도 바텀네비 표시 (Storybook용)'
    },
    initialSidebarCollapsed: {
      control: 'boolean',
      description: '사이드바 초기 축소 상태'
    },
    containerSize: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      description: '메인 콘텐츠 컨테이너 크기'
    },
    noContentPadding: {
      control: 'boolean',
      description: '메인 콘텐츠 패딩 제거'
    },
    fixedLayout: {
      control: 'boolean',
      description: '고정 레이아웃 (사이드바가 항상 보임)'
    }
  },
} satisfies Meta<typeof AppLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

// 샘플 콘텐츠 컴포넌트들
const DashboardContent = () => (
  <div style={{ 
    maxWidth: 420,
    margin: '0 auto',
    padding: '2rem 1rem',
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }}>
    <h1 style={{ margin: '0 0 2rem 0', fontSize: '2rem', fontWeight: '700', textAlign: 'center', width: '100%' }}>
      🎮 게임 대시보드
    </h1>
    <div style={{ 
      display: 'grid', 
      gap: '1.5rem',
      gridTemplateColumns: '1fr',
      marginBottom: '2rem',
      width: '100%'
    }}>
      {[
        { title: '오늘의 게임', count: '12', color: '#22c55e' },
        { title: '플레이 시간', count: '3.5시간', color: '#3b82f6' },
        { title: '획득 토큰', count: '1,250', color: '#8b5cf6' },
        { title: '달성 업적', count: '5', color: '#f97316' }
      ].map((stat, index) => (
        <div key={index} style={{
          padding: '1.5rem',
          background: 'var(--color-slate-800, #1e293b)',
          borderRadius: '12px',
          border: '1px solid var(--color-slate-700, #334155)',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <h3 style={{ 
            margin: '0 0 0.5rem 0', 
            fontSize: '0.875rem', 
            fontWeight: '500',
            color: 'var(--color-slate-400, #94a3b8)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {stat.title}
          </h3>
          <p style={{ 
            margin: '0', 
            fontSize: '2rem', 
            fontWeight: '700',
            color: stat.color
          }}>
            {stat.count}
          </p>
        </div>
      ))}
    </div>
    <div style={{
      display: 'grid',
      gap: '1.5rem',
      gridTemplateColumns: '1fr',
      width: '100%'
    }}>
      {[
        { name: '슬롯 머신', icon: '🎰', type: '카지노', color: '#ef4444' },
        { name: '포커', icon: '🃏', type: '카드 게임', color: '#3b82f6' },
        { name: '룰렛', icon: '🎯', type: '카지노', color: '#22c55e' },
        { name: '블랙잭', icon: '🃎', type: '카드 게임', color: '#8b5cf6' },
        { name: '바카라', icon: '♠️', type: '카드 게임', color: '#f97316' },
        { name: '크랩스', icon: '🎲', type: '다이스', color: '#06b6d4' }
      ].map((game, index) => (
        <div key={index} style={{
          padding: '1.5rem',
          background: 'var(--color-slate-800, #1e293b)',
          borderRadius: '8px',
          border: '1px solid var(--color-slate-700, #334155)',
          textAlign: 'center',
          transition: 'transform 0.2s ease',
          cursor: 'pointer',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: `linear-gradient(135deg, ${game.color}20, ${game.color}40)`,
            borderRadius: '12px',
            margin: '0 auto 1rem auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            border: `2px solid ${game.color}30`
          }}>
            {game.icon}
          </div>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', fontWeight: '600', color: 'white' }}>
            {game.name}
          </h3>
          <p style={{ margin: '0', color: 'var(--color-slate-400, #94a3b8)', fontSize: '0.875rem' }}>
            {game.type}
          </p>
        </div>
      ))}
    </div>
  </div>
);

const SettingsContent = () => (
  <div style={{
    maxWidth: 420,
    margin: '0 auto',
    padding: '2rem 1rem',
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }}>
    <h1 style={{ margin: '0 0 2rem 0', fontSize: '2rem', fontWeight: '700', textAlign: 'center', width: '100%' }}>
      ⚙️ 설정
    </h1>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
      {[
        { title: '프로필 설정', desc: '사용자 정보 및 아바타 변경' },
        { title: '게임 설정', desc: '그래픽, 사운드, 컨트롤 설정' },
        { title: '알림 설정', desc: '푸시 알림 및 이메일 설정' },
        { title: '보안 설정', desc: '비밀번호 및 2FA 설정' }
      ].map((setting, index) => (
        <div key={index} style={{
          padding: '1.5rem',
          background: 'var(--color-slate-800, #1e293b)',
          borderRadius: '8px',
          border: '1px solid var(--color-slate-700, #334155)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <div>
            <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.125rem', fontWeight: '600' }}>
              {setting.title}
            </h3>
            <p style={{ margin: '0', color: 'var(--color-slate-400, #94a3b8)', fontSize: '0.875rem' }}>
              {setting.desc}
            </p>
          </div>
          <button style={{
            padding: '0.5rem 1rem',
            background: 'var(--neon-purple-3, #8b5cf6)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}>
            편집
          </button>
        </div>
      ))}
    </div>
  </div>
);

/**
 * ## 기본 AppLayout
 * 가장 간단한 기본 설정의 AppLayout입니다.
 * 
 * - AppBar만 활성화된 깔끔한 레이아웃
 * - Sidebar와 BottomNav는 비활성화
 */
export const Default: Story = {
  args: {
    children: <DashboardContent />,
    showAppBar: true,
    showSidebar: false,
    showBottomNav: false,
    showFooter: false,
    appBarProps: {
      title: "카지노 게임",
      leftContent: "back",
      rightContent: "notification",
      variant: "default",
      hasShadow: true,
      hasBorder: true
    }
  }
};

/**
 * ## 완전한 레이아웃
 * AppBar, Sidebar, BottomNav가 모두 활성화된 완전한 레이아웃입니다.
 * 
 * - 모든 네비게이션 요소 활성화
 * - 데스크톱과 모바일에서 각각 다른 네비게이션 방식 제공
 */
export const FullLayout: Story = {
  args: {
    children: <DashboardContent />,
    showAppBar: true,
    showSidebar: true,
    showBottomNav: true,
    showBottomNavOnDesktop: true,
    showFooter: false,
    appBarProps: {
      title: "카지노 게임",
      leftContent: "menu",
      rightContent: "notification",
      variant: "default",
      hasShadow: true,
      hasBorder: true
    }
  }
};

/**
 * ## 바텀 네비게이션 전용
 * 모바일에 최적화된 바텀 네비게이션 레이아웃입니다.
 * 
 * - 사이드바 없음 (모바일 친화적)
 * - 바텀 네비게이션으로 주요 메뉴 제공
 * - 하단 안전 영역 자동 처리
 */
export const BottomNavOnly: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    }
  },
  args: {
    children: <DashboardContent />,
    showAppBar: true,
    showSidebar: false,
    showBottomNav: true,
    showBottomNavOnDesktop: true,
    showFooter: false,
    appBarProps: {
      title: "홈",
      centerContent: "logo",
      rightContent: "profile",
      variant: "default",
      hasShadow: true,
      hasBorder: true
    }
  }
};

/**
 * ## 게임 화면 레이아웃
 * 게임 화면에 최적화된 레이아웃입니다.
 * 
 * - 게임 변형 AppBar 사용
 * - 사이드바 없음
 * - 전체 컨테이너 사용
 */
export const GameScreen: Story = {
  args: {
    children: (
      <div style={{ 
        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem',
        fontWeight: 'bold',
        color: 'white'
      }}>
        🎰 게임 화면
      </div>
    ),
    showAppBar: true,
    showSidebar: false,
    showBottomNav: false,
    containerSize: 'full',
    noContentPadding: true,
    appBarProps: {
      title: "슬롯 게임",
      leftContent: "back",
      rightContent: "settings",
      variant: "game"
    }
  }
};

/**
 * ## 설정 페이지
 * 설정 페이지 콘텐츠가 있는 AppLayout입니다.
 */
export const SettingsPage: Story = {
  args: {
    children: <SettingsContent />,
    showAppBar: true,
    showSidebar: true,
    showBottomNav: true,
    appBarProps: {
      title: "설정",
      leftContent: "menu",
      rightContent: "none",
      variant: "default",
      hasShadow: true,
      hasBorder: true
    }
  }
};

/**
 * ## 모바일 전용 보기
 * 모바일 환경에 최적화된 레이아웃입니다.
 * 
 * - 사이드바 없음
 * - 바텀 네비게이션 사용
 */
export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile'
    }
  },
  args: {
    children: <DashboardContent />,
    showAppBar: true,
    showSidebar: false,
    showBottomNav: true,
    showBottomNavOnDesktop: true,
    appBarProps: {
      title: "홈",
      centerContent: "logo",
      rightContent: "profile",
      variant: "default",
      hasShadow: true,
      hasBorder: true
    }
  }
};

/**
 * ## 투명 앱바 
 * 배경이 있는 페이지에 적합한 투명 앱바 레이아웃입니다.
 */
export const TransparentHeader: Story = {
  args: {
    children: (
      <div style={{ 
        height: '100%',
        background: 'linear-gradient(135deg, #4f46e5, #9333ea)',
        padding: '2rem',
        color: 'white'
      }}>
        <h1 style={{ margin: '0 0 1rem 0', fontSize: '2rem', fontWeight: '700' }}>
          ✨ 투명 앱바 예시
        </h1>
        <p>
          배경 이미지나 그라데이션 위에 콘텐츠를 표시할 때 적합합니다.
        </p>
      </div>
    ),
    containerSize: 'full',
    noContentPadding: true,
    showSidebar: false,
    appBarProps: {
      title: "투명 앱바",
      variant: "transparent",
      leftContent: "back",
      hasShadow: false,
      hasBorder: false
    }
  }
};

/**
 * ## 긴 콘텐츠
 * 스크롤이 필요한 긴 콘텐츠로 레이아웃 동작을 테스트합니다.
 */
export const LongContent: Story = {
  args: {
    children: (
      <div style={{ padding: '2rem', paddingBottom: '100px' }}>
        <h1 style={{ margin: '0 0 2rem 0', fontSize: '2rem', fontWeight: '700' }}>
          📜 긴 콘텐츠 페이지
        </h1>
        {[...Array(20)].map((_, index) => (
          <div key={index} style={{
            marginBottom: '2rem',
            padding: '1.5rem',
            background: 'var(--color-slate-800, #1e293b)',
            borderRadius: '8px',
            border: '1px solid var(--color-slate-700, #334155)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: '600' }}>
              섹션 {index + 1}
            </h3>
            <p style={{ margin: '0', color: 'var(--color-slate-400, #94a3b8)', lineHeight: '1.6' }}>
              이것은 긴 콘텐츠를 시뮬레이션하기 위한 더미 텍스트입니다. 
              레이아웃이 스크롤과 함께 올바르게 작동하는지 확인할 수 있습니다.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        ))}
      </div>
    ),
    appBarProps: {
      title: "긴 콘텐츠",
      leftContent: "menu",
      variant: "default",
      hasShadow: true,
      hasBorder: true
    }
  }
};
