import { api } from './api';
import { ApiError } from '../types/errors';


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


export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/users/login', credentials);
    return response.data;
  } catch (error) {
    
    throw error;
  }
};


export const registerUser = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/users/register', credentials);
    return response.data;
  } catch (error) {
    
    throw error;
  }
}; 