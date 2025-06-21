import { Metadata } from 'next';
import SlotGameClient from './slot-game-client';

export const metadata: Metadata = {
  title: 'Royal Slots - Premium Casino Game',
  description: 'Experience the thrill of premium slot machine gaming with Royal Slots. Win big with our exciting jackpots and stunning graphics.',
  keywords: ['slot machine', 'casino', 'gambling', 'jackpot', 'online casino'],
  authors: [{ name: 'Royal Slots Team' }],
  openGraph: {
    title: 'Royal Slots - Premium Casino Game',
    description: 'Experience the thrill of premium slot machine gaming',
    type: 'website',
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
    description: 'Experience the thrill of premium slot machine gaming'
  }
};

export default function HomePage() {
  return <SlotGameClient />;
}