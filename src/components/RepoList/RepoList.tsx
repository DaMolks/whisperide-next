import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  ListItemIcon,
  Typography,
  Chip
} from '@mui/material';
import { Code, Public, Lock } from '@mui/icons-material';
import { GithubRepository } from '../../services/github/api';
import './RepoList.css';

interface RepoListProps {
  repositories: GithubRepository[];
  onSelect: (repo: GithubRepository) => void;
}

const RepoList: React.FC<RepoListProps> = ({ repositories, onSelect }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <List className="repo-list">
      {repositories.map((repo) => (
        <ListItem key={repo.id} disablePadding className="repo-item">
          <ListItemButton onClick={() => onSelect(repo)}>
            <ListItemIcon>
              {repo.private ? <Lock /> : <Public />}
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="subtitle1">
                  {repo.name}
                  {repo.language && (
                    <Chip
                      icon={<Code />}
                      label={repo.language}
                      size="small"
                      className="language-chip"
                    />
                  )}
                </Typography>
              }
              secondary={
                <Typography variant="body2" className="repo-description">
                  {repo.description || 'Aucune description'}
                  <br />
                  <span className="update-date">
                    Mis à jour le {formatDate(repo.updated_at)}
                  </span>
                </Typography>
              }
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default RepoList;