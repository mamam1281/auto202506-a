import React, { useState } from 'react';
import Checkbox from './Checkbox';
import RadioButton from './RadioButton';
import { BaseCard } from './Basecard';

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

const SettingsDemo: React.FC = () => {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [analytics, setAnalytics] = useState(true);
  
  const [theme, setTheme] = useState('dark');  return (
    <div className="space-y-6 p-4">
      {/* 체크박스 설정 섹션 */}
      <Card title="알림 설정">
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-border/20 last:border-b-0">
            <span className="text-card-foreground text-body font-medium">푸시 알림</span>
            <Checkbox checked={pushNotifications} onChange={setPushNotifications} />
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border/20 last:border-b-0">
            <span className="text-card-foreground text-body font-medium">이메일 알림</span>
            <Checkbox checked={darkMode} onChange={setDarkMode} />
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border/20 last:border-b-0">
            <span className="text-card-foreground text-body font-medium">자동 저장</span>
            <Checkbox checked={autoSave} onChange={setAutoSave} />
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-card-foreground text-body font-medium">분석 데이터 수집</span>
            <Checkbox checked={analytics} onChange={setAnalytics} />
          </div>
        </div>
      </Card>      {/* 라디오 버튼 테마 설정 섹션 */}
      <Card title="테마 설정">
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-border/20">
            <RadioButton
              name="theme"
              value="light"
              checked={theme === 'light'}
              onChange={setTheme}
              label="라이트 모드"
            />
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border/20">
            <RadioButton
              name="theme"
              value="dark"
              checked={theme === 'dark'}
              onChange={setTheme}
              label="다크 모드"
            />
          </div>
          <div className="flex items-center justify-between py-2">
            <RadioButton
              name="theme"
              value="auto"
              checked={theme === 'auto'}
              onChange={setTheme}
              label="시스템 설정에 따라"
            />
          </div>
        </div>
      </Card>

      {/* 고급 설정 섹션 */}
      <Card title="고급 설정">
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-border/20">
            <span className="text-card-foreground text-body font-medium">데이터 절약 모드</span>
            <Checkbox 
              checked={pushNotifications} 
              onChange={setPushNotifications} 
            />
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border/20">
            <span className="text-card-foreground text-body font-medium">백그라운드 동기화</span>
            <Checkbox 
              checked={autoSave} 
              onChange={setAutoSave} 
            />          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-card-foreground text-body font-medium">알림음</span>
            <Checkbox 
              checked={analytics} 
              onChange={setAnalytics} 
            />
          </div>
        </div>
      </Card>

      {/* 개인정보 동의 섹션 */}
      <Card title="개인정보 동의">
        <div className="space-y-4">
          <div className="flex items-start gap-3 py-2 border-b border-border/20">
            <Checkbox 
              checked={pushNotifications} 
              onChange={setPushNotifications} 
            />
            <span className="text-card-foreground text-body font-medium leading-body">
              마케팅 이메일 수신 동의
            </span>
          </div>
          <div className="flex items-start gap-3 py-2 border-b border-border/20">
            <Checkbox 
              checked={darkMode} 
              onChange={setDarkMode} 
            />
            <span className="text-card-foreground text-body font-medium leading-body">
              개인정보 수집 및 이용 동의 <span className="text-destructive text-caption">(필수)</span>
            </span>
          </div>
          <div className="flex items-start gap-3 py-2 border-b border-border/20">
            <Checkbox 
              checked={autoSave} 
              onChange={setAutoSave} 
            />
            <span className="text-card-foreground text-body font-medium leading-body">
              서비스 약관 동의
            </span>          </div>
          <div className="flex items-start gap-3 py-2">
            <Checkbox 
              checked={analytics} 
              onChange={setAnalytics} 
            />
            <div className="flex-1">
              <span className="text-card-foreground text-body font-medium leading-body">
                선택적 기능 이용 동의
              </span>
              <p className="text-muted-foreground text-caption mt-1 leading-caption">
                더 나은 서비스 제공을 위해 사용됩니다
              </p>
            </div>
          </div>
        </div>
      </Card>
        
      {/* 반응형 그리드 테스트 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="카드 1">
          <p className="text-muted-foreground text-body leading-body">
            모바일에서 2열로 표시되는 카드입니다.
          </p>
        </Card>
        <Card title="카드 2">
          <p className="text-muted-foreground text-body leading-body">
            태블릿에서 3열, 데스크톱에서 4열로 변경됩니다.
          </p>
        </Card>
        <Card title="카드 3">
          <p className="text-muted-foreground text-body leading-body">
            카드 크기가 그리드에 맞춰 유연하게 조정됩니다.
          </p>
        </Card>
        <Card title="카드 4">
          <p className="text-muted-foreground text-body leading-body">
            CSS Variables를 완전히 준수한 반응형 레이아웃입니다.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default SettingsDemo;
