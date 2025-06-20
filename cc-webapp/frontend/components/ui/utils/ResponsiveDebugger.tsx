'use client';

import { useEffect, useState } from 'react';

/**
 * 반응형 디버깅을 위한 브레이크포인트 표시기
 * 화면 우상단에 현재 브레이크포인트를 표시
 */
export const BreakpointIndicator = () => {
  const [mounted, setMounted] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    setMounted(true);
    
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    handleResize(); // 초기값 설정
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!mounted) return null;

  const getBreakpoint = () => {
    if (screenWidth >= 1536) return { name: '2XL', color: '#8b5cf6' };
    if (screenWidth >= 1280) return { name: 'XL', color: '#3b82f6' };
    if (screenWidth >= 1024) return { name: 'LG', color: '#10b981' };
    if (screenWidth >= 768) return { name: 'MD', color: '#f59e0b' };
    if (screenWidth >= 640) return { name: 'SM', color: '#ef4444' };
    return { name: 'XS', color: '#6b7280' };
  };

  const breakpoint = getBreakpoint();

  return (
    <div 
      className="fixed top-4 right-4 z-50 px-3 py-2 rounded-lg shadow-lg text-white text-sm font-mono font-bold pointer-events-none"
      style={{ 
        backgroundColor: breakpoint.color,
        border: `2px solid ${breakpoint.color}40`
      }}
    >
      <div className="flex items-center gap-2">
        <span>{breakpoint.name}</span>
        <span className="text-xs opacity-80">{screenWidth}px</span>
      </div>
      
      {/* 브레이크포인트 범위 표시 */}
      <div className="text-xs opacity-70 mt-1">
        {breakpoint.name === 'XS' && '< 640px'}
        {breakpoint.name === 'SM' && '640px ~ 767px'}
        {breakpoint.name === 'MD' && '768px ~ 1023px'}
        {breakpoint.name === 'LG' && '1024px ~ 1279px'}
        {breakpoint.name === 'XL' && '1280px ~ 1535px'}
        {breakpoint.name === '2XL' && '≥ 1536px'}
      </div>
    </div>
  );
};

/**
 * 그리드 오버레이 디버깅 도구
 * 8px 그리드를 시각적으로 표시
 */
export const GridOverlay = ({ show = false }: { show?: boolean }) => {
  if (!show) return null;

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-40"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255, 0, 0, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 0, 0, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '8px 8px'
      }}
    />
  );
};

/**
 * 통합 반응형 디버거
 */
export const ResponsiveDebugger = () => {
  const [showGrid, setShowGrid] = useState(false);
  const [showBreakpoint, setShowBreakpoint] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Shift + G: 그리드 토글
      if (e.ctrlKey && e.shiftKey && e.key === 'G') {
        e.preventDefault();
        setShowGrid(!showGrid);
      }
      // Ctrl + Shift + B: 브레이크포인트 표시 토글
      if (e.ctrlKey && e.shiftKey && e.key === 'B') {
        e.preventDefault();
        setShowBreakpoint(!showBreakpoint);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showGrid, showBreakpoint]);

  return (
    <>
      {showBreakpoint && <BreakpointIndicator />}
      <GridOverlay show={showGrid} />
      
      {/* 컨트롤 패널 */}
      <div className="fixed bottom-4 right-4 z-50 text-xs text-gray-400 font-mono">
        <div className="bg-black/80 px-2 py-1 rounded">
          <div>Ctrl+Shift+B: 브레이크포인트</div>
          <div>Ctrl+Shift+G: 그리드</div>
        </div>
      </div>
    </>
  );
};

export default ResponsiveDebugger;
