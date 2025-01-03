import React from 'react';
import { Box } from '@mui/material';

const FileExplorer: React.FC = () => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        bgcolor: 'background.paper',
        borderRight: 1,
        borderColor: 'divider',
        p: 2
      }}
    >
      Explorateur
    </Box>
  );
};

export default FileExplorer;