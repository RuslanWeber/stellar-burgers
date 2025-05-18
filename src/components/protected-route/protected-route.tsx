import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import {
  isUserAuthenticatedSelector,
  isLoginUserRequestSelector
} from '../../services/slices/userSlice';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(isUserAuthenticatedSelector);
  const loginUserRequest = useSelector(isLoginUserRequestSelector);
  const location = useLocation();

  /** Пока загружается информация о пользователя  */
  if (!isAuthChecked && loginUserRequest) {
    return <Preloader />;
  }

  /** Если нужна авторизация */
  if (!onlyUnAuth && !isAuthChecked) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  /** Если авторизованы */
  if (onlyUnAuth && isAuthChecked) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return children;
};
