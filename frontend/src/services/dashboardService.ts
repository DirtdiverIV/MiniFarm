import { api } from './api';

// Tipos de datos
export interface DashboardStats {
  total_animals: number;
  total_carne_production: number;
  total_leche_production: number;
  animals_with_incidents: AnimalWithIncident[];
}

export interface AnimalWithIncident {
  id: number;
  animal_type: string;
  identification_number: string;
  incidents: string;
  farm_name: string;
}

// Función para obtener las estadísticas del dashboard
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get<DashboardStats>('/dashboard/stats');
  return response.data;
}; 