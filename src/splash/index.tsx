import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import Splash from './Splash';
import { darkTheme } from '../theme';

ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
).render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Splash />
    </ThemeProvider>
  </React.StrictMode>
);