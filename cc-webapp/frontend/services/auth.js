import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export async function login(username, password) {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, {
    username,
    password,
  });
  return response.data;
}

export async function fetchTokenBalance(token) {
  const response = await axios.get(`${API_BASE_URL}/users/me/tokens`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}
