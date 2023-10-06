import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { InitState, MainData } from 'typings/MainData.js';

// // get data from local storage
// const data = localStorage.getItem('data');
// const matrix = data ? JSON.parse(data) : [];

const initialState: InitState = {
  data: { matrix: [], timer: 0 },
  isCounting: false,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    updateData: (
      state,
      action: PayloadAction<{ matrix?: MainData[][]; timer?: number }>
    ) => {
      state.data = {
        ...state.data,
        ...action.payload,
      };
    },
    startCounting: (state) => {
      state.isCounting = true;
    },
    stopCounting: (state) => {
      state.isCounting = false;
    },
    updateError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = '';
    },
  },
});

const { actions, reducer } = gameSlice;
export const {
  updateError,
  clearError,
  updateData,
  startCounting,
  stopCounting,
} = actions;
export default reducer;
