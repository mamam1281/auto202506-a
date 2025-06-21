import { Metadata, Viewport } from 'next';
import { Exo } from 'next/font/google';
import '../styles/globals.css';

const exo = Exo({
  subsets: ['latin'],
  variable: '--font-exo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '가위바위보 | Rock Paper Scissors',
  description: '최고의 가위바위보 게임을 경험해보세요. 세련된 네온 UI와 부드러운 애니메이션으로 즐기는 현대적인 게임입니다.',
  keywords: ['가위바위보', 'rock paper scissors', '게임', 'game', 'AI', '온라인게임'],
  authors: [{ name: 'RPS Game Team' }],
  creator: 'RPS Game Team',
  publisher: 'RPS Game Team',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://rps-game.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://rps-game.vercel.app',
    title: '가위바위보 | Rock Paper Scissors',
    description: '최고의 가위바위보 게임을 경험해보세요. 세련된 네온 UI와 부드러운 애니메이션으로 즐기는 현대적인 게임입니다.',
    siteName: '가위바위보 게임',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '가위바위보 게임 썸네일',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '가위바위보 | Rock Paper Scissors',
    description: '최고의 가위바위보 게임을 경험해보세요.',
    images: ['/og-image.png'],
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
  verification: {
    google: 'your-google-site-verification',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f0f0f' },
  ],
  colorScheme: 'dark light',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko" className={`${exo.variable} dark`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="가위바위보" />
        <meta name="application-name" content="가위바위보" />
        <meta name="msapplication-TileColor" content="#7b29cd" />
        <meta name="theme-color" content="#0f0f0f" />
      </head>
      <body 
        className="antialiased font-exo bg-background text-foreground"
        suppressHydrationWarning
      >
        <div id="root">
          {children}
        </div>
        <div id="portal-root" />
        <div id="toast-root" />
      </body>
    </html>
  );
}