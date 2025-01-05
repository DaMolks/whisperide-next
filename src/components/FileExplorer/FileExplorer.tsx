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

// ... [previous code remains the same] ...

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
  
  // ... [rest of the code remains the same] ...
};

export default FileExplorer;