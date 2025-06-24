import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 탭 아이템 데이터 타입
export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  // 탭 콘텐츠에 적용할 레이아웃 타입 또는 클래스 정보 추가
  contentType?: 'single-card' | 'multi-card-grid' | 'full-width-section' | 'vertical-stack';
  customLayoutClass?: string; // 특정 레이아웃 클래스를 직접 지정할 경우
}

export interface TabsProps {
  tabs: TabItem[]; // 탭 아이템 배열
  activeTab: string; // 현재 활성 탭의 ID
  onTabChange: (tabId: string) => void; // 탭 변경 시 호출될 콜백
  className?: string; // 전체 컨테이너에 적용될 추가 클래스
  tabListClassName?: string; // 탭 라벨 리스트에 적용될 클래스
  tabContentClassName?: string; // 탭 콘텐츠 영역에 적용될 클래스
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = '',
  tabListClassName = '',
  tabContentClassName = '',
}) => {
  const activeTabIndex = tabs.findIndex(tab => tab.id === activeTab);
  const activeTabRef = useRef<HTMLButtonElement>(null); // 활성 탭 버튼 참조
  const tabListRef = useRef<HTMLDivElement>(null); // 탭 리스트 컨테이너 참조

  // 1. Sliding Underline 위치 계산을 위한 상태
  const [underlineWidth, setUnderlineWidth] = useState(0);
  const [underlineLeft, setUnderlineLeft] = useState(0);

  // 2. 활성 탭이 변경될 때마다 밑줄 위치/크기 업데이트
  useEffect(() => {
    if (activeTabRef.current && tabListRef.current) {
      const tabElement = activeTabRef.current;
      const containerElement = tabListRef.current;
      
      setUnderlineWidth(tabElement.offsetWidth);
      setUnderlineLeft(tabElement.offsetLeft - containerElement.offsetLeft);
    }
  }, [activeTab]); // activeTab이 변경될 때마다 실행

  // 3. 콘텐츠 전환 애니메이션을 위한 variants
  const contentVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <div className={`tabs-container ${className}`}>
      {/* 탭 라벨 리스트 */}      <div 
        ref={tabListRef}        className={`
          relative flex border-b-[1px] border-border
          overflow-x-auto scrollbar-hide
          pt-3 pb-2
          ${tabListClassName}
        `}
        style={{
          minHeight: '48px', // 고정 높이
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(tabs.length, 4)}, 1fr)`, // 최대 4개 컬럼
          gap: '0px'
        }}
      >{tabs.map((tab) => (
          <button
            key={tab.id}
            ref={activeTab === tab.id ? activeTabRef : null} // 활성 탭에만 ref 연결
            onClick={() => onTabChange(tab.id)}            className={`
              relative py-3 px-2
              text-sm font-medium
              transition-colors duration-normal cursor-pointer
              ${activeTab === tab.id 
                ? 'text-primary' 
                : 'text-muted-foreground hover:text-foreground'
              }
              whitespace-nowrap text-center
              border-r border-border/30 last:border-r-0
            `}
            style={{
              minHeight: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {tab.label}
          </button>
        ))}
          {/* Sliding Underline */}
        {activeTabIndex !== -1 && ( // 활성 탭이 있을 때만 렌더링
          <motion.div
            className="absolute bottom-0 h-[2px] bg-primary" // 밑줄 스타일
            initial={false} // 초기 애니메이션 비활성화 (위치 계산 후 바로 적용)
            animate={{ 
              width: underlineWidth, 
              x: underlineLeft 
            }} // 너비와 x축 위치 애니메이션
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30 
            }} // 스프링 애니메이션
          />
        )}
      </div>      {/* 상용 서비스급 고정 마스터 컨테이너 - 모든 탭 콘텐츠의 통일된 프레임 */}
      <div        className={`
          tab-content-master-container mt-3
          w-full max-w-6xl mx-auto
          min-h-[400px] max-[767px]:min-h-[300px]
          bg-background border border-border/30 rounded-lg
          p-4 max-[767px]:p-3
          ${tabContentClassName}
        `}
        style={{
          // 강제로 고정 크기 적용 (상용 서비스 안정성)
          minHeight: 'var(--tabs-content-min-height, 400px)',
          borderRadius: 'var(--radius)',
          background: 'var(--background)',
          transition: 'none', // 크기 변경 애니메이션 비활성화
        }}
      >
        <AnimatePresence mode="wait">
          {tabs.map((tab) =>
            activeTab === tab.id ? (
              <motion.div
                key={tab.id}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={contentVariants}
                transition={{ duration: 0.2 }}                className={`
                  w-full h-full relative
                  ${(() => {
                    switch (tab.contentType) {
                      case 'single-card':
                        return 'flex items-start justify-center pt-2'; // 단일 카드를 중앙 상단에 배치
                      case 'multi-card-grid':
                        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-min'; // 반응형 그리드
                      case 'vertical-stack': 
                        return 'flex flex-col gap-3 max-h-full overflow-y-auto'; // 세로 스택 (스크롤 가능)
                      case 'full-width-section': 
                        return 'w-full h-full'; // 컨테이너 전체 사용
                      default:
                        return tab.customLayoutClass || 'flex flex-col gap-3'; // 기본 레이아웃
                    }
                  })()}
                `}
                style={{
                  // 내부 콘텐츠도 컨테이너 크기에 맞춤
                  minHeight: 'calc(var(--tabs-content-min-height, 400px) - var(--spacing-4) * 2)',
                  maxHeight: 'calc(var(--tabs-content-min-height, 400px) - var(--spacing-4) * 2)',
                }}
              >
                {tab.content}
              </motion.div>
            ) : null
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Tabs;
