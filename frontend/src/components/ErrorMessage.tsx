import { Box, Typography, Alert, Collapse, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { ApiError, ErrorCode } from '../types/errors';
import { useState, useEffect } from 'react';

interface ErrorMessageProps {
  error: ApiError | null;
}

export const ErrorMessage = ({ error }: ErrorMessageProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (error) {
      setOpen(true);
    }
  }, [error]);

  if (!error) return null;

  const handleClose = () => {
    setOpen(false);
  };

  
  if (error.code === ErrorCode.VALIDATION_ERROR && error.details) {
    return (
      <Collapse in={open}>
        <Alert 
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleClose}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{
            mb: 2,
            '& .MuiAlert-message': {
              width: '100%'
            },
            borderRadius: 2,
            boxShadow: (theme) => theme.shadows[1]
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            {error.message}
          </Typography>
          {Array.isArray(error.details) && (
            <Box 
              component="ul" 
              sx={{ 
                mt: 0.5,
                mb: 0,
                pl: 2,
                listStyle: 'none'
              }}
            >
              {error.details.map((detail) => (
                <Typography 
                  component="li" 
                  key={`${detail.field}-${detail.message}`} 
                  variant="body2"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    '&:before': {
                      content: '"•"',
                      color: 'error.main',
                      fontWeight: 'bold',
                      mr: 1
                    },
                    mb: 0.5
                  }}
                >
                  <strong>{detail.field}:</strong>&nbsp;{detail.message}
                </Typography>
              ))}
            </Box>
          )}
        </Alert>
      </Collapse>
    );
  }

  
  return (
    <Collapse in={open}>
      <Alert 
        severity="error"
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={handleClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={{
          mb: 2,
          borderRadius: 2,
          boxShadow: (theme) => theme.shadows[1]
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {error.message}
        </Typography>
      </Alert>
    </Collapse>
  );
}; 