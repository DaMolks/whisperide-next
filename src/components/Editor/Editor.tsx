import React from 'react';
import { Box } from '@mui/material';

const Editor: React.FC = () => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        bgcolor: '#1e1e1e',
        color: 'text.primary',
        overflow: 'hidden'
      }}
    >
      Éditeur
    </Box>
  );
};

export default Editor;