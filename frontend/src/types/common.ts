// Tipos comunes para formularios
export interface FormProps<T> {
  onSubmit: (values: T) => Promise<void>;
  initialValues?: T;
  isEditing?: boolean;
}

// Tipos para alertas y diálogos
export type AlertSeverity = 'success' | 'error' | 'info' | 'warning';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message?: string;
}

// Tipos para tablas
export interface TableProps<T> {
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (id: number) => void;
  title?: string;
}

export interface PaginationState {
  page: number;
  rowsPerPage: number;
  total: number;
}

// Tipos para autenticación
export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends AuthCredentials {
  confirmPassword: string;
}

// Tipos para respuestas de API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
} 