import { useState, useCallback } from 'react';
import { ApiResponse } from '../types/common';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T, P = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (params?: P) => Promise<T | null>;
  reset: () => void;
}

type ApiFunction<T, P = any> = (params?: P) => Promise<ApiResponse<T>>;

export const useApi = <T, P = any>(
  apiFunction: ApiFunction<T, P>,
  options?: {
    initialData?: T | null;
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
    autoReset?: boolean;
  }
): UseApiReturn<T, P> => {
  const [state, setState] = useState<UseApiState<T>>({
    data: options?.initialData === undefined ? null : options.initialData,
    loading: false,
    error: null
  });

  const reset = useCallback(() => {
    setState({
      data: options?.initialData === undefined ? null : options.initialData,
      loading: false,
      error: null
    });
  }, [options?.initialData]);

  const execute = useCallback(async (params?: P): Promise<T | null> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await apiFunction(params);

      if (!response.success) {
        throw new Error(response.message ?? 'Error en la operación');
      }

      setState(prev => ({ ...prev, data: response.data, loading: false }));
      
      if (options?.onSuccess) {
        options.onSuccess(response.data);
      }

      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      setState(prev => ({ 
        ...prev, 
        error: errorMessage,
        loading: false 
      }));

      if (options?.onError) {
        options.onError(errorMessage);
      }

      if (options?.autoReset) {
        setTimeout(reset, 3000);
      }

      return null;
    }
  }, [apiFunction, options, reset]);

  return {
    ...state,
    execute,
    reset
  };
};

// Hook especializado para operaciones CRUD
interface CrudOperations<T> {
  getAll: () => Promise<ApiResponse<T[]>>;
  getById: (id: number) => Promise<ApiResponse<T>>;
  create: (data: Partial<T>) => Promise<ApiResponse<T>>;
  update: (id: number, data: Partial<T>) => Promise<ApiResponse<T>>;
  delete: (id: number) => Promise<ApiResponse<void>>;
}

interface UpdateParams<T> {
  id: number;
  data: Partial<T>;
}

export const useCrudApi = <T>(operations: CrudOperations<T>) => {
  const getAll = useApi<T[]>(() => operations.getAll());
  const getById = useApi<T, number>((id) => operations.getById(id ?? 0));
  const create = useApi<T, Partial<T>>((data) => operations.create(data ?? {}));
  const update = useApi<T, UpdateParams<T>>((params) => 
    operations.update(params?.id ?? 0, params?.data ?? {})
  );
  const remove = useApi<void, number>((id) => operations.delete(id ?? 0));

  return {
    getAll,
    getById,
    create,
    update,
    remove,
    loading: getAll.loading || getById.loading || create.loading || update.loading || remove.loading,
    error: getAll.error || getById.error || create.error || update.error || remove.error
  };
}; 