'use client';

import { useState, useEffect } from 'react';

/**
 * 모바일 디바이스 감지를 위한 커스텀 훅
 */
export const useMobile = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkIsMobile = () => {
      // 화면 크기 기반 모바일 감지
      const isMobileSize = window.innerWidth < 768;
      
      // User Agent 기반 모바일 감지 (더 정확한 감지를 위해)
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      
      // 터치 디바이스 감지
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // 조건들을 조합하여 최종 판단
      setIsMobile(isMobileSize || (isMobileUA && isTouchDevice));
    };

    // 초기 체크
    checkIsMobile();

    // 리사이즈 이벤트 리스너 추가
    window.addEventListener('resize', checkIsMobile);
    
    // orientation change 이벤트 리스너 추가 (모바일 회전 감지)
    window.addEventListener('orientationchange', () => {
      // orientation change 후 약간의 딜레이를 두고 체크
      setTimeout(checkIsMobile, 100);
    });

    // 클린업
    return () => {
      window.removeEventListener('resize', checkIsMobile);
      window.removeEventListener('orientationchange', checkIsMobile);
    };
  }, []);

  return isMobile;
};

/**
 * 특정 브레이크포인트에서의 미디어 쿼리 매칭을 확인하는 훅
 */
export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    
    // 초기값 설정
    setMatches(mediaQuery.matches);

    // 변경 리스너 추가
    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    // 클린업
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
};

/**
 * 화면 크기별 브레이크포인트 훅들
 */
export const useBreakpoint = () => {
  const isXs = useMediaQuery('(max-width: 479px)');
  const isSm = useMediaQuery('(min-width: 480px) and (max-width: 767px)');
  const isMd = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const isLg = useMediaQuery('(min-width: 1024px) and (max-width: 1279px)');
  const isXl = useMediaQuery('(min-width: 1280px)');
  
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  return {
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    isMobile,
    isTablet,
    isDesktop,
  };
};

/**
 * 디바이스 방향 감지 훅
 */
export const useOrientation = () => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    const checkOrientation = () => {
      if (typeof window === 'undefined') return;
      
      const isLandscape = window.innerWidth > window.innerHeight;
      setOrientation(isLandscape ? 'landscape' : 'portrait');
    };

    // 초기 체크
    checkOrientation();

    // 이벤트 리스너 추가
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', () => {
      setTimeout(checkOrientation, 100);
    });

    // 클린업
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  return orientation;
};

/**
 * 뷰포트 크기 추적 훅
 */
export const useViewport = () => {
  const [viewport, setViewport] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // 초기값 설정
    updateViewport();

    // 이벤트 리스너 추가
    window.addEventListener('resize', updateViewport);

    // 클린업
    return () => {
      window.removeEventListener('resize', updateViewport);
    };
  }, []);

  return viewport;
};
