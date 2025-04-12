import { useState, useEffect } from 'react';
import { FarmType, ProductionType, getAllFarmTypes, getAllProductionTypes } from '../services/typesService';

interface UseFormTypesReturn {
  farmTypes: FarmType[];
  productionTypes: ProductionType[];
  loading: boolean;
  error: Error | null;
}

export const useFormTypes = (): UseFormTypesReturn => {
  const [farmTypes, setFarmTypes] = useState<FarmType[]>([]);
  const [productionTypes, setProductionTypes] = useState<ProductionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadTypesData = async () => {
      try {
        const [farmTypesData, productionTypesData] = await Promise.all([
          getAllFarmTypes(),
          getAllProductionTypes()
        ]);
        
        setFarmTypes(farmTypesData);
        setProductionTypes(productionTypesData);
        setError(null);
      } catch (error) {
        setError(error instanceof Error ? error : new Error('Error al cargar los tipos'));
        console.error('Error al cargar los tipos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadTypesData();
  }, []);

  return {
    farmTypes,
    productionTypes,
    loading,
    error
  };
}; 