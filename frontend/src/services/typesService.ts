import { api } from './api';
import provinciasData from '../assets/provincias.json';
import poblacionesData from '../assets/poblaciones.json';


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


export const getAllFarmTypes = async (): Promise<FarmType[]> => {
  const response = await api.get<FarmType[]>('/farm-types');
  return response.data;
};


export const getAllProductionTypes = async (): Promise<ProductionType[]> => {
  const response = await api.get<ProductionType[]>('/production-types');
  return response.data;
};


export const getProvincias = async (): Promise<Provincia[]> => {
  try {
    
    return provinciasData as Provincia[];
  } catch (error) {
    console.error('Error al obtener provincias:', error);
    return [];
  }
};


export const getMunicipiosByProvincia = async (codigoProvincia: string): Promise<Municipio[]> => {
  try {
    
    return (poblacionesData as Municipio[]).filter(
      municipio => municipio.parent_code === codigoProvincia
    );
  } catch (error) {
    console.error('Error al obtener municipios:', error);
    return [];
  }
}; 