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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to load git status:', error);
      setError(`Erreur lors du chargement du statut Git : ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const loadBranches = async () => {
    try {
      const gitBranches = await window.electron.git.getBranches(projectPath);
      setBranches(gitBranches);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to load branches:', error);
      setError(`Erreur lors du chargement des branches : ${errorMessage}`);
    }
  };

  const loadCommits = async () => {
    try {
      const gitCommits = await window.electron.git.getCommitHistory(projectPath);
      setCommits(gitCommits);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to load commits:', error);
      setError(`Erreur lors du chargement de l'historique : ${errorMessage}`);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await loadStatus();
      await loadBranches();
      await loadCommits();
    };
    loadData();
  }, [projectPath]);

  const handleStage = async (file: string) => {
    try {
      setLoading(true);
      await window.electron.git.stage(projectPath, [file]);
      await loadStatus();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to stage file:', error);
      setError(`Erreur lors du staging : ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUnstage = async (file: string) => {
    try {
      setLoading(true);
      await window.electron.git.unstage(projectPath, [file]);
      await loadStatus();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to unstage file:', error);
      setError(`Erreur lors du unstaging : ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCommit = async () => {
    if (!commitMessage.trim()) return;

    try {
      setLoading(true);
      await window.electron.git.commit(projectPath, commitMessage);
      setCommitMessage('');
      await loadStatus();
      await loadCommits();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to commit:', error);
      setError(`Erreur lors du commit : ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBranch = async () => {
    if (!newBranchName.trim()) return;

    try {
      setLoading(true);
      await window.electron.git.createBranch(projectPath, newBranchName);
      setNewBranchDialog(false);
      setNewBranchName('');
      await loadBranches();
      await loadStatus();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to create branch:', error);
      setError(`Erreur lors de la création de la branche : ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (branch: string) => {
    try {
      setLoading(true);
      await window.electron.git.checkout(projectPath, branch);
      await loadBranches();
      await loadStatus();
      await loadCommits();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to checkout branch:', error);
      setError(`Erreur lors du changement de branche : ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="git-panel">
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={selectedTab}
          onChange={(_, newValue) => setSelectedTab(newValue)}
          variant="fullWidth"
        >
          <Tab icon={<CompareArrows />} label="Changements" />
          <Tab icon={<AccountTreeOutlined />} label="Branches" />
          <Tab icon={<History />} label="Historique" />
        </Tabs>
      </Box>

      <TabPanel value={selectedTab} index={0}>
        {status && (
          <>
            <ChangesList
              title="Fichiers stagés"
              changes={status.staged}
              onAction={handleUnstage}
              actionIcon={<Remove />}
              loading={loading}
            />
            <ChangesList
              title="Fichiers modifiés"
              changes={status.modified}
              onAction={handleStage}
              actionIcon={<Add />}
              loading={loading}
            />
            <ChangesList
              title="Fichiers non suivis"
              changes={status.untracked}
              onAction={handleStage}
              actionIcon={<Add />}
              loading={loading}
            />
            {(status.staged.length > 0 || status.modified.length > 0) && (
              <Box sx={{ mt: 2, px: 1 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Message de commit"
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  disabled={loading}
                  sx={{
                    mb: 1,
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.23)'
                      }
                    }
                  }}
                />
                <Button
                  variant="contained"
                  startIcon={<Commit />}
                  onClick={handleCommit}
                  disabled={loading || !commitMessage.trim()}
                  fullWidth
                >
                  Commit
                </Button>
              </Box>
            )}
          </>
        )}
      </TabPanel>

      <TabPanel value={selectedTab} index={1}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Add />}
            onClick={() => setNewBranchDialog(true)}
            disabled={loading}
          >
            Nouvelle branche
          </Button>
        </Box>
        <List dense>
          {branches.map((branch) => (
            <ListItem
              key={branch.name}
              selected={branch.current}
              sx={{
                px: 1,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <ListItemText
                primary={branch.name}
                secondary={branch.remoteTracking}
              />
              {!branch.current && (
                <ListItemSecondaryAction>
                  <Button
                    size="small"
                    onClick={() => handleCheckout(branch.name)}
                    disabled={loading}
                  >
                    Checkout
                  </Button>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          ))}
        </List>
      </TabPanel>

      <TabPanel value={selectedTab} index={2}>
        <List dense>
          {commits.map((commit) => (
            <ListItem key={commit.hash} sx={{ px: 1 }}>
              <ListItemText
                primary={commit.message}
                secondary={
                  <>
                    {commit.author} · {new Date(commit.date).toLocaleString()}
                    <br />
                    <Typography
                      variant="caption"
                      sx={{ fontFamily: 'monospace' }}
                    >
                      {commit.hash.slice(0, 7)}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </TabPanel>

      {error && (
        <Typography
          color="error"
          sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: 1 }}
        >
          {error}
        </Typography>
      )}

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