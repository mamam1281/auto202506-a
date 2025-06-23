import type { Meta, StoryObj } from '@storybook/react';
import BottomNav from './BottomNav';

/**
 * # BottomNav 컴포넌트 스토리북
 * 
 * 모바일 환경에 최적화된 하단 네비게이션 바입니다.
 * 
 * ## 주요 특징
 * - **모바일 친화적**: 하단 안전 영역 자동 처리
 * - **고정 위치**: 화면 하단에 고정되어 항상 접근 가능
 * - **활성 상태**: 현재 경로에 따른 활성 아이콘 표시
 * - **아이콘**: Lucide React 아이콘 사용
 */
const meta: Meta<typeof BottomNav> = {
  title: 'Layout/BottomNav',
  component: BottomNav,
  parameters: {
    layout: 'fullscreen'
  },
  tags: ['autodocs'],  decorators: [
    (Story) => (
      <div style={{ 
        minHeight: '100vh',
        background: 'var(--color-slate-900, #0f172a)',
        color: 'white',
        paddingBottom: '100px'
      }}>
        <div style={{
          padding: '2rem',
          fontSize: '1.5rem',
          textAlign: 'center'
        }}>
          바텀네비가 화면 하단에 고정되어 표시됩니다
        </div>
        <div style={{
          padding: '2rem',
          fontSize: '1rem',
          opacity: 0.7,
          textAlign: 'center'
        }}>
          스크롤해도 바텀네비는 항상 화면 하단에 유지됩니다
        </div>
        <div style={{
          height: '200vh',
          background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.1))',
          padding: '2rem',
          textAlign: 'center',
          paddingTop: '10rem'
        }}>
          <p>긴 콘텐츠 영역</p>
          <p style={{ marginTop: '10rem' }}>스크롤 테스트</p>
          <p style={{ marginTop: '10rem' }}>바텀네비는 항상 하단에 고정</p>
        </div>
        <Story />
      </div>
    )
  ],
} satisfies Meta<typeof BottomNav>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * ## 기본 BottomNav
 * 기본 설정의 바텀 네비게이션입니다.
 */
export const Default: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    }
  }
};

/**
 * ## 모바일 뷰
 * 모바일 환경에서의 바텀네비입니다.
 */
export const Mobile: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    }
  }
};

/**
 * ## 데스크톱에서 보기
 * 데스크톱 환경에서도 바텀네비를 확인할 수 있습니다.
 */
export const Desktop: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'desktop'
    }
  }
};
