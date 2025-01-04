import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Button, CircularProgress, Divider } from '@mui/material';
import { Close, Remove, Folder, GitHub, Refresh, AccessTime } from '@mui/icons-material';
import { GithubAPI, GithubRepository } from '../../services/github/api';
import { ProjectManager } from '../../services/projects/ProjectManager';
import { ProjectInfo } from '../../services/projects/types';
import RepoList from '../../components/RepoList/RepoList';
import './ProjectSelect.css';
import '../../styles/shared.css';

interface ProjectSelectProps {
  mode: 'github' | 'local';
  githubToken?: string;
  onProjectSelect: (projectInfo: ProjectInfo) => void;
}

const ProjectSelect: React.FC<ProjectSelectProps> = ({ 
  mode, 
  githubToken,
  onProjectSelect 
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [repositories, setRepositories] = useState<GithubRepository[]>([]);
  const [recentProjects, setRecentProjects] = useState<ProjectInfo[]>([]);

  // Charger les projets récents
  useEffect(() => {
    loadRecentProjects();
  }, []);

  // Charger les dépôts GitHub si nécessaire
  useEffect(() => {
    if (mode === 'github' && githubToken) {
      loadGitHubRepositories();
    }
  }, [mode, githubToken]);

  const loadRecentProjects = async () => {
    try {
      const projects = await ProjectManager.getRecentProjects();
      setRecentProjects(projects);
    } catch (error) {
      console.error('Failed to load recent projects:', error);
    }
  };

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

  const handleCreateRepo = async () => {
    if (!githubToken) return;
    
    try {
      const repoName = prompt('Nom du nouveau dépôt:');
      if (!repoName) return;

      setLoading(true);
      const newRepo = await GithubAPI.createRepository(githubToken, repoName);
      const projectInfo = await ProjectManager.cloneAndOpenGithubRepo(newRepo, githubToken);
      onProjectSelect(projectInfo);
    } catch (err) {
      setError('Erreur lors de la création du dépôt');
      console.error('Failed to create repository:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubProjectSelect = async (repo: GithubRepository) => {
    try {
      setLoading(true);
      const projectInfo = await ProjectManager.cloneAndOpenGithubRepo(repo, githubToken!);
      onProjectSelect(projectInfo);
    } catch (error) {
      setError('Erreur lors du clonage du dépôt');
      console.error('Failed to clone repository:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocalProjectSelect = async () => {
    try {
      const path = await window.electron?.selectDirectory();
      if (!path) return;
      
      setLoading(true);
      const projectInfo = await ProjectManager.openLocalProject(path);
      onProjectSelect(projectInfo);
    } catch (error) {
      setError('Erreur lors de l\'ouverture du projet');
      console.error('Failed to open project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecentProjectSelect = async (project: ProjectInfo) => {
    try {
      setLoading(true);
      // Vérifier si le projet existe toujours
      const projectInfo = await ProjectManager.openLocalProject(project.path);
      onProjectSelect(projectInfo);
    } catch (error) {
      setError('Erreur lors de l\'ouverture du projet récent');
      console.error('Failed to open recent project:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="project-select-container gradient-background">
      <Box className="window-controls">
        <IconButton 
          onClick={() => window.electron?.minimize()}
          size="small"
          sx={{ color: 'rgba(255,255,255,0.7)' }}
        >
          <Remove />
        </IconButton>
        <IconButton 
          onClick={() => window.electron?.close()}
          size="small"
          sx={{ color: 'rgba(255,255,255,0.7)' }}
        >
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
            'Ouvrez un projet local ou sélectionnez un projet récent'}
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
            onClick={handleLocalProjectSelect}
            disabled={loading}
          >
            Ouvrir un dossier
          </Button>
        )}
      </Box>

      {/* Projets récents */}
      {recentProjects.length > 0 && mode === 'local' && (
        <Box className="recent-projects">
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTime /> Projets récents
          </Typography>
          <Box className="projects-list">
            {recentProjects.map((project) => (
              <Button
                key={project.id}
                variant="text"
                fullWidth
                onClick={() => handleRecentProjectSelect(project)}
                sx={{ justifyContent: 'flex-start', textAlign: 'left', py: 1 }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="subtitle1">{project.name}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    {project.path}
                  </Typography>
                </Box>
              </Button>
            ))}
          </Box>
        </Box>
      )}

      {/* Liste des dépôts GitHub */}
      {mode === 'github' && (
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
              onSelect={handleGitHubProjectSelect}
            />
          ) : (
            <Box className="empty-state">
              <Typography variant="h6">
                Aucun dépôt trouvé
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ProjectSelect;