// 게임 팝업 창 관리 유틸리티

export interface GamePopupConfig {
  width: number;
  height: number;
  title: string;
  url: string;
  resizable?: boolean;
  scrollbars?: boolean;
}

// 기본 게임 창 설정
export const DEFAULT_GAME_POPUP_CONFIG: Partial<GamePopupConfig> = {
  width: 480,
  height: 720,
  resizable: false,
  scrollbars: false,
};

// 게임별 창 설정
export const GAME_POPUP_CONFIGS: Record<string, GamePopupConfig> = {
  slots: {
    width: 400,
    height: 900,
    title: '코스믹 포츈 - 슬롯 머신',
    url: '/games/slots/popup',
    resizable: false,
    scrollbars: false,
  },
  rps: {
    width: 400,
    height: 750,
    title: 'RPS Battle',
    url: '/games/rps/popup',
    resizable: false,
    scrollbars: false,
  },
  gacha: {
    width: 400,
    height: 750,
    title: 'Lucky Gacha',
    url: '/gacha/popup',
    resizable: false,
    scrollbars: false,
  },
  'slot-simple': {
    width: 400,
    height: 650,
    title: '슬롯 머신',
    url: '/slot/popup',
    resizable: false,
    scrollbars: false,
  },
};

/**
 * 게임 팝업 창을 엽니다
 */
export function openGamePopup(gameId: string): Window | null {
  const config = GAME_POPUP_CONFIGS[gameId];
  if (!config) {
    console.error(`Game config not found for: ${gameId}`);
    return null;
  }

  // 화면 중앙에 창 위치 계산
  const screenWidth = window.screen.availWidth;
  const screenHeight = window.screen.availHeight;
  const left = Math.round((screenWidth - config.width) / 2);
  const top = Math.round((screenHeight - config.height) / 2);

  // 팝업 창 옵션 설정
  const windowFeatures = [
    `width=${config.width}`,
    `height=${config.height}`,
    `left=${left}`,
    `top=${top}`,
    `resizable=${config.resizable ? 'yes' : 'no'}`,
    `scrollbars=${config.scrollbars ? 'yes' : 'no'}`,
    'menubar=no',
    'toolbar=no',
    'location=no',
    'status=no',
    'titlebar=yes',
  ].join(',');

  try {
    // 새 창 열기
    const popup = window.open(config.url, `game_${gameId}_${Date.now()}`, windowFeatures);
    
    if (popup) {
      // 창 포커스
      popup.focus();
      
      // 창이 열렸을 때 제목 설정 (일부 브라우저에서 지원)
      popup.document.title = config.title;
      
      return popup;
    } else {
      console.error('Popup was blocked or failed to open');
      // 팝업이 차단된 경우 사용자에게 알림
      alert('팝업이 차단되었습니다. 브라우저 설정에서 팝업을 허용해주세요.');
      return null;
    }
  } catch (error) {
    console.error('Error opening game popup:', error);
    return null;
  }
}

/**
 * 팝업 창인지 확인
 */
export function isPopupWindow(): boolean {
  try {
    return window.opener !== null && window.opener !== window;
  } catch {
    return false;
  }
}

/**
 * 팝업 창 닫기
 */
export function closeGamePopup(): void {
  if (isPopupWindow()) {
    window.close();
  }
}
