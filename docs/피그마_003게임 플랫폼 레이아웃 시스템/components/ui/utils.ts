// Simple className utility without external dependencies
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Mock user data for development
export const mockUser = {
  id: "1",
  username: "게이머",
  email: "gamer@example.com",
  level: 12,
  tokenBalance: 25000,
  avatar: undefined,
  stats: {
    gamesPlayed: 150,
    wins: 95,
    losses: 55,
    winRate: 63.3,
  },
};

// Mock games data
export const mockGames = [
  {
    id: "1",
    title: "테트리스 마스터",
    category: "퍼즐",
    thumbnail: "https://images.unsplash.com/photo-1606503153255-59d8b8b3e7c5?w=300&h=200&fit=crop",
    description: "클래식 테트리스 게임의 현대적 버전",
    isActive: true,
    playerCount: 1247,
    rating: 4.8,
    tags: ["퍼즐", "아케이드", "싱글플레이어"],
  },
  {
    id: "2", 
    title: "스페이스 슈터",
    category: "액션",
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop",
    description: "우주를 배경으로 한 액션 슈팅 게임",
    isActive: true,
    playerCount: 892,
    rating: 4.5,
    tags: ["액션", "슈팅", "멀티플레이어"],
  },
];