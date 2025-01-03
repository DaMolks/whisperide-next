import React from 'react';
import { Box } from '@mui/material';

const AIChat: React.FC = () => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        bgcolor: 'background.paper',
        borderLeft: 1,
        borderColor: 'divider',
        p: 2
      }}
    >
      Chat IA
    </Box>
  );
};

export default AIChat;