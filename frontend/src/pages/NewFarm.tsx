import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Button,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

// Componentes
import FarmForm, { FarmFormValues } from '../components/FarmForm';
import AlertMessage from '../components/AlertMessage';
import Loading from '../components/Loading';

// Servicios
import { createFarm } from '../services/farmService';

const NewFarm = () => {
  const navigate = useNavigate();
  
  // Estados para UI
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');
  
  // Función para mostrar alertas
  const showAlert = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };
  
  // Manejar la creación de la granja
  const handleCreateFarm = async (values: FarmFormValues) => {
    if (loading) return; // Prevenir múltiples envíos
    
    setLoading(true);
    try {
      const createdFarm = await createFarm({
        name: values.name,
        farm_type_id: values.farm_type_id,
        production_type_id: values.production_type_id,
        image: values.image || undefined
      });
      
      showAlert('Granja creada con éxito', 'success');
      // Navegar inmediatamente después de mostrar el mensaje
      navigate(`/farms/${createdFarm.id}`);
      
    } catch (error) {
      console.error('Error al crear la granja:', error);
      showAlert('Error al crear la granja', 'error');
      setLoading(false);
    }
  };
  
  // Manejar el regreso al dashboard
  const handleBack = () => {
    navigate('/');
  };
  
  // Renderizar estado de carga
  if (loading) {
    return <Loading message="Creando granja..." />;
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
            Crear Nueva Granja
          </Typography>
        </Box>
        
        <FarmForm onSubmit={handleCreateFarm} />
        
        {/* Componentes de UI global */}
        <AlertMessage
          open={alertOpen}
          severity={alertSeverity}
          message={alertMessage}
          onClose={() => setAlertOpen(false)}
        />
      </Box>
    </Container>
  );
};

export default NewFarm; 