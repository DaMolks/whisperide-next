import React, { useState } from 'react';
import { Box, Typography, IconButton, List, ListItem, ListItemIcon, ListItemText, Collapse } from '@mui/material';
import { ExpandMore, ExpandLess, Folder, FolderOpen, InsertDriveFile, Refresh } from '@mui/icons-material';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  path: string;
  expanded?: boolean;
}

const mockData: FileNode = {
  name: 'projet',
  type: 'folder',
  path: '/',
  expanded: true,
  children: [
    {
      name: 'src',
      type: 'folder',
      path: '/src',
      children: [
        { name: 'index.tsx', type: 'file', path: '/src/index.tsx' },
        { name: 'App.tsx', type: 'file', path: '/src/App.tsx' },
        {
          name: 'components',
          type: 'folder',
          path: '/src/components',
          children: [
            { name: 'FileExplorer.tsx', type: 'file', path: '/src/components/FileExplorer.tsx' },
            { name: 'Editor.tsx', type: 'file', path: '/src/components/Editor.tsx' }
          ]
        }
      ]
    },
    { name: 'package.json', type: 'file', path: '/package.json' },
    { name: 'README.md', type: 'file', path: '/README.md' }
  ]
};

const FileTreeItem: React.FC<{ node: FileNode; level: number; onSelect: (path: string) => void }> = ({ 
  node, 
  level,
  onSelect 
}) => {
  const [expanded, setExpanded] = useState(node.expanded || false);

  const handleClick = () => {
    if (node.type === 'folder') {
      setExpanded(!expanded);
    } else {
      onSelect(node.path);
    }
  };

  const getFileIcon = () => {
    if (node.type === 'folder') {
      return expanded ? <FolderOpen color="primary" /> : <Folder color="primary" />;
    }
    return <InsertDriveFile />;
  };

  return (
    <>
      <ListItem
        button
        onClick={handleClick}
        sx={{
          pl: level * 2,
          py: 0.5,
          minHeight: 32,
          '&:hover': {
            bgcolor: 'action.hover'
          }
        }}
      >
        <ListItemIcon sx={{ minWidth: 32 }}>
          {getFileIcon()}
        </ListItemIcon>
        <ListItemText 
          primary={node.name}
          primaryTypographyProps={{
            sx: {
              fontSize: '0.9rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }
          }}
        />
        {node.type === 'folder' && node.children?.length > 0 && (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        )}
      </ListItem>

      {node.type === 'folder' && (
        <Collapse in={expanded} timeout="auto">
          <List disablePadding>
            {node.children?.map((child, index) => (
              <FileTreeItem 
                key={child.path} 
                node={child} 
                level={level + 1}
                onSelect={onSelect}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

const FileExplorer: React.FC = () => {
  const handleSelect = (path: string) => {
    console.log('Selected:', path);
    // TODO: Implémenter l'ouverture de fichier
  };

  return (
    <Box
      sx={{
        height: '100%',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        borderRight: 1,
        borderColor: 'divider'
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