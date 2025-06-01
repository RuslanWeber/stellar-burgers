import { rootReducer, store } from '../src/services/store';

describe('Тестирование rootReducer', () => {
  test('Вызов rootReducer с UNKNOWN_ACTION и undefined возвращает предыдущее состояние хранилища', () => {
    const before = store.getState(); // Сохраняем начальное состояние

    const action = { type: 'UNKNOWN_ACTION' }; // Создаем экшен с неизвестным типом
    const after = rootReducer(before, action); // Применяем экшен

    // Проверяем, что состояние не изменилось
    expect(after).toEqual(before);
  });

  test('Вызов rootReducer с несуществующим экшеном должен оставить состояние без изменений', () => {
    const initialState = store.getState(); // Получаем начальное состояние
    const action = { type: 'ANY_ACTION' }; // Экшен, который не обрабатывается редьюсером

    // Процесс вызова редьюсера
    const result = rootReducer(initialState, action);

    // Проверяем, что состояние не изменилось
    expect(result).toEqual(initialState);
  });
});
