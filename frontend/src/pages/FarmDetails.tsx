import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Container, 
  Button, 
  Fab
} from '@mui/material';
import { 
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Pets as PetsIcon,
  Balance as BalanceIcon,
  FilterFrames as ProductionIcon
} from '@mui/icons-material';

// Componentes
import StatCard from '../components/StatCard';
import AnimalsTable from '../components/AnimalsTable';
import Loading from '../components/Loading';
import AlertMessage from '../components/AlertMessage';
import ConfirmDialog from '../components/ConfirmDialog';

// Hooks
import { useApi } from '../hooks/useApi';
import { useDialog } from '../hooks/useDialog';
import { useAlert } from '../hooks/useAlert';

// Servicios
import { getFarmById, Farm } from '../services/farmService';
import { getAnimalsByFarm, deleteAnimal, Animal } from '../services/animalService';

const FarmDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Hooks personalizados
  const { alertOpen, alertMessage, alertSeverity, showAlert, closeAlert } = useAlert();
  const { isOpen: showConfirm, data: animalToDelete, openDialog: openConfirm, closeDialog: closeConfirm } = useDialog();

  // APIs
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
        // Recargar la lista de animales
        animalsApi.execute();
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
          farmApi.execute(),
          animalsApi.execute()
        ]);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };
    
    loadData();
  }, [id]);

  // Manejadores de eventos
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

  // Renderizar estado de carga
  if ((farmApi.loading || animalsApi.loading) && !farmApi.data) {
    return <Loading message="Cargando datos de la granja..." />;
  }

  // Si no hay granja (error o ID incorrecto)
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

  // Calcular estadísticas
  const totalAnimals = animals.length;
  const totalProduction = animals.reduce((sum, animal) => sum + animal.estimated_production, 0);
  const animalsWithIncidents = animals.filter(animal => animal.incidents && animal.incidents !== '').length;

  if (!farm) {
    return null;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 3, mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBackClick}
          >
            Volver al Dashboard
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddAnimal}
          >
            Nuevo Animal
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {farm.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Tipo: {farm.farm_type.name} | Producción: {farm.production_type.name}
        </Typography>
        
        {/* Imagen de la granja */}
        {farm.image_path && (
          <Box 
            sx={{ 
              mt: 2, 
              mb: 4, 
              maxWidth: '100%',
              height: 300,
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 2
            }}
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
          md: 'repeat(3, 1fr)'
        }, 
        gap: 3, 
        mb: 4 
      }}>
        <StatCard
          title="Total de Animales"
          value={totalAnimals}
          icon={<PetsIcon />}
        />
        <StatCard
          title="Producción Total"
          value={totalProduction}
          icon={<ProductionIcon />}
        />
        <StatCard
          title="Animales con Incidencias"
          value={animalsWithIncidents}
          icon={<BalanceIcon />}
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