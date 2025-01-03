import React from 'react';
import { Box } from '@mui/material';
import TitleBar from '../components/TitleBar/TitleBar';
import SplitPane from '../components/layout/SplitPane';
import FileExplorer from '../components/FileExplorer/FileExplorer';
import Editor from '../components/Editor/Editor';
import Terminal from '../components/Terminal/Terminal';
import AIChat from '../components/AIChat/AIChat';

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
      
      {/* Container principal */}
      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
        {/* SplitPane principal : Explorer | Main */}
        <SplitPane
          defaultSplit={0.2}
          left={<FileExplorer />}
          right={
            <SplitPane
              direction="vertical"
              defaultSplit={0.8}
              left={
                <SplitPane
                  defaultSplit={0.8}
                  left={<Editor />}
                  right={<AIChat />}
                />
              }
              right={<Terminal />}
            />
          }
        />
      </Box>
    </Box>
  );
};

export default MainLayout;