import { FC, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

import { useDispatch, useSelector } from '../../services/store';
import {
  selectConstructorData,
  resetConstructor
} from '../../services/slices/burgerConstructorSlice';
import {
  selectCurrentOrder,
  selectIsSubmitting,
  selectOrderError,
  submitBurgerOrder,
  resetOrderState
} from '../../services/slices/orderSlice';
import { selectIsAuthenticated } from '../../services/slices/userSlice';

export const BurgerConstructor: FC = () => {
  const { bun, fillings } = useSelector(selectConstructorData);
  const orderRequest = useSelector(selectIsSubmitting);
  const error = useSelector(selectOrderError);
  const orderModalData = useSelector(selectCurrentOrder);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onOrderClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!bun || orderRequest) return;

    const orderData: string[] = [
      bun._id,
      ...fillings.map((ingredient) => ingredient._id),
      bun._id
    ];
    dispatch(submitBurgerOrder(orderData));
  };

  const closeOrderModal = () => {
    navigate('/', { replace: true });
    dispatch(resetOrderState());
  };

  useEffect(() => {
    if (!error && !orderRequest) {
      dispatch(resetConstructor());
    }
  }, [error, orderRequest, dispatch]);

  const price = useMemo(() => {
    const fillingsTotal = fillings.reduce(
      (sum: number, item: TConstructorIngredient) => sum + item.price,
      0
    );
    return (bun ? bun.price * 2 : 0) + fillingsTotal;
  }, [bun, fillings]);

  return (
    <BurgerConstructorUI
      constructorItems={{ bun, ingredients: fillings }}
      orderRequest={orderRequest}
      price={price}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
