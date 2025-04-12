import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { Suspense } from 'react';
import Header from './Header';
import Loading from '../components/Loading';
import ErrorBoundary from '../components/ErrorBoundary';

const PrivateLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, p: 3, position: 'relative' }}>
        <ErrorBoundary>
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </Box>
    </Box>
  );
};

export default PrivateLayout; 