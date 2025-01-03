import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { GitHub } from '@mui/icons-material';
import './Welcome.css';

interface WelcomeProps {
  onGitHubLogin: () => void;
  onLocalMode: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onGitHubLogin, onLocalMode }) => {
  return (
    <Box className="welcome-container">
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