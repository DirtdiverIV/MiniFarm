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