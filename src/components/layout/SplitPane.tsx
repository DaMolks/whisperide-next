import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import './SplitPane.css';

interface SplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  defaultSplit?: number;
  minSize?: number;
  direction?: 'horizontal' | 'vertical';
}

const SplitPane: React.FC<SplitPaneProps> = ({
  left,
  right,
  defaultSplit = 0.25,
  minSize = 200,
  direction = 'horizontal'
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [split, setSplit] = useState(defaultSplit);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const container = document.getElementById('split-container');
    if (!container) return;

    const { left: containerLeft, width: containerWidth } = container.getBoundingClientRect();
    let newSplit = (e.clientX - containerLeft) / containerWidth;
    
    // Limit split based on minSize
    const minSplit = minSize / containerWidth;
    const maxSplit = 1 - minSplit;
    newSplit = Math.max(minSplit, Math.min(maxSplit, newSplit));

    setSplit(newSplit);
  }, [isDragging, minSize]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <Box
      id="split-container"
      sx={{
        display: 'flex',
        flexDirection: direction === 'horizontal' ? 'row' : 'column',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        bgcolor: 'background.default'
      }}
    >
      <Box
        sx={{
          width: direction === 'horizontal' ? `${split * 100}%` : '100%',
          height: direction === 'horizontal' ? '100%' : `${split * 100}%`,
          overflow: 'auto'
        }}
      >
        {left}
      </Box>

      <Box
        className="split-handler"
        sx={{
          position: 'relative',
          cursor: direction === 'horizontal' ? 'col-resize' : 'row-resize',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: direction === 'horizontal' ? 0 : '50%',
            left: direction === 'horizontal' ? '50%' : 0,
            transform: direction === 'horizontal' ? 
              'translateX(-50%)' : 'translateY(-50%)',
            width: direction === 'horizontal' ? '1px' : '100%',
            height: direction === 'horizontal' ? '100%' : '1px',
            bgcolor: 'divider',
            transition: 'background-color 0.2s'
          },
          '&:hover::after': {
            bgcolor: 'primary.main'
          }
        }}
        onMouseDown={handleMouseDown}
      />

      <Box
        sx={{
          width: direction === 'horizontal' ? `${(1 - split) * 100}%` : '100%',
          height: direction === 'horizontal' ? '100%' : `${(1 - split) * 100}%`,
          overflow: 'auto'
        }}
      >
        {right}
      </Box>
    </Box>
  );
};

export default SplitPane;