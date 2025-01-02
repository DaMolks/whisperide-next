import React from 'react';
import { Box, Typography } from '@mui/material';

// Placeholder component - will be implemented fully in next commit
const AIChat: React.FC = () => {
  return (
    <Box
      sx={{
        width: '300px',
        bgcolor: 'background.paper',
        borderTop: 1,
        borderLeft: 1,
        borderColor: 'divider',
        p: 2
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        Chat IA
      </Typography>
    </Box>
  );
};

export default AIChat;