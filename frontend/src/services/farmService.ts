import { api } from './api';


export interface Farm {
  id: number;
  name: string;
  farm_type: {
    id: number;
    name: string;
  };
  production_type: {
    id: number;
    name: string;
  };
  provincia: string;
  municipio: string;
  image_path: string;
}

export interface FarmCreateData {
  name: string;
  farm_type_id: number;
  production_type_id: number;
  provincia: string;
  municipio: string;
  image?: File;
}

export interface FarmUpdateData {
  name?: string;
  farm_type_id?: number;
  production_type_id?: number;
  provincia?: string;
  municipio?: string;
  image?: File;
}


export const getAllFarms = async (): Promise<Farm[]> => {
  const response = await api.get<Farm[]>('/farms');
  return response.data;
};


export const getFarmById = async (id: number): Promise<Farm> => {
  const response = await api.get<Farm>(`/farms/${id}`);
  return response.data;
};


export const createFarm = async (farmData: FarmCreateData): Promise<Farm> => {
  
  const formData = new FormData();
  formData.append('name', farmData.name);
  formData.append('farm_type_id', farmData.farm_type_id.toString());
  formData.append('production_type_id', farmData.production_type_id.toString());
  formData.append('provincia', farmData.provincia);
  formData.append('municipio', farmData.municipio);
  
  if (farmData.image) {
    formData.append('image', farmData.image);
  }

  const response = await api.post<{message: string, farm: Farm}>('/farms', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data.farm;
};


export const updateFarm = async (id: number, farmData: FarmUpdateData): Promise<Farm> => {
  
  const formData = new FormData();
  
  if (farmData.name) {
    formData.append('name', farmData.name);
  }
  
  if (farmData.farm_type_id) {
    formData.append('farm_type_id', farmData.farm_type_id.toString());
  }
  
  if (farmData.production_type_id) {
    formData.append('production_type_id', farmData.production_type_id.toString());
  }
  
  if (farmData.provincia) {
    formData.append('provincia', farmData.provincia);
  }
  
  if (farmData.municipio) {
    formData.append('municipio', farmData.municipio);
  }
  
  if (farmData.image) {
    formData.append('image', farmData.image);
  }

  const response = await api.put<{message: string, farm: Farm}>(`/farms/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data.farm;
};


export const deleteFarm = async (id: number): Promise<void> => {
  await api.delete(`/farms/${id}`);
}; 