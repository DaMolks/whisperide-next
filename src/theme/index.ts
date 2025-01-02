import { createTheme, Theme } from '@mui/material';

const baseTheme = {
  typography: {
    fontFamily: '"Inter", sans-serif'
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: true
      },
      styleOverrides: {
        root: {
          textTransform: 'none' as const
        }
      }
    }
  }
};

export const darkTheme: Theme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#3498db'
    },
    background: {
      default: '#1a1a1a',
      paper: '#2d2d2d'
    }
  }
});

export const lightTheme: Theme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#3498db'
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff'
    }
  }
});