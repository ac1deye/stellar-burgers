import { expect, test, describe } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import { ingredientsMockState, constructorMockState } from './mockData';
import {
  constructorSlice,
  initialState,
  addIngredient,
  removeIngredient,
  moveIngredient,
  resetIngredients,
  selectConstructorBurger
} from './constructorSlice';

describe('Constructor slice selectors tests', () => {
  test('selectConstructorBurger selector', () => {
    const store = configureStore({
      reducer: {
        burgerConstructor: constructorSlice.reducer
      },
      preloadedState: {
        burgerConstructor: constructorMockState
      }
    });
    const ingredients = selectConstructorBurger(store.getState());

    expect(ingredients).toEqual(constructorMockState);
  });
});

describe('Constructor slice actions tests', () => {
  test('Add bun action', () => {
    const ingredient = ingredientsMockState.ingredients.find(
      (item) => item.type === 'bun'
    )!;

    const nextState = constructorSlice.reducer(
      initialState,
      addIngredient(ingredient)
    );

    const { bun } = nextState;

    expect(bun?._id).toEqual(ingredient._id);
  });

  test('Add main action', () => {
    const ingredient = ingredientsMockState.ingredients.find(
      (item) => item.type === 'main'
    )!;

    const nextState = constructorSlice.reducer(
      initialState,
      addIngredient(ingredient)
    );
    const { ingredients } = nextState;

    expect(ingredients[0]._id).toEqual(ingredient._id);
  });

  test('Add sauce action', () => {
    const ingredient = ingredientsMockState.ingredients.find(
      (item) => item.type === 'sauce'
    )!;

    const nextState = constructorSlice.reducer(
      initialState,
      addIngredient(ingredient)
    );
    const { ingredients } = nextState;

    expect(ingredients[0]._id).toEqual(ingredient._id);
  });

  test('Remove ingredient action', () => {
    const nextState = constructorSlice.reducer(
      constructorMockState,
      removeIngredient(2)
    );
    const { ingredients } = nextState;

    expect(ingredients.length).toBe(
      constructorMockState.ingredients.length - 1
    );
  });

  test('Move ingredietns action', () => {
    const nextState = constructorSlice.reducer(
      constructorMockState,
      moveIngredient({ from: 1, to: 0 })
    );

    expect(nextState.ingredients[0]._id).toEqual(
      constructorMockState.ingredients[1]._id
    );
    expect(nextState.ingredients[1]._id).toEqual(
      constructorMockState.ingredients[0]._id
    );
  });

  test('Reset ingredients action', () => {
    const nextState = constructorSlice.reducer(
      constructorMockState,
      resetIngredients()
    );

    const { bun, ingredients } = nextState;

    expect(bun).toBeNull();
    expect(ingredients.length).toBe(0);
  });
});
