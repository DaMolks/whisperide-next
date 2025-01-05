import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material';
import {
  FolderOutlined,
  InsertDriveFileOutlined,
  Add,
  Delete,
  Refresh,
  ChevronRight,
  ExpandMore
} from '@mui/icons-material';
import type { FileEntry } from '@shared/types';
import './FileExplorer.css';

interface FileExplorerProps {
  projectPath: string;
  onFileSelect: (filePath: string) => void;
}

interface FileTreeItemProps {
  entry: FileEntry;
  level: number;
  selected: string | null;
  onSelect: (path: string) => void;
  onContextMenu: (event: React.MouseEvent, entry: FileEntry) => void;
}

const FileTreeItem: React.FC<FileTreeItemProps> = ({
  entry,
  level,
  selected,
  onSelect,
  onContextMenu
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  return (
    <Box className="file-tree-item">
      <Box
        className={`file-item ${selected === entry.path ? 'selected' : ''}`}
        onClick={() => onSelect(entry.path)}
        onContextMenu={(e) => onContextMenu(e, entry)}
        sx={{ pl: level * 2 }}
      >
        {entry.type === 'directory' && (
          <IconButton
            size="small"
            onClick={handleExpandClick}
            sx={{ p: 0.5, mr: 0.5 }}
          >
            {expanded ? <ExpandMore /> : <ChevronRight />}
          </IconButton>
        )}
        {entry.type === 'directory' ? <FolderOutlined /> : <InsertDriveFileOutlined />}
        <Typography className="file-name" variant="body2">
          {entry.name}
        </Typography>
        {entry.gitStatus && (
          <Box
            className={`git-status ${entry.gitStatus}`}
            title={entry.gitStatus}
          />
        )}
      </Box>
      {entry.type === 'directory' && expanded && entry.children && (
        <Box className="children">
          {entry.children.map((child) => (
            <FileTreeItem
              key={child.path}
              entry={child}
              level={level + 1}
              selected={selected}
              onSelect={onSelect}
              onContextMenu={onContextMenu}
            />
          ))
        </Box>
      )}
    </Box>
  );
};

export const FileExplorer: React.FC<FileExplorerProps> = ({
  projectPath,
  onFileSelect
}) => {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    entry?: FileEntry;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newFileDialog, setNewFileDialog] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [createType, setCreateType] = useState<'file' | 'directory'>('file');

  // ... [rest of the code remains unchanged] ...

};

export default FileExplorer;