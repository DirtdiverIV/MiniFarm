import { memo, useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  Autocomplete
} from '@mui/material';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { ErrorMessage } from './ErrorMessage';


import { useFormHandling } from '../hooks/useFormHandling';
import { useFormTypes } from '../hooks/useFormTypes';
import { useImagePreview } from '../hooks/useImagePreview';


interface FarmFormProps {
  onSubmit: (values: FarmFormValues) => Promise<void>;
  initialValues?: FarmFormValues;
  isEditing?: boolean;
}

export interface FarmFormValues {
  name: string;
  farm_type_id: number;
  production_type_id: number;
  provincia: string;
  municipio: string;
  image?: File | null;
}


const FarmFormSchema = Yup.object().shape({
  name: Yup.string()
    .required('El nombre es obligatorio')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no puede exceder los 50 caracteres'),
  farm_type_id: Yup.number()
    .required('El tipo de granja es obligatorio')
    .min(1, 'Selecciona un tipo de granja válido'),
  production_type_id: Yup.number()
    .required('El tipo de producción es obligatorio')
    .min(1, 'Selecciona un tipo de producción válido'),
  provincia: Yup.string()
    .required('La provincia es obligatoria'),
  municipio: Yup.string()
    .required('El municipio es obligatorio'),
});

const FarmForm = memo(({ onSubmit, initialValues, isEditing = false }: FarmFormProps) => {
  
  const defaultValues: FarmFormValues = {
    name: '',
    farm_type_id: 0,
    production_type_id: 0,
    provincia: '',
    municipio: '',
    image: null
  };

  
  const [selectedProvinciaCode, setSelectedProvinciaCode] = useState<string | null>(null);

  
  const { 
    farmTypes, 
    productionTypes, 
    provincias, 
    municipios, 
    loading: typesLoading, 
    setSelectedProvincia
  } = useFormTypes();
  const { selectedImage, handleImageChange, clearImage } = useImagePreview();
  const { handleSubmit: originalHandleSubmit, error, loading: formLoading } = useFormHandling({
    onSubmit,
    initialValues: initialValues ?? defaultValues,
    isEditing,
    onSuccess: () => {
      if (!isEditing) {
        clearImage();
      }
    }
  });

  
  const handleSubmit = async (values: FarmFormValues, formikHelpers: FormikHelpers<FarmFormValues>) => {
    console.log('Valores a enviar:', values);
    return originalHandleSubmit(values, formikHelpers);
  };

  
  useEffect(() => {
    if (isEditing && initialValues?.provincia && provincias.length > 0) {
      
      const provinciaEncontrada = provincias.find(
        p => p.label.toLowerCase() === initialValues.provincia.toLowerCase()
      );
      
      if (provinciaEncontrada) {
        setSelectedProvinciaCode(provinciaEncontrada.code);
        setSelectedProvincia(provinciaEncontrada.code);
      }
    }
  }, [isEditing, initialValues, provincias, setSelectedProvincia]);

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        {isEditing ? 'Editar Granja' : 'Nueva Granja'}
      </Typography>
      
      {error && <ErrorMessage error={error} />}
      
      <Formik
        initialValues={initialValues ?? defaultValues}
        validationSchema={FarmFormSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, touched, errors, setFieldValue, values }) => (
          <Form>
            <Box sx={{ display: 'grid', gridGap: '16px', gridTemplateColumns: '1fr', width: '100%' }}>
              <Box>
                <Field
                  as={TextField}
                  name="name"
                  label="Nombre de la Granja"
                  fullWidth
                  margin="normal"
                  error={touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                />
              </Box>
              
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
                gap: 2 
              }}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="farm-type-label">Tipo de Granja</InputLabel>
                  <Field
                    as={Select}
                    labelId="farm-type-label"
                    name="farm_type_id"
                    label="Tipo de Granja"
                    error={touched.farm_type_id && !!errors.farm_type_id}
                  >
                    <MenuItem value={0}>Selecciona un tipo</MenuItem>
                    {farmTypes.map((type) => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.name}
                      </MenuItem>
                    ))}
                  </Field>
                  {touched.farm_type_id && errors.farm_type_id && (
                    <Typography variant="caption" color="error">
                      {errors.farm_type_id as string}
                    </Typography>
                  )}
                </FormControl>
                
                <FormControl fullWidth margin="normal">
                  <InputLabel id="production-type-label">Tipo de Producción</InputLabel>
                  <Field
                    as={Select}
                    labelId="production-type-label"
                    name="production_type_id"
                    label="Tipo de Producción"
                    error={touched.production_type_id && !!errors.production_type_id}
                  >
                    <MenuItem value={0}>Selecciona un tipo</MenuItem>
                    {productionTypes.map((type) => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.name}
                      </MenuItem>
                    ))}
                  </Field>
                  {touched.production_type_id && errors.production_type_id && (
                    <Typography variant="caption" color="error">
                      {errors.production_type_id as string}
                    </Typography>
                  )}
                </FormControl>
              </Box>

              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
                gap: 2 
              }}>
                <Autocomplete
                  options={provincias}
                  getOptionLabel={(option) => option.label}
                  value={provincias.find(p => p.label === values.provincia) || null}
                  onChange={(_, newValue) => {
                    console.log('Nueva provincia seleccionada:', newValue);
                    if (newValue) {
                      setFieldValue('provincia', newValue.label);
                      setSelectedProvinciaCode(newValue.code);
                      setSelectedProvincia(newValue.code);
                      
                      setFieldValue('municipio', '');
                    } else {
                      setFieldValue('provincia', '');
                      setSelectedProvinciaCode(null);
                      setSelectedProvincia('');
                      setFieldValue('municipio', '');
                    }
                  }}
                  renderInput={(params) => 
                    <TextField 
                      {...params} 
                      label="Provincia" 
                      margin="normal"
                      error={touched.provincia && !!errors.provincia}
                      helperText={touched.provincia && errors.provincia}
                    />
                  }
                />
                
                <Autocomplete
                  options={municipios}
                  getOptionLabel={(option) => option.label}
                  value={municipios.find(m => m.label === values.municipio) || null}
                  disabled={!selectedProvinciaCode}
                  onChange={(_, newValue) => {
                    console.log('Nuevo municipio seleccionado:', newValue);
                    if (newValue) {
                      setFieldValue('municipio', newValue.label);
                    } else {
                      setFieldValue('municipio', '');
                    }
                  }}
                  renderInput={(params) => 
                    <TextField 
                      {...params} 
                      label="Municipio" 
                      margin="normal"
                      error={touched.municipio && !!errors.municipio}
                      helperText={touched.municipio && errors.municipio}
                    />
                  }
                />
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Imagen de la Granja
                </Typography>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="farm-image"
                  type="file"
                  onChange={(e) => handleImageChange(e, setFieldValue)}
                />
                <label htmlFor="farm-image">
                  <Button
                    variant="contained"
                    component="span"
                    sx={{ mr: 2 }}
                  >
                    Seleccionar Imagen
                  </Button>
                </label>
                {selectedImage && (
                  <Box sx={{ mt: 2, maxWidth: 300 }}>
                    <img 
                      src={selectedImage} 
                      alt="Vista previa" 
                      style={{ 
                        maxWidth: '100%', 
                        borderRadius: '4px'
                      }} 
                    />
                  </Box>
                )}
              </Box>
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting || formLoading || typesLoading}
                >
                  {isEditing ? 'Actualizar Granja' : 'Crear Granja'}
                </Button>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    </Paper>
  );
});

FarmForm.displayName = 'FarmForm';
export default FarmForm; 