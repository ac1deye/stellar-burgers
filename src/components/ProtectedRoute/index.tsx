import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { selectIsAuthorized } from '../../slices/userSlice';
import { useSelector } from '../../services/store';

type ProtectedRouteProps = {
  onlyAuth?: boolean;
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

const ProtectedRoute = ({
  onlyAuth,
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  let location = useLocation();

  const isAuthorized = useSelector(selectIsAuthorized);

  if (onlyAuth && !isAuthorized) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (onlyUnAuth && isAuthorized) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return children;
};

export default ProtectedRoute;
