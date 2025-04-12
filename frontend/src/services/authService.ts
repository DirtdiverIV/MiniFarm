import { api } from './api';

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

interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
    status?: number;
  };
  message: string;
}

// Función para manejar errores de la API
const handleApiError = (error: unknown): never => {
  const apiError = error as ApiError;
  const errorMessage = apiError.response?.data?.error || apiError.message || 'Error desconocido';
  
  if (apiError.response?.status === 401) {
    throw new Error('Credenciales inválidas');
  } else if (apiError.response?.status === 400) {
    throw new Error(errorMessage);
  } else {
    throw new Error('Error en el servidor. Por favor, inténtelo más tarde.');
  }
};

// Función para iniciar sesión
export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/users/login', credentials);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Función para registrar un nuevo usuario
export const registerUser = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/users/register', credentials);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}; 