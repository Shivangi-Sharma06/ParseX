import { useMemo, useState } from 'react';
import { AuthContext } from './authContext.js';

const readStorage = () => {
  const token = localStorage.getItem('auth_token');
  const userText = localStorage.getItem('auth_user');

  if (!token || !userText) {
    return { token: '', user: null };
  }

  try {
    return { token, user: JSON.parse(userText) };
  } catch {
    return { token: '', user: null };
  }
};

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStorage);

  const login = ({ token, user }) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    setAuth({ token, user });
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setAuth({ token: '', user: null });
  };

  const value = useMemo(
    () => ({
      token: auth.token,
      user: auth.user,
      isAuthenticated: Boolean(auth.token && auth.user),
      login,
      logout,
    }),
    [auth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
