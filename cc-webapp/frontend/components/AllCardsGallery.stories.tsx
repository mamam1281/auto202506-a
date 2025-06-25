import type { Meta, StoryObj } from '@storybook/react';
import { FeedbackCard } from './Feedbackcard';
import { PointsCard } from './PointsCard';
import { ProfileCard } from './ProfileCard';
import { NotificationCard } from './NotificationCard';
import { RecentActivityCard } from './RecentActivityCard';
import { InputCard } from './Inputcard';
import { GameCard } from './GameCard';
import { GameStatsCard } from './Gamestatscard';
import { BaseCard } from './Basecard';

const meta: Meta = {
  title: 'Cards/All Cards Gallery',
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'app',
      values: [
        { name: 'app', value: '#F8FAFC' },
        { name: 'dark', value: '#1A202C' },
        { name: 'light', value: '#FFFFFF' }
      ],
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllCardsShowcase: Story = {
  render: () => (
    <div className="p-4 md:p-8 min-h-screen" style={{ backgroundColor: 'var(--color-neutral-50)' }}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
            카드 컴포넌트 갤러리
          </h1>
          <p className="text-base md:text-lg text-gray-600">
            모든 카드 컴포넌트를 한 번에 보고 비교할 수 있습니다
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {/* BaseCard 예시 */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 px-2">BaseCard</h3>
            <BaseCard className="w-full">
              <div className="p-4">
                <h4 className="font-medium mb-2">기본 카드</h4>
                <p className="text-sm text-muted-foreground">
                  모든 카드의 기본이 되는 컴포넌트입니다.
                </p>
              </div>
            </BaseCard>
          </div>

          {/* FeedbackCard 예시들 */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 px-2">FeedbackCard - Success</h3>
            <FeedbackCard
              type="success"
              title="성공!"
              message="작업이 성공적으로 완료되었습니다."
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 px-2">FeedbackCard - Error</h3>
            <FeedbackCard
              type="error"
              title="오류 발생"
              message="작업을 처리하는 중 오류가 발생했습니다."
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 px-2">FeedbackCard - Warning</h3>
            <FeedbackCard
              type="warning"
              title="주의"
              message="이 작업을 계속하시겠습니까?"
            />
          </div>

          {/* PointsCard */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 px-2">PointsCard</h3>
            <PointsCard
              currentPoints={12500}
              weeklyChange={325}
              rank={42}
              nextReward="프리미엄 아이템"
            />
          </div>

          {/* ProfileCard */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 px-2">ProfileCard</h3>
            <ProfileCard
              name="김철수"
              username="cheolsu_kim"
              level={15}
              experiencePoints={7500}
              maxExperience={10000}
              onViewProfile={() => {}}
              onSettings={() => {}}
            />
          </div>

          {/* NotificationCard */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 px-2">NotificationCard</h3>
            <NotificationCard
              title="새로운 알림"
              description="새로운 게임 업데이트가 있습니다!"
              actionText="확인"
              onAction={() => {}}
              onDismiss={() => {}}
            />
          </div>

          {/* RecentActivityCard */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 px-2">RecentActivityCard</h3>
            <RecentActivityCard
              activities={[
                { id: '1', type: 'game', title: '게임 플레이', description: '슬롯머신 게임 완료', timestamp: '5분 전' },
                { id: '2', type: 'achievement', title: '미션 완료', description: '일일 미션 달성', timestamp: '1시간 전' },
                { id: '3', type: 'message', title: '친구 초대', description: '새로운 친구 추가', timestamp: '3시간 전' }
              ]}
            />
          </div>

          {/* GameStatsCard */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 px-2">GameStatsCard</h3>
            <GameStatsCard
              gamesPlayed={127}
              winRate={73.2}
              bestScore={98765}
              totalPlayTime="45시간 12분"
            />
          </div>

          {/* InputCard */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 px-2">InputCard</h3>
            <InputCard
              title="사용자 입력"
              onSubmit={(data) => console.log('Form submitted:', data)}
            />
          </div>

          {/* GameCard */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 px-2">GameCard</h3>
            <GameCard
              id="slot-machine"
              title="슬롯 머신"
              rating={4.5}
              players="1,234"
              imagePlaceholder="슬롯머신 게임"
              onClick={() => {}}
            />
          </div>

          {/* 추가 BaseCard 변형들 */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 px-2">BaseCard - Accent</h3>
            <BaseCard variant="accent" className="w-full">
              <div className="p-4">
                <h4 className="font-medium mb-2" style={{ color: 'var(--color-accent-amber)' }}>
                  액센트 카드
                </h4>
                <p className="text-sm text-muted-foreground">
                  중요한 정보를 강조할 때 사용합니다.
                </p>
              </div>
            </BaseCard>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 px-2">BaseCard - Success</h3>
            <BaseCard variant="success" className="w-full">
              <div className="p-4">
                <h4 className="font-medium mb-2 text-green-700">
                  성공 카드
                </h4>
                <p className="text-sm text-muted-foreground">
                  성공적인 작업을 나타낼 때 사용합니다.
                </p>
              </div>
            </BaseCard>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 px-2">BaseCard - Error</h3>
            <BaseCard variant="error" className="w-full">
              <div className="p-4">
                <h4 className="font-medium mb-2 text-red-700">
                  에러 카드
                </h4>
                <p className="text-sm text-muted-foreground">
                  오류나 문제를 나타낼 때 사용합니다.
                </p>
              </div>
            </BaseCard>
          </div>
        </div>

        <div className="mt-12 p-6 bg-white rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            디자인 시스템 가이드라인
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-medium mb-2 text-gray-700">색상 시스템</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• 프라이머리: var(--color-primary-dark-navy)</li>
                <li>• 액센트: var(--color-accent-amber)</li>
                <li>• 중성: var(--color-neutral-50~900)</li>
                <li>• 의미색: 성공, 에러, 경고 색상</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2 text-gray-700">간격 시스템</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• 모바일 우선: p-4, gap-4</li>
                <li>• 데스크톱: md:p-6, md:gap-6</li>
                <li>• 그리드: grid-cols-1 md:grid-cols-2 lg:grid-cols-3</li>
                <li>• 반응형 텍스트: text-base md:text-lg</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const CompactGallery: Story = {
  render: () => (
    <div className="p-4 min-h-screen" style={{ backgroundColor: 'var(--color-neutral-50)' }}>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 text-center">
          카드 컴포넌트 간략 갤러리
        </h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <BaseCard className="w-full">
            <div className="p-3">
              <h4 className="text-sm font-medium">BaseCard</h4>
            </div>
          </BaseCard>

          <FeedbackCard
            type="success"
            title="성공"
            message="완료됨"
          />

          <PointsCard
            currentPoints={1250}
            weeklyChange={25}
            rank={10}
          />

          <GameStatsCard
            gamesPlayed={50}
            winRate={65.0}
            bestScore={15000}
            totalPlayTime="12시간"
          />

          <ProfileCard
            name="사용자"
            username="user123"
            level={5}
            experiencePoints={300}
            maxExperience={500}
          />

          <NotificationCard
            title="알림"
            description="새 업데이트"
            onAction={() => {}}
          />

          <InputCard
            title="입력 폼"
            onSubmit={() => {}}
          />

          <GameCard
            id="game1"
            title="게임"
            rating={4.0}
            players="100"
            imagePlaceholder="게임 이미지"
            onClick={() => {}}
          />

          <BaseCard variant="accent" className="w-full">
            <div className="p-3">
              <h4 className="text-sm font-medium">Accent</h4>
            </div>
          </BaseCard>
        </div>
      </div>
    </div>
  ),
};
