import { createSlice } from "@reduxjs/toolkit";

const accessToken = localStorage.getItem("access");
const refreshToken = localStorage.getItem("refresh");
const storedUser = localStorage.getItem("user");

const initialState = {
  accessToken,
  refreshToken,
  user: storedUser ? JSON.parse(storedUser) : null,
  isAuthenticated: Boolean(accessToken),
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    loginSuccess: (state, action) => {
      const { access, refresh, user } = action.payload;

      state.accessToken = access;
      state.refreshToken = refresh;
      state.user = user;
      state.isAuthenticated = true;

      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }
    },

    tokenRefreshed: (state, action) => {
      state.accessToken = action.payload.access;

      localStorage.setItem("access", action.payload.access);

      if (action.payload.refresh) {
        state.refreshToken = action.payload.refresh;
        localStorage.setItem("refresh", action.payload.refresh);
      }
    },

    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthenticated = false;

      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("user");
    },
  },
});

export const { loginSuccess, tokenRefreshed, logout } = authSlice.actions;

export default authSlice.reducer;
