import { Alert, AlertTitle, Snackbar } from '@mui/material';

interface AlertMessageProps {
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
  open: boolean;
  onClose: () => void;
  autoHideDuration?: number;
  title?: string;
}

const AlertMessage = ({
  message,
  severity,
  open,
  onClose,
  autoHideDuration = 6000,
  title
}: AlertMessageProps) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AlertMessage; 