import { api } from './api';

// Tipos de datos
export interface FarmType {
  id: number;
  name: string;
}

export interface ProductionType {
  id: number;
  name: string;
}

// Función para obtener todos los tipos de granja
export const getAllFarmTypes = async (): Promise<FarmType[]> => {
  const response = await api.get<FarmType[]>('/farm-types');
  return response.data;
};

// Función para obtener todos los tipos de producción
export const getAllProductionTypes = async (): Promise<ProductionType[]> => {
  const response = await api.get<ProductionType[]>('/production-types');
  return response.data;
}; 