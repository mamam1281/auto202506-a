import { post } from './api';

export const register = (nickname, password) =>
  post('/api/register', { nickname, password });
