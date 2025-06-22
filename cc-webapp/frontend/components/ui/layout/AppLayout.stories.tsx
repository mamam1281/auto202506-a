import type { Meta, StoryObj } from '@storybook/react';
import { AppLayout } from './AppLayout';

/**
 * # AppLayout 컴포넌트 스토리북
 * 
 * Figma 003 게임 플랫폼 레이아웃 시스템의 메인 애플리케이션 레이아웃입니다.
 * Header, Sidebar, Footer를 통합한 완전한 앱 레이아웃을 제공합니다.
 * 
 * ## 주요 특징
 * - **통합 레이아웃**: Header + Sidebar + Footer 완전 통합
 * - **반응형 디자인**: 모바일, 태블릿, 데스크톱 최적화
 * - **사이드바 상태 관리**: 확장/축소 상태 자동 관리
 * - **모바일 친화적**: 작은 화면에서 오버레이 모드 지원
 */
const meta = {
  title: 'Layout/AppLayout',
  component: AppLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
AppLayout은 게임 플랫폼의 메인 애플리케이션 레이아웃입니다.

### 구성 요소
- **Header**: 브랜드, 네비게이션, 검색, 토큰 잔액
- **Sidebar**: 메인 메뉴, 게임 카테고리, 사용자 정보
- **Footer**: 링크, 소셜 미디어, 저작권 정보
- **Main**: 페이지별 콘텐츠 영역

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
  },  tags: ['autodocs'],
  argTypes: {
    children: {
      description: '메인 콘텐츠 영역에 들어갈 내용'
    },
    showHeader: {
      control: 'boolean',
      description: '헤더 표시 여부'
    },
    showSidebar: {
      control: 'boolean', 
      description: '사이드바 표시 여부'
    },
    showFooter: {
      control: 'boolean',
      description: '푸터 표시 여부'
    },
    simpleFooter: {
      control: 'boolean',
      description: '간단한 푸터 모드'
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
  <div style={{ padding: '2rem' }}>
    <h1 style={{ margin: '0 0 2rem 0', fontSize: '2rem', fontWeight: '700' }}>
      🎮 게임 대시보드
    </h1>
    
    <div style={{ 
      display: 'grid', 
      gap: '1.5rem',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      marginBottom: '2rem'
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
          border: '1px solid var(--color-slate-700, #334155)'
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
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
    }}>
      {[1, 2, 3, 4, 5, 6].map((num) => (
        <div key={num} style={{
          padding: '1.5rem',
          background: 'var(--color-slate-800, #1e293b)',
          borderRadius: '8px',
          border: '1px solid var(--color-slate-700, #334155)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: `linear-gradient(135deg, #${Math.floor(Math.random()*16777215).toString(16)}, #${Math.floor(Math.random()*16777215).toString(16)})`,
            borderRadius: '12px',
            margin: '0 auto 1rem auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem'
          }}>
            🎯
          </div>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', fontWeight: '600' }}>
            게임 {num}
          </h3>
          <p style={{ margin: '0', color: 'var(--color-slate-400, #94a3b8)', fontSize: '0.875rem' }}>
            액션 RPG 게임
          </p>
        </div>
      ))}
    </div>
  </div>
);

const SettingsContent = () => (
  <div style={{ padding: '2rem', maxWidth: '800px' }}>
    <h1 style={{ margin: '0 0 2rem 0', fontSize: '2rem', fontWeight: '700' }}>
      ⚙️ 설정
    </h1>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
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
          alignItems: 'center'
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
 * 기본 설정의 AppLayout으로 대시보드 콘텐츠를 표시합니다.
 */
export const Default: Story = {
  args: {
    children: <DashboardContent />
  }
};

/**
 * ## 설정 페이지
 * 설정 페이지 콘텐츠가 있는 AppLayout입니다.
 */
export const SettingsPage: Story = {
  args: {
    children: <SettingsContent />
  }
};

/**
 * ## 빈 페이지
 * 최소한의 콘텐츠만 있는 AppLayout입니다.
 */
export const EmptyPage: Story = {
  args: {
    children: (
      <div style={{ 
        padding: '4rem 2rem',
        textAlign: 'center',
        color: 'var(--color-slate-400, #94a3b8)'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎮</div>
        <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem', fontWeight: '600' }}>
          페이지가 비어있습니다
        </h2>
        <p style={{ margin: '0', fontSize: '1rem' }}>
          여기에 콘텐츠를 추가해보세요.
        </p>
      </div>
    )
  }
};

/**
 * ## 긴 콘텐츠
 * 스크롤이 필요한 긴 콘텐츠로 레이아웃 동작을 테스트합니다.
 */
export const LongContent: Story = {
  args: {
    children: (
      <div style={{ padding: '2rem' }}>
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
    )
  }
};
