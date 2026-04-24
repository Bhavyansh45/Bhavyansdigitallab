import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('admin_token'));

  const value = useMemo(() => ({
    token,
    login: (nextToken) => {
      localStorage.setItem('admin_token', nextToken);
      setToken(nextToken);
    },
    logout: () => {
      localStorage.removeItem('admin_token');
      setToken(null);
    }
  }), [token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
