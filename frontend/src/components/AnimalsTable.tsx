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
import { alpha } from '@mui/material/styles';
import { themeColors } from '../theme/theme';

// Extendemos el tipo Animal para la versión del dashboard
interface DashboardAnimal extends Animal {
  farm_name: string;
}

interface AnimalsTableProps {
  animals: Animal[] | DashboardAnimal[];
  onEditAnimal?: (animal: Animal) => void;
  onDeleteAnimal?: (id: number) => void;
  title?: string;
  isDashboard?: boolean;
}

const AnimalsTable = ({ 
  animals, 
  onEditAnimal, 
  onDeleteAnimal, 
  title = 'Animales',
  isDashboard = false
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
    searchFields: isDashboard 
      ? ['animal_type', 'identification_number', 'farm_name']
      : ['animal_type', 'identification_number', 'sanitary_register'],
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
    <Paper 
      elevation={2} 
      sx={{ 
        p: 2, 
        backgroundColor: themeColors.surface.containerLowest,
        borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom color={themeColors.text.primary}>
          {title}
        </Typography>
        <SearchField
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder={isDashboard 
            ? "Buscar por tipo, identificación o granja..." 
            : "Buscar por tipo, identificación o registro sanitario..."}
        />
      </Box>

      <TableContainer sx={{ borderRadius: 1, overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell 
                sx={{ 
                  backgroundColor: themeColors.primary.main,
                  color: themeColors.primary.contrastText,
                  fontWeight: 'bold'
                }}
              >
                Tipo
              </TableCell>
              <TableCell 
                sx={{ 
                  backgroundColor: themeColors.primary.main,
                  color: themeColors.primary.contrastText,
                  fontWeight: 'bold'
                }}
              >
                Identificación
              </TableCell>
              {!isDashboard && (
                <>
                  <TableCell 
                    sx={{ 
                      backgroundColor: themeColors.primary.main,
                      color: themeColors.primary.contrastText,
                      fontWeight: 'bold'
                    }}
                  >
                    Peso (kg)
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      backgroundColor: themeColors.primary.main,
                      color: themeColors.primary.contrastText,
                      fontWeight: 'bold'
                    }}
                  >
                    Producción Est.
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      backgroundColor: themeColors.primary.main,
                      color: themeColors.primary.contrastText,
                      fontWeight: 'bold'
                    }}
                  >
                    Registro Sanitario
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      backgroundColor: themeColors.primary.main,
                      color: themeColors.primary.contrastText,
                      fontWeight: 'bold'
                    }}
                  >
                    Edad
                  </TableCell>
                </>
              )}
              {isDashboard && (
                <TableCell 
                  sx={{ 
                    backgroundColor: themeColors.primary.main,
                    color: themeColors.primary.contrastText,
                    fontWeight: 'bold'
                  }}
                >
                  Granja
                </TableCell>
              )}
              <TableCell 
                sx={{ 
                  backgroundColor: themeColors.primary.main,
                  color: themeColors.primary.contrastText,
                  fontWeight: 'bold'
                }}
              >
                Incidencias
              </TableCell>
              {!isDashboard && (
                <TableCell 
                  sx={{ 
                    backgroundColor: themeColors.primary.main,
                    color: themeColors.primary.contrastText,
                    fontWeight: 'bold'
                  }}
                >
                  Acciones
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((animal, index) => {
                const hasAnimalIncident = hasIncident(animal.incidents);
                
                return (
                  <TableRow 
                    key={animal.id}
                    sx={{
                      bgcolor: index % 2 === 0 
                        ? themeColors.surface.containerLowest
                        : themeColors.surface.containerLow,
                      '&:hover': { 
                        bgcolor: themeColors.surface.containerHigh
                      },
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <TableCell sx={{ color: themeColors.text.primary }}>
                      {animal.animal_type}
                    </TableCell>
                    <TableCell sx={{ color: themeColors.text.primary }}>
                      {animal.identification_number}
                    </TableCell>
                    {!isDashboard && (
                      <>
                        <TableCell sx={{ color: themeColors.text.primary }}>
                          {animal.weight}
                        </TableCell>
                        <TableCell sx={{ color: themeColors.text.primary }}>
                          {animal.estimated_production}
                        </TableCell>
                        <TableCell sx={{ color: themeColors.text.primary }}>
                          {animal.sanitary_register}
                        </TableCell>
                        <TableCell sx={{ color: themeColors.text.primary }}>
                          {animal.age}
                        </TableCell>
                      </>
                    )}
                    {isDashboard && (
                      <TableCell sx={{ color: themeColors.text.primary }}>
                        {(animal as DashboardAnimal).farm_name}
                      </TableCell>
                    )}
                    <TableCell>
                      {hasAnimalIncident ? (
                        <Chip 
                          label={animal.incidents} 
                          sx={{
                            backgroundColor: themeColors.error.container,
                            color: themeColors.error.dark,
                            fontWeight: 'bold',
                            borderRadius: '4px',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
                            fontFamily: '"Roboto Mono", "Courier New", monospace'
                          }}
                          size="small"
                        />
                      ) : (
                        <Typography variant="body2" sx={{ color: themeColors.text.secondary }}>Ninguna</Typography>
                      )}
                    </TableCell>
                    {!isDashboard && (
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {onEditAnimal && (
                            <IconButton 
                              size="small" 
                              sx={{ 
                                color: '#ffffff',
                                backgroundColor: themeColors.primary.main,
                                borderRadius: '4px',
                                width: '28px',
                                height: '28px',
                                '&:hover': {
                                  backgroundColor: themeColors.primary.dark,
                                }
                              }}
                              onClick={() => handleEdit(animal)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          )}
                          {onDeleteAnimal && (
                            <IconButton 
                              size="small" 
                              sx={{ 
                                color: '#ffffff',
                                backgroundColor: themeColors.error.main,
                                borderRadius: '4px',
                                width: '28px',
                                height: '28px',
                                '&:hover': {
                                  backgroundColor: themeColors.error.dark,
                                }
                              }}
                              onClick={() => handleDelete(animal.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell 
                  colSpan={isDashboard ? 4 : 8} 
                  align="center"
                  sx={{ 
                    color: themeColors.text.secondary,
                    py: 4,
                    backgroundColor: themeColors.surface.containerLowest
                  }}
                >
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
        sx={{
          color: themeColors.text.primary,
          '& .MuiIconButton-root': {
            color: themeColors.primary.main,
            '&:hover': {
              backgroundColor: alpha(themeColors.primary.light, 0.1),
            }
          },
          '& .Mui-disabled': {
            color: themeColors.outline.main,
          }
        }}
      />
    </Paper>
  );
};

export default AnimalsTable; 