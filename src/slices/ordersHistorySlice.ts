import { getOrdersApi } from '@api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

interface TOrderHistoryState {
  orders: Array<TOrder>;
  loading: boolean;
}

const initialState: TOrderHistoryState = {
  orders: [],
  loading: false
};

export const fetchOrdersThunk = createAsyncThunk('orders/list', async () =>
  getOrdersApi()
);

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
      })
      .addCase(fetchOrdersThunk.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchOrdersThunk.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
      });
  }
});

export const { selectOrdersList } = orderHistorySlice.selectors;
