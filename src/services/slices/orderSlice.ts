import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

export interface OrderState {
  currentOrder: TOrder | null;
  isSubmitting: boolean;
  errorMessage: string | null;
}

const initialState: OrderState = {
  currentOrder: null,
  isSubmitting: false,
  errorMessage: null
};

export const submitBurgerOrder = createAsyncThunk<TOrder, string[]>(
  'order/submit',
  async (ingredientIds, { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredientIds);
      return response.order;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrderState: (state) => {
      state.currentOrder = null;
      state.isSubmitting = false;
      state.errorMessage = null;
    },
    setOrderError: (state, action: PayloadAction<string>) => {
      state.errorMessage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitBurgerOrder.pending, (state) => {
        state.isSubmitting = true;
        state.errorMessage = null;
      })
      .addCase(submitBurgerOrder.rejected, (state, action) => {
        state.isSubmitting = false;
        state.errorMessage =
          (action.payload as string) || 'Не удалось оформить заказ';
      })
      .addCase(submitBurgerOrder.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.currentOrder = action.payload;
        state.errorMessage = null;
      });
  }
});

export const selectOrderState = (state: { order: OrderState }) => state.order;
export const selectIsSubmitting = (state: { order: OrderState }) =>
  state.order.isSubmitting;
export const selectCurrentOrder = (state: { order: OrderState }) =>
  state.order.currentOrder;
export const selectOrderError = (state: { order: OrderState }) =>
  state.order.errorMessage;

export const { resetOrderState, setOrderError } = orderSlice.actions;

export default orderSlice.reducer;
