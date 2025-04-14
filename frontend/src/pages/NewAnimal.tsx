import { useNavigate, useParams } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Button,
  Paper,
  Fade,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useState } from 'react';
import { alpha } from '@mui/material/styles';


import AnimalForm, { AnimalFormValues } from '../components/AnimalForm';
import AlertMessage from '../components/AlertMessage';
import Loading from '../components/Loading';


import { useAlert } from '../hooks/useAlert';


import { createAnimal } from '../services/animalService';

const NewAnimal = () => {
  const { farmId } = useParams<{ farmId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  
  const { alertOpen, alertMessage, alertSeverity, showAlert, closeAlert } = useAlert();
  
  
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
    <Fade in timeout={800}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 4 
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button 
                startIcon={<ArrowBackIcon />} 
                onClick={handleBack}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  }
                }}
              >
                Volver
              </Button>
              <Typography 
                variant="h4" 
                component="h1"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, primary.main, primary.dark)',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                }}
              >
                Nuevo Animal
              </Typography>
            </Box>
          </Box>

          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: 4,
              border: '1px solid',
              borderColor: 'divider',
              background: (theme) => `linear-gradient(180deg, ${theme.palette.background.paper}, ${alpha(theme.palette.background.paper, 0.8)})`,
            }}
          >
            <AnimalForm 
              onSubmit={handleSubmit}
              farmId={parseInt(farmId ?? '0')}
            />
          </Paper>
          
          <AlertMessage
            open={alertOpen}
            severity={alertSeverity}
            message={alertMessage}
            onClose={closeAlert}
          />
        </Box>
      </Container>
    </Fade>
  );
};

export default NewAnimal; 