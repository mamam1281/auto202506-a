/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // CSS Variables 직접 참조 - 색상 시스템
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        accent: 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        border: 'var(--border)',
        'border-hover': 'var(--border-hover)',
        input: 'var(--input)',
        destructive: 'var(--destructive)',
        ring: 'var(--ring)',
        
        // 네온 퍼플 컬러 시스템
        'neon-purple-1': 'var(--neon-purple-1)',
        'neon-purple-2': 'var(--neon-purple-2)',
        'neon-purple-3': 'var(--neon-purple-3)',
        'neon-purple-4': 'var(--neon-purple-4)',
        
        // 브랜드 컬러
        'brand-primary': 'var(--brand-primary)',
        'brand-secondary': 'var(--brand-secondary)',
        'brand-accent': 'var(--brand-accent)',
        'brand-highlight': 'var(--brand-highlight)',
      },

      // CSS Variables 직접 참조 - 간격 시스템 (확장)
      spacing: {
        '0.5': 'var(--spacing-0-5)',
        '1': 'var(--spacing-1)',
        '2': 'var(--spacing-2)',
        '3': 'var(--spacing-3)',
        '4': 'var(--spacing-4)',
        '5': 'var(--spacing-5)',
        '6': 'var(--spacing-6)',
        '7': 'var(--spacing-7)',
        '8': 'var(--spacing-8)',
        '9': 'var(--spacing-9)',
      },

      // CSS Variables 직접 참조 - 최대 너비 (모달 등)
      maxWidth: {
        'modal-sm': 'var(--modal-max-width-sm)',
        'modal-md': 'var(--modal-max-width-md)',
        'modal-lg': 'var(--modal-max-width-lg)',
        'modal-xl': 'var(--modal-max-width-xl)',
        'layout': 'var(--layout-max-width)',
      },

      // CSS Variables 직접 참조 - Border Radius
      borderRadius: {
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
        'full': 'var(--radius-full)',
      },

      // CSS Variables 직접 참조 - 폰트 시스템 (lineHeight 배열로 포함)
      fontSize: {
        'xs': ['var(--font-size-xs)', { lineHeight: 'var(--line-height-tight)' }],
        'caption': ['var(--font-size-caption)', { lineHeight: 'var(--line-height-caption)' }],
        'sm': ['var(--font-size-sm)', { lineHeight: 'var(--line-height-base)' }],
        'body': ['var(--font-size-body)', { lineHeight: 'var(--line-height-body)' }],
        'lg': ['var(--font-size-lg)', { lineHeight: 'var(--line-height-base)' }],
        'h4': ['var(--font-size-h4)', { lineHeight: 'var(--line-height-heading)' }],
        'h3': ['var(--font-size-h3)', { lineHeight: 'var(--line-height-heading)' }],
        'h2': ['var(--font-size-h2)', { lineHeight: 'var(--line-height-heading)' }],
        'h1': ['var(--font-size-h1)', { lineHeight: 'var(--line-height-heading)' }],
        'token': ['var(--font-size-token)', { lineHeight: 'var(--line-height-base)' }],
      },

      fontWeight: {
        normal: 'var(--font-weight-normal)',
        medium: 'var(--font-weight-medium)',
        semibold: 'var(--font-weight-semibold)',
        bold: 'var(--font-weight-bold)',
      },

      lineHeight: {
        base: 'var(--line-height-base)',
        tight: 'var(--line-height-tight)',
        caption: 'var(--line-height-caption)',
        body: 'var(--line-height-body)',
        heading: 'var(--line-height-heading)',
      },

      // CSS Variables 직접 참조 - 그림자 (모든 shadow 변수 포함)
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'focused-glow': 'var(--shadow-focused-glow)',
        'inner-sm': 'var(--shadow-inner-sm)',
        'error-glow': 'var(--shadow-error-glow)',
        'success-glow': 'var(--shadow-success-glow)',
        'card-default': 'var(--shadow-card-default)',
        'card-hover': 'var(--shadow-card-hover)',
        'neon-primary': 'var(--shadow-neon-primary)',
        'neon-hover': 'var(--shadow-neon-hover)',
        'glass-card': 'var(--shadow-glass-card)',
        'animated-default': 'var(--shadow-animated-default)',
        'animated-hover': 'var(--shadow-animated-hover)',
      },

      // CSS Variables 직접 참조 - 애니메이션
      transitionDuration: {
        'fast': 'var(--transition-fast)',
        'normal': 'var(--transition-normal)',
      },

      // CSS Variables 직접 참조 - 아이콘 크기
      width: {
        'icon-xs': 'var(--icon-xs)',
        'icon-sm': 'var(--icon-sm)',
        'icon-md': 'var(--icon-md)',
        'icon-lg': 'var(--icon-lg)',
        'icon-xl': 'var(--icon-xl)',
        'icon-xxl': 'var(--icon-xxl)',
        'btn-icon-sm': 'var(--btn-icon-sm)',
        'btn-icon-md': 'var(--btn-icon-md)',
        'btn-icon-lg': 'var(--btn-icon-lg)',
        'btn-icon-xl': 'var(--btn-icon-xl)',
        'content-card': 'var(--content-card-size)',
        'content-icon': 'var(--content-icon-size)',
        'mobile-content': 'var(--mobile-content-size)',
        'mobile-content-icon': 'var(--mobile-content-icon)',
      },

      height: {
        'icon-xs': 'var(--icon-xs)',
        'icon-sm': 'var(--icon-sm)',
        'icon-md': 'var(--icon-md)',
        'icon-lg': 'var(--icon-lg)',
        'icon-xl': 'var(--icon-xl)',
        'icon-xxl': 'var(--icon-xxl)',
        'btn-md': 'var(--btn-height-md)',
        'btn-lg': 'var(--btn-height-lg)',
        'btn-icon-sm': 'var(--btn-icon-sm)',
        'btn-icon-md': 'var(--btn-icon-md)',
        'btn-icon-lg': 'var(--btn-icon-lg)',
        'btn-icon-xl': 'var(--btn-icon-xl)',
        'content-card': 'var(--content-card-size)',
        'content-icon': 'var(--content-icon-size)',
        'mobile-content': 'var(--mobile-content-size)',
        'mobile-content-icon': 'var(--mobile-content-icon)',
        'section-card': 'var(--section-card-height)',
        'mobile-section': 'var(--mobile-section-height)',
        'app-header-mobile': 'var(--app-header-height-mobile)',
        'app-header-desktop': 'var(--app-header-height-desktop)',
        'tabs-content': 'var(--tabs-content-min-height)',
        'tabs-content-mobile': 'var(--tabs-content-min-height-mobile)',
      },

      // CSS Variables 직접 참조 - 브레이크포인트 업데이트
      screens: {
        'sm': 'var(--breakpoint-mobile-sm)',   // 480px
        'md': 'var(--breakpoint-mobile-lg)',   // 768px  
        'lg': 'var(--breakpoint-tablet)',      // 1024px
        'xl': '1280px',                        // Tailwind 기본값 유지
        '2xl': '1536px',                       // Tailwind 기본값 유지
      },

      // 그라데이션 배경
      backgroundImage: {
        'gradient-purple-primary': 'var(--gradient-purple-primary)',
        'gradient-purple-secondary': 'var(--gradient-purple-secondary)',
        'gradient-neon': 'var(--gradient-neon)',
      },

      // 체크박스 크기
      size: {
        'checkbox': 'var(--checkbox-size)',
      },

      // 최소 높이
      minHeight: {
        'content-card': 'var(--content-card-size)',
        'mobile-content': 'var(--mobile-content-size)',
        'section-card': 'var(--section-card-height)',
        'mobile-section': 'var(--mobile-section-height)',
        'tabs-content': 'var(--tabs-content-min-height)',
        'tabs-content-mobile': 'var(--tabs-content-min-height-mobile)',
      },

      // Gap 값들
      gap: {
        'layout': 'var(--layout-gap)',
        'app-header-icon': 'var(--app-header-icon-gap)',
      },      // Padding 값들
      padding: {
        'layout': 'var(--layout-padding)',
        'mobile-layout': 'var(--mobile-layout-padding)',
        'section-card': 'var(--section-card-padding)',
        'content-card': 'var(--content-card-padding)',
        'tabs-content': 'var(--tabs-content-padding)',
        'tabs-content-mobile': 'var(--tabs-content-padding-mobile)',
        'app-header-y': 'var(--app-header-padding-y)',
        'container-x': 'var(--container-padding-x)',
        'container-x-mobile': 'var(--container-padding-x-mobile)',
      },
    },
  },
  plugins: [],
}
