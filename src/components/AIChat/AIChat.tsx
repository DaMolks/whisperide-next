import React from 'react';
import { Box, Typography } from '@mui/material';

const AIChat: React.FC = () => {
  return (
    <Box
      sx={{
        height: '100%',
        bgcolor: 'background.paper',
        borderLeft: 1,
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
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