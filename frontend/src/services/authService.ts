import { api } from './api';
import { ApiError } from '../types/errors';

// Tipos de datos
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  email: string;
  password: string;
  role?: string;
}

interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
}

// Función para iniciar sesión
export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/users/login', credentials);
    return response.data;
  } catch (error) {
    // El error ya viene transformado como ApiError desde el interceptor
    throw error;
  }
};

// Función para registrar un nuevo usuario
export const registerUser = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/users/register', credentials);
    return response.data;
  } catch (error) {
    // El error ya viene transformado como ApiError desde el interceptor
    throw error;
  }
}; 