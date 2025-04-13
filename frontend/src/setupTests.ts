import '@testing-library/jest-dom'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import { vi } from 'vitest'

// Limpia automáticamente después de cada prueba
afterEach(() => {
  cleanup()
})

// Suprimir errores de consola durante las pruebas
const originalConsoleError = console.error
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('ReactDOM.render is no longer supported') ||
      args[0].includes('Warning:'))
  ) {
    return
  }
  originalConsoleError(...args)
}

// Establecer vi.mock para MUI icons antes de que cualquier test lo utilice
vi.mock('@mui/icons-material', () => {
  // Crear un proxy que genere componentes mock bajo demanda
  return new Proxy(
    {},
    {
      get: (target, prop) => {
        // Si la propiedad ya existe en el target, devolverla
        if (prop in target) {
          return target[prop as keyof typeof target];
        }

        // Crear un componente mock
        const component = () => null;
        
        // Agregar métodos y propiedades comunes para simular un componente de React
        Object.assign(component, {
          displayName: `MockedIcon(${String(prop)})`,
          muiName: 'SvgIcon',
          propTypes: {},
          render: () => null,
        });
        
        // Guardar el componente en el target para futuras solicitudes
        (target as Record<string, any>)[prop as string] = component;
        
        return component;
      },
    }
  );
});

// También mockeamos otros componentes comunes que pueden causar problemas
vi.mock('@mui/material/Fade', () => {
  return {
    default: ({ in: inProp, children }: { in: boolean; children: React.ReactNode }) => {
      if (inProp) {
        return children;
      }
      return null;
    },
  };
});

vi.mock('@mui/material/Alert', () => {
  return {
    default: ({ severity, children, ...props }: { severity: string; children: React.ReactNode }) => {
      return {
        type: 'div',
        props: {
          role: 'alert',
          className: `MuiAlert-standardSuccess MuiAlert-standard${severity.charAt(0).toUpperCase() + severity.slice(1)}`,
          ...props,
          children
        }
      };
    },
  };
});

// Agregamos mocks para todos los componentes de MUI utilizados en nuestros tests
vi.mock('@mui/material/Table', () => ({ default: ({ children }: { children: React.ReactNode }) => children }));
vi.mock('@mui/material/TableBody', () => ({ default: ({ children }: { children: React.ReactNode }) => children }));
vi.mock('@mui/material/TableCell', () => ({ default: ({ children }: { children: React.ReactNode }) => children }));
vi.mock('@mui/material/TableContainer', () => ({ default: ({ children }: { children: React.ReactNode }) => children }));
vi.mock('@mui/material/TableHead', () => ({ default: ({ children }: { children: React.ReactNode }) => children }));
vi.mock('@mui/material/TableRow', () => ({ default: ({ children }: { children: React.ReactNode }) => children }));
vi.mock('@mui/material/TableSortLabel', () => ({ default: ({ children }: { children: React.ReactNode }) => children }));
vi.mock('@mui/material/Card', () => ({ default: ({ children }: { children: React.ReactNode }) => children }));
vi.mock('@mui/material/CardContent', () => ({ default: ({ children }: { children: React.ReactNode }) => children }));
vi.mock('@mui/material/CardActions', () => ({ default: ({ children }: { children: React.ReactNode }) => children }));
vi.mock('@mui/material/Button', () => ({ default: ({ children }: { children: React.ReactNode }) => children }));
vi.mock('@mui/material/TextField', () => ({ default: (props: any) => null }));
vi.mock('@mui/material/IconButton', () => ({ default: ({ children }: { children: React.ReactNode }) => children }));
vi.mock('@mui/material/Snackbar', () => ({ default: ({ children }: { children: React.ReactNode }) => children }));
vi.mock('@mui/material/CircularProgress', () => ({ default: (props: any) => null }));
vi.mock('@mui/material/Typography', () => ({ default: ({ children }: { children: React.ReactNode }) => children })); 