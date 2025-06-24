import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 탭 아이템 데이터 타입
export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
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
        ref={tabListRef}
        className={`
          relative flex border-b-[1px] border-[var(--border)]
          overflow-x-auto scrollbar-hide
          pt-[var(--spacing-3)] pb-[var(--spacing-2)]
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
            onClick={() => onTabChange(tab.id)}
            className={`
              relative py-[var(--spacing-3)] px-[var(--spacing-2)]
              text-[var(--font-size-sm)] font-[var(--font-weight-medium)]
              transition-colors duration-[var(--transition-normal)] cursor-pointer
              ${activeTab === tab.id 
                ? 'text-[var(--color-purple-primary)]' 
                : 'text-[var(--color-text-secondary)] hover:text-[var(--foreground)]'
              }
              whitespace-nowrap text-center
              border-r border-[var(--border)]/30 last:border-r-0
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
            className="absolute bottom-0 h-[2px] bg-[var(--color-purple-primary)]" // 밑줄 스타일
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
      </div>      {/* 탭 콘텐츠 영역 */}
      <div className={`tab-content mt-[var(--spacing-3)] ${tabContentClassName}`}>
        <AnimatePresence mode="wait"> {/* 콘텐츠 전환 시 이전 콘텐츠 완전히 사라진 후 다음 콘텐츠 나타나도록 */}
          {tabs.map((tab) =>
            activeTab === tab.id ? (
              <motion.div
                key={tab.id}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={contentVariants}
                transition={{ duration: 0.2 }}
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
