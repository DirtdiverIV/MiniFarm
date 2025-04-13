import { useCallback, useMemo, useState } from 'react';
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
  Chip,
  TableSortLabel
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { Animal } from '../services/animalService';
import SearchBar from './SearchBar';
import { alpha } from '@mui/material/styles';
import { themeColors } from '../theme/theme';
import { useFilteredData } from '../hooks/useFilteredData';

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
  // Definir los campos de búsqueda según el tipo de tabla
  const searchFields = isDashboard 
    ? ['animal_type', 'identification_number', 'farm_name']
    : ['animal_type', 'identification_number', 'sanitary_register'];
  
  // Función de filtrado para nuestro hook
  const filterAnimal = useCallback((animal: Animal | DashboardAnimal, term: string) => {
    const searchTerm = term.toLowerCase().trim();
    
    if (!searchTerm) return true;
    
    // Verificar cada campo de búsqueda
    return searchFields.some(field => {
      const value = (animal as any)[field];
      return value && value.toString().toLowerCase().includes(searchTerm);
    });
  }, [searchFields]);
  
  // Usar nuestro hook personalizado de filtrado
  const { 
    filteredData, 
    setSearchTerm,
    searchTerm 
  } = useFilteredData<Animal | DashboardAnimal>(animals, filterAnimal);
  
  // Estado para paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  // Estado para ordenación
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  // Usar un tipo más genérico para orderBy ya que las columnas cambian
  const [orderBy, setOrderBy] = useState<string>('identification_number'); 

  // ---- Lógica de ordenación ----
  
  // Función auxiliar para comparación descendente
  function descendingComparator(a: Animal | DashboardAnimal, b: Animal | DashboardAnimal, orderBy: string) {
    const key = orderBy as keyof (Animal | DashboardAnimal);
    
    // Obtener valores, manejando el caso especial de farm_name
    let valA: any = key in a ? a[key] : undefined;
    let valB: any = key in b ? b[key] : undefined;

    if (orderBy === 'farm_name') {
      valA = (a as DashboardAnimal).farm_name;
      valB = (b as DashboardAnimal).farm_name;
    }

    // Comparación robusta que maneja null/undefined
    if (valB == null && valA != null) return -1; // b es null/undefined, a no lo es -> a va primero
    if (valA == null && valB != null) return 1;  // a es null/undefined, b no lo es -> b va primero
    if (valA == null && valB == null) return 0; // Ambos son null/undefined -> son iguales

    // Comparación normal si ambos valores existen
    if (valB < valA) {
      return -1;
    }
    if (valB > valA) {
      return 1;
    }
    return 0;
  }

  // Tipo para la función de comparación
  type Order = 'asc' | 'desc';

  // Obtiene la función de comparación correcta según el orden y el campo
  function getComparator(
    order: Order,
    orderBy: string,
  ): (a: Animal | DashboardAnimal, b: Animal | DashboardAnimal) => number {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  // Ordenación estable
  function stableSort(array: readonly (Animal | DashboardAnimal)[], comparator: (a: Animal | DashboardAnimal, b: Animal | DashboardAnimal) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [Animal | DashboardAnimal, number]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1]; // Si son iguales, mantiene el orden original
    });
    return stabilizedThis.map((el) => el[0]);
  }
  
  // Manejador para solicitar la ordenación
  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  
  // ---- Fin Lógica de ordenación ----

  // Calcular datos ordenados y paginados
  const sortedAndPaginatedData = useMemo(() => {
    const comparator = getComparator(order, orderBy);
    const sortedData = stableSort(filteredData, comparator);
    
    const startIndex = page * rowsPerPage;
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, order, orderBy, page, rowsPerPage]);
  
  // Manejadores para paginación
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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

  // Definir las cabeceras de la tabla
  interface HeadCell {
    id: keyof Animal | keyof DashboardAnimal | 'actions'; // Incluye posibles claves y 'actions'
    label: string;
    numeric: boolean;
    disablePadding?: boolean;
    sortable: boolean; // Añadir propiedad para indicar si es ordenable
  }
  
  const headCells: readonly HeadCell[] = useMemo(() => {
    const commonCells: HeadCell[] = [
      { id: 'animal_type', numeric: false, label: 'Tipo', sortable: true },
      { id: 'identification_number', numeric: false, label: 'ID', sortable: true },
    ];
    
    const farmCells: HeadCell[] = [
      { id: 'weight', numeric: true, label: 'Peso (kg)', sortable: true },
      { id: 'estimated_production', numeric: true, label: 'Prod. Est.', sortable: true },
      { id: 'sanitary_register', numeric: false, label: 'Reg. San.', sortable: true },
      { id: 'age', numeric: true, label: 'Edad', sortable: true },
    ];

    const dashboardCells: HeadCell[] = [
      { id: 'farm_name', numeric: false, label: 'Granja', sortable: true },
    ];

    const incidentCell: HeadCell = { id: 'incidents', numeric: false, label: 'Incidencias', sortable: true };
    const actionCell: HeadCell = { id: 'actions', numeric: false, label: 'Acciones', sortable: false }; // Acciones no son ordenables

    if (isDashboard) {
      return [...commonCells, ...dashboardCells, incidentCell];
    } else {
      return [...commonCells, ...farmCells, incidentCell, actionCell];
    }
  }, [isDashboard]);

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
        <SearchBar
          onSearch={setSearchTerm}
          initialValue={searchTerm}
          placeholder={isDashboard 
            ? "Buscar por tipo, identificación o granja..." 
            : "Buscar por tipo, identificación o registro sanitario..."}
        />
      </Box>

      <TableContainer sx={{ borderRadius: 1, overflow: 'hidden' }}>
        {/* Quitar tableLayout fijo */}
        <Table>
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.numeric ? 'right' : 'left'}
                  padding={headCell.disablePadding ? 'none' : 'normal'}
                  sx={{ 
                    backgroundColor: themeColors.primary.main,
                    color: themeColors.primary.contrastText,
                    fontWeight: 'bold',
                    // --- Reajustar anchos sin tableLayout fijo ---
                    width: 
                      headCell.id === 'incidents' ? '35%' : // Incidencias con % 
                      headCell.id === 'actions' ? 100 : // Acciones con px fijo
                      'auto', // Resto automático
                    // Añadir minWidth a columnas específicas
                    minWidth: 
                      headCell.id === 'incidents' ? 150 : 
                      (headCell.numeric || headCell.id === 'identification_number') ? 80 : 
                      undefined, // Sin minWidth para el resto
                  }}
                >
                  {headCell.sortable ? (
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : 'asc'}
                      onClick={() => handleRequestSort(headCell.id as string)}
                      sx={{ 
                        // Forzar dirección para que el icono esté siempre después del texto
                        flexDirection: headCell.numeric ? 'row-reverse' : 'row',
                        // Ajustar para que el label ocupe espacio disponible si es necesario
                        width: '100%', 
                        justifyContent: headCell.numeric ? 'flex-end' : 'flex-start',
                        '& .MuiTableSortLabel-icon': {
                          color: orderBy === headCell.id ? themeColors.primary.contrastText + ' !important' : alpha(themeColors.primary.contrastText, 0.5) , // Color del icono
                          // Añadir margen para separar icono del texto en celdas alineadas a la derecha
                          marginLeft: headCell.numeric ? '8px' : '0',
                        },
                        '&:hover': {
                          color: themeColors.primary.contrastText, // Color al pasar el ratón
                        },
                        color: themeColors.primary.contrastText, // Color del texto
                      }}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  ) : (
                    headCell.label // Si no es ordenable, solo muestra la etiqueta
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedAndPaginatedData.length > 0 ? (
              sortedAndPaginatedData.map((animal, index) => {
                // Obtenemos las celdas visibles para esta fila (depende de isDashboard)
                const visibleCells = headCells.filter(cell => cell.id !== 'actions'); // Excluimos acciones aquí
                
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
                    {/* Mapear sobre las celdas definidas para generar las celdas del cuerpo */}
                    {visibleCells.map((cell) => {
                      let cellContent;
                      const key = cell.id as keyof (Animal | DashboardAnimal); // Clave para acceder a los datos

                      if (cell.id === 'incidents') {
                        const hasAnimalIncident = hasIncident(animal.incidents);
                        cellContent = hasAnimalIncident ? (
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
                        );
                      } else if (isDashboard && cell.id === 'farm_name') {
                        cellContent = (animal as DashboardAnimal).farm_name;
                      } else {
                        // Acceder al valor usando la clave, asegurar que no sea undefined
                        cellContent = animal[key] != null ? String(animal[key]) : '-'; 
                      }

                      return (
                        <TableCell 
                          key={cell.id}
                          align={cell.numeric ? 'right' : 'left'} // Aplicar alineación
                          sx={{ 
                            color: themeColors.text.primary, 
                            whiteSpace: 'nowrap', // Evitar saltos de línea
                            overflow: 'hidden', // Ocultar desbordamiento
                            textOverflow: 'ellipsis' // Añadir puntos suspensivos si el contenido es muy largo
                          }}
                        >
                          {cellContent}
                        </TableCell>
                      );
                    })}

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
                              onClick={() => handleEdit(animal as Animal)}
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
                              onClick={() => handleDelete(animal.id as number)}
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
                  colSpan={headCells.length}
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