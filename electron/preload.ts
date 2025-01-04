import { contextBridge, ipcRenderer } from 'electron';
import type { ProjectInfo, ProjectConfig } from './services/project-manager';
import type { GitInfo } from './services/git';

contextBridge.exposeInMainWorld('electron', {
  // Contrôles de fenêtre
  close: () => ipcRenderer.send('window-close'),
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  
  // Gestion de projet
  projects: {
    getRecent: () => ipcRenderer.invoke('get-recent-projects') as Promise<ProjectInfo[]>,
    open: (path: string) => ipcRenderer.invoke('open-project', path) as Promise<ProjectInfo>,
    create: (path: string, config?: ProjectConfig) => 
      ipcRenderer.invoke('create-project', path, config) as Promise<ProjectInfo>,
    selectDirectory: () => 
      ipcRenderer.invoke('select-directory') as Promise<string | null>
  },

  // Git
  git: {
    isInstalled: () => ipcRenderer.invoke('check-git') as Promise<boolean>,
    getInfo: (path: string) => 
      ipcRenderer.invoke('get-git-info', path) as Promise<GitInfo>
  }
});

// Types pour TypeScript
declare global {
  interface Window {
    electron: {
      close: () => void;
      minimize: () => void;
      maximize: () => void;
      projects: {
        getRecent: () => Promise<ProjectInfo[]>;
        open: (path: string) => Promise<ProjectInfo>;
        create: (path: string, config?: ProjectConfig) => Promise<ProjectInfo>;
        selectDirectory: () => Promise<string | null>;
      };
      git: {
        isInstalled: () => Promise<boolean>;
        getInfo: (path: string) => Promise<GitInfo>;
      };
    };
  }
}