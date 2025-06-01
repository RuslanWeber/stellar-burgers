import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

interface FeedState {
  orders: TOrder[];
  isFeedLoading: boolean;
  selectedOrder: TOrder | null;
  isOrderDetailsLoading: boolean;
  totalOrders: number;
  totalToday: number;
  errorMessage: string | null;
  lastUpdated: string | null; // Добавлено новое поле без изменения существующих
}

const initialState: FeedState = {
  orders: [],
  isFeedLoading: false,
  selectedOrder: null,
  isOrderDetailsLoading: false,
  totalOrders: 0,
  totalToday: 0,
  errorMessage: null,
  lastUpdated: null
};

// Добавлена обработка ошибок через rejectWithValue
export const fetchOrderFeed = createAsyncThunk(
  'feed/fetchAllOrders',
  async (_, { rejectWithValue }) => {
    try {
      return await getFeedsApi();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Улучшенная типизация и обработка ошибок
export const fetchOrderByNumber = createAsyncThunk<TOrder[], number>(
  'feed/fetchOrderByNumber',
  async (orderNumber, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(orderNumber);
      if (!response.orders.length) {
        return rejectWithValue('Заказ не найден');
      }
      return response.orders;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  selectors: {
    selectOrders: (s) => s.orders,
    selectIsFeedLoading: (s) => s.isFeedLoading,
    selectSelectedOrder: (s) => s.selectedOrder,
    selectIsOrderDetailsLoading: (s) => s.isOrderDetailsLoading,
    selectTotalOrders: (s) => s.totalOrders,
    selectTotalToday: (s) => s.totalToday,
    selectFeedError: (s) => s.errorMessage,
    selectLastUpdated: (s) => s.lastUpdated
  },
  reducers: {
    clearError: (state) => {
      state.errorMessage = null;
    },
    resetSelectedOrder: (state) => {
      state.selectedOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderFeed.pending, (state) => {
        state.isFeedLoading = true;
        state.errorMessage = null;
      })
      .addCase(fetchOrderFeed.rejected, (state, action) => {
        state.isFeedLoading = false;
        state.errorMessage =
          (action.payload as string) || 'Ошибка загрузки ленты заказов';
      })
      .addCase(fetchOrderFeed.fulfilled, (state, action) => {
        const { orders, total, totalToday } = action.payload;
        state.orders = orders;
        state.totalOrders = total;
        state.totalToday = totalToday;
        state.isFeedLoading = false;
        state.lastUpdated = new Date().toISOString(); // Обновляем метку времени
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isOrderDetailsLoading = true;
        state.errorMessage = null;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isOrderDetailsLoading = false;
        state.errorMessage =
          (action.payload as string) || 'Ошибка получения заказа';
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.selectedOrder = action.payload?.[0] ?? null;
        state.isOrderDetailsLoading = false;
        state.lastUpdated = new Date().toISOString(); // Обновляем метку времени
      });
  }
});

export const {
  selectOrders,
  selectIsFeedLoading,
  selectSelectedOrder,
  selectIsOrderDetailsLoading,
  selectTotalOrders,
  selectTotalToday,
  selectFeedError,
  selectLastUpdated
} = feedSlice.selectors;

export const { clearError, resetSelectedOrder } = feedSlice.actions;

export default feedSlice.reducer;
