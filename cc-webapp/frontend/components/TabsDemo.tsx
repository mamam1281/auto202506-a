import React, { useState } from 'react';
import Tabs, { TabItem } from './Tabs';
import { BaseCard } from './Basecard';
import Button from './Button';
import Checkbox from './Checkbox';
import RadioButton from './RadioButton';
import { Home, User, Settings, Bell, Star } from 'lucide-react';

// Card 컴포넌트를 BaseCard로 래핑
const Card = ({ title, children, className, ...props }: { 
  title?: string; 
  children: React.ReactNode; 
  className?: string; 
}) => (
  <BaseCard className={className} {...props}>
    <div className="space-y-4">
      {title && (
        <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
      )}
      <div>{children}</div>
    </div>
  </BaseCard>
);

const TabsDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  
  // 체크박스 상태
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [autoSave, setAutoSave] = useState(false);
  
  // 라디오 버튼 상태
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('ko');

  const tabItems: TabItem[] = [
    {
      id: 'home',
      label: '홈',
      content: (
        <div className="space-y-[var(--spacing-4)]">
          <Card title="오늘의 제안">
            <p className="text-[var(--foreground)] text-[var(--font-size-body)]">
              새로운 게임을 체험해보세요! 특별 보너스가 기다립니다.
            </p>
            <div className="flex gap-[var(--spacing-2)] pt-[var(--spacing-2)]">
              <Button variant="primary" size="md">확인하기</Button>
              <Button variant="outline" size="md">나중에</Button>
            </div>
          </Card>
          
          <Card title="최근 활동">
            <div className="space-y-[var(--spacing-2)]">
              <div className="flex justify-between items-center">
                <span className="text-[var(--foreground)] text-[13px]">슬롯 게임</span>
                <span className="text-[var(--color-text-secondary)] text-[12px]">10분 전</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--foreground)] text-[13px]">카드 게임</span>
                <span className="text-[var(--color-text-secondary)] text-[12px]">1시간 전</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--foreground)] text-[13px]">룰렛</span>
                <span className="text-[var(--color-text-secondary)] text-[12px]">어제</span>
              </div>
            </div>
          </Card>
        </div>
      )
    },
    {
      id: 'profile',
      label: '프로필',
      content: (
        <div className="space-y-[var(--spacing-4)]">
          <Card title="사용자 정보">
            <div className="space-y-[var(--spacing-2)]">
              <div className="flex justify-between items-center">
                <span className="text-[var(--foreground)] text-[13px]">이름</span>
                <span className="text-[var(--color-text-secondary)] text-[13px]">홍길동</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--foreground)] text-[13px]">레벨</span>
                <span className="text-[var(--color-purple-primary)] text-[13px] font-medium">레벨 15</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--foreground)] text-[13px]">포인트</span>
                <span className="text-[var(--color-accent-green)] text-[13px] font-medium">1,250 P</span>
              </div>
            </div>
          </Card>
          
          <Card title="업적">
            <div className="space-y-[var(--spacing-2)]">
              <div className="flex items-center gap-[var(--spacing-2)]">
                <Star className="w-4 h-4 text-[var(--color-accent-yellow)]" />
                <span className="text-[var(--foreground)] text-[13px]">첫 승리</span>
              </div>
              <div className="flex items-center gap-[var(--spacing-2)]">
                <Star className="w-4 h-4 text-[var(--color-accent-yellow)]" />
                <span className="text-[var(--foreground)] text-[13px]">연속 플레이 7일</span>
              </div>
              <div className="flex items-center gap-[var(--spacing-2)]">
                <Star className="w-4 h-4 text-[var(--color-text-secondary)]" />
                <span className="text-[var(--color-text-secondary)] text-[13px]">대박 달성 (진행중)</span>
              </div>
            </div>
          </Card>
        </div>
      )
    },
    {
      id: 'settings',
      label: '설정',
      content: (
        <div className="space-y-[var(--spacing-4)]">
          <Card title="알림 설정">
            <div className="space-y-[var(--spacing-2)]">
              <Checkbox
                checked={pushNotifications}
                onChange={setPushNotifications}
                label="푸시 알림"
              />
              <Checkbox
                checked={emailNotifications}
                onChange={setEmailNotifications}
                label="이메일 알림"
              />
              <div className="flex justify-between items-center">
                <span className="text-[var(--foreground)] text-[13px] leading-normal">소리</span>
                <Checkbox
                  checked={darkMode}
                  onChange={setDarkMode}
                />
              </div>
            </div>
          </Card>
          
          <Card title="테마 설정">
            <div className="space-y-[var(--spacing-2)]">
              <RadioButton
                name="theme"
                value="light"
                checked={theme === 'light'}
                onChange={setTheme}
                label="라이트 모드"
              />
              <RadioButton
                name="theme"
                value="dark"
                checked={theme === 'dark'}
                onChange={setTheme}
                label="다크 모드"
              />
              <RadioButton
                name="theme"
                value="auto"
                checked={theme === 'auto'}
                onChange={setTheme}
                label="시스템 설정에 따라"
              />
            </div>
          </Card>
          
          <Card title="언어 설정">
            <div className="space-y-[var(--spacing-2)]">
              <RadioButton
                name="language"
                value="ko"
                checked={language === 'ko'}
                onChange={setLanguage}
                label="한국어"
              />
              <RadioButton
                name="language"
                value="en"
                checked={language === 'en'}
                onChange={setLanguage}
                label="English"
              />
              <RadioButton
                name="language"
                value="ja"
                checked={language === 'ja'}
                onChange={setLanguage}
                label="日本語"
              />
            </div>
          </Card>
        </div>
      )
    }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Tabs
        tabs={tabItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
};

export default TabsDemo;
