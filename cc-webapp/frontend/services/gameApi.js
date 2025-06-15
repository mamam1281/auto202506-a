import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8000' });

export async function playSlot(betAmount, token) {
  const { data } = await api.post('/api/games/slot/spin', { bet_amount: betAmount }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function playRoulette(betType, betAmount, value, token) {
  const { data } = await api.post('/api/games/roulette/spin', { 
    bet_type: betType, 
    bet_amount: betAmount, 
    value: value 
  }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function pullGacha(count, token) {
  const { data } = await api.post('/api/games/gacha/pull', { count }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}
