import { useState, useCallback } from 'react';
import { ApiError, ErrorCode, isApiError } from '../types/errors';

interface ErrorState {
  error: ApiError | null;
  hasError: boolean;
}

interface UseErrorHandlerReturn extends ErrorState {
  handleError: (error: unknown) => ApiError;
  clearError: () => void;
}

export const useErrorHandler = (): UseErrorHandlerReturn => {
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    hasError: false
  });

  const handleError = useCallback((error: unknown): ApiError => {
    let apiError: ApiError;

    if (isApiError(error)) {
      apiError = error;
    } else if (error instanceof Error) {
      apiError = {
        code: ErrorCode.UNKNOWN_ERROR,
        message: error.message
      };
    } else if (typeof error === 'string') {
      apiError = {
        code: ErrorCode.UNKNOWN_ERROR,
        message: error
      };
    } else {
      apiError = {
        code: ErrorCode.UNKNOWN_ERROR,
        message: 'Ha ocurrido un error inesperado'
      };
    }

    setErrorState({
      error: apiError,
      hasError: true
    });

    return apiError;
  }, []);

  const clearError = useCallback(() => {
    setErrorState({
      error: null,
      hasError: false
    });
  }, []);

  return {
    ...errorState,
    handleError,
    clearError
  };
}; 