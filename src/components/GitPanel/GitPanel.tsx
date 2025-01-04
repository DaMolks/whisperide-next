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
  AccountTreeOutlined,
  History,
  CompareArrows
} from '@mui/icons-material';
import {
  GitStatus,
  GitBranch,
  GitCommitInfo
} from '../../../electron/services/git';
import './GitPanel.css';

// ... [Code précédent inchangé jusqu'aux JSX renderings]

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
        <Tab icon={<AccountTreeOutlined />} label="Branches" />
        <Tab icon={<History />} label="Historique" />
      </Tabs>

      {/* ... [Reste du code inchangé] */}

      <List dense>
        {branches.map((branch) => (
          <ListItem
            key={branch.name}
            button
            selected={branch.current}
            onClick={() => !branch.current && handleCheckout(branch.name)}
          >
            <ListItemIcon>
              <AccountTreeOutlined />
            </ListItemIcon>
            <ListItemText
              primary={branch.name}
              secondary={branch.remoteTracking}
            />
          </ListItem>
        ))}
      </List>

      {/* ... [Reste du code inchangé] */}

    </Box>
  );
};

export default GitPanel;