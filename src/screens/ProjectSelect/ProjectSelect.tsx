import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Button, CircularProgress, Dialog, TextField, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Close, Remove, Folder, Add, AccessTime } from '@mui/icons-material';
import { ProjectConfig, ProjectInfo } from '@shared/types';
import './ProjectSelect.css';

interface ProjectSelectProps {
  mode: 'github' | 'local';
  githubToken?: string;
  onProjectSelect: (project: ProjectInfo) => void;
}

export const ProjectSelect: React.FC<ProjectSelectProps> = ({ mode, githubToken, onProjectSelect }) => {
  const [loading, setLoading] = useState(false);
  const [recentProjects, setRecentProjects] = useState<ProjectInfo[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRecentProjects();
  }, []);

  const loadRecentProjects = async () => {
    try {
      setLoading(true);
      const projects = await window.electron.projects.getRecent();
      setRecentProjects(projects.filter(p => p.type === mode));
      setError(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to load recent projects:', error);
      setError(`Erreur lors du chargement des projets récents : ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenProject = async () => {
    try {
      const path = await window.electron.projects.selectDirectory();
      if (!path) return;

      setLoading(true);
      const project = await window.electron.projects.open(path);
      onProjectSelect(project);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to open project:', error);
      setError(`Erreur lors de l\'ouverture du projet : ${errorMessage}`);
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    try {
      const path = await window.electron.projects.selectDirectory();
      if (!path) return;

      setLoading(true);
      const config: ProjectConfig = {
        name: newProjectName || path.split('/').pop() || 'New Project',
        type: mode,
      };

      const project = await window.electron.projects.create(path, config);
      onProjectSelect(project);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to create project:', error);
      setError(`Erreur lors de la création du projet : ${errorMessage}`);
      setLoading(false);
    }
    setCreateDialogOpen(false);
  };

  const handleRecentProjectSelect = async (project: ProjectInfo) => {
    try {
      setLoading(true);
      const updatedProject = await window.electron.projects.open(project.path);
      onProjectSelect(updatedProject);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to open recent project:', error);
      setError(`Erreur lors de l'ouverture du projet : ${errorMessage}`);
      setLoading(false);
      loadRecentProjects(); // Recharger la liste si le projet n'est plus valide
    }
  };

  return (
    <Box className="project-select-container">
      <Box className="window-controls">
        <IconButton 
          onClick={() => window.electron.minimize()}
          size="small"
          sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
        >
          <Remove />
        </IconButton>
        <IconButton 
          onClick={() => window.electron.close()}
          size="small"
          sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
        >
          <Close />
        </IconButton>
      </Box>

      <Box className="header">
        <Typography variant="h4" component="h1" sx={{ mb: 1 }}>
          {mode === 'github' ? 'Projet GitHub' : 'Projet Local'}
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.7 }}>
          {mode === 'github' 
            ? 'Créez un nouveau projet à partir d\'un repository GitHub' 
            : 'Créez un nouveau projet ou ouvrez un projet existant'}
        </Typography>
      </Box>

      <Box className="main-actions">
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateDialogOpen(true)}
          disabled={loading}
        >
          Nouveau projet
        </Button>
        <Button
          variant="outlined"
          startIcon={<Folder />}
          onClick={handleOpenProject}
          disabled={loading}
        >
          Ouvrir un projet
        </Button>
      </Box>

      {loading ? (
        <Box className="loading-container">
          <CircularProgress />
          <Typography>Chargement...</Typography>
        </Box>
      ) : error ? (
        <Box className="error-container">
          <Typography color="error">{error}</Typography>
          <Button 
            onClick={loadRecentProjects} 
            startIcon={<AccessTime />}
            variant="outlined"
            size="small"
            sx={{ mt: 1 }}
          >
            Réessayer
          </Button>
        </Box>
      ) : recentProjects.length > 0 ? (
        <Box className="recent-projects">
          <Typography 
            variant="h6" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              mb: 2
            }}
          >
            <AccessTime /> Projets récents
          </Typography>
          <Box className="projects-list">
            {recentProjects.map((project) => (
              <Button
                key={project.path}
                variant="text"
                fullWidth
                onClick={() => handleRecentProjectSelect(project)}
                sx={{ 
                  justifyContent: 'flex-start', 
                  textAlign: 'left', 
                  py: 2,
                  px: 3,
                  mb: 1,
                  borderRadius: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                  <Typography variant="subtitle1">{project.name}</Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      opacity: 0.7,
                      maxWidth: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {project.path}
                  </Typography>
                  {project.gitInfo && (
                    <Typography 
                      variant="caption" 
                      sx={{ opacity: 0.7 }}
                    >
                      Branch: {project.gitInfo.branch}
                    </Typography>
                  )}
                </Box>
              </Button>
            ))}
          </Box>
        </Box>
      ) : (
        <Box 
          className="empty-state"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            opacity: 0.7
          }}
        >
          <Typography variant="h6">
            Aucun projet récent
          </Typography>
          <Typography variant="body2">
            Commencez par créer un nouveau projet ou ouvrez-en un existant
          </Typography>
        </Box>
      )}

      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(30, 30, 30, 0.95)',
            color: 'white',
            p: 2
          }
        }}
      >
        <DialogTitle>
          {mode === 'github' ? 'Nouveau projet GitHub' : 'Nouveau projet local'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom du projet"
            fullWidth
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            variant="outlined"
            sx={{
              mt: 1,
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
            onClick={() => setCreateDialogOpen(false)} 
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Annuler
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateProject}
            disabled={loading}
          >
            Créer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectSelect;