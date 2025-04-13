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

// Función para obtener el código de error basado en el status HTTP
const getErrorCodeFromStatus = (status?: number): ErrorCode => {
  if (status === 401) return ErrorCode.UNAUTHORIZED;
  if (status === 400) return ErrorCode.BAD_REQUEST;
  if (status === 404) return ErrorCode.NOT_FOUND;
  if (status === 422) return ErrorCode.VALIDATION_ERROR;
  if (status === 500) return ErrorCode.SERVER_ERROR;
  return ErrorCode.UNKNOWN_ERROR;
};

// Función para crear un objeto ApiError
const createApiError = (
  code: ErrorCode, 
  message: string, 
  status?: number, 
  details?: Record<string, unknown>
): ApiError => {
  const error: ApiError = { code, message };
  if (status !== undefined) error.status = status;
  if (details !== undefined) error.details = details;
  return error;
};

// Función para transformar errores de axios en ApiError
const transformError = (error: unknown): ApiError => {
  // Manejar errores de Axios
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const errorData = error.response?.data;
    const code = getErrorCodeFromStatus(status);
    
    // Mensaje personalizado para error de autorización
    if (code === ErrorCode.UNAUTHORIZED) {
      return createApiError(code, 'Credenciales inválidas', status);
    }
    
    // Determinar el mensaje de error apropiado
    let message = 'Error en la solicitud';
    if (errorData?.error) {
      message = errorData.error;
    } else if (errorData?.message) {
      message = errorData.message;
    }
    
    const details = errorData?.details as Record<string, unknown> | undefined;
    return createApiError(code, message, status, details);
  }

  // Manejar errores estándar de JavaScript
  if (error instanceof Error) {
    return createApiError(ErrorCode.NETWORK_ERROR, error.message);
  }

  // Errores desconocidos
  return createApiError(ErrorCode.UNKNOWN_ERROR, 'Error desconocido');
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