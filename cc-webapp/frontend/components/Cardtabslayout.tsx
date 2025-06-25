import { useState } from 'react';
import { ElegantTabs, ElegantTabsList, ElegantTabsTrigger, ElegantTabsContent } from '../tabs/ElegantTabs';
import { InputFormCard } from '../cards/InputFormCard';
import { FeedbackCard } from '../cards/FeedbackCard';
import { NotificationCard } from '../cards/NotificationCard';
import { PointsCard } from '../cards/PointsCard';
import { ProfileCard } from '../cards/ProfileCard';
import { RecentActivityCard } from '../cards/RecentActivityCard';
import { GameStatsCard } from '../cards/GameStatsCard';

import { 
  Home, 
  Gamepad2, 
  User, 
  Bell,
} from 'lucide-react';

interface CardTabsLayoutProps {
  recentActivities: Array<{
    id: string;
    type: 'game' | 'achievement' | 'message';
    title: string;
    description: string;
    timestamp: string;
  }>;
  onFormSubmit: (data: Record<string, string>) => void;
}

export function CardTabsLayout({ recentActivities, onFormSubmit }: CardTabsLayoutProps) {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="w-full max-w-7xl mx-auto">
      <ElegantTabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        
        {/* Elegant Tabs Navigation - 반응형 최적화 */}
        <div className="flex justify-center mb-8">
          <ElegantTabsList className="grid grid-cols-4 w-full max-w-lg md:max-w-2xl mx-4">
            <ElegantTabsTrigger value="dashboard" className="flex-1">
              <Home className="elegant-tab-icon" />
              <span className="hidden xs:inline md:inline text-xs md:text-sm elegant-tab-text">대시보드</span>
            </ElegantTabsTrigger>
            <ElegantTabsTrigger value="gaming" className="flex-1">
              <Gamepad2 className="elegant-tab-icon" />
              <span className="hidden xs:inline md:inline text-xs md:text-sm elegant-tab-text">게임</span>
            </ElegantTabsTrigger>
            <ElegantTabsTrigger value="profile" className="flex-1">
              <User className="elegant-tab-icon" />
              <span className="hidden xs:inline md:inline text-xs md:text-sm elegant-tab-text">프로필</span>
            </ElegantTabsTrigger>
            <ElegantTabsTrigger value="notifications" className="flex-1">
              <Bell className="elegant-tab-icon" />
              <span className="hidden xs:inline md:inline text-xs md:text-sm elegant-tab-text">알림</span>
            </ElegantTabsTrigger>
          </ElegantTabsList>
        </div>

        {/* Dashboard Tab */}
        <ElegantTabsContent value="dashboard">
          <div className="space-y-6">
            <div className="text-center px-4">
              <h2 className="text-slate-100 mb-2">대시보드</h2>
              <p className="text-slate-400 text-sm md:text-base">전체적인 활동 현황을 한눈에 확인하세요</p>
            </div>
            
            {/* 반응형 그리드: 모바일 1열, 태블릿 2열, 데스크톱 3-4열 */}
            <div className="space-y-4 px-4 md:grid md:grid-cols-2 md:gap-6 md:space-y-0 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8">
              <PointsCard
                currentPoints={12450}
                weeklyChange={320}
                rank={7}
                nextReward="프리미엄 아이템"
              />
              
              <GameStatsCard
                gamesPlayed={127}
                winRate={73.2}
                bestScore={98765}
                totalPlayTime="45시간 12분"
              />
              
              <RecentActivityCard activities={recentActivities} />
              
              <FeedbackCard
                type="success"
                title="일일 목표 달성!"
                message="오늘 목표를 모두 완료했습니다."
              />
            </div>
          </div>
        </ElegantTabsContent>

        {/* Gaming Tab */}
        <ElegantTabsContent value="gaming">
          <div className="space-y-6">
            <div className="text-center px-4">
              <h2 className="text-slate-100 mb-2">게임 센터</h2>
              <p className="text-slate-400 text-sm md:text-base">게임 통계와 성과를 확인하고 새로운 도전을 시작하세요</p>
            </div>
            
            <div className="space-y-4 px-4 md:grid md:grid-cols-2 md:gap-6 md:space-y-0 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8">
              <GameStatsCard
                gamesPlayed={127}
                winRate={73.2}
                bestScore={98765}
                totalPlayTime="45시간 12분"
              />
              
              <PointsCard
                currentPoints={8720}
                weeklyChange={-50}
                rank={15}
                nextReward="특별 배지"
              />
              
              <PointsCard
                currentPoints={15890}
                weeklyChange={450}
                rank={3}
                nextReward="레전더리 아이템"
              />
              
              <NotificationCard
                title="새로운 이벤트"
                description="한정 시간 챌린지가 시작되었습니다!"
                actionText="참여하기"
                onAction={() => console.log('Event joined')}
              />
              
              <RecentActivityCard activities={recentActivities.filter(activity => activity.type === 'game')} />
              
              <FeedbackCard
                type="warning"
                title="연속 플레이 주의"
                message="휴식을 취하는 것을 잊지 마세요."
              />
            </div>
          </div>
        </ElegantTabsContent>

        {/* Profile Tab */}
        <ElegantTabsContent value="profile">
          <div className="space-y-6">
            <div className="text-center px-4">
              <h2 className="text-slate-100 mb-2">프로필 관리</h2>
              <p className="text-slate-400 text-sm md:text-base">개인 정보와 계정 설정을 관리하세요</p>
            </div>
            
            <div className="space-y-4 px-4 md:grid md:grid-cols-2 md:gap-6 md:space-y-0 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8">
              <ProfileCard
                name="김게임"
                username="kimgamer123"
                level={25}
                experiencePoints={1200}
                maxExperience={1500}
                onViewProfile={() => console.log('View profile')}
                onSettings={() => console.log('Open settings')}
              />
              
              <InputFormCard 
                title="프로필 수정"
                onSubmit={onFormSubmit}
              />
              
              <InputFormCard 
                title="계정 설정"
                onSubmit={onFormSubmit}
              />
              
              <FeedbackCard
                type="info"
                title="프로필 완성도"
                message="프로필을 85% 완성했습니다!"
              />
              
              <RecentActivityCard activities={recentActivities.filter(activity => activity.type === 'achievement')} />
              
              <NotificationCard
                title="보안 알림"
                description="새로운 기기에서 로그인이 감지되었습니다"
                actionText="확인"
                onAction={() => console.log('Security check')}
                onDismiss={() => console.log('Security dismissed')}
              />
            </div>
          </div>
        </ElegantTabsContent>

        {/* Notifications Tab */}
        <ElegantTabsContent value="notifications">
          <div className="space-y-6">
            <div className="text-center px-4">
              <h2 className="text-slate-100 mb-2">알림 센터</h2>
              <p className="text-slate-400 text-sm md:text-base">모든 알림과 메시지를 한 곳에서 관리하세요</p>
            </div>
            
            <div className="space-y-4 px-4 md:grid md:grid-cols-2 md:gap-6 md:space-y-0 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8">
              <NotificationCard
                title="친구 요청"
                description="새로운 친구 요청이 3개 있습니다"
                actionText="확인하기"
                onAction={() => console.log('Friend requests viewed')}
                onDismiss={() => console.log('Friend request dismissed')}
              />
              
              <NotificationCard
                title="일일 보상"
                description="오늘의 로그인 보상을 받아보세요!"
                actionText="수령하기"
                onAction={() => console.log('Daily reward claimed')}
              />
              
              <NotificationCard
                title="업데이트 알림"
                description="새로운 기능이 추가되었습니다"
                actionText="자세히 보기"
                onAction={() => console.log('Update details viewed')}
                onDismiss={() => console.log('Update dismissed')}
              />
              
              <FeedbackCard
                type="success"
                title="메시지 전송 완료"
                message="친구에게 메시지를 성공적으로 보냈습니다."
              />
              
              <FeedbackCard
                type="error"
                title="연결 오류"
                message="서버 연결에 문제가 있습니다."
              />
              
              <FeedbackCard
                type="warning"
                title="저장 공간 부족"
                message="기기의 저장 공간이 부족합니다."
              />
              
              <RecentActivityCard activities={recentActivities.filter(activity => activity.type === 'message')} />
              
              <NotificationCard
                title="시스템 점검"
                description="내일 새벽 2시~4시 시스템 점검이 예정되어 있습니다"
                actionText="자세히"
                onAction={() => console.log('Maintenance details')}
              />
            </div>
          </div>
        </ElegantTabsContent>
        
      </ElegantTabs>
    </div>
  );
}