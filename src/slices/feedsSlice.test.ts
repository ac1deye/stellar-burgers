import { describe, expect, test } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import { feedsMockState } from './mockData';
import {
  feedsSlice,
  initialState,
  fetchFeedsThunk,
  selectFeedsOrders,
  selectFeedsTotal,
  selectFeedsTotalToday
} from './feedsSlice';

describe('Feeds slice selectors tests', () => {
  test('selectFeedsOrders selector', () => {
    const store = configureStore({
      reducer: {
        feed: feedsSlice.reducer
      },
      preloadedState: {
        feed: feedsMockState
      }
    });

    const orders = selectFeedsOrders(store.getState());

    expect(orders).toEqual(feedsMockState.orders);
  });

  test('selectFeedsTotal selector', () => {
    const store = configureStore({
      reducer: {
        feed: feedsSlice.reducer
      },
      preloadedState: {
        feed: feedsMockState
      }
    });

    const total = selectFeedsTotal(store.getState());

    expect(total).toEqual(feedsMockState.total);
  });

  test('selectFeedsTotalToday selector', () => {
    const store = configureStore({
      reducer: {
        feed: feedsSlice.reducer
      },
      preloadedState: {
        feed: feedsMockState
      }
    });

    const totalToday = selectFeedsTotalToday(store.getState());

    expect(totalToday).toEqual(feedsMockState.totalToday);
  });
});

describe('Feeds slice thunks tests', () => {
  test('fetchFeedsThunk pending state', () => {
    const action = {
      type: fetchFeedsThunk.pending.type
    };

    const nextState = feedsSlice.reducer(initialState, action);

    expect(nextState.loading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  test('fetchFeedsThunk rejected state', () => {
    const errorText = 'fetchFeedsThunk error text';
    const action = {
      type: fetchFeedsThunk.rejected.type,
      error: { message: errorText }
    };

    const nextState = feedsSlice.reducer(initialState, action);

    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe(errorText);
  });

  test('fetchFeedsThunk fulfilled state', () => {
    const action = {
      type: fetchFeedsThunk.fulfilled.type,
      payload: feedsMockState
    };

    const nextState = feedsSlice.reducer(initialState, action);

    expect(nextState).toEqual(feedsMockState);
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBeNull();
  });
});
