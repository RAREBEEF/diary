import { createSlice } from "@reduxjs/toolkit";

export default interface calendarDataStateType {
  init: boolean;
  holi: Array<any>;
  curDate: {
    year: number;
    month: number;
  };
}

const initialState: calendarDataStateType = {
  holi: [],
  curDate: { year: 1998, month: 10 },
  init: false,
};

export const setCalendar = createSlice({
  name: "calendarData",
  initialState,
  reducers: {
    setHoli: (state, action) => {
      state.holi = action.payload;
      state.curDate = state.curDate;
      state.init = state.init;
    },
    setCurDate: (state, action) => {
      state.holi = state.holi;
      state.curDate = action.payload;
      state.init = state.init;
    },
    setInit: (state, action) => {
      state.holi = state.holi;
      state.curDate = state.curDate;
      state.init = action.payload;
    },
  },
});
