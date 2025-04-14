import '@testing-library/jest-dom'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import { vi } from 'vitest'


afterEach(() => {
  cleanup()
})


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


vi.mock('@mui/icons-material', () => {
  
  return new Proxy(
    {},
    {
      get: (target, prop) => {
        
        if (prop in target) {
          return target[prop as keyof typeof target];
        }

        
        const component = () => null;
        
        
        Object.assign(component, {
          displayName: `MockedIcon(${String(prop)})`,
          muiName: 'SvgIcon',
          propTypes: {},
          render: () => null,
        });
        
        
        (target as Record<string, any>)[prop as string] = component;
        
        return component;
      },
    }
  );
});


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