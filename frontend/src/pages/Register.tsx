import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';

const Register = () => {
  const { register } = useAuth();

  const handleSubmit = async (values: { email: string; password: string; confirmPassword?: string }) => {
    try {
      const { confirmPassword, ...credentials } = values;
      await register(credentials);
    } catch (err) {
      // El error ya es manejado por el AuthContext
      throw err; // Propagamos el error para que useFormHandling lo maneje
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