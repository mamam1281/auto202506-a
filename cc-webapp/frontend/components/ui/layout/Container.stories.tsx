import type { Meta, StoryObj } from '@storybook/react';
import { Container } from './Container';

/**
 * # Container 컴포넌트 스토리북
 * 
 * Figma 003 게임 플랫폼 레이아웃 시스템 기준으로 제작된 Container 컴포넌트의
 * 다양한 변형과 사용 사례를 보여줍니다.
 *  * ## 주요 특징
 * - **반응형 크기**: sm, md, lg, xl, full 크기 옵션
 * - **모바일 우선 패딩**: 12px → 16px → 24px → 32px (모바일 → 데스크톱)
 * - **패딩 제어**: noPadding 옵션으로 패딩 제거
 * - **중앙 정렬**: center 옵션으로 자동 중앙 정렬
 * - **유동 너비**: fluid 옵션으로 최대 너비 제한 해제
 */
const meta = {
  title: 'Layout/Container',
  component: Container,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Container 컴포넌트는 콘텐츠를 감싸고 반응형 레이아웃을 제공하는 기본 레이아웃 컴포넌트입니다.

### 크기별 최대 너비
- **sm**: 640px
- **md**: 768px  
- **lg**: 1024px
- **xl**: 1280px
- **full**: 100% (제한 없음)

### 모바일 우선 패딩 시스템
- **모바일 (0-479px)**: 12px (0.75rem)
- **큰 모바일 (480-639px)**: 16px (1rem)
- **태블릿 (640-1023px)**: 24px (1.5rem)
- **데스크톱 (1024px+)**: 32px (2rem)

### 사용 예시
\`\`\`tsx
// 기본 사용
<Container size="lg">
  <h1>콘텐츠</h1>
</Container>

// 패딩 없는 전체 너비
<Container size="full" noPadding>
  <FullWidthComponent />
</Container>
\`\`\`
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      description: '컨테이너의 최대 너비를 설정합니다.'
    },
    noPadding: {
      control: 'boolean',
      description: '좌우 패딩을 제거합니다.'
    },
    center: {
      control: 'boolean',
      description: '컨테이너를 수평 중앙 정렬합니다.'
    },
    fluid: {
      control: 'boolean',
      description: '최대 너비 제한을 해제합니다.'
    },
    as: {
      control: 'select',
      options: ['div', 'section', 'article', 'main', 'aside'],
      description: '렌더링할 HTML 태그를 선택합니다.'
    }
  },
  decorators: [
    (Story) => (
      <div style={{ 
        minHeight: '100vh',
        background: 'var(--color-slate-900, #0f172a)',
        color: 'white',
        fontFamily: 'Inter, sans-serif'
      }}>
        <Story />
      </div>
    )
  ],
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

// 예시 콘텐츠 컴포넌트
const SampleContent = ({ title = "Container 예시", description = "이것은 Container 컴포넌트의 예시입니다." }) => (
  <div style={{ 
    padding: '2rem',
    background: 'var(--color-slate-800, #1e293b)',
    borderRadius: '8px',
    border: '1px solid var(--color-slate-700, #334155)'
  }}>
    <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem', fontWeight: '600' }}>{title}</h2>
    <p style={{ margin: '0', color: 'var(--color-slate-400, #94a3b8)', lineHeight: '1.6' }}>
      {description}
    </p>
    <div style={{ 
      marginTop: '1rem',
      padding: '1rem',
      background: 'var(--color-slate-700, #334155)',
      borderRadius: '4px',
      fontSize: '0.875rem'
    }}>
      <strong>현재 Container 설정:</strong>
      <br />
      최대 너비: {window.innerWidth < 640 ? 'sm' : window.innerWidth < 768 ? 'md' : window.innerWidth < 1024 ? 'lg' : 'xl'}px
    </div>
  </div>
);

/**
 * ## 기본 Container
 * 기본 설정의 Container입니다. lg 크기(1024px)에 중앙 정렬과 패딩이 적용됩니다.
 */
export const Default: Story = {
  args: {
    size: 'lg',
    center: true,
    noPadding: false,
    fluid: false,
    children: <SampleContent />
  }
};

/**
 * ## 크기별 Container
 * 다양한 크기의 Container를 보여줍니다.
 */
export const Small: Story = {
  args: {
    ...Default.args,
    size: 'sm',
    children: <SampleContent title="Small Container (640px)" description="작은 폼이나 모달에 적합한 크기입니다." />
  }
};

export const Medium: Story = {
  args: {
    ...Default.args,
    size: 'md',
    children: <SampleContent title="Medium Container (768px)" description="태블릿 크기에 최적화된 중간 크기 컨테이너입니다." />
  }
};

export const Large: Story = {
  args: {
    ...Default.args,
    size: 'lg',
    children: <SampleContent title="Large Container (1024px)" description="데스크톱에서 일반적으로 사용되는 크기입니다." />
  }
};

export const ExtraLarge: Story = {
  args: {
    ...Default.args,
    size: 'xl',
    children: <SampleContent title="Extra Large Container (1280px)" description="큰 화면에서 더 넓은 레이아웃이 필요한 경우 사용합니다." />
  }
};

export const FullWidth: Story = {
  args: {
    ...Default.args,
    size: 'full',
    children: <SampleContent title="Full Width Container" description="화면 전체 너비를 사용하는 컨테이너입니다." />
  }
};

/**
 * ## 패딩 없는 Container
 * noPadding 옵션을 사용하여 좌우 패딩을 제거한 컨테이너입니다.
 * 이미지나 전체 너비 컴포넌트에 적합합니다.
 */
export const WithoutPadding: Story = {
  args: {
    ...Default.args,
    noPadding: true,
    children: (
      <div style={{ 
        background: 'linear-gradient(45deg, var(--neon-purple-3, #5b30f6), var(--neon-purple-1, #7b29cd))',
        padding: '3rem 2rem',
        textAlign: 'center'
      }}>
        <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.75rem', fontWeight: '700' }}>
          패딩 없는 전체 너비 콘텐츠
        </h2>
        <p style={{ margin: '0', fontSize: '1.125rem' }}>
          이 콘텐츠는 컨테이너의 패딩 제약 없이 전체 너비를 사용합니다.
        </p>
      </div>
    )
  }
};

/**
 * ## 유동 Container
 * fluid 옵션을 사용하여 최대 너비 제한을 해제한 컨테이너입니다.
 */
export const FluidContainer: Story = {
  args: {
    ...Default.args,
    fluid: true,
    children: <SampleContent title="Fluid Container" description="최대 너비 제한이 해제되어 화면 크기에 관계없이 전체 너비를 사용합니다." />
  }
};

/**
 * ## 다양한 HTML 태그
 * as 속성을 사용하여 다른 HTML 태그로 렌더링하는 예시입니다.
 */
export const AsSection: Story = {
  args: {
    ...Default.args,
    as: 'section',
    children: <SampleContent title="Section Container" description="semantic HTML을 위해 section 태그로 렌더링됩니다." />
  }
};

export const AsMain: Story = {
  args: {
    ...Default.args,
    as: 'main',
    children: <SampleContent title="Main Container" description="페이지의 주요 콘텐츠 영역을 위한 main 태그로 렌더링됩니다." />
  }
};

/**
 * ## 모든 크기 비교
 * 모든 크기의 Container를 한 번에 비교해볼 수 있습니다.
 */
export const AllSizes: Story = {
  args: {
    children: <div>Default content</div>
  },
  render: () => (
    <div style={{ padding: '2rem 0', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {['sm', 'md', 'lg', 'xl', 'full'].map((size) => (
        <Container 
          key={size} 
          size={size as any}
          style={{ 
            outline: '2px dashed var(--neon-purple-3, #5b30f6)',
            outlineOffset: '-2px'
          }}
        >
          <SampleContent 
            title={`${size.toUpperCase()} Container`}
            description={`${size} 크기 컨테이너의 경계를 보여주는 점선 테두리가 있습니다.`}
          />
        </Container>
      ))}
    </div>
  )
};

/**
 * ## 반응형 데모
 * 화면 크기에 따라 Container가 어떻게 반응하는지 보여줍니다.
 */
export const ResponsiveDemo: Story = {
  args: {
    children: <div>Default content</div>
  },
  render: () => (
    <Container size="lg">
      <div style={{ 
        display: 'grid',
        gap: '1rem',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
      }}>
        {[1, 2, 3, 4].map((num) => (
          <div key={num} style={{
            padding: '1.5rem',
            background: 'var(--color-slate-800, #1e293b)',
            borderRadius: '8px',
            border: '1px solid var(--color-slate-700, #334155)',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem' }}>카드 {num}</h3>
            <p style={{ margin: '0', color: 'var(--color-slate-400, #94a3b8)', fontSize: '0.875rem' }}>
              반응형 그리드 레이아웃
            </p>
          </div>
        ))}
      </div>
    </Container>
  )
};

/**
 * ## 모바일 패딩 최적화
 * 새롭게 최적화된 모바일 우선 패딩 시스템을 보여줍니다.
 * 
 * - 모바일 (0-479px): 12px
 * - 큰 모바일 (480-639px): 16px  
 * - 태블릿 (640-1023px): 24px
 * - 데스크톱 (1024px+): 32px
 */
export const MobilePaddingOptimized: Story = {
  args: {
    children: <div>Default content</div>
  },
  render: () => (
    <div style={{ padding: '1rem 0' }}>
      <Container size="lg">
        <div style={{ 
          padding: '1.5rem',
          background: 'var(--color-slate-800, #1e293b)',
          borderRadius: '8px',
          border: '1px solid var(--color-slate-700, #334155)',
          position: 'relative'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: '600' }}>
            🔥 모바일 패딩 최적화
          </h3>
          <p style={{ margin: '0 0 1rem 0', color: 'var(--color-slate-400, #94a3b8)', lineHeight: '1.6' }}>
            브라우저 창 크기를 조정해보세요! Container의 패딩이 화면 크기에 맞춰 자동으로 조정됩니다.
          </p>
          
          <div style={{
            display: 'grid',
            gap: '0.75rem',
            fontSize: '0.875rem',
            fontFamily: 'monospace'
          }}>
            <div style={{ 
              padding: '0.5rem',
              background: 'var(--color-slate-700, #334155)',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>📱 모바일 (0-479px)</span>
              <span style={{ color: 'var(--neon-green-3, #22c55e)' }}>12px</span>
            </div>
            <div style={{ 
              padding: '0.5rem',
              background: 'var(--color-slate-700, #334155)',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>📱+ 큰 모바일 (480-639px)</span>
              <span style={{ color: 'var(--neon-blue-3, #3b82f6)' }}>16px</span>
            </div>
            <div style={{ 
              padding: '0.5rem',
              background: 'var(--color-slate-700, #334155)',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>📟 태블릿 (640-1023px)</span>
              <span style={{ color: 'var(--neon-purple-3, #8b5cf6)' }}>24px</span>
            </div>
            <div style={{ 
              padding: '0.5rem',
              background: 'var(--color-slate-700, #334155)',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>🖥️ 데스크톱 (1024px+)</span>
              <span style={{ color: 'var(--neon-orange-3, #f97316)' }}>32px</span>
            </div>
          </div>
          
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem',
            background: 'var(--color-slate-900, #0f172a)',
            borderRadius: '4px',
            border: '1px solid var(--neon-green-3, #22c55e)',
            fontSize: '0.75rem',
            color: 'var(--neon-green-3, #22c55e)'
          }}>
            ✨ 이전: 모바일에서 16px 패딩 → 현재: 12px 패딩 (25% 감소)
          </div>
        </div>
      </Container>
    </div>
  )
};
