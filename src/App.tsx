import React from 'react';
import { Box } from '@mui/material';
import TitleBar from './components/TitleBar';

const App: React.FC = () => {
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TitleBar />
      <Box sx={{ flex: 1, bgcolor: 'background.default' }}>
        WhisperIDE
      </Box>
    </Box>
  );
};

export default App;