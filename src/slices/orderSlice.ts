import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrderByNumberApi, orderBurgerApi } from '../utils/burger-api';

interface TOrdersState {
  currentOrder: TOrder | null;
  modalOrder: TOrder | null;
  loading: boolean;
  error: string | null;
}

export const fetchOrderThunk = createAsyncThunk(
  'order/fetchOrder',
  async (id: number) => getOrderByNumberApi(id)
);

export const createOrderThunk = createAsyncThunk(
  'order/createOrder',
  (data: string[]) => orderBurgerApi(data)
);

export const initialState: TOrdersState = {
  currentOrder: null,
  modalOrder: null,
  loading: false,
  error: null
};

export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearModalOrder: (state) => {
      state.modalOrder = null;
    }
  },
  selectors: {
    selectCurrentOrder: (state) => state.currentOrder,
    selectOrderRequest: (state) => state.loading,
    selectModalOrder: (state) => state.modalOrder
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderThunk.pending, (state) => {
        state.loading = true;
        state.currentOrder = null;
        state.error = null;
      })
      .addCase(fetchOrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'error';
      })
      .addCase(fetchOrderThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.orders[0];
        state.error = null;
      })
      .addCase(createOrderThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'error';
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.modalOrder = action.payload.order;
        state.error = null;
      });
  }
});

export const { clearModalOrder } = orderSlice.actions;
export const { selectCurrentOrder, selectOrderRequest, selectModalOrder } =
  orderSlice.selectors;
