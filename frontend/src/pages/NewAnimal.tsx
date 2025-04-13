import { useNavigate, useParams } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Button
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useState } from 'react';

// Componentes
import AnimalForm, { AnimalFormValues } from '../components/AnimalForm';
import AlertMessage from '../components/AlertMessage';
import Loading from '../components/Loading';

// Hooks
import { useAlert } from '../hooks/useAlert';

// Servicios y tipos
import { createAnimal } from '../services/animalService';

const NewAnimal = () => {
  const { farmId } = useParams<{ farmId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Hooks personalizados
  const { alertOpen, alertMessage, alertSeverity, showAlert, closeAlert } = useAlert();
  
  // Manejador para la creación del animal
  const handleSubmit = async (values: AnimalFormValues) => {
    if (!farmId || loading) {
      showAlert('ID de granja no válido', 'error');
      return;
    }

    setLoading(true);
    try {
      await createAnimal({
        ...values,
        farm_id: parseInt(farmId)
      });
      
      showAlert('Animal creado exitosamente', 'success');
      // Navegar inmediatamente después de mostrar el mensaje
      navigate(`/farms/${farmId}`);
      
    } catch (error) {
      console.error('Error al crear el animal:', error);
      showAlert('Error al crear el animal', 'error');
      setLoading(false);
    }
  };
  
  const handleBack = () => {
    navigate(`/farms/${farmId}`);
  };
  
  if (loading) {
    return <Loading message="Creando animal..." />;
  }
  
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            Volver
          </Button>
          <Typography variant="h4" component="h1">
            Nuevo Animal
          </Typography>
        </Box>
        
        <AnimalForm 
          onSubmit={handleSubmit}
          farmId={parseInt(farmId ?? '0')}
        />
        
        <AlertMessage
          open={alertOpen}
          severity={alertSeverity}
          message={alertMessage}
          onClose={closeAlert}
        />
      </Box>
    </Container>
  );
};

export default NewAnimal; 