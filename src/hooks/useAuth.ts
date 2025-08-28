import { useState, useEffect, createContext, useContext } from 'react';
import { AdminUser } from '../types';

interface AuthContextType {
  user: AdminUser | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthProvider = () => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token
    const token = localStorage.getItem('admin_token');
    const userData = localStorage.getItem('admin_user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate the authentication
      if (username === 'admin' && password === 'admin123') {
        const mockUser: AdminUser = {
          id: 1,
          username: 'admin',
          password: '',
          email: 'admin@rosariodenim.com',
          role: 'super_admin',
          created_at: new Date()
        };
        
        setUser(mockUser);
        localStorage.setItem('admin_token', 'mock_token_' + Date.now());
        localStorage.setItem('admin_user', JSON.stringify(mockUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  };

  return {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading
  };
};

export { AuthContext };