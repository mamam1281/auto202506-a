import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export async function playSlot(token, betAmount) {
  const response = await axios.post(
    `${API_BASE_URL}/games/slot/play`,
    { bet_amount: betAmount },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}
