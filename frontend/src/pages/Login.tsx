import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';

const Login = () => {
  const { login } = useAuth();

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      await login(values);
    } catch (err) {
      // El error ya es manejado por el AuthContext
      throw err; // Propagamos el error para que useFormHandling lo maneje
    }
  };

  return (
    <AuthForm
      type="login"
      onSubmit={handleSubmit}
    />
  );
};

export default Login; 