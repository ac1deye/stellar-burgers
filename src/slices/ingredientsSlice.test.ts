import { describe, expect, test } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import { ingredientsMockState } from './mockData';
import {
  ingredientsSlice,
  initialState,
  selectIngredients,
  selectIsLoading,
  fetchIngredientsThunk
} from './ingredientsSlice';

describe('Ingredients slice selectors tests', () => {
  test('selectIngredients selector', () => {
    const store = configureStore({
      reducer: {
        ingredients: ingredientsSlice.reducer
      },
      preloadedState: {
        ingredients: ingredientsMockState
      }
    });
    const ingredients = selectIngredients(store.getState());

    expect(ingredients).toEqual(ingredientsMockState.ingredients);
  });

  test('ingredientsLoading selector', () => {
    const store = configureStore({
      reducer: {
        ingredients: ingredientsSlice.reducer
      },
      preloadedState: {
        ingredients: ingredientsMockState
      }
    });

    const ingredientsLoading = selectIsLoading(store.getState());

    expect(ingredientsLoading).toEqual(ingredientsMockState.loading);
  });
});

describe('Ingredients slice thunks tests', () => {
  test('fetchIngredientsThunk pending state', () => {
    const action = {
      type: fetchIngredientsThunk.pending.type
    };

    const nextState = ingredientsSlice.reducer(initialState, action);

    expect(nextState.loading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  test('fetchIngredientsThunk rejected state', () => {
    const errorText = 'fetchIngredientsThunk error text';
    const action = {
      type: fetchIngredientsThunk.rejected.type,
      error: { message: errorText }
    };

    const nextState = ingredientsSlice.reducer(initialState, action);

    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe(errorText);
  });

  test('fetchIngredientsThunk fulfilled state', () => {
    const action = {
      type: fetchIngredientsThunk.fulfilled.type,
      payload: ingredientsMockState.ingredients
    };

    const nextState = ingredientsSlice.reducer(initialState, action);

    expect(nextState.ingredients).toEqual(ingredientsMockState.ingredients);
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBeNull();
  });
});
