import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '@utils-types';

export interface BurgerConstructorState {
  ingredients: {
    bun: TConstructorIngredient | null;
    fillings: TConstructorIngredient[];
  };
  error: string | null;
  lastUpdated: number | null;
}

const initialState: BurgerConstructorState = {
  ingredients: {
    bun: null,
    fillings: []
  },
  error: null,
  lastUpdated: null
};

const fillingsHelpers = {
  moveItem: (
    fillings: TConstructorIngredient[],
    fromIndex: number,
    toIndex: number
  ) => {
    if (
      fromIndex < 0 ||
      fromIndex >= fillings.length ||
      toIndex < 0 ||
      toIndex >= fillings.length
    ) {
      return fillings;
    }

    const newFillings = [...fillings];
    const [movedItem] = newFillings.splice(fromIndex, 1);
    newFillings.splice(toIndex, 0, movedItem);
    return newFillings;
  }
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  selectors: {
    selectConstructorState: (state) => state,
    selectConstructorData: (state) => state.ingredients, // Добавлен обратно
    selectBun: (state) => state.ingredients.bun,
    selectFillings: (state) => state.ingredients.fillings,
    selectTotalPrice: (state) => {
      const bunPrice = state.ingredients.bun?.price || 0;
      const fillingsPrice = state.ingredients.fillings.reduce(
        (sum, item) => sum + item.price,
        0
      );
      return bunPrice * 2 + fillingsPrice;
    }
  },
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const ingredient = action.payload;
        if (ingredient.type === 'bun') {
          state.ingredients.bun = ingredient;
        } else {
          state.ingredients.fillings.push(ingredient);
        }
        state.lastUpdated = Date.now();
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() }
      })
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      state.ingredients.fillings = fillingsHelpers.moveItem(
        state.ingredients.fillings,
        fromIndex,
        toIndex
      );
      state.lastUpdated = Date.now();
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients.fillings = state.ingredients.fillings.filter(
        (item) => item.id !== action.payload
      );
      state.lastUpdated = Date.now();
    },
    resetConstructor: (state) => {
      state.ingredients.bun = null;
      state.ingredients.fillings = [];
      state.lastUpdated = Date.now();
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const {
  selectConstructorState,
  selectConstructorData,
  selectBun,
  selectFillings,
  selectTotalPrice
} = burgerConstructorSlice.selectors;

export const {
  addIngredient,
  moveIngredient,
  removeIngredient,
  resetConstructor,
  setError
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;
