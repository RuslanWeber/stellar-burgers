import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  loadUserOrders,
  selectUserOrders
} from '../../services/slices/userSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectUserOrders);

  useEffect(() => {
    dispatch(loadUserOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
