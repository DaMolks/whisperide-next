import React from 'react';
import { Box, Typography } from '@mui/material';

// Placeholder component - will be implemented fully in next commit
const FileExplorer: React.FC = () => {
  return (
    <Box
      sx={{
        height: '100%',
        bgcolor: 'background.paper',
        borderRight: 1,
        borderColor: 'divider',
        p: 2
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        Explorateur de fichiers
      </Typography>
    </Box>
  );
};

export default FileExplorer;