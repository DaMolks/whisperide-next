import React from 'react';
import { Box, IconButton } from '@mui/material';
import { Close as CloseIcon, Remove as MinimizeIcon, CropSquare as MaximizeIcon } from '@mui/icons-material';

const TitleBar: React.FC = () => {
  const handleClose = () => window.electron.close();
  const handleMinimize = () => window.electron.minimize();
  const handleMaximize = () => window.electron.maximize();

  return (
    <Box
      sx={{
        height: '32px',
        bgcolor: 'background.paper',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        WebkitAppRegion: 'drag',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Box sx={{ pl: 2 }}>WhisperIDE</Box>
      
      <Box sx={{ WebkitAppRegion: 'no-drag' }}>
        <IconButton onClick={handleMinimize} size="small">
          <MinimizeIcon fontSize="small" />
        </IconButton>
        <IconButton onClick={handleMaximize} size="small">
          <MaximizeIcon fontSize="small" />
        </IconButton>
        <IconButton onClick={handleClose} size="small" color="error">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default TitleBar;