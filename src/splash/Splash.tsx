import React, { useEffect, useState } from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import '../styles/Splash.css';

const steps = [
  'Initialisation...',
  'Vérification...',
  'Configuration...',
  'Démarrage...'
];

const Splash: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let startTime = Date.now();
    const duration = 3000; // 3 secondes au total

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      const stepIndex = Math.min(
        Math.floor((newProgress / 100) * steps.length),
        steps.length - 1
      );
      setCurrentStep(stepIndex);

      if (newProgress < 100) {
        requestAnimationFrame(updateProgress);
      }
    };

    requestAnimationFrame(updateProgress);
  }, []);

  return (
    <Box className="splash-container">
      <Box className="splash-content">
        <Typography variant="h3" className="splash-title">
          WhisperIDE Next
        </Typography>

        <Box className="splash-progress">
          <Box className="progress-bar-container">
            <LinearProgress
              variant="determinate"
              value={progress}
            />
            <Typography variant="body2" className="splash-step">
              {steps[currentStep]}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Splash;