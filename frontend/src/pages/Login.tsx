import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';

const Login = () => {
  const { login } = useAuth();

  const handleSubmit = async (values: { email: string; password: string }) => {
    await login(values);
  };

  return (
    <AuthForm
      type="login"
      onSubmit={handleSubmit}
    />
  );
};

export default Login; 