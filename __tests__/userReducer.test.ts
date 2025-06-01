import reducer, {
  resetError,
  trackAction,
  authorizeUser,
  registerNewUser,
  fetchUserProfile,
  updateUserProfile,
  signOutUser,
  loadUserOrders
} from '../src/services/slices/userSlice';

import { TUser, TOrder } from '../src/utils/types';

const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

const mockOrders: TOrder[] = [
  {
    _id: '1',
    status: 'done',
    name: 'Order 1',
    createdAt: '2021-01-01',
    updatedAt: '2021-01-02',
    number: 1001,
    ingredients: ['ingredient1', 'ingredient2']
  }
];

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  orders: [],
  isFetchingOrders: false,
  errorMessage: null,
  lastAction: null
};

describe('userSlice', () => {
  it('должен вернуть начальное состояние', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('resetError сбрасывает сообщение об ошибке', () => {
    const state = { ...initialState, errorMessage: 'Ошибка' };
    expect(reducer(state, resetError()).errorMessage).toBeNull();
  });

  it('trackAction сохраняет последнее действие', () => {
    const state = reducer(initialState, trackAction('customAction'));
    expect(state.lastAction).toBe('customAction');
  });

  describe('authorizeUser', () => {
    it('pending устанавливает isLoading', () => {
      const state = reducer(initialState, { type: authorizeUser.pending.type });
      expect(state.isLoading).toBe(true);
    });

    it('fulfilled сохраняет пользователя и аутентифицирует', () => {
      const state = reducer(initialState, {
        type: authorizeUser.fulfilled.type,
        payload: mockUser
      });
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.lastAction).toBe('authSuccess');
    });

    it('rejected сохраняет ошибку', () => {
      const state = reducer(initialState, {
        type: authorizeUser.rejected.type,
        error: { message: 'Ошибка входа' }
      });
      expect(state.errorMessage).toBe('Ошибка входа');
      expect(state.lastAction).toBe('actionFailed');
    });
  });

  describe('registerNewUser', () => {
    it('fulfilled сохраняет пользователя и аутентифицирует', () => {
      const state = reducer(initialState, {
        type: registerNewUser.fulfilled.type,
        payload: mockUser
      });
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.lastAction).toBe('authSuccess');
    });
  });

  describe('fetchUserProfile', () => {
    it('fulfilled сохраняет профиль пользователя', () => {
      const state = reducer(initialState, {
        type: fetchUserProfile.fulfilled.type,
        payload: { user: mockUser }
      });
      expect(state.user).toEqual(mockUser);
      expect(state.lastAction).toBe('profileLoaded');
    });
  });

  describe('updateUserProfile', () => {
    it('fulfilled обновляет профиль пользователя', () => {
      const state = reducer(initialState, {
        type: updateUserProfile.fulfilled.type,
        payload: { user: mockUser }
      });
      expect(state.user).toEqual(mockUser);
      expect(state.lastAction).toBe('profileUpdated');
    });
  });

  describe('signOutUser', () => {
    it('pending очищает пользователя и isAuthenticated', () => {
      const preState = {
        ...initialState,
        user: mockUser,
        isAuthenticated: true
      };
      const state = reducer(preState, { type: signOutUser.pending.type });
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.lastAction).toBe('signOut');
    });
  });

  describe('loadUserOrders', () => {
    it('pending устанавливает isFetchingOrders', () => {
      const state = reducer(initialState, {
        type: loadUserOrders.pending.type
      });
      expect(state.isFetchingOrders).toBe(true);
      expect(state.errorMessage).toBeNull();
    });

    it('fulfilled сохраняет заказы', () => {
      const state = reducer(initialState, {
        type: loadUserOrders.fulfilled.type,
        payload: mockOrders
      });
      expect(state.orders).toEqual(mockOrders);
      expect(state.isFetchingOrders).toBe(false);
      expect(state.lastAction).toBe('ordersLoaded');
    });

    it('rejected сохраняет ошибку', () => {
      const state = reducer(initialState, {
        type: loadUserOrders.rejected.type,
        error: { message: 'Не удалось загрузить заказы' }
      });
      expect(state.isFetchingOrders).toBe(false);
      expect(state.errorMessage).toBe('Не удалось загрузить заказы');
      expect(state.lastAction).toBe('ordersLoadFailed');
    });
  });
});
