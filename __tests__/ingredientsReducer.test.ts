import reducer, {
  initialState,
  fetchIngredients,
  clearError,
  resetIngredients
} from '../src/services/slices/ingedientsSlice';
import { TIngredient } from '../src/utils/types';

// Пример данных
const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Test Ingredient',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 200,
    price: 100,
    image: '',
    image_mobile: '',
    image_large: ''
  }
];

describe('ingredientsSlice reducer', () => {
  it('должен вернуть начальное состояние', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('clearError должен очищать ошибку', () => {
    const stateWithError = { ...initialState, error: 'Some error' };
    expect(reducer(stateWithError, clearError()).error).toBeNull();
  });

  it('resetIngredients должен сбрасывать состояние', () => {
    const modifiedState = {
      items: mockIngredients,
      isLoading: true,
      error: 'Error',
      lastUpdated: '2020-01-01T00:00:00.000Z'
    };
    expect(reducer(modifiedState, resetIngredients())).toEqual(initialState);
  });

  it('fetchIngredients.pending устанавливает isLoading=true и очищает ошибку', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fetchIngredients.fulfilled сохраняет данные и завершает загрузку', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = reducer(initialState, action);
    expect(state.items).toEqual(mockIngredients);
    expect(state.isLoading).toBe(false);
    expect(state.lastUpdated).not.toBeNull();
  });

  it('fetchIngredients.rejected сохраняет ошибку и завершает загрузку', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      payload: 'Ошибка загрузки'
    };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });

  it('fetchIngredients.rejected без payload использует сообщение по умолчанию', () => {
    const action = {
      type: fetchIngredients.rejected.type
    };
    const state = reducer(initialState, action as any);
    expect(state.error).toBe('Ошибка загрузки ингредиентов');
  });
});
