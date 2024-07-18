import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import {
  selectConstructorBurger,
  resetIngredients
} from '../../slices/constructorSlice';
import { selectIsAuthorized, selectUser } from '../../slices/userSlice';
import {
  clearModalOrder,
  createOrderThunk,
  selectModalOrder,
  selectOrderRequest
} from '../../slices/orderSlice';

export const BurgerConstructor: FC = () => {
  const constructorItems = useSelector(selectConstructorBurger);
  const isAuth = useSelector(selectIsAuthorized);
  const user = useSelector(selectUser);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectModalOrder);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!isAuth || !user) {
      return navigate('/login');
    }

    const ingredientIds = constructorItems.ingredients.map((item) => item._id);
    const orderData = [constructorItems.bun._id, ...ingredientIds];

    dispatch(createOrderThunk(orderData)).finally(() =>
      dispatch(resetIngredients())
    );
  };

  const closeOrderModal = () => {
    dispatch(clearModalOrder());
  };

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
