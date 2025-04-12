import { memo, useEffect, useState, useCallback } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography,
  Paper,
  InputAdornment,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { ErrorMessage } from './ErrorMessage';

// Importar servicios y tipos
import { getFarmById } from '../services/farmService';

// Importar constantes y validaciones
import { FARM_TYPE_TO_ANIMAL_TYPE } from '../constants/animalTypes';
import { AnimalFormSchema } from '../validations/animalSchema';
import Loading from './Loading';

// Hooks personalizados
import { useFormHandling } from '../hooks/useFormHandling';

// Interfaces
interface AnimalFormProps {
  onSubmit: (values: AnimalFormValues) => Promise<void>;
  initialValues?: AnimalFormValues;
  isEditing?: boolean;
  farmId?: number;
}

export interface AnimalFormValues {
  farm_id: number;
  animal_type: string;
  identification_number: string;
  weight: number;
  estimated_production: number;
  sanitary_register: string;
  age: number;
  has_incidents: boolean;
  incidents: string;
}

const AnimalForm = memo(({ 
  onSubmit, 
  initialValues, 
  isEditing = false,
  farmId 
}: AnimalFormProps) => {
  const [animalType, setAnimalType] = useState<string>('');
  
  // Valores iniciales por defecto
  const defaultValues: AnimalFormValues = {
    farm_id: farmId === undefined ? 0 : farmId,
    animal_type: animalType,
    identification_number: '',
    weight: 0,
    estimated_production: 0,
    sanitary_register: '',
    age: 0,
    has_incidents: false,
    incidents: ''
  };

  const { handleSubmit, error, loading: formLoading } = useFormHandling({
    onSubmit: async (values) => {
      const submitValues = {
        ...values,
        incidents: values.has_incidents ? values.incidents : ''
      };
      await onSubmit(submitValues);
    },
    initialValues: initialValues || defaultValues,
    isEditing
  });

  // Cargar el tipo de granja al montar el componente
  const loadFarmType = useCallback(async () => {
    if (farmId) {
      try {
        const farm = await getFarmById(farmId);
        const farmType = farm.farm_type.name.toLowerCase();
        const animal = FARM_TYPE_TO_ANIMAL_TYPE[farmType] || '';
        setAnimalType(animal);
      } catch (error) {
        console.error('Error al cargar el tipo de granja:', error);
      }
    }
  }, [farmId]);

  useEffect(() => {
    loadFarmType();
  }, [loadFarmType]);
  
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        {isEditing ? 'Editar Animal' : 'Nuevo Animal'}
      </Typography>
      
      {error && <ErrorMessage error={error} />}
      
      <Formik
        initialValues={initialValues || defaultValues}
        validationSchema={AnimalFormSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, touched, errors, setFieldValue, values }) => (
          <Form>
            {formLoading ? (
              <Box sx={{ my: 4 }}>
                <Loading message="Guardando animal..." />
              </Box>
            ) : (
              <Box sx={{ display: 'grid', gridGap: '16px', gridTemplateColumns: '1fr', width: '100%' }}>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
                  gap: 2 
                }}>
                  <Field
                    as={TextField}
                    name="animal_type"
                    label="Tipo de Animal"
                    fullWidth
                    margin="normal"
                    disabled
                    value={animalType}
                  />
                  
                  <Field
                    as={TextField}
                    name="identification_number"
                    label="Número de Identificación"
                    fullWidth
                    margin="normal"
                    error={touched.identification_number && !!errors.identification_number}
                    helperText={
                      (touched.identification_number && errors.identification_number) ||
                      'Formato requerido: XXX000 (ejemplo: VAC001 para vacas, CER001 para cerdos, OVE001 para ovejas)'
                    }
                  />
                </Box>
                
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, 
                  gap: 2 
                }}>
                  <Field
                    as={TextField}
                    name="weight"
                    label="Peso"
                    type="number"
                    fullWidth
                    margin="normal"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                    }}
                    error={touched.weight && !!errors.weight}
                    helperText={touched.weight && errors.weight}
                  />
                  
                  <Field
                    as={TextField}
                    name="age"
                    label="Edad"
                    type="number"
                    fullWidth
                    margin="normal"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">años</InputAdornment>,
                    }}
                    error={touched.age && !!errors.age}
                    helperText={touched.age && errors.age}
                  />
                  
                  <Field
                    as={TextField}
                    name="estimated_production"
                    label="Producción Estimada"
                    type="number"
                    fullWidth
                    margin="normal"
                    error={touched.estimated_production && !!errors.estimated_production}
                    helperText={touched.estimated_production && errors.estimated_production}
                  />
                </Box>
                
                <Field
                  as={TextField}
                  name="sanitary_register"
                  label="Registro Sanitario"
                  fullWidth
                  margin="normal"
                  error={touched.sanitary_register && !!errors.sanitary_register}
                  helperText={
                    (touched.sanitary_register && errors.sanitary_register) ||
                    'Formato requerido: SR000 (ejemplo: SR001)'
                  }
                />
                
                <FormControlLabel
                  control={
                    <Field
                      as={Checkbox}
                      name="has_incidents"
                      checked={values.has_incidents}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFieldValue('has_incidents', e.target.checked);
                        if (!e.target.checked) {
                          setFieldValue('incidents', '');
                        }
                      }}
                    />
                  }
                  label="¿Tiene incidencias?"
                />
                
                {values.has_incidents && (
                  <Field
                    as={TextField}
                    name="incidents"
                    label="Incidencias"
                    multiline
                    rows={3}
                    fullWidth
                    margin="normal"
                    error={touched.incidents && !!errors.incidents}
                    helperText={touched.incidents && errors.incidents}
                  />
                )}
                
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting || formLoading}
                  >
                    {isEditing ? 'Actualizar' : 'Crear'}
                  </Button>
                </Box>
              </Box>
            )}
          </Form>
        )}
      </Formik>
    </Paper>
  );
});

AnimalForm.displayName = 'AnimalForm';
export default AnimalForm; 