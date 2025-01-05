import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Button, CircularProgress, Dialog, TextField } from '@mui/material';
import { Close, Remove, Folder, Add, AccessTime } from '@mui/icons-material';
import { ProjectInfo } from '@shared/types';
import './ProjectSelect.css';

interface ProjectSelectProps {
  mode: 'github' | 'local';
  githubToken?: string;
  onProjectSelect: (project: ProjectInfo) => void;
}

export const ProjectSelect: React.FC<ProjectSelectProps> = ({ mode, githubToken, onProjectSelect }) => {
  // ... [Code précédent jusqu'à la fin du rendu Dialog]

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