import React, { useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { darkTheme } from './theme';
import Welcome from './screens/Welcome/Welcome';
import MainLayout from './layouts/MainLayout';

type AppState = 'welcome' | 'main';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('welcome');

  const handleGitHubLogin = () => {
    setAppState('main');
  };

  const handleLocalMode = () => {
    setAppState('main');
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      
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