import { getIngredientsApi } from '@api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

export type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
};

const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: true
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
    selectIsLoading: (sliceState) => sliceState.isLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredientsThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchIngredientsThunk.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchIngredientsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      });
  }
});

export const { selectIngredients, selectIsLoading } =
  ingredientsSlice.selectors;
