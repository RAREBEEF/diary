import { combineReducers, configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import { login, loginDataStateType } from "./modules/setLogin";
import calendarDataStateType, { setCalendar } from "./modules/setCalendar";
import diariesData, { DiariesDataStateType } from "./modules/setDiaries";

export interface reduxStateType {
  calendarData: calendarDataStateType;
  loginData: loginDataStateType;
  diariesData: DiariesDataStateType;
}

const reducer = combineReducers({
  calendarData: setCalendar.reducer,
  loginData: login.reducer,
  diariesData,
});
const store = configureStore({ reducer, middleware: [thunk] });

export default store;
