import { describe, expect, test } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import { ordersHistoryMockState } from './mockData';
import {
  orderHistorySlice,
  initialState,
  fetchOrdersThunk,
  selectOrdersList
} from './ordersHistorySlice';

describe('Order history slice selectors tests', () => {
  test('selectOrdersList selector', () => {
    const store = configureStore({
      reducer: {
        orderHistory: orderHistorySlice.reducer
      },
      preloadedState: {
        orderHistory: ordersHistoryMockState
      }
    });
    const orders = selectOrdersList(store.getState());

    expect(orders).toEqual(ordersHistoryMockState.orders);
  });
});

describe('Order history thunks tests', () => {
  test('fetchOrdersThunk pending state', () => {
    const action = {
      type: fetchOrdersThunk.pending.type
    };
    const nextState = orderHistorySlice.reducer(initialState, action);

    expect(nextState.loading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  test('fetchFeedsThunk rejected state', () => {
    const errorText = 'fetchFeedsThunk error text';
    const action = {
      type: fetchOrdersThunk.rejected.type,
      error: { message: errorText }
    };
    const nextState = orderHistorySlice.reducer(initialState, action);

    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe(errorText);
  });

  test('fetchFeedsThunk fulfilled state', () => {
    const action = {
      type: fetchOrdersThunk.fulfilled.type,
      payload: ordersHistoryMockState.orders
    };
    const nextState = orderHistorySlice.reducer(initialState, action);

    expect(nextState.orders).toEqual(ordersHistoryMockState.orders);
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBeNull();
  });
});
