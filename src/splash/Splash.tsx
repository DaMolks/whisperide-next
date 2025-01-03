import React, { useEffect, useState } from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import '../styles/Splash.css';
import '../styles/shared.css';

const steps = [
  'Initialisation...',
  'Vérification...',
  'Configuration...',
  'Démarrage...'
];

const Splash: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let startTime = Date.now();
    const duration = 3000;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      const stepIndex = Math.min(
        Math.floor((newProgress / 100) * steps.length),
        steps.length - 1
      );
      setCurrentStep(stepIndex);

      if (newProgress === 100) {
        setIsComplete(true);
      } else {
        requestAnimationFrame(updateProgress);
      }
    };

    requestAnimationFrame(updateProgress);
  }, []);

  return (
    <Box className={`splash-container gradient-background ${isComplete ? 'complete' : ''}`}>
      <Box className="splash-content">
        <Typography variant="h2" className="splash-title">
          WhisperIDE Next
        </Typography>
      </Box>
      
      <Box className="splash-progress">
        <LinearProgress
          variant="determinate"
          value={progress}
        />
      </Box>
    </Box>
  );
};

export default Splash;