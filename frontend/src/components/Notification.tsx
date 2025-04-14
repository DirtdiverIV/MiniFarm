import { Box, Typography, Alert, Collapse, IconButton, Snackbar, AlertTitle } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { ApiError, ErrorCode } from '../types/errors';
import { useState, useEffect } from 'react';

interface NotificationProps {
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
  open: boolean;
  onClose: () => void;
  isSnackbar?: boolean;
  title?: string;
  details?: any[] | null;
  autoHideDuration?: number;
  error?: ApiError | null;
}

export const Notification = ({
  message,
  severity,
  open,
  onClose,
  isSnackbar = false,
  title,
  details = null,
  autoHideDuration = 6000,
  error = null
}: NotificationProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  
  useEffect(() => {
    if (open || error) {
      setInternalOpen(true);
    }
  }, [open, error]);
  
  const handleClose = () => {
    setInternalOpen(false);
    onClose();
  };
  
  
  const errorDetails = error?.details || null;
  const errorMessage = error?.message || message;
  const errorSeverity = error ? 'error' : severity;
  
  const renderDetails = () => {
    const itemsToRender = errorDetails || details;
    
    if (!itemsToRender || !Array.isArray(itemsToRender)) return null;
    
    return (
      <Box 
        component="ul" 
        sx={{ 
          mt: 0.5,
          mb: 0,
          pl: 2,
          listStyle: 'none'
        }}
      >
        {itemsToRender.map((detail, index) => (
          <Typography 
            component="li" 
            key={detail.field ? `detail-${detail.field}` : `detail-${detail.message || detail.toString()}-${index}`}
            variant="body2"
            sx={{
              display: 'flex',
              alignItems: 'center',
              '&:before': {
                content: '"•"',
                color: `${errorSeverity}.main`,
                fontWeight: 'bold',
                mr: 1
              },
              mb: 0.5
            }}
          >
            {detail.field ? (
              <>
                <strong>{detail.field}:</strong>&nbsp;{detail.message}
              </>
            ) : (
              detail.message || detail.toString()
            )}
          </Typography>
        ))}
      </Box>
    );
  };
  
  const alertContent = (
    <Alert 
      severity={errorSeverity}
      onClose={handleClose}
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
        mb: isSnackbar ? 0 : 2,
        borderRadius: 2,
        boxShadow: (theme) => theme.shadows[1],
        '& .MuiAlert-message': {
          width: '100%'
        }
      }}
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
        {errorMessage}
      </Typography>
      {renderDetails()}
    </Alert>
  );
  
  
  return isSnackbar ? (
    <Snackbar
      open={internalOpen}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      {alertContent}
    </Snackbar>
  ) : (
    <Collapse in={internalOpen}>
      {alertContent}
    </Collapse>
  );
};

export default Notification; 