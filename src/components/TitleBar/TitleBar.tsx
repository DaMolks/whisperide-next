import React from 'react';
import { Box, IconButton } from '@mui/material';
import { Close, Remove, CropSquare } from '@mui/icons-material';
import './TitleBar.css';

const TitleBar: React.FC = () => {
  const handleClose = () => window.electron.close();
  const handleMinimize = () => window.electron.minimize();
  const handleMaximize = () => window.electron.maximize();

  return (
    <Box
      className="titlebar"
      sx={{
        height: '32px',
        bgcolor: 'background.paper',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 1,
        borderBottom: 1,
        borderColor: 'divider',
        WebkitUserSelect: 'none',
        WebkitAppRegion: 'drag'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <img 
          src="/logo.svg" 
          alt="WhisperIDE" 
          style={{ height: 20, width: 20 }}
        />
        <span>WhisperIDE</span>
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
          sx={{ borderRadius: 0 }}
        >
          <Remove fontSize="small" />
        </IconButton>
        <IconButton 
          onClick={handleMaximize} 
          size="small"
          sx={{ borderRadius: 0 }}
        >
          <CropSquare fontSize="small" />
        </IconButton>
        <IconButton 
          onClick={handleClose} 
          size="small"
          sx={{ 
            borderRadius: 0,
            '&:hover': {
              bgcolor: 'error.main'
            }
          }}
        >
          <Close fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default TitleBar;