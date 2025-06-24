import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { Home, User, Settings, Bell, Star, Trophy, Gift } from 'lucide-react';
import Tabs, { TabItem } from './Tabs';
import Card from './Card';
import Button from './Button';
import Checkbox from './Checkbox';
import RadioButton from './RadioButton';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '복수의 관련 콘텐츠를 효율적으로 전환하여 보여주는 Tabs 컴포넌트입니다. 활성 탭에는 sliding underline 애니메이션이 적용됩니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    tabs: {
      control: false,
      description: '탭 아이템 배열',
    },
    activeTab: {
      control: 'text',
      description: '현재 활성 탭의 ID',
    },
    onTabChange: {
      control: false,
      description: '탭 변경 시 호출될 콜백',
    },
    className: {
      control: 'text',
      description: '전체 컨테이너에 적용될 추가 클래스',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 탭 데이터
const basicTabs: TabItem[] = [
  {
    id: 'home',
    label: '홈',
    content: (
      <div className="space-y-4">
        <h3 className="text-[var(--font-size-h3)] font-[var(--font-weight-semibold)]">홈 대시보드</h3>
        <p className="text-[var(--color-text-secondary)]">
          메인 대시보드 화면입니다. 여기에서 전체적인 현황을 확인할 수 있습니다.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Card title="오늘의 통계">
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--color-purple-primary)]">1,234</div>
              <div className="text-sm text-[var(--color-text-secondary)]">포인트</div>
            </div>
          </Card>
          <Card title="진행률">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">78%</div>
              <div className="text-sm text-[var(--color-text-secondary)]">완료</div>
            </div>
          </Card>
        </div>
      </div>
    ),
  },
  {
    id: 'profile',
    label: '프로필',
    content: (
      <div className="space-y-4">
        <h3 className="text-[var(--font-size-h3)] font-[var(--font-weight-semibold)]">사용자 프로필</h3>
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[var(--color-purple-primary)] rounded-full flex items-center justify-center">
              <User size={24} className="text-white" />
            </div>
            <div>
              <h4 className="font-semibold">게이머123</h4>
              <p className="text-[var(--color-text-secondary)] text-sm">레벨 42 • VIP 회원</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>총 게임 시간</span>
              <span className="font-semibold">247시간</span>
            </div>
            <div className="flex justify-between">
              <span>획득 트로피</span>
              <span className="font-semibold">89개</span>
            </div>
          </div>
        </Card>
      </div>
    ),
  },
  {
    id: 'settings',
    label: '설정',
    content: (
      <div className="space-y-4">
        <h3 className="text-[var(--font-size-h3)] font-[var(--font-weight-semibold)]">환경 설정</h3>
        <Card title="일반 설정">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>알림 받기</span>
              <Button variant="neon" size="md">켜기</Button>
            </div>
            <div className="flex items-center justify-between">
              <span>자동 로그인</span>
              <Button variant="outline" size="md">끄기</Button>
            </div>
            <div className="flex items-center justify-between">
              <span>다크 모드</span>
              <Button variant="neon" size="md">켜기</Button>
            </div>
          </div>
        </Card>
      </div>
    ),
  },
];

// 기본 탭스
export const Default: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('home');
    
    return (
      <div className="w-full max-w-4xl">
        <Tabs
          tabs={basicTabs}
          activeTab={activeTab}
          onTabChange={(tabId) => {
            setActiveTab(tabId);
            action('tab changed')(tabId);
          }}
        />
      </div>
    );
  },
};

// 게임 관련 탭스
export const GameTabs: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('games');
    
    const gameTabs: TabItem[] = [
      {
        id: 'games',
        label: '게임',
        content: (
          <div className="space-y-4">
            <h3 className="text-[var(--font-size-h3)] font-[var(--font-weight-semibold)]">인기 게임</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card title="슬롯 머신" onClick={action('slot clicked')}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                    <Star size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">클래식 슬롯</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">잭팟: 1,000,000</p>
                  </div>
                </div>
              </Card>
              
              <Card title="룰렛" onClick={action('roulette clicked')}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white rounded-full" />
                  </div>
                  <div>
                    <p className="font-semibold">유럽식 룰렛</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">최고 배율: 35:1</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        ),
      },
      {
        id: 'leaderboard',
        label: '순위',
        content: (
          <div className="space-y-4">
            <h3 className="text-[var(--font-size-h3)] font-[var(--font-weight-semibold)]">리더보드</h3>
            <Card>
              <div className="space-y-3">
                {[
                  { rank: 1, name: '프로게이머', score: 99999, icon: '🥇' },
                  { rank: 2, name: '게임마스터', score: 95432, icon: '🥈' },
                  { rank: 3, name: '럭키플레이어', score: 87654, icon: '🥉' },
                ].map((player) => (
                  <div key={player.rank} className="flex items-center justify-between p-3 bg-[var(--card)]/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{player.icon}</span>
                      <div>
                        <p className="font-semibold">{player.name}</p>
                        <p className="text-sm text-[var(--color-text-secondary)]">#{player.rank}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[var(--color-purple-primary)]">{player.score.toLocaleString()}</p>
                      <p className="text-xs text-[var(--color-text-secondary)]">포인트</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ),
      },
      {
        id: 'rewards',
        label: '보상',
        content: (
          <div className="space-y-4">
            <h3 className="text-[var(--font-size-h3)] font-[var(--font-weight-semibold)]">일일 보상</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { day: 1, reward: '100 코인', claimed: true },
                { day: 2, reward: '200 코인', claimed: true },
                { day: 3, reward: '프리스핀 5회', claimed: false },
                { day: 4, reward: '500 코인', claimed: false },
              ].map((item) => (
                <Card 
                  key={item.day} 
                  className={`text-center p-4 ${item.claimed ? 'opacity-50' : ''}`}
                  onClick={!item.claimed ? action(`day ${item.day} claimed`) : undefined}
                >
                  <div className="space-y-2">
                    <div className="w-8 h-8 bg-[var(--color-purple-primary)] rounded-full flex items-center justify-center mx-auto">
                      <Gift size={16} className="text-white" />
                    </div>
                    <p className="text-sm font-semibold">Day {item.day}</p>
                    <p className="text-xs text-[var(--color-text-secondary)]">{item.reward}</p>
                    {item.claimed && (
                      <p className="text-xs text-green-400">완료</p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ),
      },
    ];
    
    return (
      <div className="w-full max-w-5xl">
        <Tabs
          tabs={gameTabs}
          activeTab={activeTab}
          onTabChange={(tabId) => {
            setActiveTab(tabId);
            action('game tab changed')(tabId);
          }}
        />
      </div>
    );
  },
};

// 간단한 텍스트 탭
export const SimpleTabs: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('tab1');
    
    const simpleTabs: TabItem[] = [
      {
        id: 'tab1',
        label: '첫 번째',
        content: (
          <div className="p-6 text-center">
            <h4 className="text-lg font-semibold mb-2">첫 번째 탭</h4>
            <p className="text-[var(--color-text-secondary)]">
              첫 번째 탭의 내용입니다. sliding underline 애니메이션을 확인해보세요.
            </p>
          </div>
        ),
      },
      {
        id: 'tab2',
        label: '두 번째',
        content: (
          <div className="p-6 text-center">
            <h4 className="text-lg font-semibold mb-2">두 번째 탭</h4>
            <p className="text-[var(--color-text-secondary)]">
              두 번째 탭의 내용입니다. 탭을 전환할 때 부드러운 애니메이션이 적용됩니다.
            </p>
          </div>
        ),
      },
      {
        id: 'tab3',
        label: '세 번째',
        content: (
          <div className="p-6 text-center">
            <h4 className="text-lg font-semibold mb-2">세 번째 탭</h4>
            <p className="text-[var(--color-text-secondary)]">
              세 번째 탭의 내용입니다. 콘텐츠 전환 시 opacity와 y축 이동 애니메이션이 적용됩니다.
            </p>
          </div>
        ),
      },
    ];
    
    return (
      <div className="w-full max-w-2xl">
        <Tabs
          tabs={simpleTabs}
          activeTab={activeTab}
          onTabChange={(tabId) => {
            setActiveTab(tabId);
            action('simple tab changed')(tabId);
          }}
        />
      </div>
    );
  },
};

// 많은 탭이 있는 경우
export const ManyTabs: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('tab1');
    
    const manyTabs: TabItem[] = Array.from({ length: 8 }, (_, index) => ({
      id: `tab${index + 1}`,
      label: `탭 ${index + 1}`,
      content: (
        <div className="p-6 text-center">
          <h4 className="text-lg font-semibold mb-2">탭 {index + 1}</h4>
          <p className="text-[var(--color-text-secondary)]">
            {index + 1}번째 탭의 내용입니다. 많은 탭이 있어도 sliding underline이 정확하게 위치합니다.
          </p>
        </div>
      ),
    }));
    
    return (
      <div className="w-full max-w-4xl">
        <Tabs
          tabs={manyTabs}
          activeTab={activeTab}
          onTabChange={(tabId) => {
            setActiveTab(tabId);
            action('many tabs changed')(tabId);
          }}
        />
      </div>
    );
  },
};

// 커스텀 스타일 적용
export const CustomStyled: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('info');
    
    const customTabs: TabItem[] = [
      {
        id: 'info',
        label: '정보',
        content: (
          <Card title="사용자 정보">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>이름</span>
                <span className="font-semibold">김게이머</span>
              </div>
              <div className="flex justify-between">
                <span>레벨</span>
                <span className="font-semibold">42</span>
              </div>
              <div className="flex justify-between">
                <span>경험치</span>
                <span className="font-semibold">8,750 / 10,000</span>
              </div>
            </div>
          </Card>
        ),
      },
      {
        id: 'achievements',
        label: '업적',
        content: (
          <Card title="최근 업적">
            <div className="space-y-3">
              {[
                { name: '첫 승리', desc: '첫 번째 게임에서 승리', completed: true },
                { name: '연승왕', desc: '5연승 달성', completed: true },
                { name: '행운의 여신', desc: '잭팟 1회 달성', completed: false },
              ].map((achievement) => (
                <div key={achievement.name} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    achievement.completed ? 'bg-yellow-500' : 'bg-gray-600'
                  }`}>
                    <Trophy size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">{achievement.name}</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">{achievement.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ),
      },
    ];
    
    return (
      <div className="w-full max-w-3xl">
        <Tabs
          tabs={customTabs}
          activeTab={activeTab}
          onTabChange={(tabId) => {
            setActiveTab(tabId);
            action('custom tab changed')(tabId);
          }}
          className="bg-[var(--card)]/30 p-4 rounded-[var(--radius-lg)]"
          tabListClassName="border-b-2 border-[var(--color-purple-primary)]/30"
          tabContentClassName="mt-6"
        />
      </div>
    );
  },
};
