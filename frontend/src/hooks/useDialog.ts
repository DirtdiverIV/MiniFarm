import { useState, useCallback } from 'react';

interface UseDialogReturn {
  isOpen: boolean;
  data: any;
  openDialog: (data?: any) => void;
  closeDialog: () => void;
  toggleDialog: () => void;
}

export const useDialog = (initialState = false): UseDialogReturn => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [data, setData] = useState<any>(null);

  const openDialog = useCallback((dialogData?: any) => {
    setIsOpen(true);
    if (dialogData !== undefined) {
      setData(dialogData);
    }
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);

  const toggleDialog = useCallback(() => {
    setIsOpen(prev => !prev);
    if (!isOpen) {
      setData(null);
    }
  }, [isOpen]);

  return {
    isOpen,
    data,
    openDialog,
    closeDialog,
    toggleDialog
  };
}; 