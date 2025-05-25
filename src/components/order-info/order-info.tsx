import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';

import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';

import {
  fetchOrderByNumber,
  selectSelectedOrder
} from '../../services/slices/feedSlice';
import { selectIngredients } from '../../services/slices/ingedientsSlice';

import { TIngredient } from '@utils-types';

type TIngredientsWithCount = TIngredient & { count: number };

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams();

  const orderData = useSelector(selectSelectedOrder);
  const ingredients = useSelector(selectIngredients);

  useEffect(() => {
    if (number) {
      dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [dispatch, number]);

  const orderInfo = useMemo(() => {
    if (!orderData || ingredients.length === 0) return null;

    const date = new Date(orderData.createdAt);

    const ingredientsInfoMap = orderData.ingredients.reduce<
      Record<string, TIngredientsWithCount>
    >((acc, id) => {
      if (acc[id]) {
        acc[id].count += 1;
      } else {
        const ingredient = ingredients.find((item) => item._id === id);
        if (ingredient) {
          acc[id] = { ...ingredient, count: 1 };
        }
      }
      return acc;
    }, {});

    const total = Object.values(ingredientsInfoMap).reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo: ingredientsInfoMap,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
