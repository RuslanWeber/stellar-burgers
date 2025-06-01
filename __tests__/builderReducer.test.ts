import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  resetConstructor,
  selectConstructorData,
  selectBun,
  selectFillings,
  selectTotalPrice,
  BurgerConstructorState,
  initialState
} from '../src/services/slices/burgerConstructorSlice';
import { TConstructorIngredient } from '../src/utils/types';

const bunMockData: TConstructorIngredient = {
  id: 'bun-1',
  _id: '123',
  name: 'Булка',
  type: 'bun',
  proteins: 10,
  fat: 5,
  carbohydrates: 20,
  calories: 200,
  price: 50,
  image: 'img.jpg',
  image_mobile: 'img-mobile.jpg',
  image_large: 'img-large.jpg'
};

const ingredient1MockData: TConstructorIngredient = {
  _id: '643d69a5c3f7b9001cfa093e',
  id: '123',
  name: 'Филе Люминесцентного тетраодонтимформа',
  type: 'main',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/meat-03.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
};

const ingredient2MockData: TConstructorIngredient = {
  _id: '643d69a5c3f7b9001cfa093e',
  id: '456',
  name: 'Филе Люминесцентного тетраодонтимформа',
  type: 'main',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/meat-03.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
};

describe('burgerConstructorSlice', () => {
  test('Добавление булки через addIngredient', () => {
    const state = reducer(initialState, addIngredient(bunMockData));

    const { id: receivedId, ...receivedBun } = state.ingredients.bun!;
    const { id: expectedId, ...expectedBun } = bunMockData;

    expect(receivedBun).toEqual(expectedBun);
    expect(state.ingredients.fillings).toHaveLength(0);
  });

  test('Добавление ингредиента в fillings', () => {
    const state = reducer(initialState, addIngredient(ingredient1MockData));

    expect(state.ingredients.fillings).toHaveLength(1);
    expect(state.ingredients.bun).toBeNull();

    const added = state.ingredients.fillings[0];
    const { id: receivedId, ...addedWithoutId } = added;
    const { id: expectedId, ...expectedWithoutId } = ingredient1MockData;

    expect(addedWithoutId).toEqual(expectedWithoutId);
  });

  test('Удаление ингредиента', () => {
    const _initialState: BurgerConstructorState = {
      ingredients: {
        bun: null,
        fillings: [ingredient1MockData, ingredient2MockData]
      },
      error: null,
      lastUpdated: null
    };

    const state = reducer(_initialState, removeIngredient('123'));

    expect(state.ingredients.fillings).toHaveLength(1);
    expect(state.ingredients.fillings[0]).toEqual(ingredient2MockData);
    expect(state.ingredients.bun).toBeNull();
  });

  test('Передвижение ингредиента вниз', () => {
    const _initialState: BurgerConstructorState = {
      ingredients: {
        bun: null,
        fillings: [ingredient1MockData, ingredient2MockData]
      },
      error: null,
      lastUpdated: null
    };

    const state = reducer(
      _initialState,
      moveIngredient({ fromIndex: 0, toIndex: 1 })
    );

    expect(state.ingredients.fillings[0]).toEqual(ingredient2MockData);
    expect(state.ingredients.fillings[1]).toEqual(ingredient1MockData);
  });

  test('Передвижение ингредиента вверх', () => {
    const _initialState: BurgerConstructorState = {
      ingredients: {
        bun: null,
        fillings: [ingredient1MockData, ingredient2MockData]
      },
      error: null,
      lastUpdated: null
    };

    const state = reducer(
      _initialState,
      moveIngredient({ fromIndex: 1, toIndex: 0 })
    );

    expect(state.ingredients.fillings[0]).toEqual(ingredient2MockData);
    expect(state.ingredients.fillings[1]).toEqual(ingredient1MockData);
  });

  test('Очистка конструктора', () => {
    const _initialState: BurgerConstructorState = {
      ingredients: {
        bun: bunMockData,
        fillings: [ingredient1MockData, ingredient2MockData]
      },
      error: null,
      lastUpdated: null
    };

    const state = reducer(_initialState, resetConstructor());

    expect(state.ingredients.fillings).toHaveLength(0);
    expect(state.ingredients.bun).toBeNull();
    expect(state.lastUpdated).not.toBeNull();
  });

  describe('Селекторы burgerConstructor', () => {
    const state = {
      burgerConstructor: {
        ingredients: {
          bun: bunMockData,
          fillings: [ingredient1MockData, ingredient2MockData]
        },
        error: 'Ошибка',
        lastUpdated: 123456789
      }
    };

    test('selectConstructorData', () => {
      expect(selectConstructorData(state)).toEqual(
        state.burgerConstructor.ingredients
      );
    });

    test('selectBun', () => {
      expect(selectBun(state)).toEqual(bunMockData);
    });

    test('selectFillings', () => {
      expect(selectFillings(state)).toEqual([
        ingredient1MockData,
        ingredient2MockData
      ]);
    });

    test('selectTotalPrice', () => {
      const expected =
        bunMockData.price * 2 +
        ingredient1MockData.price +
        ingredient2MockData.price;
      expect(selectTotalPrice(state)).toBe(expected);
    });
  });
});
