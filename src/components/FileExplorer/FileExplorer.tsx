import React, { useState } from 'react';
import { Box, Typography, IconButton, List } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import FileTreeItem, { FileTreeNode } from './FileTreeItem';

// Mock data for initial development
const mockData: FileTreeNode = {
  name: 'Projet WhisperIDE',
  type: 'folder',
  children: [
    { name: 'src', type: 'folder', children: [
      { name: 'components', type: 'folder', children: [
        { name: 'FileExplorer', type: 'file' },
        { name: 'Editor', type: 'file' }
      ]},
      { name: 'index.tsx', type: 'file' }
    ]},
    { name: 'package.json', type: 'file' },
    { name: 'README.md', type: 'file' }
  ]
};

const FileExplorer: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<FileTreeNode | null>(null);

  const handleSelect = (node: FileTreeNode) => {
    setSelectedNode(node);
    console.log('Selected:', node);
  };

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