import { Box, CircularProgress, Typography, Fade } from '@mui/material';
import { alpha } from '@mui/material/styles';

interface LoadingProps {
  message?: string;
}

const Loading = ({ message = 'Cargando...' }: LoadingProps) => {
  return (
    <Fade in={true} timeout={800}>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '400px',
          width: '100%',
          p: 4,
          background: (theme) => alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(8px)',
          borderRadius: 2
        }}
      >
        <CircularProgress 
          size={64} 
          thickness={4} 
          sx={{
            color: 'primary.main',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            }
          }}
        />
        <Typography 
          variant="h6" 
          sx={{ 
            mt: 3,
            color: 'text.secondary',
            fontWeight: 500,
            textAlign: 'center',
            animation: 'pulse 2s infinite ease-in-out'
          }}
        >
          {message}
        </Typography>
      </Box>
    </Fade>
  );
};

export default Loading; 