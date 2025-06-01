import {
  TypedUseSelectorHook,
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector
} from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';

import burgerConstructorReducer from './slices/burgerConstructorSlice';
import feedReducer from './slices/feedSlice';
import ingredientsReducer from './slices/ingedientsSlice';
import orderReducer from './slices/orderSlice';
import userReducer from './slices/userSlice';

export const rootReducer = combineReducers({
  burgerConstructor: burgerConstructorReducer,
  feed: feedReducer,
  ingredients: ingredientsReducer,
  order: orderReducer,
  user: userReducer
});

export const setupStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [],
          ignoredPaths: []
        },
        immutableCheck: true
      }),
    devTools: process.env.NODE_ENV !== 'production',
    preloadedState
  });

export const store = setupStore();

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];

export const useDispatch: () => AppDispatch = useReduxDispatch;
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;

export const createTestStore = (initialState?: Partial<RootState>) =>
  setupStore(initialState);

export default store;
