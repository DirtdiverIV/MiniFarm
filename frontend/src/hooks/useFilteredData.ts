import { useState, useMemo } from 'react';

/**
 * Hook genérico para filtrar datos basados en un término de búsqueda
 * Reduce duplicación de código en componentes que necesitan filtrado
 * 
 * @param data Array de datos a filtrar
 * @param filterFn Función para determinar si un item debe incluirse en los resultados
 * @param initialSearchTerm Término de búsqueda inicial (opcional)
 */
export function useFilteredData<T>(
  data: T[],
  filterFn: (item: T, searchTerm: string) => boolean,
  initialSearchTerm = ''
) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  
  // Memoización para evitar recálculos innecesarios
  const filteredData = useMemo(() => {
    if (!searchTerm.trim() || !data) return data || [];
    return data.filter(item => filterFn(item, searchTerm));
  }, [data, searchTerm, filterFn]);
  
  // Función de reset
  const resetFilter = () => setSearchTerm('');
  
  return {
    searchTerm,
    setSearchTerm,
    filteredData,
    resetFilter,
    hasFilter: searchTerm.trim().length > 0
  };
} 