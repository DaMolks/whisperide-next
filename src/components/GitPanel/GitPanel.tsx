import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tab,
  Tabs
} from '@mui/material';
import {
  Add,
  Remove,
  Refresh,
  Commit,
  AccountTreeOutlined,
  History,
  CompareArrows
} from '@mui/icons-material';
import { GitStatus, GitBranch, GitCommitInfo } from '@shared/types/git';
import type { FileEntry } from '@shared/types';
import './GitPanel.css';

interface GitPanelProps {
  projectPath: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <Box
    role="tabpanel"
    hidden={value !== index}
    sx={{ flex: 1, overflow: 'auto' }}
  >
    {value === index && children}
  </Box>
);

const ChangesList: React.FC<{
  title: string;
  changes: string[];
  onAction: (file: string) => Promise<void>;
  actionIcon: React.ReactNode;
  loading: boolean;
}> = ({ title, changes, onAction, actionIcon, loading }) => (
  <Box>
    {changes.length > 0 && (
      <>
        <Typography variant="subtitle2" sx={{ mt: 1, mb: 0.5 }}>{title}</Typography>
        <List dense>
          {changes.map((file) => (
            <ListItem key={file} sx={{ px: 1 }}>
              <ListItemText primary={file} />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  size="small"
                  onClick={() => onAction(file)}
                  disabled={loading}
                >
                  {actionIcon}
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </>
    )}
  </Box>
);
