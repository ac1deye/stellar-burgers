import { describe, expect, test } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import { orderMockState } from './mockData';
import {
  orderSlice,
  initialState,
  clearModalOrder,
  fetchOrderThunk,
  createOrderThunk,
  selectCurrentOrder,
  selectOrderRequest,
  selectModalOrder
} from './orderSlice';

describe('Order slice selectors tests', () => {
  test('selectCurrentOrder selector', () => {
    const store = configureStore({
      reducer: {
        orders: orderSlice.reducer
      },
      preloadedState: {
        orders: orderMockState
      }
    });
    const currentOrder = selectCurrentOrder(store.getState());

    expect(currentOrder).toEqual(orderMockState.currentOrder);
  });

  test('selectOrderRequest selector', () => {
    const store = configureStore({
      reducer: {
        orders: orderSlice.reducer
      },
      preloadedState: {
        orders: orderMockState
      }
    });

    const orderLoading = selectOrderRequest(store.getState());

    expect(orderLoading).toEqual(orderMockState.loading);
  });

  test('selectModalOrder selector', () => {
    const store = configureStore({
      reducer: {
        orders: orderSlice.reducer
      },
      preloadedState: {
        orders: orderMockState
      }
    });

    const modalOrder = selectModalOrder(store.getState());

    expect(modalOrder).toEqual(orderMockState.modalOrder);
  });
});

describe('Order slice actions tests', () => {
  test('clearModalOrder action', () => {
    const nextState = orderSlice.reducer(orderMockState, clearModalOrder());

    expect(nextState.modalOrder).toBeNull();
  });
});

describe('Order slice thunks tests', () => {
  test('fetchOrderThunk pending state', () => {
    const action = {
      type: fetchOrderThunk.pending.type
    };

    const nextState = orderSlice.reducer(initialState, action);

    expect(nextState.loading).toBe(true);
    expect(nextState.error).toBe(null);
  });

  test('fetchOrderThunk rejected state', () => {
    const errorText = 'fetchOrderThunk error text';
    const action = {
      type: fetchOrderThunk.rejected.type,
      error: { message: errorText }
    };

    const nextState = orderSlice.reducer(initialState, action);

    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe(errorText);
  });

  test('fetchOrderThunk fulfilled state', () => {
    const action = {
      type: fetchOrderThunk.fulfilled.type,
      payload: { orders: [orderMockState.currentOrder] }
    };
    const nextState = orderSlice.reducer(initialState, action);

    expect(nextState.currentOrder).toEqual(orderMockState.currentOrder);
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe(null);
  });

  test('createOrderThunk pending state', () => {
    const action = {
      type: createOrderThunk.pending.type
    };

    const nextState = orderSlice.reducer(initialState, action);

    expect(nextState.loading).toBe(true);
    expect(nextState.error).toBe(null);
  });

  test('createOrderThunk rejected state', () => {
    const errorText = 'createOrderThunk error text';

    const action = {
      type: createOrderThunk.rejected.type,
      error: { message: errorText }
    };

    const nextState = orderSlice.reducer(initialState, action);

    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe(errorText);
  });

  test('createOrderThunk fulfilled state', () => {
    const action = {
      type: createOrderThunk.fulfilled.type,
      payload: { order: orderMockState.modalOrder }
    };
    const nextState = orderSlice.reducer(initialState, action);

    expect(nextState.modalOrder).toEqual(orderMockState.modalOrder);
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe(null);
  });
});
