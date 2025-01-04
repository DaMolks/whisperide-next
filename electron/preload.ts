import { contextBridge, ipcRenderer } from 'electron';
import type { ProjectInfo, ProjectConfig } from './services/project-manager';
import type { GitInfo } from './services/git';
import type { FileEntry } from './services/file-system';

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
  },

  // Système de fichiers
  files: {
    list: (path: string) => 
      ipcRenderer.invoke('list-files', path) as Promise<FileEntry[]>,
    read: (path: string) => 
      ipcRenderer.invoke('read-file', path) as Promise<string>,
    write: (path: string, content: string) => 
      ipcRenderer.invoke('write-file', path, content) as Promise<void>,
    createFile: (path: string) => 
      ipcRenderer.invoke('create-file', path) as Promise<void>,
    createDirectory: (path: string) => 
      ipcRenderer.invoke('create-directory', path) as Promise<void>,
    rename: (oldPath: string, newPath: string) => 
      ipcRenderer.invoke('rename-file', oldPath, newPath) as Promise<void>,
    delete: (path: string) => 
      ipcRenderer.invoke('delete-file', path) as Promise<void>
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
      files: {
        list: (path: string) => Promise<FileEntry[]>;
        read: (path: string) => Promise<string>;
        write: (path: string, content: string) => Promise<void>;
        createFile: (path: string) => Promise<void>;
        createDirectory: (path: string) => Promise<void>;
        rename: (oldPath: string, newPath: string) => Promise<void>;
        delete: (path: string) => Promise<void>;
      };
    };
  }
}