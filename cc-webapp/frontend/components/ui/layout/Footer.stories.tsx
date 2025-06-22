import type { Meta, StoryObj } from '@storybook/react';
import { Footer } from './Footer';

/**
 * # Footer 컴포넌트 스토리북
 * 
 * Figma 003 게임 플랫폼 레이아웃 시스템 기준으로 제작된 Footer 컴포넌트의
 * 다양한 변형과 사용 사례를 보여줍니다.
 * 
 * ## 주요 특징
 * - **간단한 모드**: 저작권 정보만 표시
 * - **상세한 모드**: 링크, 소셜 미디어 포함
 * - **반응형 디자인**: 모바일/데스크톱 최적화
 * - **게임 브랜딩**: GamePlatform 브랜드 아이덴티티
 * - **접근성**: 키보드 네비게이션 지원
 */
const meta = {
  title: 'Layout/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Footer 컴포넌트는 게임 플랫폼의 하단에 위치하는 푸터입니다.

### 주요 기능
- **간단한 모드**: 저작권 정보만 깔끔하게 표시
- **상세한 모드**: 링크, 소셜 미디어 등 포함
- **브랜드 아이덴티티**: GamePlatform 로고와 브랜드명
- **반응형**: 모바일/데스크톱 자동 적응
- **접근성**: 키보드 네비게이션 완전 지원

### 사용 예시
\`\`\`tsx
// 간단한 푸터
<Footer simple />

// 상세한 푸터
<Footer 
  brandName="GamePlatform"
  links={footerLinks}
  socialLinks={socialLinks}
/>
\`\`\`
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    year: {
      control: 'number',
      description: '저작권 년도'
    },
    brandName: {
      control: 'text',
      description: '브랜드명'
    },
    simple: {
      control: 'boolean',
      description: '간단한 푸터 모드 (저작권만 표시)'
    },
    links: {
      control: 'object',
      description: '푸터 링크들'
    },
    socialLinks: {
      control: 'object',
      description: '소셜 미디어 링크들'
    }
  },
  decorators: [
    (Story) => (
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-slate-900, #0f172a)',
        color: 'white',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{ flex: 1, padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ 
            padding: '2rem',
            background: 'var(--color-slate-800, #1e293b)',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>페이지 컨텐츠</h2>
            <p style={{ margin: '0', color: 'var(--color-slate-400, #94a3b8)' }}>
              이곳은 메인 컨텐츠 영역입니다. 아래에 Footer가 표시됩니다.
            </p>
          </div>
        </div>
        <Story />
      </div>
    )
  ],
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * ## 간단한 Footer
 * 저작권 정보만 표시하는 미니멀한 푸터입니다.
 */
export const Simple: Story = {
  args: {
    simple: true,
    brandName: "GamePlatform",
    year: 2025
  }
};

/**
 * ## 기본 Footer (상세 모드)
 * 링크와 브랜드 정보가 포함된 상세한 푸터입니다.
 */
export const Default: Story = {
  args: {
    simple: false,
    brandName: "GamePlatform",
    year: 2025,
    links: [
      { id: 'privacy', label: '개인정보처리방침', href: '/privacy' },
      { id: 'terms', label: '이용약관', href: '/terms' },
      { id: 'support', label: '고객지원', href: '/support' },
      { id: 'games', label: '게임 목록', href: '/games' }
    ]
  }
};

/**
 * ## 커스텀 브랜드
 * 다른 브랜드명을 사용하는 예시입니다.
 */
export const CustomBrand: Story = {
  args: {
    simple: false,
    brandName: "MyGamePlatform",
    year: 2025,
    links: [
      { id: 'about', label: '회사 소개', href: '/about' },
      { id: 'careers', label: '채용', href: '/careers' },
      { id: 'blog', label: '블로그', href: '/blog', external: true }
    ]
  }
};

/**
 * ## 최소한의 링크
 * 필수 링크만 포함된 푸터입니다.
 */
export const MinimalLinks: Story = {
  args: {
    simple: false,
    brandName: "GamePlatform",
    year: 2025,
    links: [
      { id: 'privacy', label: '개인정보처리방침', href: '/privacy' },
      { id: 'terms', label: '이용약관', href: '/terms' }
    ]
  }
};

/**
 * ## 많은 링크
 * 다양한 링크들이 포함된 푸터입니다.
 */
export const ManyLinks: Story = {
  args: {
    simple: false,
    brandName: "GamePlatform",
    year: 2025,
    links: [
      { id: 'privacy', label: '개인정보처리방침', href: '/privacy' },
      { id: 'terms', label: '이용약관', href: '/terms' },
      { id: 'support', label: '고객지원', href: '/support' },
      { id: 'games', label: '게임 목록', href: '/games' },
      { id: 'ranking', label: '랭킹', href: '/ranking' },
      { id: 'events', label: '이벤트', href: '/events' },
      { id: 'community', label: '커뮤니티', href: '/community' },
      { id: 'api', label: 'API 문서', href: '/api', external: true }
    ]
  }
};
