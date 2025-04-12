import { useCallback } from 'react';
import { 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  IconButton,
  Box,
  Typography,
  Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { Animal } from '../services/animalService';
import SearchField from './SearchField';
import { useTableData } from '../hooks/useTableData';

interface AnimalsTableProps {
  animals: Animal[];
  onEditAnimal?: (animal: Animal) => void;
  onDeleteAnimal?: (id: number) => void;
  title?: string;
}

const AnimalsTable = ({ 
  animals, 
  onEditAnimal, 
  onDeleteAnimal, 
  title = 'Animales' 
}: AnimalsTableProps) => {
  const {
    page,
    rowsPerPage,
    searchTerm,
    filteredData,
    paginatedData,
    handleChangePage,
    handleChangeRowsPerPage,
    handleSearchChange
  } = useTableData({
    data: animals,
    searchFields: ['animal_type', 'identification_number', 'farm.name'],
    initialRowsPerPage: 5
  });

  // Función simple para verificar incidencias
  const hasIncident = (incidents: string) => {
    return incidents && incidents.toLowerCase() !== 'ninguno' && incidents.trim() !== '';
  };

  // Handlers memoizados para eventos de edición y eliminación
  const handleEdit = useCallback((animal: Animal) => {
    if (onEditAnimal) {
      onEditAnimal(animal);
    }
  }, [onEditAnimal]);

  const handleDelete = useCallback((id: number) => {
    if (onDeleteAnimal) {
      onDeleteAnimal(id);
    }
  }, [onDeleteAnimal]);

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <SearchField
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Buscar por tipo, identificación o granja..."
        />
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tipo</TableCell>
              <TableCell>Identificación</TableCell>
              <TableCell>Granja</TableCell>
              <TableCell>Incidencias</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((animal) => (
                <TableRow 
                  key={animal.id}
                  sx={{ 
                    bgcolor: hasIncident(animal.incidents) ? 'error.light' : 'inherit',
                    '&:hover': { bgcolor: hasIncident(animal.incidents) ? 'error.200' : 'action.hover' }
                  }}
                >
                  <TableCell>{animal.animal_type}</TableCell>
                  <TableCell>{animal.identification_number}</TableCell>
                  <TableCell>{animal.farm?.name}</TableCell>
                  <TableCell>
                    {hasIncident(animal.incidents) ? (
                      <Chip 
                        label={animal.incidents} 
                        color="error" 
                        size="small"
                      />
                    ) : (
                      'Ninguna'
                    )}
                  </TableCell>
                  <TableCell>
                    {onEditAnimal && (
                      <IconButton 
                        size="small" 
                        color="primary" 
                        onClick={() => handleEdit(animal)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    )}
                    {onDeleteAnimal && (
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => handleDelete(animal.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No hay animales para mostrar
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
      />
    </Paper>
  );
};

export default AnimalsTable; 