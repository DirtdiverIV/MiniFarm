import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';

// Importaciones con lazy loading para mejor rendimiento
const Login = lazy(() => import('../pages/Login.tsx'));
const Register = lazy(() => import('../pages/Register.tsx'));
const Dashboard = lazy(() => import('../pages/Dashboard.tsx'));
const FarmDetails = lazy(() => import('../pages/FarmDetails.tsx'));
const NewFarm = lazy(() => import('../pages/NewFarm.tsx'));
const EditFarm = lazy(() => import('../pages/EditFarm.tsx'));
const NewAnimal = lazy(() => import('../pages/NewAnimal.tsx'));
const EditAnimal = lazy(() => import('../pages/EditAnimal.tsx'));

// Layout global para rutas privadas
const PrivateLayout = lazy(() => import('../layout/PrivateLayout.tsx'));

// Componente para rutas protegidas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Componente para rutas públicas (redirige al dashboard si ya está autenticado)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Suspense fallback={<Loading />}>
              <Login />
            </Suspense>
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Suspense fallback={<Loading />}>
              <Register />
            </Suspense>
          </PublicRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <PrivateLayout />
            </Suspense>
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            <Suspense fallback={<Loading />}>
              <Dashboard />
            </Suspense>
          }
        />
        <Route
          path="farms/new"
          element={
            <Suspense fallback={<Loading />}>
              <NewFarm />
            </Suspense>
          }
        />
        <Route
          path="farms/:id"
          element={
            <Suspense fallback={<Loading />}>
              <FarmDetails />
            </Suspense>
          }
        />
        <Route
          path="farms/:id/edit"
          element={
            <Suspense fallback={<Loading />}>
              <EditFarm />
            </Suspense>
          }
        />
        <Route
          path="farms/:farmId/animals/new"
          element={
            <Suspense fallback={<Loading />}>
              <NewAnimal />
            </Suspense>
          }
        />
        <Route
          path="farms/:farmId/animals/:id/edit"
          element={
            <Suspense fallback={<Loading />}>
              <EditAnimal />
            </Suspense>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes; 