import React, { useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { darkTheme } from './theme';
import Splash from './splash/Splash';
import Welcome from './screens/Welcome/Welcome';
import ProjectSelect from './screens/ProjectSelect/ProjectSelect';
import MainLayout from './layouts/MainLayout';

type AppState = 'splash' | 'welcome' | 'select-project' | 'main';
type ProjectMode = 'github' | 'local';

interface AppData {
  mode?: ProjectMode;
  githubToken?: string;
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
    setAppData({ mode: 'github', githubToken: token });
    setAppState('select-project');
  };

  const handleLocalMode = () => {
    setAppData({ mode: 'local' });
    setAppState('select-project');
  };

  const handleProjectSelect = (projectInfo: any) => {
    // TODO: Stocker les infos du projet
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
      
      {appState === 'select-project' && appData.mode && (
        <ProjectSelect
          mode={appData.mode}
          githubToken={appData.githubToken}
          onProjectSelect={handleProjectSelect}
        />
      )}
      
      {appState === 'main' && <MainLayout />}
    </ThemeProvider>
  );
};

export default App;