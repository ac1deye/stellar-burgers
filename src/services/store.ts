import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { ingredientsSlice } from '../slices/ingredientsSlice';
import { userSlice } from '../slices/userSlice';
import { constructorSlice } from '../slices/constructorSlice';
import { orderSlice } from '../slices/orderSlice';
import { orderHistorySlice } from '../slices/ordersHistorySlice';
import { feedsSlice } from '../slices/feedsSlice';

export const rootReducer = combineReducers({
  [ingredientsSlice.name]: ingredientsSlice.reducer,
  [userSlice.name]: userSlice.reducer,
  [feedsSlice.name]: feedsSlice.reducer,
  [constructorSlice.name]: constructorSlice.reducer,
  [orderSlice.name]: orderSlice.reducer,
  [orderHistorySlice.name]: orderHistorySlice.reducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
