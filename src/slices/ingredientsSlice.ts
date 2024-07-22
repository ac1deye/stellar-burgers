import { getIngredientsApi } from '../utils/burger-api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

export type TIngredientsState = {
  ingredients: TIngredient[];
  loading: boolean;
  error: string | null;
};

export const initialState: TIngredientsState = {
  ingredients: [],
  loading: true,
  error: null
};

export const fetchIngredientsThunk = createAsyncThunk(
  'ingredients/getAll',
  getIngredientsApi
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    selectIngredients: (sliceState) => sliceState.ingredients,
    selectIsLoading: (sliceState) => sliceState.loading
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredientsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredientsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'error';
      })
      .addCase(fetchIngredientsThunk.fulfilled, (state, action) => {
        state.ingredients = action.payload;
        state.loading = false;
        state.error = null;
      });
  }
});

export const { selectIngredients, selectIsLoading } =
  ingredientsSlice.selectors;
