import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 기본 요청 함수들
export const apiService = {
  get: (url) => api.get(url).then(response => response.data),
  post: (url, data) => api.post(url, data).then(response => response.data),
  put: (url, data) => api.put(url, data).then(response => response.data),
  delete: (url) => api.delete(url).then(response => response.data),
};
