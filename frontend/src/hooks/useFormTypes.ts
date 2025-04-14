import { useState, useEffect } from 'react';
import { 
  FarmType, 
  ProductionType, 
  Provincia, 
  Municipio, 
  getAllFarmTypes, 
  getAllProductionTypes, 
  getProvincias,
  getMunicipiosByProvincia 
} from '../services/typesService';

interface UseFormTypesReturn {
  farmTypes: FarmType[];
  productionTypes: ProductionType[];
  provincias: Provincia[];
  municipios: Municipio[];
  loading: boolean;
  error: Error | null;
  setSelectedProvincia: (codigoProvincia: string) => void;
}

export const useFormTypes = (): UseFormTypesReturn => {
  const [farmTypes, setFarmTypes] = useState<FarmType[]>([]);
  const [productionTypes, setProductionTypes] = useState<ProductionType[]>([]);
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [selectedProvincia, setSelectedProvincia] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  
  useEffect(() => {
    const loadTypesData = async () => {
      try {
        const [farmTypesData, productionTypesData, provinciasData] = await Promise.all([
          getAllFarmTypes(),
          getAllProductionTypes(),
          getProvincias()
        ]);
        
        setFarmTypes(farmTypesData);
        setProductionTypes(productionTypesData);
        setProvincias(provinciasData);
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

  
  useEffect(() => {
    const loadMunicipios = async () => {
      if (!selectedProvincia) {
        setMunicipios([]);
        return;
      }

      try {
        setLoading(true);
        const municipiosData = await getMunicipiosByProvincia(selectedProvincia);
        setMunicipios(municipiosData);
      } catch (error) {
        setError(error instanceof Error ? error : new Error('Error al cargar los municipios'));
        console.error('Error al cargar los municipios:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMunicipios();
  }, [selectedProvincia]);

  const handleProvinciaChange = (codigoProvincia: string) => {
    setSelectedProvincia(codigoProvincia);
  };

  return {
    farmTypes,
    productionTypes,
    provincias,
    municipios,
    loading,
    error,
    setSelectedProvincia: handleProvinciaChange
  };
}; 