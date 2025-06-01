import reducer, {
  initialState,
  clearError,
  resetSelectedOrder,
  selectOrders,
  selectIsFeedLoading,
  selectSelectedOrder,
  selectIsOrderDetailsLoading,
  selectTotalOrders,
  selectTotalToday,
  selectFeedError,
  selectLastUpdated,
  fetchOrderFeed,
  fetchOrderByNumber
} from '../src/services/slices/feedSlice';

import { TOrder } from '../src/utils/types';

describe('feedSlice', () => {
  const mockOrder: TOrder = {
    _id: '1',
    ingredients: ['ingredient1', 'ingredient2'],
    status: 'done',
    name: 'Test Order',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    number: 1234
  };

  test('should return initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  test('clearError should set errorMessage to null', () => {
    const stateWithError = { ...initialState, errorMessage: 'Some error' };
    const state = reducer(stateWithError, clearError());
    expect(state.errorMessage).toBeNull();
  });

  test('resetSelectedOrder should set selectedOrder to null', () => {
    const stateWithOrder = { ...initialState, selectedOrder: mockOrder };
    const state = reducer(stateWithOrder, resetSelectedOrder());
    expect(state.selectedOrder).toBeNull();
  });

  describe('fetchOrderFeed', () => {
    test('pending', () => {
      const state = reducer(initialState, {
        type: fetchOrderFeed.pending.type
      });
      expect(state.isFeedLoading).toBe(true);
      expect(state.errorMessage).toBeNull();
    });

    test('fulfilled', () => {
      const actionPayload = {
        orders: [mockOrder],
        total: 10,
        totalToday: 3
      };

      const state = reducer(initialState, {
        type: fetchOrderFeed.fulfilled.type,
        payload: actionPayload
      });

      expect(state.orders).toEqual([mockOrder]);
      expect(state.totalOrders).toBe(10);
      expect(state.totalToday).toBe(3);
      expect(state.isFeedLoading).toBe(false);
      expect(state.lastUpdated).not.toBeNull();
    });

    test('rejected', () => {
      const state = reducer(initialState, {
        type: fetchOrderFeed.rejected.type,
        payload: 'Ошибка загрузки'
      });

      expect(state.isFeedLoading).toBe(false);
      expect(state.errorMessage).toBe('Ошибка загрузки');
    });
  });

  describe('fetchOrderByNumber', () => {
    test('pending', () => {
      const state = reducer(initialState, {
        type: fetchOrderByNumber.pending.type
      });
      expect(state.isOrderDetailsLoading).toBe(true);
      expect(state.errorMessage).toBeNull();
    });

    test('fulfilled', () => {
      const state = reducer(initialState, {
        type: fetchOrderByNumber.fulfilled.type,
        payload: [mockOrder]
      });

      expect(state.selectedOrder).toEqual(mockOrder);
      expect(state.isOrderDetailsLoading).toBe(false);
      expect(state.lastUpdated).not.toBeNull();
    });

    test('rejected', () => {
      const state = reducer(initialState, {
        type: fetchOrderByNumber.rejected.type,
        payload: 'Ошибка получения заказа'
      });

      expect(state.selectedOrder).toBeNull();
      expect(state.errorMessage).toBe('Ошибка получения заказа');
      expect(state.isOrderDetailsLoading).toBe(false);
    });
  });

  describe('selectors', () => {
    const fullState = {
      feed: {
        ...initialState,
        orders: [mockOrder],
        isFeedLoading: true,
        selectedOrder: mockOrder,
        isOrderDetailsLoading: true,
        totalOrders: 5,
        totalToday: 2,
        errorMessage: 'Ошибка',
        lastUpdated: '2025-06-01T12:00:00Z'
      }
    };

    test('selectOrders', () => {
      expect(selectOrders(fullState)).toEqual([mockOrder]);
    });

    test('selectIsFeedLoading', () => {
      expect(selectIsFeedLoading(fullState)).toBe(true);
    });

    test('selectSelectedOrder', () => {
      expect(selectSelectedOrder(fullState)).toEqual(mockOrder);
    });

    test('selectIsOrderDetailsLoading', () => {
      expect(selectIsOrderDetailsLoading(fullState)).toBe(true);
    });

    test('selectTotalOrders', () => {
      expect(selectTotalOrders(fullState)).toBe(5);
    });

    test('selectTotalToday', () => {
      expect(selectTotalToday(fullState)).toBe(2);
    });

    test('selectFeedError', () => {
      expect(selectFeedError(fullState)).toBe('Ошибка');
    });

    test('selectLastUpdated', () => {
      expect(selectLastUpdated(fullState)).toBe('2025-06-01T12:00:00Z');
    });
  });
});
