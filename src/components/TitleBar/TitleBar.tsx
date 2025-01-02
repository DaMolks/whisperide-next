import React, { useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import { Close, Remove, CropSquare } from '@mui/icons-material';
import './TitleBar.css';

const TitleBar = () => {
  useEffect(() => {
    console.log('Window object:', window);
    console.log('Window.electron:', (window as any).electron);
    console.log('Window.electron type:', typeof (window as any).electron);
  }, []);

  const handleClose = () => {
    console.log('Close button clicked');
    if ((window as any).electron) {
      console.log('Sending close command');
      (window as any).electron.send('window-control', 'close');
    } else {
      console.error('window.electron is not defined');
    }
  };

  const handleMinimize = () => {
    console.log('Minimize button clicked');
    if ((window as any).electron) {
      console.log('Sending minimize command');
      (window as any).electron.send('window-control', 'minimize');
    } else {
      console.error('window.electron is not defined');
    }
  };

  const handleMaximize = () => {
    console.log('Maximize button clicked');
    if ((window as any).electron) {
      console.log('Sending maximize command');
      (window as any).electron.send('window-control', 'maximize');
    } else {
      console.error('window.electron is not defined');
    }
  };

  return (
    <Box
      className="titlebar"
      sx={{
        height: '32px',
        bgcolor: 'background.paper',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        WebkitAppRegion: 'drag',
        borderBottom: 1,
        borderColor: 'divider',
        px: 2
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        WhisperIDE
      </Box>

      <Box
        sx={{
          display: 'flex',
          WebkitAppRegion: 'no-drag'
        }}
      >
        <IconButton
          onClick={handleMinimize}
          size="small"
          sx={{
            borderRadius: 0,
            height: '32px',
            width: '46px',
            '&:hover': { bgcolor: 'action.hover' }
          }}
        >
          <Remove fontSize="small" />
        </IconButton>

        <IconButton
          onClick={handleMaximize}
          size="small"
          sx={{
            borderRadius: 0,
            height: '32px',
            width: '46px',
            '&:hover': { bgcolor: 'action.hover' }
          }}
        >
          <CropSquare fontSize="small" />
        </IconButton>

        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            borderRadius: 0,
            height: '32px',
            width: '46px',
            '&:hover': { bgcolor: 'error.main' }
          }}
        >
          <Close fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default TitleBar;