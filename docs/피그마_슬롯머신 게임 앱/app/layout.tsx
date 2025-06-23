import type { Metadata, Viewport } from 'next';
import { Inter, Exo, IBM_Plex_Sans_KR, Epilogue } from 'next/font/google';
import '../styles/globals.css';

// 폰트 최적화
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

const exo = Exo({ 
  subsets: ['latin'],
  variable: '--font-exo',
  display: 'swap'
});

const ibmPlexSansKR = IBM_Plex_Sans_KR({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex-sans-kr',
  display: 'swap'
});

const epilogue = Epilogue({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-epilogue',
  display: 'swap'
});

export const metadata: Metadata = {
  title: {
    default: 'Royal Slots - Premium Casino Game',
    template: '%s | Royal Slots'
  },
  description: 'Experience the thrill of premium slot machine gaming with Royal Slots. Win big with our exciting jackpots and stunning graphics.',
  keywords: ['slot machine', 'casino', 'gambling', 'jackpot', 'online casino', 'Royal Slots'],
  authors: [{ name: 'Royal Slots Team' }],
  creator: 'Royal Slots Team',
  publisher: 'Royal Slots',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://royal-slots.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    title: 'Royal Slots - Premium Casino Game',
    description: 'Experience the thrill of premium slot machine gaming',
    siteName: 'Royal Slots',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Royal Slots Casino Game'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Royal Slots - Premium Casino Game',
    description: 'Experience the thrill of premium slot machine gaming',
    images: ['/twitter-image.png']
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
    google: 'your-google-verification-code',
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="ko" 
      className={`${inter.variable} ${exo.variable} ${ibmPlexSansKR.variable} ${epilogue.variable} dark`}
    >
      <body className="antialiased min-h-screen bg-background text-foreground">
        <div id="__next">
          {children}
        </div>
        <div id="portal-root" />
      </body>
    </html>
  );
}