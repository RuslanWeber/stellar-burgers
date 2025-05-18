import { FC, useEffect, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  burgerConstructorSelector,
  clearConstructor
} from '../../services/slices/burgerConstructorSlice';
import {
  clearOrder,
  errorSelector,
  isOrderLoadingSelector,
  orderBurgerThunk,
  orderSelector
} from '../../services/slices/orderSlice';
import { useNavigate } from 'react-router-dom';
import { isUserAuthenticatedSelector } from '../../services/slices/userSlice';

export const BurgerConstructor: FC = () => {
  const constructorItems = useSelector(burgerConstructorSelector);
  const orderRequest = useSelector(isOrderLoadingSelector);
  const error = useSelector(errorSelector);
  const orderModalData = useSelector(orderSelector);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(isUserAuthenticatedSelector);

  const onOrderClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const { bun, ingredients } = constructorItems;
    if (!constructorItems.bun || orderRequest) return;
    const orderData: string[] = [
      bun?._id!,
      ...ingredients.map((ingredient) => ingredient._id),
      bun?._id!
    ];
    dispatch(orderBurgerThunk(orderData));
  };
  const closeOrderModal = () => {
    navigate('/', { replace: true });
    dispatch(clearOrder());
  };

  useEffect(() => {
    if (!error && !orderRequest) {
      dispatch(clearConstructor());
    }
  }, [error, orderRequest]);

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
