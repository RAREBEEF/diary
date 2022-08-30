import { createSlice } from "@reduxjs/toolkit";

export default interface calendarDataStateType {
  init: boolean;
  curDate: {
    year: number;
    month: number;
  };
}

const initialState: calendarDataStateType = {
  curDate: { year: 1998, month: 10 },
  init: false,
};

export const setCalendar = createSlice({
  name: "calendarData",
  initialState,
  reducers: {
    setCurDate: (state, action) => {
      state.curDate = action.payload;
      state.init = state.init;
    },
    setInit: (state, action) => {
      state.curDate = state.curDate;
      state.init = action.payload;
    },
  },
});
