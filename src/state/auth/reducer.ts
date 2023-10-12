import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosRequestConfig } from "axios";

import messaging from "messaging";
import api from "api";
import { console } from "utils";

type Backend = {
  getLogin: (config?: AxiosRequestConfig) => Promise<void>;
  login: (
    data: { username: string; password: string; refreshToken?: string },
    config?: AxiosRequestConfig
  ) => Promise<void>;
  logout: (config?: AxiosRequestConfig) => Promise<void>;
};
const backend: Backend = {
  getLogin: (_config?: AxiosRequestConfig) => Promise.resolve(),
  login: (_data: { username: string; password: string; refreshToken?: string }, _config?: AxiosRequestConfig) =>
    Promise.resolve(),
  logout: (_config?: AxiosRequestConfig) => Promise.resolve(),
};
if (process.env.NODE_ENV === "development") {
  console.info("Development: Using api library as backend.");
  backend.getLogin = api.getLogin;
  backend.login = api.login;
  backend.logout = api.logout;
} else if (process.env.NODE_ENV === "production") {
  console.info("Production: Using messaging library as backend.");
  backend.getLogin = messaging.getLogin;
  backend.login = messaging.login;
  backend.logout = messaging.logout;
}

type State = {
  loggedIn: boolean;
  loading: boolean;
  loginError: boolean;
  logoutError: boolean;
};

const initialState: State = {
  loggedIn: false,
  loading: false,
  loginError: false,
  logoutError: false,
};

export const getLogin = createAsyncThunk("auth/getLogin", backend.getLogin);
export const login = createAsyncThunk("auth/login", backend.login);
export const logout = createAsyncThunk("auth/logout", backend.logout);

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLogin.pending, (state) => ({
      ...state,
      loading: true,
    }));
    builder.addCase(getLogin.fulfilled, (state) => ({
      ...state,
      loading: false,
      loggedIn: true,
    }));
    builder.addCase(getLogin.rejected, (state) => ({
      ...state,
      loading: false,
      loggedIn: false,
    }));
    builder.addCase(login.pending, (state) => ({
      ...state,
      loading: true,
      loginError: false,
    }));
    builder.addCase(login.fulfilled, (state) => ({
      ...state,
      loading: false,
      loginError: false,
      loggedIn: true,
    }));
    builder.addCase(login.rejected, (state) => ({
      ...state,
      loading: false,
      loginError: true,
    }));
    builder.addCase(logout.pending, (state) => ({
      ...state,
      loading: true,
      logoutError: false,
    }));
    builder.addCase(logout.fulfilled, (state) => ({
      ...state,
      loading: false,
      logoutError: false,
      loggedIn: false,
    }));
    builder.addCase(logout.rejected, (state) => ({
      ...state,
      loading: false,
      logoutError: true,
    }));
  },
});

export const actions = { ...slice.actions, getLogin, login, logout };

export default slice.reducer;
