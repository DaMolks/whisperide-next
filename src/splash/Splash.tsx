import React, { useEffect, useState } from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import '../styles/Splash.css';

const steps = [
  'Initialisation de l\'environnement...',
  'Vérification des dépendances...',
  'Chargement des configurations...',
  'Démarrage des services...'
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

      // Met à jour l'étape en fonction du progrès
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
        <div className="splash-logo">
          <svg width="80" height="80" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
            <text x="50" y="55" textAnchor="middle" fill="currentColor" fontSize="24" fontFamily="Inter">
              W
            </text>
          </svg>
        </div>

        <Typography variant="h4" className="splash-title">
          WhisperIDE
        </Typography>

        <Box className="splash-progress">
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              width: '300px',
              height: '4px',
              borderRadius: '2px',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              '& .MuiLinearProgress-bar': {
                bgcolor: '#3498db'
              }
            }}
          />
        </Box>

        <Typography variant="body2" className="splash-step">
          {steps[currentStep]}
        </Typography>
      </Box>
    </Box>
  );
};

export default Splash;