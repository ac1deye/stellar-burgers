import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredientsThunk } from '../../slices/ingredientsSlice';
import { useEffect } from 'react';
import {
  fetchUserThunk,
  selectIsAuthorized,
  tokenRefreshThunk
} from '../../slices/userSlice';
import { getCookie } from '../../utils/cookie';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchIngredientsThunk());
  }, []);

  const isAuth = useSelector(selectIsAuthorized);

  const refreshToken = localStorage.getItem('refreshToken');
  const accessToken = getCookie('accessToken');

  if (refreshToken && accessToken === undefined) {
    dispatch(tokenRefreshThunk());
  }

  useEffect(() => {
    if (isAuth) {
      dispatch(fetchUserThunk());
    }
  }, [isAuth]);

  const navigate = useNavigate();

  const location = useLocation();
  const backgroundLocation = location.state?.background;

  const handleOnCloseModal = () => {
    navigate(-1);
  };
  return (
    <>
      <div className={styles.app}>
        <AppHeader />

        <Routes location={backgroundLocation || location}>
          <Route path='/' element={<ConstructorPage />} />
          <Route path='/feed' element={<Feed />} />
          <Route path='/feed/:number' element={<OrderInfo />} />
          <Route
            path='/login'
            element={
              <ProtectedRoute onlyUnAuth>
                <Login />
              </ProtectedRoute>
            }
          />
          <Route
            path='/register'
            element={
              <ProtectedRoute onlyUnAuth>
                <Register />
              </ProtectedRoute>
            }
          />
          <Route
            path='/forgot-password'
            element={
              <ProtectedRoute onlyUnAuth>
                <ForgotPassword />
              </ProtectedRoute>
            }
          />
          <Route
            path='/reset-password'
            element={
              <ProtectedRoute onlyUnAuth>
                <ResetPassword />
              </ProtectedRoute>
            }
          />
          <Route
            path='/profile'
            element={
              <ProtectedRoute onlyAuth>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path='/profile/orders'
            element={
              <ProtectedRoute onlyAuth>
                <ProfileOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute onlyAuth>
                <OrderInfo />
              </ProtectedRoute>
            }
          />
          <Route path='ingredients/:id' element={<IngredientDetails />} />
          <Route path='*' element={<NotFound404 />} />
        </Routes>

        {backgroundLocation && (
          <Routes>
            <Route
              path='/ingredients/:id'
              element={
                <Modal title='Детали ингредиента' onClose={handleOnCloseModal}>
                  <IngredientDetails />
                </Modal>
              }
            />
            <Route
              path='/feed/:number'
              element={
                <Modal title='Детали заказа' onClose={handleOnCloseModal}>
                  <OrderInfo />
                </Modal>
              }
            />

            <Route
              path='/profile/orders/:number'
              element={
                <ProtectedRoute onlyAuth>
                  <Modal title='Детали заказа' onClose={handleOnCloseModal}>
                    <OrderInfo />
                  </Modal>
                </ProtectedRoute>
              }
            />
          </Routes>
        )}
      </div>
    </>
  );
};

export default App;
