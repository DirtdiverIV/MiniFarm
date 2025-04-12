import { Box, Typography, Alert } from '@mui/material';
import { ApiError, ErrorCode } from '../types/errors';

interface ErrorMessageProps {
  error: ApiError | null;
}

export const ErrorMessage = ({ error }: ErrorMessageProps) => {
  if (!error) return null;

  // Para errores de validación, mostrar cada campo con error
  if (error.code === ErrorCode.VALIDATION_ERROR && error.details) {
    return (
      <Box sx={{ mb: 2 }}>
        <Alert severity="error">
          {error.message}
          {Array.isArray(error.details) && (
            <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2 }}>
              {error.details.map((detail) => (
                <Typography 
                  component="li" 
                  key={`${detail.field}-${detail.message}`} 
                  variant="body2"
                >
                  {detail.field}: {detail.message}
                </Typography>
              ))}
            </Box>
          )}
        </Alert>
      </Box>
    );
  }

  // Para otros tipos de errores
  return (
    <Box sx={{ mb: 2 }}>
      <Alert severity="error">
        {error.message}
      </Alert>
    </Box>
  );
}; 