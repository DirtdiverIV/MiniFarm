import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Button 
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

// Componentes
import FarmForm, { FarmFormValues } from '../components/FarmForm';
import AlertMessage from '../components/AlertMessage';
import Loading from '../components/Loading';

// Hooks
import { useApi } from '../hooks/useApi';
import { useAlert } from '../hooks/useAlert';

// Servicios
import { getFarmById, updateFarm } from '../services/farmService';

const EditFarm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Hooks personalizados
  const { alertOpen, alertMessage, alertSeverity, showAlert, closeAlert } = useAlert();

  // APIs
  const farmApi = useApi<FarmFormValues>(async () => {
    if (!id) throw new Error('ID de granja requerido');
    const data = await getFarmById(parseInt(id));
    return {
      success: true,
      data: {
        name: data.name,
        farm_type_id: data.farm_type.id,
        production_type_id: data.production_type.id,
        image: null
      },
      message: 'Datos de la granja cargados exitosamente'
    };
  });

  const updateFarmApi = useApi<void, { id: number, data: FarmFormValues }>(
    async (params) => {
      if (!params?.id) throw new Error('ID de granja requerido');
      await updateFarm(params.id, {
        ...params.data,
        image: params.data.image || undefined
      });
      return {
        success: true,
        data: undefined,
        message: 'Granja actualizada exitosamente'
      };
    },
    {
      onSuccess: () => {
        showAlert('Granja actualizada exitosamente', 'success');
        setTimeout(() => navigate('/'), 1500);
      },
      onError: (error) => {
        showAlert(error, 'error');
      }
    }
  );

  // Cargar datos al montar el componente
  useEffect(() => {
    farmApi.execute();
  }, [id]);

  // Manejador para la actualización de la granja
  const handleSubmit = async (values: FarmFormValues) => {
    if (!id) {
      showAlert('ID de granja no válido', 'error');
      return;
    }

    await updateFarmApi.execute({
      id: parseInt(id),
      data: values
    });
  };

  // Manejador para cancelar la edición
  const handleCancel = () => {
    if (updateFarmApi.loading) {
      return;
    }
    navigate('/');
  };

  // Renderizar estado de carga
  if (farmApi.loading && !farmApi.data) {
    return <Loading message="Cargando datos de la granja..." />;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 3, mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleCancel}
          disabled={updateFarmApi.loading}
          sx={{
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'action.hover',
            }
          }}
        >
          Volver
        </Button>
      </Box>

      <Typography variant="h4" gutterBottom>
        Editar Granja
      </Typography>

      {farmApi.data && (
        <FarmForm
          onSubmit={handleSubmit}
          initialValues={farmApi.data}
          isEditing
        />
      )}

      <AlertMessage
        open={alertOpen}
        message={alertMessage}
        severity={alertSeverity}
        onClose={closeAlert}
      />
    </Container>
  );
};

export default EditFarm; 