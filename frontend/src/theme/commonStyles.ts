import { alpha } from '@mui/material/styles';
import { themeColors } from './theme';
import { Theme } from '@mui/material/styles';

/**
 * Estilos comunes para componentes reutilizables
 * Elimina la duplicación de estilos en múltiples componentes
 */
export const commonStyles = {
  cards: {
    base: {
      borderRadius: 2,
      boxShadow: (theme: Theme) => theme.shadows[1],
      transition: 'all 0.3s ease',
      border: '1px solid',
      borderColor: themeColors.outline.variant,
    },
    primary: {
      backgroundColor: alpha(themeColors.primary.light, 0.2),
    },
    secondary: {
      backgroundColor: alpha(themeColors.secondary.light, 0.2),
    },
    tertiary: {
      backgroundColor: alpha(themeColors.tertiary.light, 0.2),
    },
    error: {
      backgroundColor: alpha(themeColors.error.light, 0.2),
      borderColor: alpha(themeColors.error.main, 0.2),
    }
  },
  buttons: {
    iconButton: {
      width: 40,
      height: 40,
      boxShadow: (theme: Theme) => theme.shadows[3],
      '&:hover': {
        bgcolor: (color: string) => `${color}.dark`,
      },
      '&:disabled': {
        bgcolor: themeColors.surface.containerHigh,
      }
    },
    circular: {
      borderRadius: '50%'
    }
  },
  navigation: {
    paginationIndicator: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      transition: 'all 0.2s',
      cursor: 'pointer'
    }
  },
  containers: {
    contentSection: {
      mb: 4
    },
    pageHeader: {
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      mb: 4
    }
  }
}; 