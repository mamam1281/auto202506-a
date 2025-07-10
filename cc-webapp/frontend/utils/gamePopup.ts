/**
 * 게임 팝업 관리 유틸리티
 * 팝업 크기, 위치, 자동 피팅 로직을 중앙화하여 관리
 */

export interface PopupConfig {
  width: number;
  height: number;
  title: string;
  resizable?: boolean;
  scrollable?: boolean;
}

// 표준 팝업 크기 설정 (400x750 기본)
export const POPUP_CONFIGS = {
  profile: {
    width: 400,
    height: 750,
    title: '프로필',
    resizable: true,
    scrollable: true
  },
  profileEdit: {
    width: 400,
    height: 600,
    title: '프로필 편집',
    resizable: true,
    scrollable: true
  },
  settings: {
    width: 450,
    height: 500,
    title: '설정',
    resizable: false,
    scrollable: true
  },
  gacha: {
    width: 500,
    height: 700,
    title: '가챠',
    resizable: false,
    scrollable: false
  }
} as const;

export type PopupType = keyof typeof POPUP_CONFIGS;

/**
 * 화면 크기에 따른 팝업 자동 피팅 계산
 * 세로/가로 모드 모두 지원
 */
export function calculateAutoFitSize(
  config: PopupConfig,
  screenWidth: number = window.innerWidth,
  screenHeight: number = window.innerHeight
): { width: number; height: number; scale: number } {
  const margin = 40; // 최소 여백
  const maxWidth = screenWidth - margin;
  const maxHeight = screenHeight - margin;
  
  // 스케일 계산 (가로/세로 중 더 제한적인 것 기준)
  const scaleX = maxWidth / config.width;
  const scaleY = maxHeight / config.height;
  const scale = Math.min(scaleX, scaleY, 1); // 1을 초과하지 않음
  
  return {
    width: Math.floor(config.width * scale),
    height: Math.floor(config.height * scale),
    scale
  };
}

/**
 * 팝업 위치 계산 (중앙 정렬)
 */
export function calculatePopupPosition(
  width: number,
  height: number,
  screenWidth: number = window.innerWidth,
  screenHeight: number = window.innerHeight
): { x: number; y: number } {
  return {
    x: Math.max(0, Math.floor((screenWidth - width) / 2)),
    y: Math.max(0, Math.floor((screenHeight - height) / 2))
  };
}

/**
 * 반응형 팝업 CSS 클래스 생성
 */
export function getResponsivePopupClasses(popupType: PopupType): string {
  const baseClasses = [
    'fixed',
    'z-50',
    'bg-white',
    'dark:bg-gray-900',
    'rounded-lg',
    'shadow-2xl',
    'border',
    'border-gray-200',
    'dark:border-gray-700'
  ];
  
  // 팝업 타입별 추가 클래스
  const typeSpecificClasses = {
    profile: ['overflow-y-auto', 'max-h-screen'],
    profileEdit: ['overflow-y-auto', 'max-h-screen'],
    settings: ['overflow-hidden'],
    gacha: ['overflow-hidden', 'select-none']
  };
  
  return [...baseClasses, ...typeSpecificClasses[popupType]].join(' ');
}

/**
 * 팝업 열기
 */
export function openPopup(
  popupType: PopupType,
  additionalConfig?: Partial<PopupConfig>
): void {
  const config = { ...POPUP_CONFIGS[popupType], ...additionalConfig };
  const autoFit = calculateAutoFitSize(config);
  const position = calculatePopupPosition(autoFit.width, autoFit.height);
  
  // 팝업 상태를 전역 상태에 저장 (예: Zustand store)
  // 실제 구현에서는 상태 관리 라이브러리 사용
  const popupState = {
    isOpen: true,
    type: popupType,
    config: config,
    size: autoFit,
    position: position,
    timestamp: Date.now()
  };
  
  // 이벤트 발송 (옵션)
  window.dispatchEvent(new CustomEvent('popup:open', { 
    detail: popupState 
  }));
  
  console.log('Popup opened:', popupState);
}

/**
 * 팝업 닫기
 */
export function closePopup(popupType?: PopupType): void {
  // 팝업 상태 초기화
  const popupState = {
    isOpen: false,
    type: popupType || null,
    timestamp: Date.now()
  };
  
  // 이벤트 발송 (옵션)
  window.dispatchEvent(new CustomEvent('popup:close', { 
    detail: popupState 
  }));
  
  console.log('Popup closed:', popupState);
}

/**
 * 화면 크기 변경 시 팝업 리사이즈
 */
export function handlePopupResize(
  currentPopupType: PopupType,
  currentConfig: PopupConfig
): void {
  const autoFit = calculateAutoFitSize(currentConfig);
  const position = calculatePopupPosition(autoFit.width, autoFit.height);
  
  // 팝업 상태 업데이트
  const resizeState = {
    type: currentPopupType,
    size: autoFit,
    position: position,
    timestamp: Date.now()
  };
  
  // 이벤트 발송
  window.dispatchEvent(new CustomEvent('popup:resize', { 
    detail: resizeState 
  }));
  
  console.log('Popup resized:', resizeState);
}

/**
 * 디바이스 방향 감지 및 팝업 최적화
 */
export function getDeviceOrientation(): 'portrait' | 'landscape' {
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
}

/**
 * 방향별 최적화된 팝업 설정
 */
export function getOrientationOptimizedConfig(
  baseConfig: PopupConfig
): PopupConfig {
  const orientation = getDeviceOrientation();
  
  if (orientation === 'landscape') {
    // 가로 모드에서는 높이를 줄이고 폭을 늘림
    return {
      ...baseConfig,
      width: Math.min(baseConfig.width * 1.2, window.innerWidth * 0.8),
      height: Math.min(baseConfig.height * 0.8, window.innerHeight * 0.9)
    };
  }
  
  // 세로 모드는 기본 설정 사용
  return baseConfig;
}

// 전역 리사이즈 이벤트 리스너 설정
if (typeof window !== 'undefined') {
  let resizeTimeout: NodeJS.Timeout;
  
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // 현재 열린 팝업이 있다면 리사이즈 처리
      const event = new CustomEvent('popup:window-resize');
      window.dispatchEvent(event);
    }, 100);
  });
}
