import React from 'react';
import { Box, Typography } from '@mui/material';

// Placeholder component - will be implemented fully in next commit
const Editor: React.FC = () => {
  return (
    <Box
      sx={{
        height: '100%',
        bgcolor: 'background.default',
        p: 2
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        Éditeur
      </Typography>
    </Box>
  );
};

export default Editor;