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
import { GitStatus, GitBranch, GitCommitInfo } from '@shared/types';
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

export const GitPanel: React.FC<GitPanelProps> = ({ projectPath }) => {
  const [status, setStatus] = useState<GitStatus | null>(null);
  const [branches, setBranches] = useState<GitBranch[]>([]);
  const [commits, setCommits] = useState<GitCommitInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [commitMessage, setCommitMessage] = useState('');
  const [newBranchDialog, setNewBranchDialog] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);

  const loadStatus = async () => {
    try {
      setLoading(true);
      const gitStatus = await window.electron.git.getStatus(projectPath);
      setStatus(gitStatus);
      setError(null);
    } catch (err) {
      console.error('Failed to load git status:', err);
      setError('Erreur lors du chargement du status Git');
    } finally {
      setLoading(false);
    }
  };

  const loadBranches = async () => {
    try {
      const gitBranches = await window.electron.git.getBranches(projectPath);
      setBranches(gitBranches);
    } catch (err) {
      console.error('Failed to load branches:', err);
    }
  };

  const loadCommits = async () => {
    try {
      const gitCommits = await window.electron.git.getCommitHistory(projectPath);
      setCommits(gitCommits);
    } catch (err) {
      console.error('Failed to load commits:', err);
    }
  };

  useEffect(() => {
    loadStatus();
    loadBranches();
    loadCommits();
  }, [projectPath]);

  const handleStage = async (file: string) => {
    try {
      await window.electron.git.stage(projectPath, [file]);
      loadStatus();
    } catch (err) {
      console.error('Failed to stage file:', err);
      setError('Erreur lors du staging');
    }
  };

  const handleUnstage = async (file: string) => {
    try {
      await window.electron.git.unstage(projectPath, [file]);
      loadStatus();
    } catch (err) {
      console.error('Failed to unstage file:', err);
      setError('Erreur lors du unstaging');
    }
  };

  const handleCommit = async () => {
    if (!commitMessage.trim()) return;

    try {
      await window.electron.git.commit(projectPath, commitMessage);
      setCommitMessage('');
      loadStatus();
      loadCommits();
    } catch (err) {
      console.error('Failed to commit:', err);
      setError('Erreur lors du commit');
    }
  };

  const handleCreateBranch = async () => {
    if (!newBranchName.trim()) return;

    try {
      await window.electron.git.createBranch(projectPath, newBranchName);
      setNewBranchDialog(false);
      setNewBranchName('');
      loadBranches();
      loadStatus();
    } catch (err) {
      console.error('Failed to create branch:', err);
      setError('Erreur lors de la création de la branche');
    }
  };

  const handleCheckout = async (branch: string) => {
    try {
      await window.electron.git.checkout(projectPath, branch);
      loadBranches();
      loadStatus();
      loadCommits();
    } catch (err) {
      console.error('Failed to checkout branch:', err);
      setError('Erreur lors du changement de branche');
    }
  };

  // ... [previous render code] ...

  return (
    <Box className="git-panel">
      {/* ... [previous JSX code] ... */}
      <Dialog
        open={newBranchDialog}
        onClose={() => setNewBranchDialog(false)}
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(30, 30, 30, 0.95)',
            color: 'white',
            p: 2
          }
        }}
      >
        <DialogTitle>Nouvelle branche</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom de la branche"
            fullWidth
            value={newBranchName}
            onChange={(e) => setNewBranchName(e.target.value)}
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
          <Button
            onClick={() => setNewBranchDialog(false)}
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Annuler
          </Button>
          <Button
            onClick={handleCreateBranch}
            variant="contained"
            disabled={!newBranchName.trim()}
          >
            Créer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GitPanel;