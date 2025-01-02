import React, { useEffect, useState } from 'react';
import { Box, LinearProgress, Typography, keyframes } from '@mui/material';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Steps = [
  'Vérification de l\'environnement...',
  'Chargement des configurations...',
  'Initialisation...',
  'Démarrage de WhisperIDE...'
];

const Splash: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      if (currentProgress >= 100) {
        clearInterval(interval);
        return;
      }

      currentProgress += 2;
      setProgress(currentProgress);
      setCurrentStep(Math.floor((currentProgress / 100) * Steps.length));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        height: '100vh',
        background: 'radial-gradient(circle at center, #2c3e50 0%, #1a1a1a 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
        color: 'white',
        animation: `${fadeIn} 0.5s ease-out`
      }}
    >
      <Typography 
        variant="h3" 
        sx={{ 
          mb: 4,
          fontWeight: 'bold',
          letterSpacing: 2,
          textShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}
      >
        WhisperIDE
      </Typography>
      
      <Box sx={{ width: '80%', maxWidth: 400 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 6,
            borderRadius: 3,
            backgroundColor: 'rgba(255,255,255,0.1)',
            '.MuiLinearProgress-bar': {
              backgroundColor: '#3498db',
              transition: 'transform 0.2s linear'
            }
          }}
        />
      </Box>

      <Typography 
        sx={{ 
          mt: 2,
          opacity: 0.8,
          minHeight: 24,
          textAlign: 'center'
        }}
      >
        {Steps[currentStep]}
      </Typography>
    </Box>
  );
};

export default Splash;