import React, { useState } from 'react';
import { Box, Typography, IconButton, List } from '@mui/material';
import { Refresh } from '@mui/icons-material';
// ... rest of the imports

const FileExplorer: React.FC = () => {
  // ... existing code

  return (
    <Box
      sx={{
        height: '100%',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        borderRight: 1,
        borderColor: 'divider',
        pl: 1 // Ajout d'une marge à gauche
      }}
    >
      <Box
        sx={{
          p: 1,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant="subtitle2">
          Explorateur
        </Typography>
        <IconButton size="small">
          <Refresh fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ overflow: 'auto', flex: 1 }}>
        <List dense disablePadding>
          <FileTreeItem 
            node={mockData} 
            level={0}
            onSelect={handleSelect}
          />
        </List>
      </Box>
    </Box>
  );
};

export default FileExplorer;