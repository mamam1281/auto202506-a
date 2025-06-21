/** @type {import('next').NextConfig} */
const nextConfig = {
  // React 19 Experimental Features
  experimental: {
    // React 19 지원
    reactCompiler: true,
    // 새로운 App Router 기능들
    typedRoutes: true,
    // 성능 최적화
    optimizePackageImports: ['lucide-react', 'framer-motion'],
    // PWA 관련 설정
    webVitalsAttribution: ['CLS', 'LCP']
  },

  // TypeScript 설정
  typescript: {
    // 빌드 시 타입 체크 엄격 모드
    ignoreBuildErrors: false,
  },

  // ESLint 설정
  eslint: {
    ignoreDuringBuilds: false,
  },

  // 이미지 최적화
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // PWA 및 모바일 최적화
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  // 성능 최적화
  compiler: {
    // SWC를 사용한 최적화
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // 번들 분석 (analyze 스크립트 실행 시)
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        const { BundleAnalyzerPlugin } = require('@next/bundle-analyzer')();
        config.plugins.push(new BundleAnalyzerPlugin());
      }
      return config;
    },
  }),

  // 개발 서버 설정
  ...(process.env.NODE_ENV === 'development' && {
    devIndicators: {
      buildActivity: true,
      buildActivityPosition: 'bottom-right',
    },
  }),

  // 빌드 최적화
  swcMinify: true,
  compress: true,

  // 환경 변수
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // 리다이렉트 설정
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },

  // 리라이트 설정 (API 프록시 등)
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;