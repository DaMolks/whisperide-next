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
import { FileEntry } from '@shared/types';
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
          )}
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

  useEffect(() => {
    loadFiles();
  }, [projectPath]);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const fileList = await window.electron.files.list(projectPath);
      setFiles(fileList);
      setError(null);
    } catch (err) {
      console.error('Failed to load files:', err);
      setError('Erreur lors du chargement des fichiers');
    } finally {
      setLoading(false);
    }
  };

  const handleContextMenu = (
    event: React.MouseEvent,
    entry: FileEntry
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX,
            mouseY: event.clientY,
            entry
          }
        : null
    );
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const handleSelect = (path: string) => {
    setSelectedPath(path);
    onFileSelect(path);
  };

  const handleCreate = (type: 'file' | 'directory') => {
    setCreateType(type);
    setNewFileName('');
    setNewFileDialog(true);
    handleClose();
  };

  const handleCreateConfirm = async () => {
    if (!newFileName) return;

    try {
      const basePath = contextMenu?.entry?.type === 'directory'
        ? contextMenu.entry.path
        : projectPath;
      const fullPath = path.join(basePath, newFileName);

      if (createType === 'file') {
        await window.electron.files.createFile(fullPath);
      } else {
        await window.electron.files.createDirectory(fullPath);
      }

      setNewFileDialog(false);
      loadFiles();
    } catch (err) {
      console.error('Failed to create:', err);
      setError(`Erreur lors de la création ${createType === 'file' ? 'du fichier' : 'du dossier'}`);
    }
  };

  const handleDelete = async () => {
    if (!contextMenu?.entry) return;

    try {
      await window.electron.files.delete(contextMenu.entry.path);
      handleClose();
      loadFiles();
      if (selectedPath === contextMenu.entry.path) {
        setSelectedPath(null);
      }
    } catch (err) {
      console.error('Failed to delete:', err);
      setError('Erreur lors de la suppression');
    }
  };

  return (
    <Box className="file-explorer">
      <Box className="file-explorer-header">
        <Typography variant="subtitle1" component="h2">
          Explorateur
        </Typography>
        <IconButton onClick={loadFiles} size="small" title="Actualiser">
          <Refresh />
        </IconButton>
      </Box>

      <Box className="file-explorer-content">
        {loading ? (
          <Typography variant="body2" className="message">
            Chargement...
          </Typography>
        ) : error ? (
          <Typography variant="body2" color="error" className="message">
            {error}
          </Typography>
        ) : files.length === 0 ? (
          <Typography variant="body2" className="message">
            Aucun fichier
          </Typography>
        ) : (
          files.map((entry) => (
            <FileTreeItem
              key={entry.path}
              entry={entry}
              level={0}
              selected={selectedPath}
              onSelect={handleSelect}
              onContextMenu={handleContextMenu}
            />
          ))
        )}
      </Box>

      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={() => handleCreate('file')}>
          <InsertDriveFileOutlined sx={{ mr: 1 }} /> Nouveau fichier
        </MenuItem>
        <MenuItem onClick={() => handleCreate('directory')}>
          <FolderOutlined sx={{ mr: 1 }} /> Nouveau dossier
        </MenuItem>
        {contextMenu?.entry && (
          <MenuItem onClick={handleDelete}>
            <Delete sx={{ mr: 1 }} /> Supprimer
          </MenuItem>
        )}
      </Menu>

      <Dialog
        open={newFileDialog}
        onClose={() => setNewFileDialog(false)}
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(30, 30, 30, 0.95)',
            color: 'white',
            p: 2
          }
        }}
      >
        <DialogTitle>
          {createType === 'file' ? 'Nouveau fichier' : 'Nouveau dossier'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom"
            fullWidth
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.23)'
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)'
                }
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)'
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewFileDialog(false)} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Annuler
          </Button>
          <Button onClick={handleCreateConfirm} variant="contained">
            Créer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FileExplorer;