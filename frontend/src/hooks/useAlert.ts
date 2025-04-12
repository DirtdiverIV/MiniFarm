import { useState } from 'react';

type AlertSeverity = 'success' | 'error' | 'info' | 'warning';

interface UseAlertReturn {
  alertOpen: boolean;
  alertMessage: string;
  alertSeverity: AlertSeverity;
  showAlert: (message: string, severity: AlertSeverity) => void;
  closeAlert: () => void;
}

export const useAlert = (): UseAlertReturn => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<AlertSeverity>('info');

  const showAlert = (message: string, severity: AlertSeverity) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const closeAlert = () => {
    setAlertOpen(false);
  };

  return {
    alertOpen,
    alertMessage,
    alertSeverity,
    showAlert,
    closeAlert
  };
}; 