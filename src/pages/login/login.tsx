import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';

import { selectError, loginThunk } from '../../slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const errorText = useSelector(selectError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(loginThunk({ email: email, password: password }));
  };

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
