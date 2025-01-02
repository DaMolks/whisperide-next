import React from 'react';
import { Box, Typography } from '@mui/material';

const Terminal: React.FC = () => {
  return (
    <Box
      sx={{
        height: '100%',
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        p: 2
      }}
    >
      <Typography variant="subtitle2">
        Terminal
      </Typography>
    </Box>
  );
};

export default Terminal;