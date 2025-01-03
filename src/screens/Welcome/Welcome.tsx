import React, { useState } from 'react';
import { Box, Typography, Button, IconButton, CircularProgress } from '@mui/material';
import { GitHub, Close, Remove } from '@mui/icons-material';
import './Welcome.css';
import '../../styles/shared.css';

interface WelcomeProps {
  onGitHubLogin: (token: string) => void;
  onLocalMode: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onGitHubLogin, onLocalMode }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    if (window.electron) {
      window.electron.close();
    }
  };

  const handleMinimize = () => {
    if (window.electron) {
      window.electron.minimize();
    }
  };

  const handleGitHubClick = async () => {
    try {
      setIsLoading(true);
      const token = await window.electron.githubAuth.login();
      onGitHubLogin(token);
    } catch (error) {
      console.error('GitHub auth error:', error);
      // TODO: Ajouter une notification d'erreur
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="welcome-container gradient-background">
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
            startIcon={!isLoading && <GitHub />}
            onClick={handleGitHubClick}
            className="github-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Connexion avec GitHub'
            )}
          </Button>
          
          <Button
            variant="text"
            size="large"
            onClick={onLocalMode}
            className="local-button"
            disabled={isLoading}
          >
            Mode Local
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Welcome;