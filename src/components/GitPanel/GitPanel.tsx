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
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs
} from '@mui/material';
import {
  Add,
  Remove,
  Refresh,
  Commit,
  BranchingOutlined,
  History,
  CompareArrows
} from '@mui/icons-material';
import {
  GitStatus,
  GitBranch,
  GitCommitInfo
} from '../../../electron/services/git';
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

  const loadGitInfo = async () => {
    if (!projectPath) return;
    await loadStatus();
    await loadBranches();
    await loadCommits();
  };

  const loadStatus = async () => {
    if (!projectPath) return;

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
    loadGitInfo();
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
      loadGitInfo();
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
      loadGitInfo();
    } catch (err) {
      console.error('Failed to create branch:', err);
      setError('Erreur lors de la création de la branche');
    }
  };

  const handleCheckout = async (branch: string) => {
    try {
      await window.electron.git.checkout(projectPath, branch);
      loadGitInfo();
    } catch (err) {
      console.error('Failed to checkout branch:', err);
      setError('Erreur lors du changement de branche');
    }
  };

  return (
    <Box className="git-panel">
      <Box className="git-panel-header">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="subtitle1" component="h2">
            Git
          </Typography>
          {status && (
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              sur {status.branch}
              {status.ahead > 0 && ` (${status.ahead} commits d'avance)`}
              {status.behind > 0 && ` (${status.behind} commits de retard)`}
            </Typography>
          )}
        </Box>
        <IconButton onClick={loadGitInfo} size="small" title="Actualiser">
          <Refresh />
        </IconButton>
      </Box>

      <Tabs
        value={selectedTab}
        onChange={(_, value) => setSelectedTab(value)}
        variant="fullWidth"
        className="git-tabs"
      >
        <Tab icon={<CompareArrows />} label="Changements" />
        <Tab icon={<BranchingOutlined />} label="Branches" />
        <Tab icon={<History />} label="Historique" />
      </Tabs>

      <TabPanel value={selectedTab} index={0}>
        <Box className="git-content">
          {status?.staged.length > 0 && (
            <>
              <Typography variant="subtitle2" className="section-title">
                Modifications indexées
              </Typography>
              <List dense>
                {status.staged.map(file => (
                  <ListItem key={file} button onClick={() => handleUnstage(file)}>
                    <ListItemText primary={file} />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" size="small" onClick={() => handleUnstage(file)}>
                        <Remove />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </>
          )}

          {(status?.modified.length > 0 || status?.untracked.length > 0) && (
            <>
              <Typography variant="subtitle2" className="section-title">
                Modifications non indexées
              </Typography>
              <List dense>
                {[...status?.modified || [], ...status?.untracked || []].map(file => (
                  <ListItem key={file} button onClick={() => handleStage(file)}>
                    <ListItemText primary={file} />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" size="small" onClick={() => handleStage(file)}>
                        <Add />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </>
          )}

          {status?.staged.length > 0 && (
            <Box className="commit-section">
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Message de commit"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                variant="outlined"
                size="small"
              />
              <Button
                fullWidth
                variant="contained"
                onClick={handleCommit}
                disabled={!commitMessage.trim()}
                startIcon={<Commit />}
                sx={{ mt: 1 }}
              >
                Commit
              </Button>
            </Box>
          )}
        </Box>
      </TabPanel>

      <TabPanel value={selectedTab} index={1}>
        <Box className="git-content">
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => setNewBranchDialog(true)}
            fullWidth
            sx={{ mb: 2 }}
          >
            Nouvelle branche
          </Button>

          <List dense>
            {branches.map((branch) => (
              <ListItem
                key={branch.name}
                button
                selected={branch.current}
                onClick={() => !branch.current && handleCheckout(branch.name)}
              >
                <ListItemIcon>
                  <BranchingOutlined />
                </ListItemIcon>
                <ListItemText
                  primary={branch.name}
                  secondary={branch.remoteTracking}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </TabPanel>

      <TabPanel value={selectedTab} index={2}>
        <Box className="git-content">
          <List dense>
            {commits.map((commit) => (
              <ListItem key={commit.hash}>
                <ListItemText
                  primary={commit.message}
                  secondary={
                    <>
                      <Typography variant="caption" component="span">
                        {commit.author} · {new Date(commit.date).toLocaleString()}
                      </Typography>
                      <br />
                      <Typography variant="caption" component="span" sx={{ opacity: 0.7 }}>
                        {commit.hash.substring(0, 7)}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </TabPanel>

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