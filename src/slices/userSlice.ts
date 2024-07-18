import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  TLoginData,
  TRegisterData,
  refreshToken
} from '@api';
import { TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../utils/cookie';

type TAuthState = {
  error: string | undefined;
  isLoading: boolean;
  isAuthorized: boolean;
  user: TUser | null;
};

const isAuth = getCookie('accessToken') !== undefined;

const initialState: TAuthState = {
  isAuthorized: isAuth,
  user: null,
  error: undefined,
  isLoading: false
};

export const tokenRefreshThunk = createAsyncThunk(
  'token/refresh',
  refreshToken
);

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (data: TLoginData) => loginUserApi(data)
);

export const logoutThunk = createAsyncThunk('auth/logout', logoutApi);

export const registrationThunk = createAsyncThunk(
  'auth/register',
  async (data: TRegisterData) => registerUserApi(data)
);

export const fetchUserThunk = createAsyncThunk('user/get', getUserApi);

export const updateUserThunk = createAsyncThunk(
  'user/update',
  async (data: TRegisterData) => updateUserApi(data)
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    selectIsLoading: (state) => state.isLoading,
    selectError: (state) => state.error,
    selectIsAuthorized: (state) => state.isAuthorized,
    selectUser: (state) => state.user
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.error = undefined;
        state.isLoading = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? undefined;
        state.isAuthorized = false;
        state.user = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthorized = true;
        state.user = action.payload.user;

        localStorage.setItem('refreshToken', action.payload.refreshToken);

        setCookie('accessToken', action.payload.accessToken);
      })
      .addCase(registrationThunk.pending, (state) => {
        state.error = undefined;
        state.isLoading = true;
      })
      .addCase(registrationThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? undefined;
        state.isAuthorized = false;
        state.user = null;
      })
      .addCase(registrationThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthorized = true;
        state.user = action.payload.user;

        localStorage.setItem('refreshToken', action.payload.refreshToken);

        setCookie('accessToken', action.payload.accessToken);
      })
      .addCase(fetchUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthorized = true;
        state.user = action.payload.user;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(logoutThunk.pending, (state) => {
        state.user = null;
        state.isAuthorized = false;
      })
      .addCase(logoutThunk.rejected, (state) => {
        localStorage.removeItem('refreshToken');
        deleteCookie('accessToken');
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        localStorage.removeItem('refreshToken');
        deleteCookie('accessToken');
      })
      .addCase(tokenRefreshThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthorized = false;
        state.user = null;

        localStorage.removeItem('refreshToken');
        deleteCookie('accessToken');
      })
      .addCase(tokenRefreshThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthorized = true;

        localStorage.setItem('refreshToken', action.payload.refreshToken);
        setCookie('accessToken', action.payload.accessToken);
      });
  }
});

export const { selectIsLoading, selectError, selectIsAuthorized, selectUser } =
  userSlice.selectors;
