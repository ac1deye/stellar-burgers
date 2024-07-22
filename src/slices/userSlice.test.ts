import { describe, expect, test } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import { userMockState } from './mockData';
import {
  userSlice,
  initialState,
  tokenRefreshThunk,
  loginThunk,
  logoutThunk,
  registrationThunk,
  fetchUserThunk,
  updateUserThunk,
  selectIsLoading,
  selectError,
  selectIsAuthorized,
  selectUser
} from './userSlice';
import { getCookie } from '../utils/cookie';

describe('User slice selectors tests', () => {
  test('selectIsAuthorized selector', () => {
    const store = configureStore({
      reducer: {
        user: userSlice.reducer
      },
      preloadedState: {
        user: userMockState
      }
    });

    const isAuthorized = selectIsAuthorized(store.getState());

    expect(isAuthorized).toEqual(userMockState.isAuthorized);
  });

  test('selectUser selector', () => {
    const store = configureStore({
      reducer: {
        user: userSlice.reducer
      },
      preloadedState: {
        user: userMockState
      }
    });

    const user = selectUser(store.getState());

    expect(user).toEqual(userMockState.user);
  });

  test('selectError selector', () => {
    const store = configureStore({
      reducer: {
        user: userSlice.reducer
      },
      preloadedState: {
        user: userMockState
      }
    });

    const error = selectError(store.getState());

    expect(error).toEqual(userMockState.error);
  });

  test('selectIsLoading selector', () => {
    const store = configureStore({
      reducer: {
        user: userSlice.reducer
      },
      preloadedState: {
        user: userMockState
      }
    });

    const isLoading = selectIsLoading(store.getState());

    expect(isLoading).toEqual(userMockState.loading);
  });
});

// fetchOrdersThunk pending state
// fetchFeedsThunk rejected state
// fetchFeedsThunk fulfilled state
// describe('Order history thunks tests', () => {
//   test('fetchOrdersThunk pending state', () => {
//     const action = {
//       type: fetchOrdersThunk.pending.type
//     };

describe('User slice thunks tests', () => {
  test('loginThunk pending state', () => {
    const action = {
      type: loginThunk.pending.type
    };

    const nextState = userSlice.reducer(initialState, action);

    expect(nextState.loading).toBe(true);
    expect(nextState.error).toBeUndefined();
  });

  test('loginThunk rejected state', () => {
    const errorText = 'loginThunk error text';

    const action = {
      type: loginThunk.rejected.type,
      error: { message: errorText }
    };
    const nextState = userSlice.reducer(initialState, action);

    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe(errorText);
  });

  test('loginThunk fulfilled state', () => {
    const action = {
      type: loginThunk.fulfilled.type,
      payload: { user: userMockState.user }
    };
    const nextState = userSlice.reducer(initialState, action);

    expect(nextState.user).toEqual(userMockState.user);
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBeUndefined();
  });

  test('logoutThunk pending state', () => {
    const action = {
      type: logoutThunk.pending.type
    };
    const nextState = userSlice.reducer(initialState, action);

    expect(nextState.user).toBeNull();
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBeUndefined();
    expect(nextState.isAuthorized).toBe(false);
  });

  test('logoutThunk rejected state', () => {
    const errorText = 'logoutThunk error text';

    const action = {
      type: logoutThunk.rejected.type,
      error: { message: errorText }
    };
    const nextState = userSlice.reducer(initialState, action);

    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = getCookie('accessToken');

    expect(refreshToken).toBeNull();
    expect(accessToken).toBeUndefined();
    expect(nextState.user).toBeNull();
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBeUndefined();
    expect(nextState.isAuthorized).toBe(false);
  });

  test('logoutThunk fulfilled state', () => {
    const action = { type: logoutThunk.fulfilled.type };

    const nextState = userSlice.reducer(userMockState, action);

    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = getCookie('accessToken');

    expect(refreshToken).toBeNull();
    expect(accessToken).toBeUndefined();
    expect(nextState.user).toBeNull();
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBeUndefined();
    expect(nextState.isAuthorized).toBe(false);
  });

  test('registrationThunk pending state', () => {
    const action = {
      type: registrationThunk.pending.type
    };
    const nextState = userSlice.reducer(initialState, action);

    expect(nextState.loading).toBe(true);
    expect(nextState.error).toBeUndefined();
  });

  test('registrationThunk rejected state', () => {
    const errorText = 'registrationThunk error text';

    const action = {
      type: registrationThunk.rejected.type,
      error: { message: errorText }
    };
    const nextState = userSlice.reducer(initialState, action);

    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe(errorText);
  });

  test('registrationThunk fulfilled state', () => {
    const action = {
      type: registrationThunk.fulfilled.type,
      payload: { user: userMockState.user }
    };
    const nextState = userSlice.reducer(initialState, action);

    expect(nextState.user).toEqual(userMockState.user);
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBeUndefined();
  });

  test('fetchUserThunk fulfilled state', () => {
    const action = {
      type: fetchUserThunk.fulfilled.type,
      payload: { user: userMockState.user }
    };
    const nextState = userSlice.reducer(initialState, action);

    expect(nextState.user).toEqual(userMockState.user);
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBeUndefined();
  });

  test('updateUserThunk fulfilled state', () => {
    const updatedUser = {
      name: 'Tolik',
      email: userMockState.user
    };

    const action = {
      type: updateUserThunk.fulfilled.type,
      payload: { user: updatedUser }
    };

    const nextState = userSlice.reducer(userMockState, action);

    expect(nextState.user).toEqual(updatedUser);
  });

  test('tokenRefreshThunk rejected state', () => {
    const errorText = 'tokenRefreshThunk error text';
    const action = {
      type: tokenRefreshThunk.rejected.type,
      error: { message: errorText }
    };

    const nextState = userSlice.reducer(userMockState, action);

    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = getCookie('accessToken');

    expect(nextState.loading).toBe(false);
    expect(nextState.isAuthorized).toBe(false);
    expect(nextState.user).toBeNull();
    expect(refreshToken).toBeNull();
    expect(accessToken).toBeUndefined();
  });

  test('tokenRefreshThunk fulfilled state', () => {
    const action = {
      type: tokenRefreshThunk.fulfilled.type,
      payload: {
        refreshToken: '12345',
        accessToken: '54321',
        user: userMockState.user
      }
    };

    const nextState = userSlice.reducer(initialState, action);

    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = getCookie('accessToken');

    expect(nextState.loading).toBe(false);
    expect(nextState.isAuthorized).toBe(true);
    expect(refreshToken).toBe('12345');
    expect(accessToken).toBe('54321');
  });
});
