import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { InitState, MainData } from 'typings/MainData.js';

// // get data from local storage
// const data = localStorage.getItem('data');
// const matrix = data ? JSON.parse(data) : [];

// get setting from local storage
const setting = localStorage.getItem('setting');
const settingData = setting
  ? JSON.parse(setting)
  : { music: true, sound: true };

const initialState: InitState = {
  data: { matrix: [], timer: 0, mistake: 0, level: '' },
  isCounting: false,
  activeCell: { row: 0, col: 0 },
  setting: settingData,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    updateData: (
      state,
      action: PayloadAction<{
        matrix?: MainData[][];
        timer?: number;
        mistake?: number;
        level?: string;
      }>,
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
    updateActiveCell: (
      state,
      action: PayloadAction<{ row: number; col: number }>,
    ) => {
      state.activeCell = action.payload;
    },
    updateSetting: (
      state,
      action: PayloadAction<{ music?: boolean; sound?: boolean }>,
    ) => {
      state.setting = {
        ...state.setting,
        ...action.payload,
      };
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
  updateActiveCell,
  updateSetting,
} = actions;
export default reducer;
