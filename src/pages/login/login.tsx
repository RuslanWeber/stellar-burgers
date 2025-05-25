import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  authorizeUser,
  resetError,
  selectErrorMessage,
  selectIsAuthenticated
} from '../../services/slices/userSlice';
import { Navigate, useNavigate } from 'react-router-dom';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const dispatch = useDispatch();
  const error = useSelector(selectErrorMessage);
  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(authorizeUser({ email, password }));
  };

  useEffect(() => {
    // Сброс ошибки при монтировании компонента
    dispatch(resetError());
  }, [dispatch]);

  if (isAuthenticated) {
    return <Navigate to='/' />;
  }

  return (
    <LoginUI
      errorText={error ?? ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
