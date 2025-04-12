import axios from 'axios';
import { ErrorCode, ApiError } from '../types/errors';

// Crear instancia de axios
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token de autorización
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Función para transformar errores de axios en ApiError
const transformError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    
    switch (status) {
      case 401:
        return {
          code: ErrorCode.UNAUTHORIZED,
          message: 'No autorizado. Por favor, inicie sesión nuevamente.',
          status
        };
      case 400:
        return {
          code: ErrorCode.BAD_REQUEST,
          message: error.response?.data?.message || 'Solicitud inválida',
          status,
          details: error.response?.data?.details
        };
      case 404:
        return {
          code: ErrorCode.NOT_FOUND,
          message: 'Recurso no encontrado',
          status
        };
      case 422:
        return {
          code: ErrorCode.VALIDATION_ERROR,
          message: 'Error de validación',
          status,
          details: error.response?.data?.errors
        };
      case 500:
        return {
          code: ErrorCode.SERVER_ERROR,
          message: 'Error en el servidor. Por favor, inténtelo más tarde.',
          status
        };
      default:
        return {
          code: ErrorCode.UNKNOWN_ERROR,
          message: 'Error desconocido',
          status
        };
    }
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
    
    // Si es un error de autorización, limpiar el almacenamiento local
    if (apiError.code === ErrorCode.UNAUTHORIZED) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(apiError);
  }
); 