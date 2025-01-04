import React, { useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { darkTheme } from './theme';
import Splash from './splash/Splash';
import Welcome from './screens/Welcome/Welcome';
import ProjectSelect from './screens/ProjectSelect/ProjectSelect';
import MainLayout from './layouts/MainLayout';
import { ProjectInfo, ProjectMode } from '@shared/types';

type AppState = 'splash' | 'welcome' | 'select-project' | 'main';

interface AppData {
  projectMode?: ProjectMode;
  githubToken?: string;
  currentProject?: ProjectInfo;
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('splash');
  const [appData, setAppData] = useState<AppData>({});

  React.useEffect(() => {
    if (appState === 'splash') {
      const timer = setTimeout(() => {
        setAppState('welcome');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [appState]);

  const handleGitHubLogin = (token: string) => {
    setAppData({
      projectMode: { mode: 'github', githubToken: token },
      githubToken: token
    });
    setAppState('select-project');
  };

  const handleLocalMode = () => {
    setAppData({
      projectMode: { mode: 'local' }
    });
    setAppState('select-project');
  };

  const handleProjectSelect = (projectInfo: ProjectInfo) => {
    setAppData(prev => ({ ...prev, currentProject: projectInfo }));
    setAppState('main');
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      
      {appState === 'splash' && <Splash />}
      
      {appState === 'welcome' && (
        <Welcome
          onGitHubLogin={handleGitHubLogin}
          onLocalMode={handleLocalMode}
        />
      )}
      
      {appState === 'select-project' && appData.projectMode && (
        <ProjectSelect
          mode={appData.projectMode.mode}
          githubToken={appData.projectMode.githubToken}
          onProjectSelect={handleProjectSelect}
        />
      )}
      
      {appState === 'main' && appData.currentProject && (
        <MainLayout 
          project={appData.currentProject}
        />
      )}
    </ThemeProvider>
  );
};

export default App;