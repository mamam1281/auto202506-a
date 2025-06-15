import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8000' });

export async function login(username, password) {
  const { data } = await api.post('/auth/login', { username, password });
  if (data.access_token) {
    localStorage.setItem('accessToken', data.access_token);
  }
  return data.access_token;
}

export async function fetchTokenBalance(token) {
  const { data } = await api.get('/users/me/tokens', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.cyber_tokens;
}
