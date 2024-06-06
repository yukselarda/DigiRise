import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const AuthContext = createContext({
  user: null,
  isLoading: true,
  login: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = Cookies.get('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Hatalı kullanıcı verisi:', error);
        Cookies.remove('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData, rememberMe) => {
    setUser(userData);
    if (rememberMe) {
      Cookies.set('user', JSON.stringify(userData), { expires: 7 }); // 7 gün süreyle sakla
    } else {
      Cookies.set('user', JSON.stringify(userData)); // Oturum süresince sakla
    }
  };

  const logout = () => {
    setUser(null);
    Cookies.remove('user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
