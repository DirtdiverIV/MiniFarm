import { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Container,
  Button,
  IconButton
} from '@mui/material';
import { 
  Add as AddIcon,
  Pets as PetsIcon,
  Agriculture as AgricultureIcon,
  WaterDrop as WaterDropIcon,
  LocalShipping as MeatIcon,
  Warning as WarningIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import { themeColors } from '../theme/theme';

// Componentes
import StatCard from '../components/StatCard';
import FarmCard from '../components/FarmCard';
import AnimalsTable from '../components/AnimalsTable';
import Loading from '../components/Loading';
import AlertMessage from '../components/AlertMessage';
import ConfirmDialog from '../components/ConfirmDialog';

// Hooks
import { useApi } from '../hooks/useApi';
import { useDialog } from '../hooks/useDialog';
import { useAlert } from '../hooks/useAlert';

// Servicios
import { getDashboardStats, DashboardStats, AnimalWithIncident } from '../services/dashboardService';
import { getAllFarms, Farm, deleteFarm } from '../services/farmService';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Hooks personalizados
  const { alertOpen, alertMessage, alertSeverity, showAlert, closeAlert } = useAlert();
  const { isOpen: showConfirm, data: farmToDelete, openDialog: openConfirm, closeDialog: closeConfirm } = useDialog();
  
  // APIs
  const dashboardApi = useApi<DashboardStats>(async () => {
    const data = await getDashboardStats();
    return {
      success: true,
      data,
      message: 'Datos del dashboard cargados exitosamente'
    };
  });

  const farmsApi = useApi<Farm[]>(async () => {
    const data = await getAllFarms();
    return {
      success: true,
      data,
      message: 'Granjas cargadas exitosamente'
    };
  });

  const deleteFarmApi = useApi<void, { id: number }>(
    async (params) => {
      if (!params?.id) throw new Error('ID de granja requerido');
      await deleteFarm(params.id);
      return { 
        success: true, 
        data: undefined, 
        message: 'Granja eliminada exitosamente' 
      };
    },
    {
      onSuccess: () => {
        showAlert('Granja eliminada con éxito', 'success');
        // Recargar la lista de granjas
        farmsApi.execute();
      },
      onError: (error) => {
        showAlert(error, 'error');
      }
    }
  );

  // Cargar datos al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          dashboardApi.execute(),
          farmsApi.execute()
        ]);
      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
      }
    };
    
    loadData();
  }, []);

  // Manejadores de eventos
  const handleAddFarm = () => {
    navigate('/farms/new');
  };

  const handleFarmDelete = (id: number) => {
    const farm = farmsApi.data?.find(f => f.id === id);
    if (farm) {
      openConfirm(farm);
    }
  };

  const handleConfirmDelete = async () => {
    if (farmToDelete) {
      await deleteFarmApi.execute({ id: farmToDelete.id });
      closeConfirm();
    }
  };

  const incidentsCount = dashboardApi.data?.animals_with_incidents?.length || 0;
  const hasIncidents = incidentsCount > 0;

  const [currentFarmPage, setCurrentFarmPage] = useState(0);
  const farmsPerPage = 3;

  const handleNextPage = () => {
    if (farmsApi.data) {
      setCurrentFarmPage(prev => 
        prev + 1 >= Math.ceil((farmsApi.data?.length || 0) / farmsPerPage) ? 0 : prev + 1
      );
    }
  };

  const handlePrevPage = () => {
    if (farmsApi.data) {
      setCurrentFarmPage(prev => 
        prev - 1 < 0 ? Math.ceil((farmsApi.data?.length || 0) / farmsPerPage) - 1 : prev - 1
      );
    }
  };

  // Calcular granjas visibles
  const visibleFarms = farmsApi.data ? farmsApi.data.slice(
    currentFarmPage * farmsPerPage,
    (currentFarmPage + 1) * farmsPerPage
  ) : [];

  const totalPages = farmsApi.data ? Math.ceil(farmsApi.data.length / farmsPerPage) : 0;
  const showNavigation = (farmsApi.data?.length || 0) > farmsPerPage;

  // Renderizar estado de carga
  if ((dashboardApi.loading || farmsApi.loading) && !dashboardApi.data && !farmsApi.data) {
    return <Loading message="Cargando datos del dashboard..." />;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4
        }}>
          <Typography variant="h4">
            Dashboard
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddFarm}
          >
            Nueva Granja
          </Button>
        </Box>

        {/* Tarjetas de estadísticas */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(5, 1fr)'
          }, 
          gap: 3, 
          mb: 4 
        }}>
          <StatCard
            title="Total de Animales"
            value={dashboardApi.data?.total_animals ?? 0}
            icon={<PetsIcon />}
            sx={(theme) => ({ 
              backgroundColor: alpha(themeColors.primary.light, 0.2),
              border: '1px solid',
              borderColor: themeColors.outline.variant,
            })}
          />
          <StatCard
            title="Total de Granjas"
            value={farmsApi.data?.length ?? 0}
            icon={<AgricultureIcon />}
            sx={(theme) => ({ 
              backgroundColor: alpha(themeColors.secondary.light, 0.2),
              border: '1px solid',
              borderColor: themeColors.outline.variant,
            })}
          />
          <StatCard
            title="Producción Cárnica"
            value={dashboardApi.data?.total_carne_production ?? 0}
            icon={<MeatIcon />}
            sx={(theme) => ({ 
              backgroundColor: alpha(themeColors.primary.light, 0.2),
              border: '1px solid',
              borderColor: themeColors.outline.variant,
            })}
          />
          <StatCard
            title="Producción Láctea"
            value={dashboardApi.data?.total_leche_production ?? 0}
            icon={<WaterDropIcon />}
            sx={(theme) => ({ 
              backgroundColor: alpha(themeColors.tertiary.light, 0.2),
              border: '1px solid',
              borderColor: themeColors.outline.variant,
            })}
          />
          <StatCard
            title="Incidencias"
            value={incidentsCount}
            icon={<WarningIcon />}
            color={hasIncidents ? 'error' : 'default'}
            sx={theme => ({ 
              backgroundColor: hasIncidents ? alpha(themeColors.error.light, 0.2) : themeColors.grey[100],
              border: '1px solid',
              borderColor: hasIncidents 
                ? alpha(themeColors.error.main, 0.2)
                : themeColors.outline.variant
            })}
          />
        </Box>

        {/* Lista de granjas */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Mis Granjas
          </Typography>

          <Box sx={{ position: 'relative' }}>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 3,
              position: 'relative',
            }}>
              {visibleFarms.map((farm) => (
                <Box key={farm.id}>
                  <FarmCard farm={farm} onDelete={handleFarmDelete} />
                </Box>
              ))}
            </Box>

            {showNavigation && (
              <>
                <IconButton
                  onClick={handlePrevPage}
                  sx={(theme) => ({
                    position: 'absolute',
                    left: -20,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: themeColors.primary.main,
                    color: themeColors.common.white,
                    boxShadow: theme.shadows[3],
                    width: 40,
                    height: 40,
                    '&:hover': {
                      bgcolor: themeColors.primary.dark,
                    },
                    '&:disabled': {
                      bgcolor: themeColors.surface.containerHigh,
                    }
                  })}
                >
                  <ChevronLeftIcon />
                </IconButton>
                <IconButton
                  onClick={handleNextPage}
                  sx={(theme) => ({
                    position: 'absolute',
                    right: -20,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: themeColors.primary.main,
                    color: themeColors.common.white,
                    boxShadow: theme.shadows[3],
                    width: 40,
                    height: 40,
                    '&:hover': {
                      bgcolor: themeColors.primary.dark,
                    },
                    '&:disabled': {
                      bgcolor: themeColors.surface.containerHigh,
                    }
                  })}
                >
                  <ChevronRightIcon />
                </IconButton>
              </>
            )}
          </Box>

          {totalPages > 1 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: 1, 
              mt: 2 
            }}>
              {[...Array(totalPages)].map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: currentFarmPage === index ? themeColors.primary.main : themeColors.outline.main,
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onClick={() => setCurrentFarmPage(index)}
                />
              ))}
            </Box>
          )}
        </Box>
        
        {/* Tabla de animales con incidencias */}
        <Box sx={{ mt: 4 }}>
          <AnimalsTable 
            animals={dashboardApi.data === null ? [] : dashboardApi.data.animals_with_incidents.map(convertToAnimal)}
            title="Animales con Incidencias"
            isDashboard={true}
          />
        </Box>
      </Box>
      
      {/* Componentes de UI global */}
      <AlertMessage
        open={alertOpen}
        severity={alertSeverity}
        message={alertMessage}
        onClose={closeAlert}
      />
      
      <ConfirmDialog
        open={showConfirm}
        title="Eliminar Granja"
        message={`¿Estás seguro de que deseas eliminar la granja ${farmToDelete?.name}? Esta acción no se puede deshacer y eliminará todos los animales asociados.`}
        onConfirm={handleConfirmDelete}
        onCancel={closeConfirm}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </Container>
  );
};

// Función auxiliar para convertir AnimalWithIncident a Animal
const convertToAnimal = (animalWithIncident: AnimalWithIncident) => {
  return {
    id: animalWithIncident.id,
    animal_type: animalWithIncident.animal_type,
    identification_number: animalWithIncident.identification_number,
    incidents: animalWithIncident.incidents,
    farm_name: animalWithIncident.farm_name,
    farm: {
      id: 0, // No tenemos el ID de la granja en este objeto
      name: animalWithIncident.farm_name
    },
    // Valores por defecto para los campos requeridos que no están en AnimalWithIncident
    weight: 0,
    estimated_production: 0,
    sanitary_register: '',
    age: 0
  };
};

export default Dashboard; 