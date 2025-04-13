import { Box, Container } from '@mui/material';
import Header from './Header';
import { Outlet } from 'react-router-dom';
import ErrorBoundary from '../components/ErrorBoundary';

const PrivateLayout = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100vw',
        maxWidth: '100%',
        bgcolor: 'background.default',
      }}
    >
      <Header />
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          mt: { xs: '56px', sm: '64px' }
        }}
      >
        <Container 
          maxWidth={false}
          disableGutters
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxWidth: '100% !important',
            height: '100%',
            overflow: 'auto'
          }}
        >
          <ErrorBoundary>
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column',
              width: '100%',
              height: '100%',
              '& > *': {
                width: '100%'
              }
            }}>
              <Outlet />
            </Box>
          </ErrorBoundary>
        </Container>
      </Box>
    </Box>
  );
};

export default PrivateLayout; 