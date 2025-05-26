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
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const user = useSelector(selectUserData);
  const location = useLocation();

  if (isLoading && !user) {
    return <Preloader />;
  }

  if (onlyUnAuth && isAuthenticated) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  if (!isAuthenticated && !onlyUnAuth) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  return children;
};

ProtectedRoute.displayName = 'ProtectedRoute';
