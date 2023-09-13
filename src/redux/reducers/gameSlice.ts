import { createSlice } from '@reduxjs/toolkit';
import { InitState } from 'typings/MainData.js';

const initialState: InitState = {
  data: [],
  isCounting: false,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,

  reducers: {
    updateData: (state, action) => {
      state.data = action.payload;
    },
    startCounting: (state) => {
      state.isCounting = true;
    },
    stopCounting: (state) => {
      state.isCounting = false;
    },
    clearError: (state) => {
      state.error = '';
    },
  },
});

const { actions, reducer } = gameSlice;
export const { clearError, updateData, startCounting, stopCounting } = actions;
export default reducer;
