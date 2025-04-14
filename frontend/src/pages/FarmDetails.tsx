import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Container, 
  Button
} from '@mui/material';
import { 
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Pets as PetsIcon,
  Scale as ScaleIcon,
  Warning as WarningIcon,
  Agriculture as AgricultureIcon,
  LocalShipping as ShippingIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { themeColors } from '../theme/theme';


import StatCard from '../components/StatCard';
import AnimalsTable from '../components/AnimalsTable';
import Loading from '../components/Loading';
import AlertMessage from '../components/AlertMessage';
import ConfirmDialog from '../components/ConfirmDialog';


import { useApi } from '../hooks/useApi';
import { useDialog } from '../hooks/useDialog';
import { useAlert } from '../hooks/useAlert';


import { getFarmById, Farm } from '../services/farmService';
import { getAnimalsByFarm, deleteAnimal, Animal } from '../services/animalService';

const FarmDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  
  const { alertOpen, alertMessage, alertSeverity, showAlert, closeAlert } = useAlert();
  const { isOpen: showConfirm, data: animalToDelete, openDialog: openConfirm, closeDialog: closeConfirm } = useDialog();

 
  const farmApi = useApi<Farm>(async () => {
    if (!id) throw new Error('ID de granja requerido');
    const data = await getFarmById(parseInt(id));
    return {
      success: true,
      data,
      message: 'Datos de la granja cargados exitosamente'
    };
  });

  const animalsApi = useApi<Animal[]>(async () => {
    if (!id) throw new Error('ID de granja requerido');
    const data = await getAnimalsByFarm(parseInt(id));
    return {
      success: true,
      data,
      message: 'Animales cargados exitosamente'
    };
  });

  const deleteAnimalApi = useApi<void, { id: number }>(
    async (params) => {
      if (!params?.id) throw new Error('ID de animal requerido');
      await deleteAnimal(params.id);
      return {
        success: true,
        data: undefined,
        message: 'Animal eliminado exitosamente'
      };
    },
    {
      onSuccess: () => {
        showAlert('Animal eliminado con éxito', 'success');
      
        animalsApi.execute();
      },
      onError: (error) => {
        showAlert(error, 'error');
      }
    }
  );


  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          farmApi.execute(),
          animalsApi.execute()
        ]);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };
    
    loadData();
  }, [id]);


  const handleAddAnimal = () => {
    navigate(`/farms/${id}/animals/new`);
  };

  const handleEditAnimal = (animalId: number) => {
    navigate(`/farms/${id}/animals/${animalId}/edit`);
  };

  const handleDeleteAnimal = (animalId: number) => {
    const animal = animalsApi.data?.find(a => a.id === animalId);
    if (animal) {
      openConfirm(animal);
    }
  };

  const handleConfirmDelete = async () => {
    if (animalToDelete) {
      await deleteAnimalApi.execute({ id: animalToDelete.id });
      closeConfirm();
    }
  };

  const handleBackClick = () => {
    navigate('/');
  };

  
  if ((farmApi.loading || animalsApi.loading) && !farmApi.data) {
    return <Loading message="Cargando datos de la granja..." />;
  }


  if (!farmApi.data && !farmApi.loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            La granja no existe o ha ocurrido un error
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<ArrowBackIcon />}
            onClick={handleBackClick}
            sx={{ mt: 2 }}
          >
            Volver al Dashboard
          </Button>
        </Box>
      </Container>
    );
  }

  const farm = farmApi.data;
  const animals = animalsApi.data || [];

 
  const totalAnimals = animals.length;
  const totalProduction = animals.reduce((sum, animal) => sum + animal.estimated_production, 0);
  const animalsWithIncidents = animals.filter(animal => animal.incidents && animal.incidents !== '').length;
  const hasIncidents = animalsWithIncidents > 0;
  const averageWeight = animals.length > 0 
    ? animals.reduce((sum, animal) => sum + animal.weight, 0) / animals.length 
    : 0;
  

  const isLecheProduction = farm?.production_type?.name?.toLowerCase().includes('leche');
  const productionUnit = isLecheProduction ? 'litros/semana' : 'kg total estimado';

  if (!farm) {
    return null;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 3, mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          mb: 4,
          gap: 3
        }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={handleBackClick}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  }
                }}
              >
                Volver
              </Button>
              <Typography variant="h4" color="text.primary">
                {farm.name}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
              }}>
                <AgricultureIcon color="primary" />
                <Box>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ 
                      display: 'block',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    Tipo de Granja
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {farm.farm_type.name}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5 
              }}>
                <ShippingIcon color="primary" />
                <Box>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ 
                      display: 'block',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    Tipo de Producción
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {farm.production_type.name}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5 
              }}>
                <LocationIcon color="primary" />
                <Box>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ 
                      display: 'block',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    Ubicación
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {farm.municipio}, {farm.provincia}
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddAnimal}
                sx={{ ml: 'auto' }}
              >
                Nuevo Animal
              </Button>
            </Box>
          </Box>

          {farm.image_path && (
            <Box 
              sx={(theme) => ({
                width: 200,
                height: 120,
                position: 'relative',
                overflow: 'hidden',
                borderRadius: theme.shape.borderRadius,
                boxShadow: theme.shadows[4]
              })}
            >
              <img
                src={`http://localhost:4000${farm.image_path}`}
                alt={farm.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </Box>
          )}
        </Box>

        {/* Estadísticas */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)'
          }, 
          gap: 3, 
          mb: 4 
        }}>
          <StatCard
            title="Total Animales"
            value={totalAnimals}
            icon={<PetsIcon />}
            sx={(theme) => ({
              backgroundColor: alpha(themeColors.primary.light, 0.2),
              border: '1px solid',
              borderColor: themeColors.outline.variant,
            })}
          />
          <StatCard
            title="Peso Promedio"
            value={Math.round(averageWeight)}
            icon={<ScaleIcon />}
            unit="kg"
            sx={(theme) => ({
              backgroundColor: alpha(themeColors.secondary.light, 0.2),
              border: '1px solid',
              borderColor: themeColors.outline.variant,
            })}
          />
          <StatCard
            title="Producción Total"
            value={totalProduction}
            icon={<PetsIcon />}
            unit={productionUnit}
            sx={(theme) => ({
              backgroundColor: alpha(themeColors.primary.light, 0.2),
              border: '1px solid',
              borderColor: themeColors.outline.variant,
            })}
          />
          <StatCard
            title="Incidencias"
            value={animalsWithIncidents}
            icon={<WarningIcon />}
            color={hasIncidents ? 'error' : 'default'}
            sx={(theme) => ({
              backgroundColor: hasIncidents ? alpha(themeColors.error.light, 0.2) : themeColors.grey[100],
              border: '1px solid',
              borderColor: hasIncidents 
                ? alpha(themeColors.error.main, 0.2)
                : themeColors.outline.variant
            })}
          />
        </Box>

        {/* Lista de Animales */}
        <Box sx={{ mt: 4 }}>
          <AnimalsTable 
            animals={animals}
            onEditAnimal={(animal) => handleEditAnimal(animal.id)}
            onDeleteAnimal={handleDeleteAnimal}
            title="Animales de la Granja"
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
        title="Eliminar Animal"
        message={`¿Estás seguro de que deseas eliminar el animal ${animalToDelete?.identification_number}?`}
        onConfirm={handleConfirmDelete}
        onCancel={closeConfirm}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </Container>
  );
};

export default FarmDetails; 