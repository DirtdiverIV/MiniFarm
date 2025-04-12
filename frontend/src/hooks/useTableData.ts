import { useState, useMemo } from 'react';

interface UseTableDataProps<T> {
  data: T[];
  searchFields: string[];
  initialRowsPerPage?: number;
}

interface UseTableDataReturn<T> {
  page: number;
  rowsPerPage: number;
  searchTerm: string;
  filteredData: T[];
  paginatedData: T[];
  handleChangePage: (_event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

export function useTableData<T>({ 
  data, 
  searchFields,
  initialRowsPerPage = 5 
}: UseTableDataProps<T>): UseTableDataReturn<T> {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [searchTerm, setSearchTerm] = useState('');

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    const searchTermLower = searchTerm.toLowerCase();
    return data.filter(item => 
      searchFields.some(field => {
        const value = getNestedValue(item, field);
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(searchTermLower);
      })
    );
  }, [data, searchFields, searchTerm]);

  const paginatedData = useMemo(() => 
    filteredData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    ),
    [filteredData, page, rowsPerPage]
  );

  return {
    page,
    rowsPerPage,
    searchTerm,
    filteredData,
    paginatedData,
    handleChangePage,
    handleChangeRowsPerPage,
    handleSearchChange
  };
} 