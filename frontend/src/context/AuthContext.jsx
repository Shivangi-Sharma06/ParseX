import { createContext, useCallback, useMemo, useReducer } from 'react';
import { authApi } from '../api/auth';

export const AuthContext = createContext(null);

const initialState = {
  user: JSON.parse(localStorage.getItem('authUser') || 'null'),
  token: localStorage.getItem('authToken') || '',
  loading: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'START':
      return { ...state, loading: true };
    case 'LOGIN_SUCCESS':
      return { ...state, loading: false, user: action.payload.user, token: action.payload.token };
    case 'LOGOUT':
      return { ...state, user: null, token: '', loading: false };
    case 'STOP':
      return { ...state, loading: false };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const persist = (token, user) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('authUser', JSON.stringify(user));
  };

  const clear = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  };

  const login = useCallback(async (payload) => {
    dispatch({ type: 'START' });
    try {
      const response = await authApi.login(payload);
      persist(response.data.token, response.data.user);
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
      return response.data;
    } catch (error) {
      dispatch({ type: 'STOP' });
      throw error;
    }
  }, []);

  const register = useCallback(async (payload) => {
    dispatch({ type: 'START' });
    try {
      const response = await authApi.register(payload);
      persist(response.data.token, response.data.user);
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
      return response.data;
    } catch (error) {
      dispatch({ type: 'STOP' });
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    clear();
    dispatch({ type: 'LOGOUT' });
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      isAuthenticated: Boolean(state.token),
      login,
      register,
      logout,
    }),
    [login, logout, register, state],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
