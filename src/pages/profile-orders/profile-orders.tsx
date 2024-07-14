import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchOrdersThunk,
  selectOrdersList
} from '../../slices/ordersHistorySlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchOrdersThunk());
  }, []);

  const orders = useSelector(selectOrdersList);

  return <ProfileOrdersUI orders={orders} />;
};
