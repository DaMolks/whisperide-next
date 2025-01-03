import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Tooltip 
} from '@mui/material';
import { 
  Code as CodeIcon,
  Lock as LockIcon,
  Public as PublicIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { GithubRepository } from '../../services/github/api';
import './RepoList.css';

interface RepoListProps {
  repositories: GithubRepository[];
  onSelect: (repo: GithubRepository) => void;
}

const RepoList: React.FC<RepoListProps> = ({ repositories, onSelect }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <List className="repo-list">
      {repositories.map(repo => (
        <ListItem 
          key={repo.id} 
          button 
          onClick={() => onSelect(repo)}
          className="repo-item"
        >
          <ListItemIcon>
            {repo.private ? <LockIcon /> : <PublicIcon />}
          </ListItemIcon>
          
          <ListItemText
            primary={
              <Typography variant="subtitle1">
                {repo.name}
                {repo.language && (
                  <Tooltip title={`Langage principal: ${repo.language}`}>
                    <span className="language-indicator">
                      <CodeIcon fontSize="small" />
                      {repo.language}
                    </span>
                  </Tooltip>
                )}
              </Typography>
            }
            secondary={`Mis à jour le ${formatDate(repo.updated_at)}`}
          />

          <ListItemSecondaryAction>
            <IconButton edge="end" onClick={() => window.open(repo.html_url, '_blank')}>
              <StarIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};