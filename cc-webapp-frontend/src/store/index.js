import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import gameReducer from './gameSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    game: gameReducer,
  },
});
