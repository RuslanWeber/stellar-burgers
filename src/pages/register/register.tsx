import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useSelector, useDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import {
  resetError,
  selectErrorMessage,
  registerNewUser
} from '../../services/slices/userSlice';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const error = useSelector(selectErrorMessage);

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      registerNewUser({
        name: userName,
        email,
        password
      })
    );
  };

  useEffect(() => {
    dispatch(resetError());
  }, [dispatch]);

  return (
    <RegisterUI
      errorText={error!}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
