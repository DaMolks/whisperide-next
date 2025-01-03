import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Button, CircularProgress } from '@mui/material';
import { Close, Remove, Folder, GitHub, Refresh } from '@mui/icons-material';
import './ProjectSelect.css';
import '../../styles/shared.css';

export interface Repository {
  id: number;
  name: string;
  description?: string;
  isPrivate: boolean;
  updatedAt: string;
}

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
  const [repositories, setRepositories] = useState<Repository[]>([]);

  useEffect(() => {
    if (mode === 'github' && githubToken) {
      loadGitHubRepositories();
    }
  }, [mode, githubToken]);

  const loadGitHubRepositories = async () => {
    setLoading(true);
    try {
      // TODO: Implémenter la récupération des repos
      setRepositories([]);
    } catch (error) {
      console.error('Failed to load repositories:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="project-select-container gradient-background">
      {/* Contrôles fenêtre */}
      <Box className="window-controls">
        <IconButton onClick={() => window.electron?.minimize()}>
          <Remove />
        </IconButton>
        <IconButton onClick={() => window.electron?.close()}>
          <Close />
        </IconButton>
      </Box>

      {/* En-tête */}
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

      {/* Actions principales */}
      <Box className="main-actions">
        {mode === 'github' ? (
          <Button
            variant="contained"
            startIcon={<GitHub />}
            onClick={() => {}}
          >
            Nouveau dépôt
          </Button>
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

      {/* Liste des projets */}
      <Box className="projects-list">
        {loading ? (
          <Box className="loading-container">
            <CircularProgress />
            <Typography>Chargement des projets...</Typography>
          </Box>
        ) : repositories.length > 0 ? (
          <Box>Liste des repos à implémenter</Box>
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