import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';
import { AppProviders } from '@/providers/app-providers';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'CJ Gaming - VIP 전용 플랫폼',
    template: '%s | CJ Gaming'
  },
  description: '독점적인 VIP 멤버만을 위한 프리미엄 게임 플랫폼. 특별한 게임 경험과 혜택을 누리세요.',
  keywords: ['VIP 게임', '프리미엄 플랫폼', 'CJ Gaming', '독점 게임', '온라인 게임'],
  authors: [{ name: 'CJ Gaming Team' }],
  creator: 'CJ Gaming',
  publisher: 'CJ Gaming',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://cj-gaming.com'),
  alternates: {
    canonical: '/',
    languages: {
      'ko-KR': '/ko',
      'en-US': '/en',
    },
  },
  openGraph: {
    title: 'CJ Gaming - VIP 전용 플랫폼',
    description: '독점적인 VIP 멤버만을 위한 프리미엄 게임 플랫폼',
    url: 'https://cj-gaming.com',
    siteName: 'CJ Gaming',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CJ Gaming VIP Platform',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CJ Gaming - VIP 전용 플랫폼',
    description: '독점적인 VIP 멤버만을 위한 프리미엄 게임 플랫폼',
    images: ['/twitter-image.png'],
    creator: '@cjgaming',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // PWA를 위한 뷰포트 설정
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="dark" suppressHydrationWarning>
      <head>
        {/* PWA 관련 메타 태그 */}
        <meta name="application-name" content="CJ Gaming" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="CJ Gaming" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#8054f2" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        
        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      </head>
      <body 
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable
        )}
        suppressHydrationWarning
      >
        <AppProviders>
          {/* 메인 콘텐츠 */}
          <div className="relative flex min-h-screen flex-col">
            <div className="flex-1">
              {children}
            </div>
          </div>
          
          {/* Toast 알림 */}
          <Toaster 
            position="top-center"
            richColors
            closeButton
            expand={true}
            duration={4000}
          />
        </AppProviders>

        {/* 개발 환경에서만 표시되는 성능 메트릭 */}
        {process.env.NODE_ENV === 'development' && (
          <div id="__next-dev-overlay-container" />
        )}
      </body>
    </html>
  );
}