import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { orderBurgerApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

/** Создание заказа */
export const orderBurgerThunk = createAsyncThunk(
  'orders/postOrderBurger',
  async (data: string[]) => orderBurgerApi(data)
);

export interface OrderState {
  order: TOrder | null;
  isOrderLoading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  order: null,
  isOrderLoading: false,
  error: null
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  selectors: {
    isOrderLoadingSelector: (state) => state.isOrderLoading,
    orderSelector: (state) => state.order,
    errorSelector: (state) => state.error
  },
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.isOrderLoading = false;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(orderBurgerThunk.pending, (state) => {
        state.isOrderLoading = true;
      })
      .addCase(orderBurgerThunk.rejected, (state, action) => {
        state.isOrderLoading = false;
        state.error = action.error.message!;
      })
      .addCase(orderBurgerThunk.fulfilled, (state, action) => {
        state.isOrderLoading = false;
        state.order = action.payload.order;
      });
  }
});

export const { clearOrder } = orderSlice.actions;
export const { isOrderLoadingSelector, orderSelector, errorSelector } =
  orderSlice.selectors;
export default orderSlice.reducer;
