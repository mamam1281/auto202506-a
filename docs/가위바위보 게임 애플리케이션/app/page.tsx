import { Suspense } from 'react';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

// Dynamic import로 클라이언트 컴포넌트 지연 로딩
const RPSGame = dynamic(() => import('@/components/RPSGame').then(mod => ({ default: mod.RPSGame })), {
  ssr: false,
  loading: () => <LoadingSkeleton />,
});

export const metadata: Metadata = {
  title: '가위바위보 게임 | 온라인 무료 게임',
  description: 'AI와 함께하는 최고의 가위바위보 게임! 실시간 점수 추적, 멋진 애니메이션, 반응형 디자인으로 언제 어디서나 즐겨보세요.',
  alternates: {
    canonical: '/',
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<LoadingSkeleton />}>
        <RPSGame />
      </Suspense>
    </main>
  );
}