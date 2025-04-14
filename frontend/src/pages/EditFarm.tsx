import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Button 
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';


import FarmForm, { FarmFormValues } from '../components/FarmForm';
import AlertMessage from '../components/AlertMessage';
import Loading from '../components/Loading';


import { useApi } from '../hooks/useApi';
import { useAlert } from '../hooks/useAlert';


import { getFarmById, updateFarm } from '../services/farmService';

const EditFarm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  
  const { alertOpen, alertMessage, alertSeverity, showAlert, closeAlert } = useAlert();

  
  const farmApi = useApi<FarmFormValues>(async () => {
    if (!id) throw new Error('ID de granja requerido');
    const data = await getFarmById(parseInt(id));
    return {
      success: true,
      data: {
        name: data.name,
        farm_type_id: data.farm_type.id,
        production_type_id: data.production_type.id,
        provincia: data.provincia,
        municipio: data.municipio,
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

  
  useEffect(() => {
    farmApi.execute();
  }, [id]);

  
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

  
  const handleCancel = () => {
    if (updateFarmApi.loading) {
      return;
    }
    navigate('/');
  };

  
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