// src/redux/slices/appSlice.js
import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";

interface AlertType {
    title: string;
    text: string;
    icon: "success" | "error" | "warning" | "info" | "question";
    confirmButtonText?: string;
}

interface AppStateType  {
    theme: "light" | "light" | "dark" | "system",
    alert:  AlertType | null,
    settings: {} | Record<string, any>,
};

const initialState:AppStateType  = {
  theme: "light", // light | dark | system
  alert:  null,    // store latest alert config
  settings: {},   // any extra app-wide settings
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    showAlert: (state, action) => {
      state.alert = action.payload; // save alert config in state
    },
    clearAlert: (state) => {
      state.alert = null;
    },
    updateSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },
  },
});

// Async Thunk for showing SweetAlert
export const triggerAlert =
  ({ title, text, icon = "info", confirmButtonText = "OK" }:AlertType) =>
  async (dispatch: any) => {
    dispatch(appSlice.actions.showAlert({ title, text, icon }));
    await Swal.fire({
      title,
      text,
      icon,
      confirmButtonText,
    });
    dispatch(appSlice.actions.clearAlert());
};

export const { setTheme, showAlert, clearAlert, updateSettings } = appSlice.actions;

export default appSlice.reducer;
