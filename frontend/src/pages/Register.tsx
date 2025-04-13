import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';

const Register = () => {
  const { register } = useAuth();

  const handleSubmit = async (values: { email: string; password: string; confirmPassword?: string }) => {
    try {
      const { confirmPassword, ...credentials } = values;
      await register(credentials);
    } catch (error) {
      console.error('Error en el registro:', error);
      // Los errores son manejados en dos niveles:
      // 1. AuthContext: maneja el estado de error y muestra mensajes
      // 2. useFormHandling: maneja errores de formulario
      throw error;
    }
  };

  return (
    <AuthForm
      type="register"
      onSubmit={handleSubmit}
    />
  );
};

export default Register; 