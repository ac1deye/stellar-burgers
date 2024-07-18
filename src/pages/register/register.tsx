import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import {
  selectIsAuthorized,
  selectError,
  registrationThunk
} from '../../slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const errorText = useSelector(selectError);

  const isAuthorized = useSelector(selectIsAuthorized);

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthorized) {
      navigate('/', { replace: true });
    }
  }, [isAuthorized]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(
      registrationThunk({ name: userName, email: email, password: password })
    );
  };

  return (
    <RegisterUI
      errorText={errorText}
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
