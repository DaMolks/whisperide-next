import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { darkTheme } from '../theme';
import { Splash } from './Splash';

ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
).render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <Splash />
    </ThemeProvider>
  </React.StrictMode>
);