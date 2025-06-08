import { createSlice } from '@reduxjs/toolkit';

const gameSlice = createSlice({
  name: 'game',
  initialState: { tokens: 0 },
  reducers: {
    addTokens(state, action) {
      state.tokens += action.payload;
    },
  },
});

export const { addTokens } = gameSlice.actions;
export default gameSlice.reducer;
