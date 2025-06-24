import React, { useState } from 'react';
import Checkbox from './Checkbox';
import RadioButton from './RadioButton';
import Card from './Card';

const SettingsDemo: React.FC = () => {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [analytics, setAnalytics] = useState(true);
  
  const [theme, setTheme] = useState('dark');

  return (
    <div className="space-y-6">      {/* 체크박스 설정 섹션 */}
      <Card title="알림 설정">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
          <div className="flex justify-between items-center">
            <span className="text-[var(--card-foreground)] text-[var(--font-size-body)] leading-normal">푸시 알림</span>
            <Checkbox checked={pushNotifications} onChange={setPushNotifications} />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[var(--card-foreground)] text-[var(--font-size-body)] leading-normal">이메일 알림</span>
            <Checkbox checked={darkMode} onChange={setDarkMode} />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[var(--card-foreground)] text-[var(--font-size-body)] leading-normal">자동 저장</span>
            <Checkbox checked={autoSave} onChange={setAutoSave} />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[var(--card-foreground)] text-[var(--font-size-body)] leading-normal">분석 데이터 수집</span>
            <Checkbox checked={analytics} onChange={setAnalytics} />
          </div>
        </div>
      </Card>      {/* 라디오 버튼 테마 설정 섹션 */}
      <Card title="테마 설정">
        <div className="space-y-5">
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

      {/* justify-between 스타일 레이아웃 예시 */}
      <Card title="고급 설정">
        <div className="space-y-5">
          <div className="flex justify-between items-center">
            <span className="text-[var(--card-foreground)] text-[var(--font-size-body)] leading-normal">데이터 절약 모드</span>
            <Checkbox 
              checked={pushNotifications} 
              onChange={setPushNotifications} 
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[var(--card-foreground)] text-[var(--font-size-body)] leading-normal">백그라운드 동기화</span>
            <Checkbox 
              checked={autoSave} 
              onChange={setAutoSave} 
            />
          </div>          <div className="flex justify-between items-center">
            <span className="text-[var(--card-foreground)] text-[var(--font-size-body)] leading-normal">알림음</span>
            <Checkbox 
              checked={analytics} 
              onChange={setAnalytics} 
            />
          </div>
        </div>
      </Card>

      {/* 라벨과 함께 사용하는 체크박스 예시 */}
      <Card title="개인정보 동의">
        <div className="space-y-4">
          <Checkbox 
            checked={pushNotifications} 
            onChange={setPushNotifications} 
            label="마케팅 이메일 수신 동의"
          />
          <Checkbox 
            checked={darkMode} 
            onChange={setDarkMode} 
            label="개인정보 수집 및 이용 동의 (필수)"
          />
          <Checkbox 
            checked={autoSave} 
            onChange={setAutoSave} 
            label="서비스 약관 동의"
          />
          <Checkbox 
            checked={analytics} 
            onChange={setAnalytics} 
            label="선택적 기능 이용 동의 - 더 나은 서비스 제공을 위해 사용됩니다"
          />
        </div>
      </Card>
      
      {/* 반응형 그리드 테스트 */}
      <div className="content-grid">
        <Card title="카드 1">
          <p>모바일에서 2열로 표시되는 카드입니다.</p>
        </Card>
        <Card title="카드 2">
          <p>태블릿에서 3열, 데스크톱에서 4열로 변경됩니다.</p>
        </Card>
        <Card title="카드 3">
          <p>카드 크기가 그리드에 맞춰 유연하게 조정됩니다.</p>
        </Card>
        <Card title="카드 4">
          <p>width: 100%, min-width: 0 적용으로 반응형 완벽 지원.</p>
        </Card>
      </div>
    </div>
  );
};

export default SettingsDemo;
