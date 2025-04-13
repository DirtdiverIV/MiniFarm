import { 
  Box, 
  Button, 
  Container, 
  Paper, 
  TextField, 
  Typography, 
  Alert
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Form, Formik, Field, FormikProps } from 'formik';
import * as Yup from 'yup';

// Hooks personalizados
import { useFormHandling } from '../hooks/useFormHandling';

interface AuthFormValues {
  email: string;
  password: string;
  confirmPassword?: string;
}

interface AuthFormProps {
  type: 'login' | 'register';
  onSubmit: (values: AuthFormValues) => Promise<void>;
}

// Esquemas de validación base
const baseValidationSchema = {
  email: Yup.string()
    .email('Email inválido')
    .required('El email es requerido'),
  password: Yup.string()
    .required('La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
};

const loginSchema = Yup.object().shape(baseValidationSchema);

const registerSchema = Yup.object().shape({
  ...baseValidationSchema,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Confirma tu contraseña')
});

const AuthForm = ({ type, onSubmit }: AuthFormProps) => {
  const isLogin = type === 'login';

  const initialValues: AuthFormValues = {
    email: '',
    password: '',
    ...(isLogin ? {} : { confirmPassword: '' })
  };

  const { handleSubmit, error, loading } = useFormHandling({
    onSubmit,
    initialValues,
    resetToInitial: false
  });

  return (
    <Container maxWidth="xs">
      <Box 
        sx={{ 
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Typography component="h1" variant="h5">
          {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
        </Typography>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            mt: 2, 
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error.message ?? 'Error en la autenticación'}
            </Alert>
          )}
          <Formik
            initialValues={initialValues}
            validationSchema={isLogin ? loginSchema : registerSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, touched, errors }: FormikProps<AuthFormValues>) => (
              <Form style={{ width: '100%' }}>
                <Field
                  as={TextField}
                  fullWidth
                  id="email"
                  name="email"
                  label="Correo Electrónico"
                  type="email"
                  margin="normal"
                  error={touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                />
                <Field
                  as={TextField}
                  fullWidth
                  id="password"
                  name="password"
                  label="Contraseña"
                  type="password"
                  margin="normal"
                  error={touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                />
                {!isLogin && (
                  <Field
                    as={TextField}
                    fullWidth
                    id="confirmPassword"
                    name="confirmPassword"
                    label="Confirmar Contraseña"
                    type="password"
                    margin="normal"
                    error={touched.confirmPassword && !!errors.confirmPassword}
                    helperText={touched.confirmPassword && errors.confirmPassword}
                  />
                )}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={isSubmitting || loading}
                >
                  {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
                </Button>
                <Box sx={{ textAlign: 'center' }}>
                  <Link to={isLogin ? '/register' : '/login'}>
                    {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
                  </Link>
                </Box>
              </Form>
            )}
          </Formik>
        </Paper>
      </Box>
    </Container>
  );
};

export default AuthForm; 