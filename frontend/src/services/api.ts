import axios from 'axios';
import { ErrorCode, ApiError } from '../types/errors';

// Crear instancia de axios
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Verificar si la URL es segura
if (!import.meta.env.PROD && !import.meta.env.VITE_API_URL?.startsWith('https')) {
  console.warn('⚠️ Advertencia: La API no está utilizando HTTPS. Esto no es seguro para transmisión de credenciales.');
}

// Interceptor para agregar el token de autorización
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(new Error(error.message || 'Request configuration error'))
);

// Función para transformar errores de axios en ApiError
const transformError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const errorData = error.response?.data;
    
    if (status === 401) {
      // Para errores de autenticación, mostrar mensaje genérico
      return {
        code: ErrorCode.UNAUTHORIZED,
        message: 'Credenciales inválidas',
        status
      };
    }
    
    // Resto de los casos de error
    return {
      code: status === 400 ? ErrorCode.BAD_REQUEST :
            status === 404 ? ErrorCode.NOT_FOUND :
            status === 422 ? ErrorCode.VALIDATION_ERROR :
            status === 500 ? ErrorCode.SERVER_ERROR :
            ErrorCode.UNKNOWN_ERROR,
      message: errorData?.error || errorData?.message || 'Error en la solicitud',
      status,
      details: errorData?.details
    };
  }

  if (error instanceof Error) {
    return {
      code: ErrorCode.NETWORK_ERROR,
      message: error.message
    };
  }

  return {
    code: ErrorCode.UNKNOWN_ERROR,
    message: 'Error desconocido'
  };
};

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = transformError(error);
    
    // Si es un error de autorización y NO estamos en la ruta de login, limpiar el almacenamiento local
    if (apiError.code === ErrorCode.UNAUTHORIZED && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(apiError);
  }
); 