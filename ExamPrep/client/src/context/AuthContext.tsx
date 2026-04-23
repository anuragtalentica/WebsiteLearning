import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import apiClient from '../api/apiClient';
import type { ApiResponse, AuthResponse } from '../types';

interface AuthUser {
  email: string;
  fullName: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<string>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleAuthResponse = (data: AuthResponse) => {
    const authUser: AuthUser = { email: data.email, fullName: data.fullName, role: data.role ?? 'User' };
    setToken(data.token);
    setUser(authUser);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(authUser));
  };

  const extractErrorMessage = (err: unknown, fallback: string): string => {
    if (err && typeof err === 'object' && 'response' in err) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      return axiosErr.response?.data?.message || fallback;
    }
    if (err instanceof Error) return err.message;
    return fallback;
  };

  const login = async (email: string, password: string): Promise<string> => {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', { email, password });
      if (response.data.success && response.data.data) {
        handleAuthResponse(response.data.data);
        return response.data.data.role ?? 'User';
      }
      throw new Error(response.data.message || 'Login failed');
    } catch (err) {
      throw new Error(extractErrorMessage(err, 'Login failed'));
    }
  };

  const register = async (email: string, password: string, fullName: string) => {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', { email, password, fullName });
      if (response.data.success && response.data.data) {
        handleAuthResponse(response.data.data);
        return;
      }
      throw new Error(response.data.message || 'Registration failed');
    } catch (err) {
      throw new Error(extractErrorMessage(err, 'Registration failed'));
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{
      user, token, login, register, logout,
      isAuthenticated: !!token,
      isAdmin: user?.role === 'Admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
