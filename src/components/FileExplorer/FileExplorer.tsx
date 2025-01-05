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

// Continuation du fichier précédent...

  const handleCreateConfirm = async () => {
    if (!newFileName) return;

    try {
      const basePath = contextMenu?.entry?.type === 'directory'
        ? contextMenu.entry.path
        : projectPath;

      const fullPath = `${basePath}/${newFileName}`;

      if (createType === 'file') {
        await window.electron.files.createFile(fullPath);
      } else {
        await window.electron.files.createDirectory(fullPath);
      }

      setNewFileDialog(false);
      loadFiles();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Failed to create:', err);
      setError(`Erreur lors de la création ${createType === 'file' ? 'du fichier' : 'du dossier'}: ${errorMessage}`);
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
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Failed to delete:', err);
      setError(`Erreur lors de la suppression: ${errorMessage}`);
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