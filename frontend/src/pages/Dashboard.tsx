import { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Container,
  Button,
} from '@mui/material';
import { 
  Add as AddIcon,
  Pets as PetsIcon,
  Agriculture as AgricultureIcon,
  WaterDrop as WaterDropIcon,
  LocalShipping as MeatIcon,
  Warning as WarningIcon,

} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { themeColors } from '../theme/theme';
import { commonStyles } from '../theme/commonStyles';

// Componentes
import StatCard from '../components/StatCard';
import FarmCard from '../components/FarmCard';
import AnimalsTable from '../components/AnimalsTable';
import Loading from '../components/Loading';
import Notification from '../components/Notification';
import ConfirmDialog from '../components/ConfirmDialog';
import PaginationControls from '../components/PaginationControls';

// Hooks
import { useApi } from '../hooks/useApi';
import { useDialog } from '../hooks/useDialog';
import { useAlert } from '../hooks/useAlert';
import { useAnimalData } from '../hooks/useAnimalData';

// Servicios
import { getDashboardStats, DashboardStats } from '../services/dashboardService';
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
    // Prevenir llamadas API innecesarias o bucles infinitos
    if (dashboardApi.loading || farmsApi.loading) return;
    
    const loadData = async () => {
      try {
        await Promise.all([
          dashboardApi.execute(),
          farmsApi.execute()
        ]);
      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
        showAlert('Error al cargar datos del dashboard', 'error');
      }
    };
    
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Dependencias vacías para ejecutar solo al montar

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



  // Usar el hook personalizado para obtener los animales convertidos
  const animalsWithIncidences = useAnimalData(dashboardApi.data?.animals_with_incidents || null);

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
            sx={() => ({ 
              ...commonStyles.cards.base,
              ...commonStyles.cards.primary
            })}
          />
          <StatCard
            title="Total de Granjas"
            value={farmsApi.data?.length ?? 0}
            icon={<AgricultureIcon />}
            sx={() => ({ 
              ...commonStyles.cards.base,
              ...commonStyles.cards.secondary
            })}
          />
          <StatCard
            title="Producción Cárnica"
            value={dashboardApi.data?.total_carne_production ?? 0}
            icon={<MeatIcon />}
            unit="kgs est."
            sx={() => ({ 
              ...commonStyles.cards.base,
              ...commonStyles.cards.primary
            })}
          />
          <StatCard
            title="Producción Láctea"
            value={dashboardApi.data?.total_leche_production ?? 0}
            icon={<WaterDropIcon />}
            unit="litros/semana"
            sx={() => ({ 
              ...commonStyles.cards.base,
              ...commonStyles.cards.tertiary
            })}
          />
          <StatCard
            title="Incidencias"
            value={incidentsCount}
            icon={<WarningIcon />}
            color={hasIncidents ? 'error' : 'default'}
            sx={() => ({ 
              ...commonStyles.cards.base,
              ...(hasIncidents ? commonStyles.cards.error : { backgroundColor: themeColors.grey[100] })
            })}
          />
        </Box>

        {/* Lista de granjas */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Mis Granjas
          </Typography>

          <PaginationControls
            items={farmsApi.data || []}
            currentPage={currentFarmPage}
            setCurrentPage={setCurrentFarmPage}
            itemsPerPage={farmsPerPage}
            renderItems={(visibleFarms) => (
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 3,
              }}>
                {visibleFarms.map((farm) => (
                  <Box key={farm.id}>
                    <FarmCard farm={farm} onDelete={handleFarmDelete} />
                  </Box>
                ))}
              </Box>
            )}
          />
        </Box>
        
        {/* Tabla de animales con incidencias */}
        <Box sx={{ mt: 4 }}>
          <AnimalsTable 
            animals={animalsWithIncidences}
            title="Animales con Incidencias"
            isDashboard={true}
          />
        </Box>
      </Box>
      
      {/* Componentes de UI global */}
      <Notification
        open={alertOpen}
        severity={alertSeverity}
        message={alertMessage}
        onClose={closeAlert}
        isSnackbar={true}
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

export default Dashboard; 