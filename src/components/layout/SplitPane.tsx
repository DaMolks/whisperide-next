import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import './SplitPane.css';

interface SplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  direction?: 'horizontal' | 'vertical';
  defaultSplit?: number;
  minSize?: number;
}

const SplitPane: React.FC<SplitPaneProps> = ({
  left,
  right,
  direction = 'horizontal',
  defaultSplit = 0.25,
  minSize = 100,
}) => {
  const [split, setSplit] = useState(defaultSplit);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const container = document.getElementById('split-container');
      if (!container) return;

      const { left: containerLeft, width: containerWidth, top: containerTop, height: containerHeight } = container.getBoundingClientRect();

      let newSplit;
      if (direction === 'horizontal') {
        newSplit = (e.clientX - containerLeft) / containerWidth;
      } else {
        newSplit = (e.clientY - containerTop) / containerHeight;
      }

      // Limite le split en fonction de minSize
      const minSplit = minSize / (direction === 'horizontal' ? containerWidth : containerHeight);
      newSplit = Math.max(minSplit, Math.min(1 - minSplit, newSplit));

      setSplit(newSplit);
    },
    [isDragging, direction, minSize]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <Box
      id="split-container"
      sx={{
        display: 'flex',
        flexDirection: direction === 'horizontal' ? 'row' : 'column',
        height: '100%',
        width: '100%',
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          width: direction === 'horizontal' ? `${split * 100}%` : '100%',
          height: direction === 'vertical' ? `${split * 100}%` : '100%',
          overflow: 'hidden',
          flexShrink: 0
        }}
      >
        {left}
      </Box>

      <Box
        sx={{
          width: direction === 'horizontal' ? '4px' : '100%',
          height: direction === 'vertical' ? '4px' : '100%',
          backgroundColor: isDragging ? 'primary.main' : 'divider',
          cursor: direction === 'horizontal' ? 'col-resize' : 'row-resize',
          flexShrink: 0
        }}
        onMouseDown={handleMouseDown}
      />

      <Box
        sx={{
          width: direction === 'horizontal' ? `${(1 - split) * 100}%` : '100%',
          height: direction === 'vertical' ? `${(1 - split) * 100}%` : '100%',
          overflow: 'hidden',
          flexShrink: 0
        }}
      >
        {right}
      </Box>
    </Box>
  );
};

export default SplitPane;