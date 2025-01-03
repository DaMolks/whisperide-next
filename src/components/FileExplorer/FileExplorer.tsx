import React from 'react';
import { Box, Typography } from '@mui/material';

const FileExplorer: React.FC = () => {
  return (
    <Box
      sx={{
        height: '100%',
        bgcolor: 'background.paper',
        borderRight: 1,
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        minWidth: '250px'
      }}
    >
      <Box
        sx={{
          p: 1,
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        <Typography variant="subtitle2">Explorer</Typography>
      </Box>
      <Box sx={{ p: 1, flex: 1, overflow: 'auto' }}>
        {/* Contenu de l'explorateur */}
      </Box>
    </Box>
  );
};