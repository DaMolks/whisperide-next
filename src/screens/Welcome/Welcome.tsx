import React from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { GitHub, Close, Remove } from '@mui/icons-material';
import './Welcome.css';

interface WelcomeProps {
  onGitHubLogin: () => void;
  onLocalMode: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onGitHubLogin, onLocalMode }) => {
  const handleClose = () => {
    if ((window as any).electron) {
      (window as any).electron.close();
    }
  };

  const handleMinimize = () => {
    if ((window as any).electron) {
      (window as any).electron.minimize();
    }
  };

  return (
    <Box className="welcome-container">
      <Box className="welcome-controls">
        <IconButton 
          onClick={handleMinimize}
          size="small"
          sx={{ color: 'rgba(255,255,255,0.7)' }}
        >
          <Remove />
        </IconButton>
        <IconButton 
          onClick={handleClose}
          size="small"
          sx={{ color: 'rgba(255,255,255,0.7)' }}
        >
          <Close />
        </IconButton>
      </Box>

      <Box className="welcome-content">
        <Typography variant="h2" className="welcome-title">
          WhisperIDE Next
        </Typography>

        <Box className="welcome-buttons">
          <Button
            variant="contained"
            size="large"
            startIcon={<GitHub />}
            onClick={onGitHubLogin}
            className="github-button"
          >
            Connexion avec GitHub
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            onClick={onLocalMode}
            className="local-button"
          >
            Mode Local
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Welcome;