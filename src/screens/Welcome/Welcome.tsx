import React, { useState } from 'react';
import { Box, Typography, Button, IconButton, CircularProgress } from '@mui/material';
import { GitHub, Close, Remove } from '@mui/icons-material';
import './Welcome.css';

interface WelcomeProps {
  onGitHubLogin: (token: string) => void;
  onLocalMode: () => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onGitHubLogin, onLocalMode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    window.electron?.close();
  };

  const handleMinimize = () => {
    window.electron?.minimize();
  };

  const handleGitHubClick = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = await window.electron.githubAuth.login();
      onGitHubLogin(token);
    } catch (err) {
      console.error('GitHub auth error:', err);
      setError('Erreur lors de la connexion à GitHub');
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
          WhisperIDE
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

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