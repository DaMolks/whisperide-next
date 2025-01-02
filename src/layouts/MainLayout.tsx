import React, { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import TitleBar from '../components/TitleBar/TitleBar';

// Dynamically import components to reduce initial load
const SplitPane = React.lazy(() => import('../components/layout/SplitPane'));
const FileExplorer = React.lazy(() => import('../components/FileExplorer/FileExplorer'));
const Editor = React.lazy(() => import('../components/Editor/Editor'));
const Terminal = React.lazy(() => import('../components/Terminal/Terminal'));
const AIChat = React.lazy(() => import('../components/AIChat/AIChat'));

const MainLayout: React.FC = () => {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        bgcolor: 'background.default'
      }}
    >
      <TitleBar />
      
      <Suspense fallback={
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%'
        }}>
          <CircularProgress />
        </Box>
      }>
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          <SplitPane
            left={<FileExplorer />}
            right={
              <Box sx={{ display: 'flex', height: '100%' }}>
                <SplitPane
                  direction="vertical"
                  defaultSplit={0.7}
                  left={
                    <SplitPane
                      defaultSplit={0.7}
                      left={<Editor />}
                      right={<AIChat />}
                    />
                  }
                  right={<Terminal />}
                />
              </Box>
            }
          />
        </Box>
      </Suspense>
    </Box>
  );
};

export default MainLayout;