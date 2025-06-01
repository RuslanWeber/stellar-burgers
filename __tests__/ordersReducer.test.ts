import reducer, {
  initialState,
  resetOrderState,
  setOrderError,
  submitBurgerOrder
} from '../src/services/slices/orderSlice';
import { TOrder } from '../src/utils/types';

const mockOrder: TOrder = {
  _id: 'test123',
  status: 'done',
  name: 'Test Burger',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
  number: 1234,
  ingredients: ['ingredient1', 'ingredient2']
};

describe('orderSlice reducer', () => {
  it('должен вернуть начальное состояние', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('resetOrderState сбрасывает состояние к начальному', () => {
    const modifiedState = {
      currentOrder: mockOrder,
      isSubmitting: true,
      errorMessage: 'Ошибка'
    };
    expect(reducer(modifiedState, resetOrderState())).toEqual(initialState);
  });

  it('setOrderError устанавливает сообщение об ошибке', () => {
    const action = setOrderError('Ошибка заказа');
    const state = reducer(initialState, action);
    expect(state.errorMessage).toBe('Ошибка заказа');
  });

  it('submitBurgerOrder.pending устанавливает isSubmitting и очищает ошибку', () => {
    const action = { type: submitBurgerOrder.pending.type };
    const state = reducer(initialState, action);
    expect(state.isSubmitting).toBe(true);
    expect(state.errorMessage).toBeNull();
  });

  it('submitBurgerOrder.fulfilled сохраняет заказ и завершает отправку', () => {
    const action = {
      type: submitBurgerOrder.fulfilled.type,
      payload: mockOrder
    };
    const state = reducer(initialState, action);
    expect(state.currentOrder).toEqual(mockOrder);
    expect(state.isSubmitting).toBe(false);
    expect(state.errorMessage).toBeNull();
  });

  it('submitBurgerOrder.rejected сохраняет ошибку и завершает отправку', () => {
    const action = {
      type: submitBurgerOrder.rejected.type,
      payload: 'Ошибка API'
    };
    const state = reducer(initialState, action);
    expect(state.isSubmitting).toBe(false);
    expect(state.errorMessage).toBe('Ошибка API');
  });

  it('submitBurgerOrder.rejected без payload использует сообщение по умолчанию', () => {
    const action = {
      type: submitBurgerOrder.rejected.type
    };
    const state = reducer(initialState, action as any);
    expect(state.errorMessage).toBe('Не удалось оформить заказ');
  });
});
