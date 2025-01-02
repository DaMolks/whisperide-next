import { createTheme } from '@mui/material';

const baseTheme = {
  typography: {
    fontFamily: '"Inter", sans-serif',
  },
  shape: {
    borderRadius: 8
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none'
        }
      }
    }
  }
};

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#3498db',
      light: '#5dade2',
      dark: '#2980b9'
    },
    background: {
      default: '#1a1a1a',
      paper: '#2d2d2d'
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)'
    }
  }
});

export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#3498db',
      light: '#5dade2',
      dark: '#2980b9'
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff'
    }
  }
});