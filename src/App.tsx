import React, { useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { darkTheme } from './theme';
import Splash from './splash/Splash';
import Welcome from './screens/Welcome/Welcome';
import MainLayout from './layouts/MainLayout';
import Transition from './components/Transition';

type AppState = 'splash' | 'welcome' | 'main';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('splash');
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
    setAppState('welcome');
  };

  const handleGitHubLogin = () => {
    // TODO: Implémenter login GitHub
    setAppState('main');
  };

  const handleLocalMode = () => {
    setAppState('main');
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      
      {appState === 'splash' && (
        <Transition show={showSplash} onComplete={handleSplashComplete}>
          <Splash />
        </Transition>
      )}

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