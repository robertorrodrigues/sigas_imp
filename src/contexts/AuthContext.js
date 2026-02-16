import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const mockUsers = {
  'admin@email.com': { name: 'Admin', role: 'administrador', password: 'admin' },
  'tecnico@email.com': { name: 'Técnico Zé', role: 'tecnico', password: 'tecnico' },
  'atendente@email.com': { name: 'Atendente Ana', role: 'atendente', password: 'atendente' },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = mockUsers[email];
        if (foundUser && foundUser.password === password) {
          const userData = { name: foundUser.name, email, role: foundUser.role };
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
          resolve(userData);
        } else {
          reject(new Error('Credenciais inválidas.'));
        }
      }, 1000);
    });
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = { user, login, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};