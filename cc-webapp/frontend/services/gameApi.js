import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8000' });

export async function playSlot(betAmount, token) {
  const { data } = await api.post('/games/slot/play', { bet_amount: betAmount }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.result;
}
