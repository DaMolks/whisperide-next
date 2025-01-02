import React from 'react';
import { Box, IconButton } from '@mui/material';
import { Close, Remove, CropSquare } from '@mui/icons-material';
import './TitleBar.css';

const TitleBar = () => {
  const handleClose = () => {
    if (window.electron) window.electron.close();
  };

  const handleMinimize = () => {
    if (window.electron) window.electron.minimize();
  };

  const handleMaximize = () => {
    if (window.electron) window.electron.maximize();
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