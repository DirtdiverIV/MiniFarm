import { api } from './api';
import provinciasData from '../assets/provincias.json';
import poblacionesData from '../assets/poblaciones.json';

// Tipos de datos
export interface FarmType {
  id: number;
  name: string;
}

export interface ProductionType {
  id: number;
  name: string;
}

export interface Provincia {
  code: string;
  parent_code: string;
  label: string;
}

export interface Municipio {
  code: string;
  parent_code: string;
  label: string;
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

// Función para obtener todas las provincias de España
export const getProvincias = async (): Promise<Provincia[]> => {
  try {
    // Devolver directamente los datos del JSON local
    return provinciasData as Provincia[];
  } catch (error) {
    console.error('Error al obtener provincias:', error);
    return [];
  }
};

// Función para obtener todos los municipios de una provincia específica
export const getMunicipiosByProvincia = async (codigoProvincia: string): Promise<Municipio[]> => {
  try {
    // Filtrar municipios por código de provincia usando el JSON local
    return (poblacionesData as Municipio[]).filter(
      municipio => municipio.parent_code === codigoProvincia
    );
  } catch (error) {
    console.error('Error al obtener municipios:', error);
    return [];
  }
}; 