import { combineReducers, configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import { login, loginDataStateType } from "./modules/setLogin";
import calendarDataStateType, { setCalendar } from "./modules/setCalendar";
import diariesData, { DiariesDataStateType } from "./modules/setDiaries";
import holiData, { HoliDataStateType } from "./modules/setHoli";

export interface reduxStateType {
  calendarData: calendarDataStateType;
  loginData: loginDataStateType;
  diariesData: DiariesDataStateType;
  holiData: HoliDataStateType;
}

const reducer = combineReducers({
  calendarData: setCalendar.reducer,
  loginData: login.reducer,
  diariesData,
  holiData,
});
const store = configureStore({ reducer, middleware: [thunk] });

export default store;
