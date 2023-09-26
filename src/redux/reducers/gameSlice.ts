import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { InitState, MainData } from 'typings/MainData.js';
// import SudokuTable from 'utils/generateData';

const initialState: InitState = {
  matrix: [],
  isCounting: false,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    updateData: (state, action: PayloadAction<MainData[][]>) => {
      state.matrix = action.payload;
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
// export const selectData = (state: RootState) => state.game.data;
export default reducer;
