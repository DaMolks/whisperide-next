import React, { useState } from 'react';
import { Box } from '@mui/material';
import SplitPane from '../components/layout/SplitPane';
import FileExplorer from '../components/FileExplorer/FileExplorer';
import Editor from '../components/Editor/Editor';
import GitPanel from '../components/GitPanel/GitPanel';

interface MainLayoutProps {
  project: {
    path: string;
    name: string;
  };
}

const MainLayout: React.FC<MainLayoutProps> = ({ project }) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleFileSelect = (filePath: string) => {
    setSelectedFile(filePath);
  };

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
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden'
        }}
      >
        <SplitPane
          defaultSize={240}
          min={200}
          max={400}
          split="vertical"
        >
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <FileExplorer
              projectPath={project.path}
              onFileSelect={handleFileSelect}
            />
          </Box>
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <SplitPane
              defaultSize={240}
              min={200}
              max={400}
              split="vertical"
              primary="second"
            >
              <Editor
                filePath={selectedFile}
                key={selectedFile || 'no-file'}
              />
              <GitPanel projectPath={project.path} />
            </SplitPane>
          </Box>
        </SplitPane>
      </Box>
    </Box>
  );
};

export default MainLayout;