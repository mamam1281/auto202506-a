import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { 
  Search, 
  Bell, 
  User, 
  Settings, 
  Plus, 
  Download,
  Upload,
  BarChart3,
  Users,
  ShoppingCart,
  TrendingUp,
  Filter,
  MoreVertical
} from 'lucide-react';

interface DashboardStats {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
}

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const stats: DashboardStats[] = [
    {
      title: '총 매출',
      value: '₩2,450,000',
      change: '+12.5%',
      isPositive: true,
      icon: <TrendingUp />
    },
    {
      title: '신규 고객',
      value: '324',
      change: '+8.2%',
      isPositive: true,
      icon: <Users />
    },
    {
      title: '주문 수',
      value: '1,234',
      change: '-2.1%',
      isPositive: false,
      icon: <ShoppingCart />
    },
    {
      title: '전환율',
      value: '3.2%',
      change: '+0.5%',
      isPositive: true,
      icon: <BarChart3 />
    }
  ];

  const recentActivities = [
    { id: 1, action: '새 주문이 접수되었습니다', time: '2분 전', type: 'order' },
    { id: 2, action: '고객이 회원가입했습니다', time: '5분 전', type: 'user' },
    { id: 3, action: '상품 리뷰가 등록되었습니다', time: '12분 전', type: 'review' },
    { id: 4, action: '결제가 완료되었습니다', time: '18분 전', type: 'payment' },
  ];

  const handleExport = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('데이터 내보내기 완료');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      
      {/* 상단 네비게이션 */}
      <header className="safe-top bg-[#2d2d2d] border-b border-[#333333]">
        <div className="container-responsive">
          <div className="flex items-center justify-between py-grid-2">
            
            {/* 로고 & 타이틀 */}
            <div className="flex items-center gap-grid-3">
              <h1 className="font-['Exo'] font-bold">대시보드</h1>
            </div>

            {/* 검색 & 액션 */}
            <div className="flex items-center gap-grid-2">
              <div className="hidden md:flex items-center gap-grid-2">
                <Input
                  variant="search"
                  size="sm"
                  placeholder="검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64"
                />
              </div>
              
              <Button variant="outline" size="sm" icon={<Bell />} iconOnly />
              <Button variant="outline" size="sm" icon={<User />} iconOnly />
              <Button variant="outline" size="sm" icon={<Settings />} iconOnly />
            </div>
          </div>
        </div>
      </header>

      <main className="safe-bottom">
        <div className="container-responsive py-grid-3">
          
          {/* 페이지 헤더 */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-grid-2 mb-grid-4">
            <div>
              <h2 className="font-['Exo'] font-semibold mb-1">
                안녕하세요, 홍길동님! 👋
              </h2>
              <p className="text-[#D1D5DB] font-['Exo']">
                오늘의 비즈니스 현황을 확인해보세요
              </p>
            </div>
            
            <div className="flex gap-grid-2">
              <Button
                variant="outline"
                size="md"
                icon={<Download />}
                loading={isLoading}
                onClick={handleExport}
              >
                데이터 내보내기
              </Button>
              <Button
                variant="gradient"
                size="md"
                icon={<Plus />}
              >
                새 프로젝트
              </Button>
            </div>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-grid-3 mb-grid-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-[#2d2d2d] rounded-xl p-grid-3 border border-[#333333] hover:border-[#444444] transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[#D1D5DB] text-sm font-['Exo']">
                    {stat.title}
                  </div>
                  <div className="text-[#7C3AED]">
                    {stat.icon}
                  </div>
                </div>
                <div className="font-['Exo'] font-bold text-xl mb-1">
                  {stat.value}
                </div>
                <div className={`text-sm font-['Exo'] ${
                  stat.isPositive ? 'text-[#10B981]' : 'text-[#B90C29]'
                }`}>
                  {stat.change} 지난 주 대비
                </div>
              </div>
            ))}
          </div>

          {/* 메인 콘텐츠 그리드 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-grid-4">
            
            {/* 차트 영역 */}
            <div className="lg:col-span-2">
              <div className="bg-[#2d2d2d] rounded-xl p-grid-3 border border-[#333333]">
                <div className="flex items-center justify-between mb-grid-3">
                  <h3 className="font-['Exo'] font-medium">매출 추이</h3>
                  <div className="flex gap-grid-1">
                    <Button variant="outline" size="sm" icon={<Filter />} iconOnly />
                    <Button variant="outline" size="sm" icon={<MoreVertical />} iconOnly />
                  </div>
                </div>
                
                {/* 차트 플레이스홀더 */}
                <div className="h-64 bg-[#1a1a1a] rounded-lg border border-[#333333] flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="mx-auto mb-2 text-[#7C3AED]" size={32} />
                    <p className="text-[#D1D5DB] text-sm font-['Exo']">
                      차트 데이터 로딩 중...
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 최근 활동 */}
            <div className="bg-[#2d2d2d] rounded-xl p-grid-3 border border-[#333333]">
              <div className="flex items-center justify-between mb-grid-3">
                <h3 className="font-['Exo'] font-medium">최근 활동</h3>
                <Button variant="text" size="sm">
                  전체 보기
                </Button>
              </div>
              
              <div className="space-y-grid-2">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-grid-2 p-grid-2 rounded-lg hover:bg-[#1a1a1a] transition-colors"
                  >
                    <div className="w-2 h-2 bg-[#7C3AED] rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-['Exo'] text-[#D1D5DB] mb-1">
                        {activity.action}
                      </p>
                      <p className="text-xs text-[#A0A0A0] font-['Exo']">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 액션 영역 */}
          <div className="mt-grid-4">
            <div className="bg-[#2d2d2d] rounded-xl p-grid-3 border border-[#333333]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-grid-3">
                <div>
                  <h3 className="font-['Exo'] font-medium mb-1">
                    빠른 액션
                  </h3>
                  <p className="text-[#D1D5DB] text-sm font-['Exo']">
                    자주 사용하는 기능들에 빠르게 접근하세요
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-grid-2">
                  <Button variant="primary" size="md" icon={<Upload />}>
                    데이터 업로드
                  </Button>
                  <Button variant="success" size="md" icon={<Plus />}>
                    상품 추가
                  </Button>
                  <Button variant="info" size="md" icon={<Users />}>
                    고객 관리
                  </Button>
                  <Button variant="outline" size="md" icon={<Settings />}>
                    설정
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}