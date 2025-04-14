import { api } from './api';


export interface Animal {
  id: number;
  animal_type: string;
  identification_number: string;
  weight: number;
  estimated_production: number;
  sanitary_register: string;
  age: number;
  incidents: string;
  farm?: {
    id: number;
    name: string;
  };
}

export interface AnimalCreateData {
  farm_id: number;
  animal_type: string;
  identification_number: string;
  weight: number;
  estimated_production: number;
  sanitary_register: string;
  age: number;
  incidents: string;
}

export type AnimalUpdateData = Partial<AnimalCreateData>;


export const getAnimalsByFarm = async (farmId: number): Promise<Animal[]> => {
  const response = await api.get<Animal[]>(`/animals/farm/${farmId}`);
  return response.data;
};


export const getAnimalById = async (id: number): Promise<Animal> => {
  const response = await api.get<Animal>(`/animals/${id}`);
  return response.data;
};


export const createAnimal = async (animalData: AnimalCreateData): Promise<Animal> => {
  const response = await api.post<{message: string, animal: Animal}>('/animals', animalData);
  return response.data.animal;
};


export const updateAnimal = async (id: number, animalData: AnimalUpdateData): Promise<Animal> => {
  const response = await api.put<{message: string, animal: Animal}>(`/animals/${id}`, animalData);
  return response.data.animal;
};


export const deleteAnimal = async (id: number): Promise<void> => {
  await api.delete(`/animals/${id}`);
}; 