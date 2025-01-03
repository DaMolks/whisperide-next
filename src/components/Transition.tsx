import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';

interface TransitionProps {
  children: React.ReactNode;
  show: boolean;
  onComplete?: () => void;
}

const Transition: React.FC<TransitionProps> = ({ children, show, onComplete }) => {
  const [stage, setStage] = useState<'enter' | 'leave' | 'complete'>('enter');

  useEffect(() => {
    if (!show && stage === 'enter') {
      setStage('leave');
    }
  }, [show, stage]);

  const handleAnimationEnd = () => {
    if (stage === 'leave') {
      setStage('complete');
      onComplete?.();
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        animation: `${stage === 'enter' ? 'fadeIn' : 'fadeOut'} 0.5s ease-in-out forwards`,
        zIndex: 1000
      }}
      onAnimationEnd={handleAnimationEnd}
    >
      {children}
    </Box>
  );
};

export default Transition;