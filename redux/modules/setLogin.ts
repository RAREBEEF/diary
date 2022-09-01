import { createSlice } from "@reduxjs/toolkit";
import { User, UserCredential } from "firebase/auth";

export interface loginDataStateType {
  init: boolean;
  isLoggedIn: boolean;
  userData: { user: User | null; uid: string; displayName: string };
}

export const initialState: loginDataStateType = {
  init: false,
  isLoggedIn: false,
  userData: { user: null, uid: "", displayName: "" },
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
