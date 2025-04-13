import { createContext, useState, useContext, useEffect, ReactNode, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../services/authService';
import { ApiError, ErrorCode } from '../types/errors';

// Definir tipos
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

// Crear contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor del contexto
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const navigate = useNavigate();

  const clearError = () => setError(null);

  // Verificar si hay un token en localStorage al cargar
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (_) {
          // Si hay un error al parsear el usuario, limpiar localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  // Función para iniciar sesión
  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Intentando login con:', credentials); // Debug log
      const response = await loginUser(credentials);
      console.log('Respuesta exitosa:', response); // Debug log
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      navigate('/');
    } catch (error) {
      console.log('Error capturado en login:', error); // Debug log
      
      // Asegurarnos de que el error sea del tipo correcto
      if ((error as ApiError).code) {
        setError(error as ApiError);
      } else {
        setError({
          code: ErrorCode.UNKNOWN_ERROR,
          message: error instanceof Error ? error.message : 'Error desconocido durante el inicio de sesión'
        });
      }
      
      // No redirigir en caso de error
      return;
    } finally {
      setLoading(false);
    }
  };

  // Función para registrar
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

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext; 