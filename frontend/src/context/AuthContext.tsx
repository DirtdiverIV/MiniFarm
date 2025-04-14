import { createContext, useState, useContext, useEffect, ReactNode, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../services/authService';
import { ApiError, ErrorCode } from '../types/errors';


const secureStorage = {
  
  setItem: (key: string, value: any): void => {
    if (typeof value === 'object') {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, String(value));
    }
  },
  
  
  getItem: <T,>(key: string, defaultValue: T | null = null): T | null => {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    
    try {
      
      return JSON.parse(item) as T;
    } catch (e) {
      
      return item as unknown as T;
    }
  },
  
  removeItem: (key: string): void => {
    localStorage.removeItem(key);
  }
};


interface User {
  id: number;
  email: string;
  role: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  email: string;
  password: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  error: ApiError | null;
  clearError: () => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const navigate = useNavigate();

  const clearError = () => setError(null);

  
  const isTokenExpired = (token: string): boolean => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const { exp } = JSON.parse(jsonPayload);
      
      return exp * 1000 < Date.now();
    } catch (error) {
      
      return true;
    }
  };

  
  useEffect(() => {
    const checkAuth = () => {
      const token = secureStorage.getItem<string>('token');
      const userData = secureStorage.getItem<User>('user');
      
      if (token && userData) {
        try {
          
          if (isTokenExpired(token)) {
            
            secureStorage.removeItem('token');
            secureStorage.removeItem('user');
            setUser(null);
          } else {
            setUser(userData);
          }
        } catch (_) {
          
          secureStorage.removeItem('token');
          secureStorage.removeItem('user');
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  
  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await loginUser(credentials);
      
      secureStorage.setItem('token', response.token);
      secureStorage.setItem('user', response.user);
      setUser(response.user);
      navigate('/');
    } catch (error) {
      
      if ((error as ApiError).code) {
        setError(error as ApiError);
      } else {
        setError({
          code: ErrorCode.UNKNOWN_ERROR,
          message: error instanceof Error ? error.message : 'Error desconocido durante el inicio de sesión'
        });
      }
      
      
      return;
    } finally {
      setLoading(false);
    }
  };

  
  const register = async (credentials: RegisterCredentials) => {
    setLoading(true);
    setError(null);
    
    try {
      await registerUser(credentials);
      navigate('/login');
    } catch (error) {
      if (error instanceof Error) {
        const apiError = error as unknown as ApiError;
        setError(apiError);
      } else {
        setError({
          code: ErrorCode.UNKNOWN_ERROR,
          message: 'Error desconocido durante el registro'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  
  const logout = () => {
    secureStorage.removeItem('token');
    secureStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    error,
    clearError
  }), [user, loading, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext; 