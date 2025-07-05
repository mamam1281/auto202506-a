'use client';

import { useRouter } from 'next/navigation';
import './games-premium-theme.css';

interface GameCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  gradient: string;
  available: boolean;
}

const GAMES: GameCard[] = [
  {
    id: 'slots',
    title: '슬롯 머신',
    description: '행운의 릴을 돌려 대박을 터뜨리세요!',
    icon: '🎰',
    route: '/games/slots/popup',
    gradient: 'from-purple-600 to-pink-600',
    available: true,
  },
  {
    id: 'rps',
    title: '가위바위보',
    description: 'AI와 함께하는 클래식 가위바위보!',
    icon: '✂️',
    route: '/games/rps/popup',
    gradient: 'from-blue-600 to-cyan-600',
    available: true,
  },
  {
    id: 'gacha',
    title: '가챠 시스템',
    description: '신비로운 아이템을 뽑아보세요!',
    icon: '📦',
    route: '/gacha/popup',
    gradient: 'from-yellow-600 to-orange-600',
    available: true,
  },
  {
    id: 'blackjack',
    title: '블랙잭',
    description: '21에 가장 가까운 카드로 승부하세요!',
    icon: '🃏',
    route: '/games/blackjack/popup',
    gradient: 'from-red-600 to-rose-600',
    available: false,
  },
  {
    id: 'poker',
    title: '포커',
    description: '최고의 패를 만들어 승리하세요!',
    icon: '🎯',
    route: '/games/poker/popup',
    gradient: 'from-green-600 to-emerald-600',
    available: false,
  },
  {
    id: 'dice',
    title: '주사위 게임',
    description: '운명의 주사위를 던져보세요!',
    icon: '🎲',
    route: '/games/dice/popup',
    gradient: 'from-indigo-600 to-purple-600',
    available: false,
  },
];

export default function GamesPage() {
  const router = useRouter();

  const handleGameClick = (game: GameCard) => {
    if (game.available) {
      router.push(game.route);
    }
  };

  return (
    <div className="games-container">
      <div className="games-header">
        <h1 className="games-title">게임 목록</h1>
        <p className="games-subtitle">다양한 게임을 즐겨보세요!</p>
      </div>

      <div className="games-grid">
        {GAMES.map((game) => (
          <div
            key={game.id}
            className={`game-card ${game.available ? 'available' : 'unavailable'}`}
            data-game={game.id}
            onClick={() => handleGameClick(game)}
          >
            <div className="game-card-inner">
              <div className="game-icon">
                {game.icon}
              </div>
              <div className="game-info">
                <h3 className="game-title">{game.title}</h3>
                <p className="game-description">{game.description}</p>
              </div>
              {!game.available && (
                <div className="coming-soon-badge">
                  Coming Soon
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
