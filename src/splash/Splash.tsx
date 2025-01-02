import React, { useEffect, useState } from 'react';
import '../styles/Splash.css';

const steps = [
  'Initialisation de l\'environnement...',
  'Vérification des dépendances...',
  'Chargement des plugins...',
  'Configuration de l\'IA...',
  'Préparation de l\'interface...'
];

const Splash: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const incrementProgress = () => {
      setProgress(prev => {
        if (prev >= 100) return prev;
        const next = prev + 1;
        const stepIndex = Math.floor((next / 100) * steps.length);
        if (stepIndex !== currentStep) {
          setCurrentStep(stepIndex);
        }
        return next;
      });
    };

    const interval = setInterval(incrementProgress, 30);
    return () => clearInterval(interval);
  }, [currentStep]);

  return (
    <div className="splash-container">
      <div className="logo">
        <svg width="80" height="80" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="2" />
          <text x="50" y="55" textAnchor="middle" fill="white" fontSize="20">W</text>
        </svg>
      </div>
      
      <h1 style={{
        fontSize: '2rem',
        margin: '0 0 2rem 0',
        fontWeight: 300,
        letterSpacing: '0.1em'
      }}>
        WhisperIDE
      </h1>

      <div className="progress-container">
        <div 
          className="progress-bar"
          style={{ width: `${progress}%` }}
        >
          <div className="progress-glow" />
        </div>
      </div>

      <div className="status-text" style={{
        animationDelay: '0.3s'
      }}>
        {steps[currentStep]}
      </div>
    </div>
  );
};

export default Splash;