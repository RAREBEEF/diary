import { createSlice } from "@reduxjs/toolkit";

export default interface calendarDataStateType {
  holi: Array<any>;
  curDate: {
    year: number;
    month: number;
  };
}

const initialState: calendarDataStateType = {
  holi: [],
  curDate: { year: -1, month: -1 },
};

export const setCalendar = createSlice({
  name: "calendarData",
  initialState,
  reducers: {
    setHoli: (state, action) => {
      state.holi = action.payload;
      state.curDate = state.curDate;
    },
    setCurDate: (state, action) => {
      state.holi = state.holi;
      state.curDate = action.payload;
    },
  },
});
