import React from 'react';
import { Box } from '@mui/material';

const Terminal: React.FC = () => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        bgcolor: '#1a1a1a',
        color: 'text.primary',
        p: 2,
        fontFamily: 'monospace'
      }}
    >
      Terminal
    </Box>
  );
};

export default Terminal;