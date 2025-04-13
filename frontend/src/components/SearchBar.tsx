import { ChangeEvent, useState } from 'react';
import { 
  Box, 
  InputAdornment, 
  TextField, 
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Clear as ClearIcon 
} from '@mui/icons-material';

interface SearchBarProps {
  onSearch: (term: string) => void;
  placeholder?: string;
  initialValue?: string;
  fullWidth?: boolean;
  debounceTime?: number;
  showClearButton?: boolean;
}

/**
 * Componente de barra de búsqueda reutilizable
 * Incluye manejo de limpieza y debounce para evitar búsquedas innecesarias
 */
const SearchBar = ({
  onSearch,
  placeholder = 'Buscar...',
  initialValue = '',
  fullWidth = true,
  debounceTime = 300,
  showClearButton = true
}: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [debounceTimeout, setDebounceTimeout] = useState<number | null>(null);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Limpia el timeout anterior si existe
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    
    // Establece un nuevo timeout para el debounce
    const timeoutId = setTimeout(() => {
      onSearch(value);
    }, debounceTime);
    
    setDebounceTimeout(timeoutId);
  };
  
  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };
  
  return (
    <Box sx={{ mb: 2 }}>
      <TextField
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearchChange}
        fullWidth={fullWidth}
        variant="outlined"
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            showClearButton && searchTerm && (
              <InputAdornment position="end">
                <Tooltip title="Limpiar búsqueda">
                  <IconButton
                    aria-label="clear search"
                    onClick={handleClear}
                    edge="end"
                    size="small"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            )
          ),
          sx: {
            borderRadius: 2,
            '&.Mui-focused': {
              boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)'
            }
          }
        }}
      />
    </Box>
  );
};

export default SearchBar; 