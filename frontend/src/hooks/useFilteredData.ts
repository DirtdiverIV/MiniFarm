import { useState, useMemo } from 'react';

export function useFilteredData<T>(
  data: T[],
  filterFn: (item: T, searchTerm: string) => boolean,
  initialSearchTerm = ''
) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  

  const filteredData = useMemo(() => {
    if (!searchTerm.trim() || !data) return data || [];
    return data.filter(item => filterFn(item, searchTerm));
  }, [data, searchTerm, filterFn]);
  

  const resetFilter = () => setSearchTerm('');
  
  return {
    searchTerm,
    setSearchTerm,
    filteredData,
    resetFilter,
    hasFilter: searchTerm.trim().length > 0
  };
} 