import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import {
  selectIsAuthenticated,
  selectIsLoading
} from '../../services/slices/userSlice';
import React from 'react';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  component?: React.ReactElement;
  children?: React.ReactElement;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  onlyUnAuth = false,
  component,
  children
}) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const location = useLocation();
  const currentPath = location.pathname;

  if (!component && !children) {
    throw new Error(
      'ProtectedRoute requires either component or children prop'
    );
  }

  if (isLoading) {
    return <Preloader />;
  }

  if (onlyUnAuth && isAuthenticated) {
    const redirectTo = location.state?.from?.pathname || '/';
    return <Navigate to={redirectTo} replace state={{ from: currentPath }} />;
  }

  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate to='/login' replace state={{ from: currentPath }} />;
  }

  return component || children!;
};

ProtectedRoute.displayName = 'ProtectedRoute';
