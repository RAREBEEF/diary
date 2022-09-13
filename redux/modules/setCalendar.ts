import { createSlice } from "@reduxjs/toolkit";

export default interface calendarDataStateType {
  init: boolean;
  curDate: {
    year: number;
    month: number;
  };
  today: {
    year: string;
    month: string;
    date: string;
  };
}

const initialState: calendarDataStateType = {
  curDate: { year: 1998, month: 10 },
  today: {
    year: "",
    month: "",
    date: "",
  },
  init: false,
};

export const setCalendar = createSlice({
  name: "calendarData",
  initialState,
  reducers: {
    setCurDate: (state, action) => {
      state.curDate = action.payload;
      state.init = state.init;
      state.today = state.today;
    },
    setInit: (state, action) => {
      state.curDate = state.curDate;
      state.init = action.payload;
      state.today = state.today;
    },
    setToday: (state, action) => {
      state.curDate = state.curDate;
      state.init = action.payload;
      state.today = action.payload;
    },
  },
});
