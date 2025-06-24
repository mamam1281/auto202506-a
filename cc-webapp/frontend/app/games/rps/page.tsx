import { Suspense } from 'react';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import LoadingSkeleton from '@/components/LoadingSkeleton'; // Adjusted path

// Dynamically import the RPSGame component for client-side rendering
const RPSGame = dynamic(() =>
  import('@/components/games/rps/RPSGame').then(mod => mod.RPSGame),
  {
    ssr: false, // Ensure it's client-side only
    loading: () => <LoadingSkeleton />,
  }
);

export const metadata: Metadata = {
  title: '가위바위보 네온 | CyberConnect Dopamine Games',
  description: '최첨단 AI와 함께 짜릿한 네온 테마의 가위바위보 게임을 즐겨보세요! 실시간 점수, 화려한 애니메이션, 몰입감 넘치는 경험이 당신을 기다립니다.',
  keywords: '가위바위보, RPS, AI게임, 네온게임, 웹게임, CyberConnect, Dopamine Games',
  alternates: {
    canonical: '/games/rps', // Assuming this will be the canonical path
  },
  openGraph: {
    title: '가위바위보 네온 | CyberConnect Dopamine Games',
    description: '최첨단 AI와 함께 짜릿한 네온 테마의 가위바위보 게임을 즐겨보세요!',
    type: 'website',
    url: 'https://yourdomain.com/games/rps', // Replace with actual domain
    // images: [ // TODO: Add a suitable image for social sharing
    //   {
    //     url: 'https://yourdomain.com/images/rps-og-image.jpg',
    //     width: 1200,
    //     height: 630,
    //     alt: '가위바위보 네온 게임',
    //   },
    // ],
  },
};

export default function RockPaperScissorsPage() {
  return (
    // The main layout (header, footer, nav) would typically be in a LayoutWrapper or app/layout.tsx
    // This page component just renders the game part.
    // min-h-screen is good if this page is standalone, might be inherited from a global layout.
    <main className="min-h-screen bg-background text-foreground">
      <Suspense fallback={<LoadingSkeleton />}>
        <RPSGame />
      </Suspense>
    </main>
  );
}
