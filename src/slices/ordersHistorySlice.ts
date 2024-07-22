import { getOrdersApi } from '../utils/burger-api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

interface TOrderHistoryState {
  orders: Array<TOrder>;
  loading: boolean;
  error: string | null;
}

export const initialState: TOrderHistoryState = {
  orders: [],
  loading: false,
  error: null
};

export const fetchOrdersThunk = createAsyncThunk('orders/list', getOrdersApi);

export const orderHistorySlice = createSlice({
  name: 'orderHistory',
  initialState,
  reducers: {},
  selectors: {
    selectOrdersList: (state) => state.orders
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'error';
      })
      .addCase(fetchOrdersThunk.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
        state.error = null;
      });
  }
});

export const { selectOrdersList } = orderHistorySlice.selectors;
