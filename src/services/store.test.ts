
import { expect, test } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './store';

describe('RootReducer init tests', () => {
  test('rootReducer init', () => {
    const store = configureStore({
      reducer: rootReducer
    });

    const action = { type: 'UNKNOWN_ACTION' };
    const testState = rootReducer(undefined, action);
    expect(testState).toEqual(store.getState());
  });
});