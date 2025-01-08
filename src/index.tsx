import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container, AppBar, Toolbar, Typography, Drawer, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MinimizeIcon from '@mui/icons-material/Remove';
import MaximizeIcon from '@mui/icons-material/CropSquare';
import theme from './theme';

const drawerWidth = 240;

const TitleBar: React.FC = () => {
  const handleClose = () => {
    window.ipcRenderer.invoke('close-window');
  };

  const handleMinimize = () => {
    window.ipcRenderer.invoke('minimize-window');
  };

  const handleMaximize = () => {
    window.ipcRenderer.invoke('maximize-window');
  };

  return (
    <Box
      sx={{
        '-webkit-app-region': 'drag',
        backgroundColor: 'background.paper',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 32,
        px: 1
      }}
    >
      <Typography variant="subtitle2">WhisperIDE</Typography>
      <Box sx={{ '-webkit-app-region': 'no-drag' }}>
        <IconButton size="small" onClick={handleMinimize} sx={{ mr: 1 }}>
          <MinimizeIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={handleMaximize} sx={{ mr: 1 }}>
          <MaximizeIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={handleClose} color="error">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <TitleBar />
        <Box sx={{ display: 'flex', flex: 1 }}>
          <Drawer
            variant="permanent"
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
                marginTop: '32px',
                height: 'calc(100% - 32px)'
              },
            }}
          >
            <Box sx={{ overflow: 'auto' }}>
              {/* Explorer de fichiers ici */}
            </Box>
          </Drawer>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              bgcolor: 'background.default',
              p: 3,
            }}
          >
            {/* Zone principale de l'éditeur ici */}
            <Typography paragraph>Bienvenue dans WhisperIDE</Typography>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);