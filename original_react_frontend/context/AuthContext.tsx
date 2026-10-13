import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthResponse, Role } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: AuthResponse | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: { firstName: string; lastName: string; email: string; password: string; phoneNumber?: string }) => Promise<void>;
  logout: () => void;
  quickLogin: (role: 'user' | 'admin') => Promise<void>;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register';
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  useEffect(() => {
    const existing = authService.getCurrentUser();
    if (existing) {
      setUser(existing);
    } else {
      // Default to logged-in customer for seamless initial demo exploration
      const defaultUser: AuthResponse = {
        token: 'simulated_jwt_token_demo_user',
        tokenType: 'Bearer',
        id: 2,
        email: 'user@stylecart.com',
        firstName: 'Sarah',
        lastName: 'Jenkins',
        role: 'ROLE_USER',
      };
      localStorage.setItem('stylecart_token', defaultUser.token);
      localStorage.setItem('stylecart_user', JSON.stringify(defaultUser));
      setUser(defaultUser);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await authService.login(email, pass);
    setUser(res);
    setIsAuthModalOpen(false);
  };

  const register = async (data: { firstName: string; lastName: string; email: string; password: string; phoneNumber?: string }) => {
    const res = await authService.register(data);
    setUser(res);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const quickLogin = async (role: 'user' | 'admin') => {
    if (role === 'admin') {
      await login('admin@stylecart.com', 'admin123');
    } else {
      await login('user@stylecart.com', 'user123');
    }
  };

  const openAuthModal = (tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ROLE_ADMIN',
        login,
        register,
        logout,
        quickLogin,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
