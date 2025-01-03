import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { darkTheme } from './theme';
import Splash from './splash/Splash';
import Welcome from './screens/Welcome/Welcome';
import MainLayout from './layouts/MainLayout';

type AppState = 'splash' | 'welcome' | 'main';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('splash');

  useEffect(() => {
    if (appState === 'splash') {
      const timer = setTimeout(() => {
        setAppState('welcome');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [appState]);

  const handleGitHubLogin = () => {
    setAppState('main');
  };

  const handleLocalMode = () => {
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
      {appState === 'main' && <MainLayout />}
    </ThemeProvider>
  );
};

export default App;