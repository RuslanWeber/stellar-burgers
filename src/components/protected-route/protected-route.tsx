import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import {
  selectIsAuthenticated,
  selectUserData,
  selectIsLoading
} from '../../services/slices/userSlice';
import React from 'react';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const isAuthChecked = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUserData);
  const isLoading = useSelector(selectIsLoading);
  const location = useLocation();

  const isInitialAuthCheck = isAuthChecked === false && isLoading;
  const isUserDataLoading = isAuthChecked && !user && isLoading;

  const from = location.state?.from?.pathname || '/';

  if (isInitialAuthCheck || isUserDataLoading) {
    return <Preloader />;
  }

  // для неавторизованных
  if (onlyUnAuth && user) {
    return <Navigate to={from} replace />;
  }

  // для авторизованных
  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  return children;
};

ProtectedRoute.displayName = 'ProtectedRoute';
