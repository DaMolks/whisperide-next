import React, { useEffect, useState } from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

interface LoadingStep {
  label: string;
  action: () => Promise<void>;
}

export const Splash: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const loadingSteps: LoadingStep[] = [
    {
      label: 'Vérification des dépendances',
      action: async () => { /* TODO */ }
    },
    {
      label: 'Configuration de l\'environnement',
      action: async () => { /* TODO */ }
    },
    {
      label: 'Démarrage des services',
      action: async () => { /* TODO */ }
    }
  ];

  useEffect(() => {
    const executeSteps = async () => {
      for (let i = 0; i < loadingSteps.length; i++) {
        setCurrentStep(i);
        setProgress((i / loadingSteps.length) * 100);
        await loadingSteps[i].action();
      }
      setProgress(100);
    };
    executeSteps();
  }, []);

  return (
    <Box
      sx={{
        height: '100vh',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
        color: 'white'
      }}
    >
      <Typography variant="h3" sx={{ mb: 4 }}>
        WhisperIDE
      </Typography>
      
      <Box sx={{ width: '80%', maxWidth: 400 }}>
        <LinearProgress 
          variant="determinate" 
          value={progress}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: 'rgba(255,255,255,0.1)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#3498db'
            }
          }}
        />
      </Box>

      <Typography sx={{ mt: 2, opacity: 0.8 }}>
        {loadingSteps[currentStep]?.label}
      </Typography>
    </Box>
  );
};