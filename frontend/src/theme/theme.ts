import { createTheme, alpha } from '@mui/material/styles';

// Crear un array de sombras estándar de MUI
const shadows = [
  'none',
  '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)', // elevation 1
  '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)', // elevation 2
  '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)', // elevation 3
  '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)', // elevation 4
  '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)', // elevation 5
  '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)', // elevation 6
  '0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)', // elevation 7
  '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)', // elevation 8
  '0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)', // elevation 9
  '0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)', // elevation 10
];

// Definición de colores del tema personalizado
const themeColors = {
  primary: {
    main: '#4C662B',
    light: '#B1D18A',
    dark: '#354E16',
    contrastText: '#FFFFFF',
    surfaceTint: '#4C662B',
    container: '#CDEDA3',
    onContainer: '#354E16',
    fixed: '#CDEDA3',
    onFixed: '#102000',
    fixedDim: '#B1D18A',
    onFixedVariant: '#354E16',
  },
  secondary: {
    main: '#586249',
    light: '#BFCBAD',
    dark: '#404A33',
    contrastText: '#FFFFFF',
    container: '#DCE7C8',
    onContainer: '#404A33',
    fixed: '#DCE7C8',
    onFixed: '#151E0B',
    fixedDim: '#BFCBAD',
    onFixedVariant: '#404A33',
  },
  tertiary: {
    main: '#386663',
    light: '#A0D0CB',
    dark: '#1F4E4B',
    contrastText: '#FFFFFF',
    container: '#BCECE7',
    onContainer: '#1F4E4B',
    fixed: '#BCECE7',
    onFixed: '#00201E',
    fixedDim: '#A0D0CB',
    onFixedVariant: '#1F4E4B',
  },
  error: {
    main: '#BA1A1A',
    light: '#FFDAD6',
    dark: '#93000A',
    contrastText: '#FFFFFF',
    container: '#FFDAD6',
    onContainer: '#93000A',
  },
  background: {
    default: '#F9FAEF',
    paper: '#F9FAEF',
    dim: '#DADBD0',
    bright: '#F9FAEF',
    containerLowest: '#FFFFFF',
    containerLow: '#F3F4E9',
    container: '#EEEFE3',
    containerHigh: '#E8E9DE',
    containerHighest: '#E2E3D8',
  },
  text: {
    primary: '#1A1C16',
    secondary: '#44483D',
  },
  surface: {
    main: '#F9FAEF',
    onSurface: '#1A1C16',
    variant: '#E1E4D5',
    onVariant: '#44483D',
    inverse: '#2F312A',
    onInverse: '#F1F2E6',
    dim: '#DADBD0',
    bright: '#F9FAEF',
    containerLowest: '#FFFFFF',
    containerLow: '#F3F4E9',
    container: '#EEEFE3',
    containerHigh: '#E8E9DE',
    containerHighest: '#E2E3D8',
  },
  outline: {
    main: '#75796C',
    variant: '#C5C8BA',
  },
  grey: {
    50: '#F9FAEF',
    100: '#F3F4E9',
    200: '#E8E9DE',
    300: '#DADBD0',
    400: '#C5C8BA',
    500: '#A9AD9F',
    600: '#75796C',
    700: '#44483D',
    800: '#2F312A',
    900: '#1A1C16',
    A100: '#EEEFE3',
    A200: '#DCE7C8',
    A400: '#BFCBAD',
    A700: '#586249',
  },
  common: {
    black: '#000000',
    white: '#FFFFFF',
  },
};

// Crear tema personalizado
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: themeColors.primary.main,
      light: themeColors.primary.light,
      dark: themeColors.primary.dark,
      contrastText: themeColors.primary.contrastText,
    },
    secondary: {
      main: themeColors.secondary.main,
      light: themeColors.secondary.light,
      dark: themeColors.secondary.dark,
      contrastText: themeColors.secondary.contrastText,
    },
    error: {
      main: themeColors.error.main,
      light: themeColors.error.light,
      dark: themeColors.error.dark,
      contrastText: themeColors.error.contrastText,
    },
    warning: {
      main: themeColors.error.main, // Usando error como warning para mantener coherencia del tema
      light: themeColors.error.light,
      dark: themeColors.error.dark,
      contrastText: themeColors.error.contrastText,
    },
    info: {
      main: themeColors.tertiary.main, // Usando tertiary como info para mantener coherencia del tema
      light: themeColors.tertiary.light,
      dark: themeColors.tertiary.dark,
      contrastText: themeColors.tertiary.contrastText,
    },
    success: {
      main: themeColors.primary.main, // Usando primary como success para mantener coherencia del tema
      light: themeColors.primary.light,
      dark: themeColors.primary.dark,
      contrastText: themeColors.primary.contrastText,
    },
    background: {
      default: themeColors.background.default,
      paper: themeColors.background.paper,
    },
    text: {
      primary: themeColors.text.primary,
      secondary: themeColors.text.secondary,
    },
    common: themeColors.common,
    divider: themeColors.outline.variant,
    grey: themeColors.grey,
  },
  typography: {
    fontFamily: [
      '"Roboto Mono"',
      '"Courier New"',
      'monospace',
    ].join(','),
    h1: {
      fontWeight: 700,
      fontSize: '6rem',
      lineHeight: 1.167,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '3.75rem',
      lineHeight: 1.2,
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontWeight: 700,
      fontSize: '3rem',
      lineHeight: 1.167,
      letterSpacing: '0em',
    },
    h4: {
      fontWeight: 700,
      fontSize: '2.125rem',
      lineHeight: 1.235,
      letterSpacing: '0.00735em',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.5rem',
      lineHeight: 1.334,
      letterSpacing: '0em',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.6,
      letterSpacing: '0.0075em',
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.75,
      letterSpacing: '0.00938em',
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.57,
      letterSpacing: '0.00714em',
    },
    body1: {
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    body2: {
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.43,
      letterSpacing: '0.01071em',
    },
    button: {
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.75,
      letterSpacing: '0.02857em',
      textTransform: 'uppercase',
    },
    caption: {
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 1.66,
      letterSpacing: '0.03333em',
    },
    overline: {
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 2.66,
      letterSpacing: '0.08333em',
      textTransform: 'uppercase',
    },
  },
  shadows: shadows as any,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: themeColors.primary.main,
          color: themeColors.primary.contrastText,
          '&:hover': {
            backgroundColor: themeColors.primary.dark,
          },
          '&.Mui-disabled': {
            backgroundColor: themeColors.surface.containerHigh,
            color: themeColors.outline.main,
          },
        },
        outlined: {
          borderColor: themeColors.primary.main,
          color: themeColors.primary.main,
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: themeColors.primary.container,
            borderColor: themeColors.primary.dark,
          },
        },
        text: {
          color: themeColors.primary.main,
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: themeColors.primary.container,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: themeColors.surface.containerLow,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: themeColors.surface.containerLow,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: themeColors.surface.containerHigh,
        },
        colorPrimary: {
          backgroundColor: themeColors.primary.container,
          color: themeColors.primary.onContainer,
        },
        colorSecondary: {
          backgroundColor: themeColors.secondary.container,
          color: themeColors.secondary.onContainer,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(odd)': {
            backgroundColor: themeColors.surface.containerHighest,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: themeColors.outline.variant,
            },
            '&:hover fieldset': {
              borderColor: themeColors.primary.main,
            },
            '&.Mui-focused fieldset': {
              borderColor: themeColors.primary.main,
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: themeColors.primary.main,
          color: themeColors.primary.contrastText,
        },
      },
    },
  },
});

// Exportar tanto el tema como los colores originales para usar directamente en componentes
export { themeColors };
export default theme; 