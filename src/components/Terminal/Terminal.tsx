import React from 'react';
import { Box, Typography } from '@mui/material';

// Placeholder component - will be implemented fully in next commit
const Terminal: React.FC = () => {
  return (
    <Box
      sx={{
        flex: 1,
        bgcolor: 'background.paper',
        borderTop: 1,
        borderRight: 1,
        borderColor: 'divider',
        p: 2
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        Terminal
      </Typography>
    </Box>
  );
};

export default Terminal;