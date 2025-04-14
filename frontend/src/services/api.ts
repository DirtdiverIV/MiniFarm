import axios from 'axios';
import { ErrorCode, ApiError } from '../types/errors';


export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});


if (!import.meta.env.PROD && !import.meta.env.VITE_API_URL?.startsWith('https')) {
  console.warn('⚠️ Advertencia: La API no está utilizando HTTPS. Esto no es seguro para transmisión de credenciales.');
}


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


const getErrorCodeFromStatus = (status?: number): ErrorCode => {
  if (status === 401) return ErrorCode.UNAUTHORIZED;
  if (status === 400) return ErrorCode.BAD_REQUEST;
  if (status === 404) return ErrorCode.NOT_FOUND;
  if (status === 422) return ErrorCode.VALIDATION_ERROR;
  if (status === 500) return ErrorCode.SERVER_ERROR;
  return ErrorCode.UNKNOWN_ERROR;
};


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


const transformError = (error: unknown): ApiError => {
  
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const errorData = error.response?.data;
    const code = getErrorCodeFromStatus(status);
    
    
    if (code === ErrorCode.UNAUTHORIZED) {
      return createApiError(code, 'Credenciales inválidas', status);
    }
    
    
    let message = 'Error en la solicitud';
    if (errorData?.error) {
      message = errorData.error;
    } else if (errorData?.message) {
      message = errorData.message;
    }
    
    const details = errorData?.details as Record<string, unknown> | undefined;
    return createApiError(code, message, status, details);
  }

  
  if (error instanceof Error) {
    return createApiError(ErrorCode.NETWORK_ERROR, error.message);
  }

  
  return createApiError(ErrorCode.UNKNOWN_ERROR, 'Error desconocido');
};


api.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = transformError(error);
    
    
    if (apiError.code === ErrorCode.UNAUTHORIZED && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(apiError);
  }
); 