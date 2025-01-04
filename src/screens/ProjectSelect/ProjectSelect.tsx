import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Button, CircularProgress, Dialog, TextField } from '@mui/material';
import { Close, Remove, Folder, Add, AccessTime } from '@mui/icons-material';
import { ProjectInfo } from '../../../electron/services/project-manager';
import './ProjectSelect.css';

interface ProjectSelectProps {
  onProjectSelect: (project: ProjectInfo) => void;
}

export const ProjectSelect: React.FC<ProjectSelectProps> = ({ onProjectSelect }) => {
  const [loading, setLoading] = useState(true);
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
      setRecentProjects(projects);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des projets récents');
      console.error('Failed to load recent projects:', err);
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
    } catch (err) {
      setError('Erreur lors de l\'ouverture du projet');
      console.error('Failed to open project:', err);
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    try {
      const path = await window.electron.projects.selectDirectory();
      if (!path) return;

      setLoading(true);
      const project = await window.electron.projects.create(path, {
        name: newProjectName || undefined
      });
      onProjectSelect(project);
    } catch (err) {
      setError('Erreur lors de la création du projet');
      console.error('Failed to create project:', err);
      setLoading(false);
    }
    setCreateDialogOpen(false);
  };

  const handleRecentProjectSelect = async (project: ProjectInfo) => {
    try {
      setLoading(true);
      // Vérifie si le projet existe toujours
      const updatedProject = await window.electron.projects.open(project.path);
      onProjectSelect(updatedProject);
    } catch (err) {
      setError(`Erreur lors de l'ouverture du projet : ${project.name}`);
      console.error('Failed to open recent project:', err);
      setLoading(false);
      // Recharge la liste pour retirer les projets invalides
      loadRecentProjects();
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
          Sélectionner un projet
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.7 }}>
          Ouvrez un projet existant ou créez-en un nouveau
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
          <Typography>Chargement des projets...</Typography>
        </Box>
      ) : error ? (
        <Box className="error-container">
          <Typography color="error">{error}</Typography>
          <Button
            variant="outlined"
            onClick={loadRecentProjects}
            startIcon={<AccessTime />}
          >
            Réessayer
          </Button>
        </Box>
      ) : recentProjects.length > 0 ? (
        <Box className="recent-projects">
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTime /> Projets récents
          </Typography>
          <Box className="projects-list">
            {recentProjects.map((project) => (
              <Button
                key={project.id}
                variant="text"
                fullWidth
                onClick={() => handleRecentProjectSelect(project)}
                sx={{ 
                  justifyContent: 'flex-start', 
                  textAlign: 'left', 
                  py: 2,
                  px: 3,
                  borderRadius: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="subtitle1">{project.name}</Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      opacity: 0.7,
                      maxWidth: '500px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {project.path}
                  </Typography>
                  {project.gitInfo?.isGitRepo && (
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        opacity: 0.7,
                        color: project.gitInfo.hasChanges ? '#ffd700' : '#4caf50'
                      }}
                    >
                      Branch: {project.gitInfo.branch}
                      {project.gitInfo.hasChanges && ' (modifications non sauvegardées)'}
                    </Typography>
                  )}
                </Box>
              </Button>
            ))}
          </Box>
        </Box>
      ) : (
        <Box className="empty-state">
          <Typography variant="h6">
            Aucun projet récent
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
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
            p: 3
          }
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Créer un nouveau projet
        </Typography>
        <TextField
          fullWidth
          label="Nom du projet"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          sx={{
            mb: 3,
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
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
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
        </Box>
      </Dialog>
    </Box>
  );
};

export default ProjectSelect;