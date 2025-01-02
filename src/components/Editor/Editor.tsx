import React from 'react';
import { Box, Typography } from '@mui/material';

const Editor: React.FC = () => {
  return (
    <Box
      sx={{
        height: '100%',
        bgcolor: 'background.default',
        p: 2
      }}
    >
      <Typography variant="subtitle2">
        Éditeur
      </Typography>
    </Box>
  );
};

export default Editor;