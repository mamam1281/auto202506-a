import axios from 'axios';
import type { 
  User, 
  AdultContentGalleryItem, 
  GameResponse, 
  ContentUnlockResponse, 
  FlashOfferResponseItem,
  LoginRequest,
  RegisterRequest,
  ContentUnlockRequest,
  GamePlayRequest
} from '../types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth
apiClient.interceptors.request.use((config) => {
  const token = localStorage?.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage?.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data: LoginRequest) => 
    apiClient.post<{ access_token: string; user: User }>('/auth/login', data),
  
  register: (data: RegisterRequest) => 
    apiClient.post<{ access_token: string; user: User }>('/auth/register', data),
  
  getCurrentUser: () => 
    apiClient.get<User>('/auth/me'),
};

export const gameAPI = {
  getGames: () => 
    apiClient.get<GameResponse[]>('/games/'),
  
  playGame: (data: GamePlayRequest) => 
    apiClient.post('/games/play', data),

  // Roulette specific API
  postRouletteSpin: async (betDetails: { betType: string | null; betValue: string | number | null; amount: number }) => {
    // MOCKED IMPLEMENTATION
    console.log('Mock API: /games/roulette/spin called with', betDetails);
    await new Promise(resolve => setTimeout(resolve, 750)); // Simulate network delay

    // Standard European wheel numbers and colors for mocking
    const wheelNumbersMock = [
      { num: 0, color: 'g' }, { num: 32, color: 'r' }, { num: 15, color: 'b' }, { num: 19, color: 'r' },
      { num: 4, color: 'b' }, { num: 21, color: 'r' }, { num: 2, color: 'b' }, { num: 25, color: 'r' },
      { num: 17, color: 'b' }, { num: 34, color: 'r' }, { num: 6, color: 'b' }, { num: 27, color: 'r' },
      { num: 13, color: 'b' }, { num: 36, color: 'r' }, { num: 11, color: 'b' }, { num: 30, color: 'r' },
      { num: 8, color: 'b' }, { num: 23, color: 'r' }, { num: 10, color: 'b' }, { num: 5, color: 'r' },
      { num: 24, color: 'b' }, { num: 16, color: 'r' }, { num: 33, color: 'b' }, { num: 1, color: 'r' },
      { num: 20, color: 'b' }, { num: 14, color: 'r' }, { num: 31, color: 'b' }, { num: 9, color: 'r' },
      { num: 22, color: 'b' }, { num: 18, color: 'r' }, { num: 29, color: 'b' }, { num: 7, color: 'r' },
      { num: 28, color: 'b' }, { num: 12, color: 'r' }, { num: 35, color: 'b' }, { num: 3, color: 'r' },
      { num: 26, color: 'b' },
    ];
    const winningIndex = Math.floor(Math.random() * wheelNumbersMock.length);
    const result = wheelNumbersMock[winningIndex];

    return { winningNumber: result.num, color: result.color, winningSectorIndex: winningIndex }; // Added winningSectorIndex for easier client use
    // Actual: return apiClient.post<{ winningNumber: number; color: string; winningSectorIndex: number }>('/games/roulette/spin', betDetails).then(res => res.data);
  },
};

export const userActionsAPI = {
  postRecordAction: async (actionDetails: { actionType: string; metadata: any }) => {
    // MOCKED IMPLEMENTATION
    console.log('Mock API: /api/actions called with', actionDetails);
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true, message: 'Action recorded' };
    // Actual: return apiClient.post('/api/actions', actionDetails).then(res => res.data);
  },
};

export const rewardsAPI = {
  getRewardsHistory: async () => {
    // MOCKED IMPLEMENTATION
    console.log('Mock API: /api/rewards called');
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { id: '1', type: 'daily_login', amount: 50, timestamp: new Date().toISOString() },
      { id: '2', type: 'game_win_roulette', amount: 200, timestamp: new Date().toISOString() },
    ]; // Example data
    // Actual: return apiClient.get('/api/rewards').then(res => res.data);
  },
};

export const feedbackAPI = {
  postGameFeedback: async (feedbackDetails: { game: string; result: 'win' | 'loss'; sentiment?: string; tokensChanged: number }) => {
    // MOCKED IMPLEMENTATION
    console.log('Mock API: /api/feedback called with', feedbackDetails);
    await new Promise(resolve => setTimeout(resolve, 400));
    // This might interact with more advanced AI endpoints like /ai/analyze, /feedback/generate
    // For now, just a simple mock.
    return { success: true, cj_ai_response: "That was a close one! Keep trying!" };
    // Actual: return apiClient.post('/api/feedback', feedbackDetails).then(res => res.data);
  },
};

export const adultContentAPI = {
  getGallery: () => 
    apiClient.get<{ items: AdultContentGalleryItem[] }>('/adult-content/gallery'),
  
  unlockContent: (data: ContentUnlockRequest) => 
    apiClient.post<ContentUnlockResponse>('/adult-content/unlock', data),
  
  getFlashOffers: () => 
    apiClient.get<{ offers: FlashOfferResponseItem[] }>('/adult-content/flash-offers'),
};

export default apiClient;
