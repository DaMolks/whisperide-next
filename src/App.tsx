import React, { useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { darkTheme } from './theme';
import Splash from './splash/Splash';
import Welcome from './screens/Welcome/Welcome';
import MainLayout from './layouts/MainLayout';

type AppState = 'splash' | 'welcome' | 'select-project' | 'main';

interface AppData {
  githubToken?: string;
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('splash');
  const [appData, setAppData] = useState<AppData>({});

  // Timer pour simuler le chargement
  React.useEffect(() => {
    if (appState === 'splash') {
      const timer = setTimeout(() => {
        setAppState('welcome');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [appState]);

  const handleGitHubLogin = (token: string) => {
    setAppData({ ...appData, githubToken: token });
    setAppState('select-project');
  };

  const handleLocalMode = () => {
    setAppState('select-project');
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
      {/* TODO: Ajouter SelectProject screen */}
      {appState === 'select-project' && (
        <div>Project Selection (à implémenter)</div>
      )}
      {appState === 'main' && <MainLayout />}
    </ThemeProvider>
  );
};

export default App;