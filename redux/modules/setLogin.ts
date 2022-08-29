import { createSlice } from "@reduxjs/toolkit";

export interface loginDataStateType {
  init: boolean;
  isLoggedIn: boolean;
  userData: { uid: string; displayName: string };
}

export const initialState: loginDataStateType = {
  init: false,
  isLoggedIn: false,
  userData: { uid: "", displayName: "" },
};

export const login = createSlice({
  name: "login",
  initialState,
  reducers: {
    setLogIn: (state, action) => {
      state.init = action.payload.init;
      state.isLoggedIn = action.payload.isLoggedIn;
      state.userData = action.payload.userData;
    },
  },
});
