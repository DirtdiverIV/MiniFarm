import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Button 
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';


import AnimalForm, { AnimalFormValues } from '../components/AnimalForm';
import AlertMessage from '../components/AlertMessage';
import Loading from '../components/Loading';


import { getAnimalById, updateAnimal } from '../services/animalService';

const EditAnimal = () => {
  const { id, farmId } = useParams<{ id: string; farmId?: string }>();
  const navigate = useNavigate();
  
  
  const [initialValues, setInitialValues] = useState<AnimalFormValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');
  
  
  useEffect(() => {
    const loadAnimalData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const animalData = await getAnimalById(parseInt(id));
        
        setInitialValues({
          farm_id: animalData.farm?.id === undefined ? 0 : animalData.farm.id,
          animal_type: animalData.animal_type,
          identification_number: animalData.identification_number,
          weight: animalData.weight,
          estimated_production: animalData.estimated_production,
          sanitary_register: animalData.sanitary_register,
          age: animalData.age,
          incidents: animalData.incidents,
          has_incidents: !!animalData.incidents
        });
      } catch (err) {
        console.error('Error al cargar los datos del animal:', err);
        showAlert('Error al cargar los datos del animal', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    loadAnimalData();
  }, [id]);
  
  
  const showAlert = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };
  
  const getFarmIdFromUpdatedAnimal = (updatedAnimal: any) => {
    if (farmId !== undefined) return farmId;
    if (updatedAnimal.farm?.id !== undefined) return updatedAnimal.farm.id;
    return 0;
  };

  const getFarmIdFromInitialValues = () => {
    if (farmId !== undefined) return farmId;
    if (initialValues?.farm_id !== undefined) return initialValues.farm_id;
    return 0;
  };

  
  const handleUpdateAnimal = async (values: AnimalFormValues) => {
    if (!id) return;
    
    try {
      setLoading(true);
      
      const updatedAnimal = await updateAnimal(parseInt(id), {
        farm_id: values.farm_id,
        animal_type: values.animal_type,
        identification_number: values.identification_number,
        weight: values.weight,
        estimated_production: values.estimated_production,
        sanitary_register: values.sanitary_register,
        age: values.age,
        incidents: values.incidents
      });
      
      showAlert('Animal actualizado con éxito', 'success');
      
      
      setTimeout(() => {
        const farmIdToUse = getFarmIdFromUpdatedAnimal(updatedAnimal);
        navigate(`/farms/${farmIdToUse}`);
      }, 1500);
      
    } catch (error) {
      console.error('Error al actualizar el animal:', error);
      showAlert('Error al actualizar el animal', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  
  const handleBack = () => {
    const farmIdToUse = getFarmIdFromInitialValues();
    navigate(`/farms/${farmIdToUse}`);
  };
  
  
  if (loading && !initialValues) {
    return <Loading message="Cargando datos del animal..." />;
  }
  
  
  if (!initialValues && !loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            No se pudieron cargar los datos del animal
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            Volver al Dashboard
          </Button>
        </Box>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
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
          <Typography variant="h4" component="h1">
            Editar Animal
          </Typography>
        </Box>
        
        {initialValues && (
          <AnimalForm 
            onSubmit={handleUpdateAnimal} 
            initialValues={initialValues} 
            isEditing={true} 
          />
        )}
        
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

export default EditAnimal; 