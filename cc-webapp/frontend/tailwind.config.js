/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 통합 CSS Variables 가이드 기준 - 네온 퍼플 색상 시스템
      colors: {
        'neon-purple': {
          1: '#7b29cd',
          2: '#870dd1', 
          3: '#5b30f6',
          4: '#8054f2',
        },
        brand: {
          primary: '#7b29cd',      // neon-purple-1
          secondary: '#870dd1',    // neon-purple-2
          accent: '#5b30f6',       // neon-purple-3
          highlight: '#8054f2',    // neon-purple-4
          success: '#10b981',      // Emerald-500
          warning: '#f59e0b',      // Amber-500
          error: '#ef4444',        // Red-500
          info: '#3b82f6',         // Blue-500
          dark: '#0f172a',         // Slate-900
          light: '#f8fafc',        // Slate-50
        },
        game: {
          cosmic: '#4c1d95',       // Purple-900
          neon: '#10b981',         // Emerald-500
          gold: '#FFD700',         // 통합 가이드 기준
          silver: '#e5e7eb',       // Gray-200
        },
        token: {
          normal: '#10b981',       // --token-normal
          warning: '#f59e0b',      // --token-warning  
          critical: '#ef4444',     // --token-critical
        },
        surface: {
          glass: 'rgba(255,255,255,0.1)',  // --surface-glass
          card: '#2d2d2d',                 // 카드 배경
          border: '#333333',               // 카드 테두리
        }
      },
      
      // 통합 가이드 기준 - 8px 기반 스페이싱 시스템
      spacing: {
        '0': '0px',
        '0.5': '2px',     // --spacing-0-5
        '1': '8px',       // --spacing-1
        '1.5': '6px',     // --spacing-1-5
        '2': '16px',      // --spacing-2
        '2.5': '10px',    // --spacing-2-5
        '3': '24px',      // --spacing-3
        '3.5': '14px',    // --spacing-3-5
        '4': '32px',      // --spacing-4
        '5': '40px',      // --spacing-5
        '6': '48px',      // --spacing-6
        '8': '64px',      // --spacing-8
        '10': '80px',     // --spacing-10
        '12': '96px',     // --spacing-12
        // 그리드 시스템
        'grid-1': '8px',
        'grid-2': '16px', 
        'grid-3': '24px',
        'grid-4': '32px',
        'grid-5': '40px',
        'grid-6': '48px',
        // 기존 호환성
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },

      // 통합 가이드 기준 - 폰트 시스템
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'exo': ['Exo', 'sans-serif'],
        'mono': ['Fira Code', 'Monaco', 'Consolas', 'Menlo', 'Liberation Mono', 'monospace'],
        'heading': ['Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '1rem' }],
        'sm': ['14px', { lineHeight: '1.25rem' }],
        'base': ['16px', { lineHeight: '1.5rem' }],
        'lg': ['18px', { lineHeight: '1.75rem' }],
        'xl': ['20px', { lineHeight: '1.75rem' }],
        '2xl': ['24px', { lineHeight: '2rem' }],
        '3xl': ['30px', { lineHeight: '2.25rem' }],
        '4xl': ['36px', { lineHeight: '2.5rem' }],
        '5xl': ['48px', { lineHeight: '1' }],
        '6xl': ['60px', { lineHeight: '1' }],
      },
      fontWeight: {
        normal: '400',
        medium: '500', 
        semibold: '600',
        bold: '700',
      },

      // 애니메이션 타이밍 가이드 기준
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-subtle': 'bounce 0.6s ease-in-out',
        'pulse-soft': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        // 기존 호환성
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(123, 41, 205, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(123, 41, 205, 0.4)' },
        },
      },

      // 통합 가이드 기준 - 그림자/글로우 시스템
      boxShadow: {
        'default': '0 2px 10px rgba(0,0,0,0.2), 0 0 0 1px rgba(123,41,205,0.15)',
        'hover': '0 8px 20px rgba(123,41,205,0.2), 0 0 0 1px rgba(123,41,205,0.25), 0 0 10px rgba(123,41,205,0.15)',
        'active': '0 4px 15px rgba(135,13,209,0.3), 0 0 0 2px rgba(135,13,209,0.35)',
        'neon': '0 0 5px rgba(123, 41, 205, 0.3), 0 0 10px rgba(123, 41, 205, 0.2)',
        'neon-strong': '0 0 10px rgba(123, 41, 205, 0.4), 0 0 20px rgba(123, 41, 205, 0.3)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
        'game': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'cosmic': '0 0 30px rgba(139, 92, 246, 0.3)',
      },

      // 배경 그라데이션
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'neon-gradient-1': 'linear-gradient(45deg, #7b29cd, #870dd1)',
        'neon-gradient-2': 'linear-gradient(45deg, #870dd1, #5b30f6)',
        'neon-gradient-3': 'linear-gradient(45deg, #5b30f6, #8054f2)',
        'neon-gradient-4': 'linear-gradient(45deg, #8054f2, #7b29cd)',
        'gradient-cosmic': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-game': 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
      },

      // 백드롭 필터
      backdropBlur: {
        'glass': '10px',
      },      // 폰트 패밀리
      fontFamily: {
        'body': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'heading': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'mono': ['Fira Code', 'Monaco', 'Consolas', 'monospace'],
      },

      // 경계선 반지름
      borderRadius: {
        'none': '0px',
        'sm': '2px',
        'base': '4px', 
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
        'full': '9999px',
        // 컴포넌트별
        'card': '16px',
        'image': '12px',
        'button': '12px',
        'badge': '9999px',
      },
    },
  },
  plugins: [],
}
