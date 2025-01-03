import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Button, CircularProgress } from '@mui/material';
import { Close, Remove, Folder, GitHub, Refresh } from '@mui/icons-material';
import { GithubAPI, GithubRepository } from '../../services/github/api';
import RepoList from '../../components/RepoList/RepoList';
import './ProjectSelect.css';
import '../../styles/shared.css';

interface ProjectSelectProps {
  mode: 'github' | 'local';
  githubToken?: string;
  onProjectSelect: (projectInfo: any) => void;
}

const ProjectSelect: React.FC<ProjectSelectProps> = ({ 
  mode, 
  githubToken,
  onProjectSelect 
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [repositories, setRepositories] = useState<GithubRepository[]>([]);

  const loadGitHubRepositories = async () => {
    if (!githubToken) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const repos = await GithubAPI.getUserRepositories(githubToken);
      setRepositories(repos);
    } catch (err) {
      setError('Erreur lors du chargement des dépôts');
      console.error('Failed to load repositories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mode === 'github' && githubToken) {
      loadGitHubRepositories();
    }
  }, [mode, githubToken]);

  const handleCreateRepo = async () => {
    if (!githubToken) return;
    
    try {
      const repoName = prompt('Nom du nouveau dépôt:');
      if (!repoName) return;

      setLoading(true);
      const newRepo = await GithubAPI.createRepository(githubToken, repoName);
      await loadGitHubRepositories();
      onProjectSelect(newRepo);
    } catch (err) {
      setError('Erreur lors de la création du dépôt');
      console.error('Failed to create repository:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="project-select-container gradient-background">
      <Box className="window-controls">
        <IconButton onClick={() => window.electron?.minimize()}>
          <Remove />
        </IconButton>
        <IconButton onClick={() => window.electron?.close()}>
          <Close />
        </IconButton>
      </Box>

      <Box className="header">
        <Typography variant="h4" component="h1">
          {mode === 'github' ? 'Sélectionner un dépôt' : 'Sélectionner un projet'}
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.7 }}>
          {mode === 'github' ? 
            'Choisissez un dépôt GitHub à ouvrir ou créez-en un nouveau' : 
            'Ouvrez un projet local ou initialisez un nouveau dépôt'}
        </Typography>
      </Box>

      <Box className="main-actions">
        {mode === 'github' ? (
          <>
            <Button
              variant="contained"
              startIcon={<GitHub />}
              onClick={handleCreateRepo}
              disabled={loading}
            >
              Nouveau dépôt
            </Button>
            <IconButton
              onClick={loadGitHubRepositories}
              disabled={loading}
            >
              <Refresh />
            </IconButton>
          </>
        ) : (
          <Button
            variant="contained"
            startIcon={<Folder />}
            onClick={() => {}}
          >
            Ouvrir un dossier
          </Button>
        )}
      </Box>

      <Box className="projects-list">
        {loading ? (
          <Box className="loading-container">
            <CircularProgress />
            <Typography>Chargement des projets...</Typography>
          </Box>
        ) : error ? (
          <Box className="error-container">
            <Typography color="error">{error}</Typography>
            <Button
              variant="outlined"
              onClick={loadGitHubRepositories}
              startIcon={<Refresh />}
            >
              Réessayer
            </Button>
          </Box>
        ) : repositories.length > 0 ? (
          <RepoList 
            repositories={repositories}
            onSelect={onProjectSelect}
          />
        ) : (
          <Box className="empty-state">
            <Typography variant="h6">
              {mode === 'github' ? 
                'Aucun dépôt trouvé' : 
                'Aucun projet récent'}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ProjectSelect;