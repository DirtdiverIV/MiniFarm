import { useState } from 'react';
import { FormikHelpers } from 'formik';
import { useErrorHandler } from './useErrorHandler';
import { ApiError } from '../types/errors';

interface UseFormHandlingProps<T> {
  onSubmit: (values: T) => Promise<void>;
  initialValues: T;
  isEditing?: boolean;
  onSuccess?: () => void;
  resetToInitial?: boolean;
}

interface UseFormHandlingReturn<T> {
  loading: boolean;
  error: ApiError | null;
  handleSubmit: (values: T, formikHelpers: FormikHelpers<T>) => Promise<void>;
}

export const useFormHandling = <T>({
  onSubmit,
  initialValues,
  isEditing = false,
  onSuccess,
  resetToInitial = true
}: UseFormHandlingProps<T>): UseFormHandlingReturn<T> => {
  const [loading, setLoading] = useState(false);
  const { error, handleError, clearError } = useErrorHandler();

  const handleSubmit = async (values: T, formikHelpers: FormikHelpers<T>) => {
    setLoading(true);
    clearError();

    try {
      await onSubmit(values);
      
      if (!isEditing && resetToInitial) {
        formikHelpers.resetForm({ values: initialValues });
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
      formikHelpers.setSubmitting(false);
    }
  };

  return {
    loading,
    error,
    handleSubmit
  };
}; 