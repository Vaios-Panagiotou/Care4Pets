import React, { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext({ user: null, login: () => {}, logout: () => {} });

export function AuthProvider({ children }) {
  // Initialize synchronously from localStorage to avoid redirect flicker
  const [user, setUser] = useState(() => {
    // Use sessionStorage so sessions do not persist across browser restarts
    try {
      const stored = sessionStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch (_) {
      return null;
    }
  });

  const login = (userData) => {
    setUser(userData);
    try {
      sessionStorage.setItem('user', JSON.stringify(userData));
    } catch (_) {
      // ignore
    }
  };

  const logout = () => {
    setUser(null);
    try {
      sessionStorage.removeItem('user');
    } catch (_) {
      // ignore
    }
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
