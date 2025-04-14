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
  
  const searchFields = isDashboard 
    ? ['animal_type', 'identification_number', 'farm_name']
    : ['animal_type', 'identification_number', 'sanitary_register'];
  
  
  const filterAnimal = useCallback((animal: Animal | DashboardAnimal, term: string) => {
    const searchTerm = term.toLowerCase().trim();
    
    if (!searchTerm) return true;
    
    
    return searchFields.some(field => {
      const value = (animal as any)[field];
      return value?.toString().toLowerCase().includes(searchTerm);
    });
  }, [searchFields]);
  
  
  const { 
    filteredData, 
    setSearchTerm,
    searchTerm 
  } = useFilteredData<Animal | DashboardAnimal>(animals, filterAnimal);
  
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  
  const [orderBy, setOrderBy] = useState<string>('identification_number'); 

  
  
  
  function descendingComparator(a: Animal | DashboardAnimal, b: Animal | DashboardAnimal, orderBy: string) {
    const key = orderBy as keyof (Animal | DashboardAnimal);
    
    
    let valA: any = key in a ? a[key] : undefined;
    let valB: any = key in b ? b[key] : undefined;

    if (orderBy === 'farm_name') {
      valA = (a as DashboardAnimal).farm_name;
      valB = (b as DashboardAnimal).farm_name;
    }

    
    if (valA == null || valB == null) {
      return (valA == null && valB != null) ? 1 : (valB == null && valA != null) ? -1 : 0;
    }
    
    
    return valB < valA ? -1 : valB > valA ? 1 : 0;
  }

  
  type Order = 'asc' | 'desc';

  
  function getComparator(
    order: Order,
    orderBy: string,
  ): (a: Animal | DashboardAnimal, b: Animal | DashboardAnimal) => number {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  
  function stableSort(array: readonly (Animal | DashboardAnimal)[], comparator: (a: Animal | DashboardAnimal, b: Animal | DashboardAnimal) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [Animal | DashboardAnimal, number]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1]; 
    });
    return stabilizedThis.map((el) => el[0]);
  }
  
  
  const handleRequestSort = useCallback((property: string) => {
    setOrder(orderBy === property && order === 'asc' ? 'desc' : 'asc');
    setOrderBy(property);
  }, [order, orderBy]);
  
  

  
  const sortedAndPaginatedData = useMemo(() => {
    const comparator = getComparator(order, orderBy);
    const sortedData = stableSort(filteredData, comparator);
    
    const startIndex = page * rowsPerPage;
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, order, orderBy, page, rowsPerPage]);
  
  
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  
  const hasIncident = (incidents: string) => {
    return incidents && incidents.toLowerCase() !== 'ninguno' && incidents.trim() !== '';
  };

  
  const renderCellContent = useCallback((cell: HeadCell, animal: Animal | DashboardAnimal) => {
    const key = cell.id as keyof (Animal | DashboardAnimal);
    
    if (cell.id === 'incidents') {
      const hasAnimalIncident = hasIncident(animal.incidents);
      return hasAnimalIncident ? (
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
    } 
    
    if (isDashboard && cell.id === 'farm_name') {
      return (animal as DashboardAnimal).farm_name;
    }
    
    
    return animal[key] != null ? String(animal[key]) : '-';
  }, [isDashboard]);

  
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

  
  interface HeadCell {
    id: keyof Animal | keyof DashboardAnimal | 'actions'; 
    label: string;
    numeric: boolean;
    disablePadding?: boolean;
    sortable: boolean; 
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
    const actionCell: HeadCell = { id: 'actions', numeric: false, label: 'Acciones', sortable: false }; 

    if (isDashboard) {
      return [...commonCells, ...dashboardCells, incidentCell];
    } else {
      return [...commonCells, ...farmCells, incidentCell, actionCell];
    }
  }, [isDashboard]);

  
  const getCellWidth = useCallback((headCell: HeadCell) => {
    if (headCell.id === 'incidents') return '35%';
    if (headCell.id === 'actions') return 100;
    return 'auto';
  }, []);

  
  const getCellMinWidth = useCallback((headCell: HeadCell) => {
    if (headCell.id === 'incidents') return 150;
    if (headCell.numeric || headCell.id === 'identification_number') return 80;
    return undefined;
  }, []);

  
  const getSortLabelStyles = useCallback((headCell: HeadCell) => {
    
    const labelFlexDirection = headCell.numeric ? 'row-reverse' : 'row';
    
    
    const labelJustification = headCell.numeric ? 'flex-end' : 'flex-start';
    
    
    const iconColor = orderBy === headCell.id 
      ? themeColors.primary.contrastText + ' !important' 
      : alpha(themeColors.primary.contrastText, 0.5);
    
    
    const iconMarginLeft = headCell.numeric ? '8px' : '0';
    
    return {
      
      flexDirection: labelFlexDirection,
      
      width: '100%',
      justifyContent: labelJustification,
      '& .MuiTableSortLabel-icon': {
        color: iconColor, 
        
        marginLeft: iconMarginLeft,
      },
      '&:hover': {
        color: themeColors.primary.contrastText, 
      },
      color: themeColors.primary.contrastText, 
    };
  }, [orderBy, themeColors]);

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
                    width: getCellWidth(headCell),
                    minWidth: getCellMinWidth(headCell),
                  }}
                >
                  {headCell.sortable ? (
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : 'asc'}
                      onClick={() => handleRequestSort(headCell.id as string)}
                      sx={getSortLabelStyles(headCell)}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  ) : (
                    headCell.label 
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedAndPaginatedData.length > 0 ? (
              sortedAndPaginatedData.map((animal, index) => {
                
                const visibleCells = headCells.filter(cell => cell.id !== 'actions'); 
                
                
                const rowBackgroundColor = index % 2 === 0
                  ? themeColors.surface.containerLowest
                  : themeColors.surface.containerLow;
                
                return (
                  <TableRow 
                    key={animal.id}
                    sx={{
                      bgcolor: rowBackgroundColor,
                      '&:hover': { 
                        bgcolor: themeColors.surface.containerHigh
                      },
                      transition: 'background-color 0.2s'
                    }}
                  >
                    {/* Mapear sobre las celdas definidas para generar las celdas del cuerpo */}
                    {visibleCells.map((cell) => {
                      return (
                        <TableCell 
                          key={cell.id}
                          align={cell.numeric ? 'right' : 'left'} 
                          sx={{ 
                            color: themeColors.text.primary, 
                            whiteSpace: 'nowrap', 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis' 
                          }}
                        >
                          {renderCellContent(cell, animal)}
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