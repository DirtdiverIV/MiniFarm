import { memo, useEffect, useState, useCallback } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Divider,
  Stack,
  IconButton,
  Tooltip
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { ErrorMessage } from './ErrorMessage';
import { Info as InfoIcon } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';

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
  const [_, setFarmType] = useState<{id: number, name: string} | undefined>();
  const [productionType, setProductionType] = useState<{id: number, name: string} | undefined>();
  const { id } = useParams<{ id: string }>();
  
  // Obtener el tipo de producción de la granja
  const farmApi = useApi(async () => {
    if (!farmId && !id) return {
      success: false, 
      data: null, 
      message: 'ID de granja no disponible'
    };
    
    const farmData = await getFarmById(parseInt(farmId?.toString() || id || '0'));
    return {
      success: true,
      data: farmData,
      message: 'Datos de la granja cargados'
    };
  });
  
  useEffect(() => {
    if (farmId || id) {
      farmApi.execute();
    }
  }, [farmId, id]);
  
  useEffect(() => {
    if (farmApi.data) {
      setFarmType(farmApi.data.farm_type);
      setProductionType(farmApi.data.production_type);
    }
  }, [farmApi.data]);
  
  // Determinar si es producción láctea
  const isLecheProduction = productionType?.name?.toLowerCase().includes('leche');
  const productionLabel = isLecheProduction ? 'Producción Láctea Estimada' : 'Producción Cárnica Estimada';
  const productionUnit = isLecheProduction ? 'litros/semana' : 'kg total';
  
  // Valores iniciales por defecto
  const defaultValues: AnimalFormValues = {
    farm_id: farmId ?? 0,
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
    initialValues: initialValues ?? defaultValues,
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
    <Box sx={{ width: '100%' }}>
      <Stack spacing={3}>
        <Box>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 1,
              fontWeight: 600,
              color: 'primary.main'
            }}
          >
            {isEditing ? 'Editar Animal' : 'Registro de Nuevo Animal'}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Complete los detalles del animal para su registro en el sistema
          </Typography>
          
          {error && <ErrorMessage error={error} />}
        </Box>

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
                <Stack spacing={4}>
                  <Box>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        mb: 2,
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      Información Básica
                      <Tooltip title="Información principal del animal">
                        <IconButton size="small">
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Typography>

                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
                      gap: 3
                    }}>
                      <Field
                        as={TextField}
                        name="animal_type"
                        label="Tipo de Animal"
                        fullWidth
                        disabled
                        value={animalType}
                        sx={{
                          '& .MuiInputBase-root': {
                            backgroundColor: 'action.hover'
                          }
                        }}
                      />
                      
                      <Field
                        as={TextField}
                        name="identification_number"
                        label="Número de Identificación"
                        fullWidth
                        error={touched.identification_number && !!errors.identification_number}
                        helperText={
                          (touched.identification_number && errors.identification_number) ||
                          'Formato: XXX000 (ej: VAC001)'
                        }
                      />
                    </Box>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        mb: 2,
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      Características Físicas
                      <Tooltip title="Detalles físicos y productivos del animal">
                        <IconButton size="small">
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Typography>

                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, 
                      gap: 3
                    }}>
                      <Field
                        as={TextField}
                        name="weight"
                        label="Peso"
                        type="number"
                        fullWidth
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
                        InputProps={{
                          endAdornment: <InputAdornment position="end">años</InputAdornment>,
                        }}
                        error={touched.age && !!errors.age}
                        helperText={touched.age && errors.age}
                      />
                      
                      <Field
                        as={TextField}
                        name="estimated_production"
                        label={productionLabel}
                        type="number"
                        fullWidth
                        InputProps={{
                          endAdornment: <InputAdornment position="end">{productionUnit}</InputAdornment>,
                        }}
                        error={touched.estimated_production && !!errors.estimated_production}
                        helperText={touched.estimated_production && errors.estimated_production}
                      />
                    </Box>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        mb: 2,
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      Información Sanitaria
                      <Tooltip title="Registro sanitario e incidencias">
                        <IconButton size="small">
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Typography>

                    <Stack spacing={2}>
                      <Field
                        as={TextField}
                        name="sanitary_register"
                        label="Registro Sanitario"
                        fullWidth
                        error={touched.sanitary_register && !!errors.sanitary_register}
                        helperText={
                          (touched.sanitary_register && errors.sanitary_register) ||
                          'Formato: SR000 (ej: SR001)'
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
                          error={touched.incidents && !!errors.incidents}
                          helperText={touched.incidents && errors.incidents}
                        />
                      )}
                    </Stack>
                  </Box>

                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end',
                    pt: 2 
                  }}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={isSubmitting || formLoading}
                      sx={{
                        minWidth: 200,
                        height: 48
                      }}
                    >
                      {isEditing ? 'Actualizar Animal' : 'Crear Animal'}
                    </Button>
                  </Box>
                </Stack>
              )}
            </Form>
          )}
        </Formik>
      </Stack>
    </Box>
  );
});

AnimalForm.displayName = 'AnimalForm';
export default AnimalForm; 