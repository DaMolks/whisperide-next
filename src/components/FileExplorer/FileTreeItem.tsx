import React, { useState } from 'react';
import { ListItem, ListItemIcon, ListItemText, Collapse, List } from '@mui/material';
import { Folder, FolderOpen, InsertDriveFile } from '@mui/icons-material';

export interface FileTreeNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileTreeNode[];
}

interface FileTreeItemProps {
  node: FileTreeNode;
  level?: number;
  onSelect?: (node: FileTreeNode) => void;
}

const FileTreeItem: React.FC<FileTreeItemProps> = ({ node, level = 0, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    if (node.type === 'folder') {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = () => {
    onSelect?.(node);
  };

  const renderIcon = () => {
    if (node.type === 'folder') {
      return isOpen ? <FolderOpen /> : <Folder />;
    }
    return <InsertDriveFile />;
  };

  return (
    <>
      <ListItem
        button
        onClick={handleToggle}
        sx={{ 
          pl: 1 + level * 2, 
          '&:hover': { backgroundColor: 'action.hover' } 
        }}
      >
        <ListItemIcon>{renderIcon()}</ListItemIcon>
        <ListItemText primary={node.name} />
      </ListItem>

      {node.type === 'folder' && node.children && (
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {node.children.map((child, index) => (
              <FileTreeItem
                key={`${child.name}-${index}`}
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

export default FileTreeItem;