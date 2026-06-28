/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import type { AuthState } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    token: localStorage.getItem('token'),
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        setState({
          token,
          user: JSON.parse(savedUser),
          isAuthenticated: true,
          loading: false,
        });
      } else {
        setState({
          token: null,
          user: null,
          isAuthenticated: false,
          loading: false,
        });
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      
      const response = await axios.post('https://school-system-management-backend.vercel.app/api/auth/login', {
        email,
        password,
      });

      const { token, data } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data));

      setState({
        token,
        user: data,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error: unknown) {
      setState((prev) => ({ ...prev, loading: false }));
      
      let errorMsg = 'Login failed! Please check your credentials.';
      
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || errorMsg;
      }
      
      throw new Error(errorMsg, { cause: error });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setState({
      token: null,
      user: null,
      isAuthenticated: false,
      loading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};