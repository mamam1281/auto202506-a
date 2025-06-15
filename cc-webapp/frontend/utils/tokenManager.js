/**
 * 토큰 관리 유틸리티
 */

export const tokenManager = {
  /**
   * 로컬 스토리지에서 액세스 토큰 가져오기
   */
  getAccessToken: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  },

  /**
   * 로컬 스토리지에 액세스 토큰 저장
   */
  setAccessToken: (token) => {
    if (typeof window === 'undefined') return;
    if (token) {
      localStorage.setItem('accessToken', token);
    } else {
      localStorage.removeItem('accessToken');
    }
  },

  /**
   * 토큰 제거 (로그아웃)
   */
  clearAccessToken: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('accessToken');
  },

  /**
   * 토큰이 유효한지 체크 (간단한 형식 확인)
   */
  isTokenValid: (token) => {
    if (!token || typeof token !== 'string') return false;
    // JWT 토큰 형식 간단 체크 (3개 부분이 .으로 구분)
    const parts = token.split('.');
    return parts.length === 3;
  },

  /**
   * 토큰 만료 시간 체크 (JWT 디코딩)
   */
  isTokenExpired: (token) => {
    if (!tokenManager.isTokenValid(token)) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp ? payload.exp < currentTime : false;
    } catch (error) {
      console.error('토큰 디코딩 실패:', error);
      return true;
    }
  },

  /**
   * 현재 저장된 토큰이 유효한지 체크
   */
  isCurrentTokenValid: () => {
    const token = tokenManager.getAccessToken();
    return token && tokenManager.isTokenValid(token) && !tokenManager.isTokenExpired(token);
  },
};

export default tokenManager;
