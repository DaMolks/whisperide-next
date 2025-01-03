import React from 'react';
import { Box, IconButton } from '@mui/material';
import { Close, Remove, CropSquare } from '@mui/icons-material';
import './TitleBar.css';

const TitleBar: React.FC = () => {
  const handleClose = () => {
    console.log('Close clicked');
    if ((window as any).electron) {
      (window as any).electron.close();
    } else {
      console.log('Electron not found in window');
    }
  };

  const handleMinimize = () => {
    console.log('Minimize clicked');
    if ((window as any).electron) {
      (window as any).electron.minimize();
    } else {
      console.log('Electron not found in window');
    }
  };

  const handleMaximize = () => {
    console.log('Maximize clicked');
    if ((window as any).electron) {
      (window as any).electron.maximize();
    } else {
      console.log('Electron not found in window');
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