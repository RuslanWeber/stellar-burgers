import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '../../utils/burger-api';

type IngredientsState = {
  items: TIngredient[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
};

const initialState: IngredientsState = {
  items: [],
  isLoading: false,
  error: null,
  lastUpdated: null
};

export const fetchIngredients = createAsyncThunk<TIngredient[]>(
  'ingredients/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await getIngredientsApi();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  selectors: {
    selectIngredients: (s) => s.items,
    selectIsLoading: (s) => s.isLoading,
    selectIngredientsError: (s) => s.error
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetIngredients: () => initialState
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || 'Ошибка загрузки ингредиентов';
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isLoading = false;
        state.lastUpdated = new Date().toISOString();
      })
});

export const { selectIngredients, selectIsLoading, selectIngredientsError } =
  ingredientsSlice.selectors;

export const { clearError, resetIngredients } = ingredientsSlice.actions;

export default ingredientsSlice.reducer;
