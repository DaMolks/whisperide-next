import { contextBridge, ipcRenderer } from 'electron';
import type { FileEntry, ProjectConfig, ProjectInfo } from '../shared/types';
import type { GitInfo, GitStatus, GitBranch, GitCommitInfo } from '../shared/types/git';

type WindowElectronAPI = {
  window: {
    close: () => void;
    minimize: () => void;
    maximize: () => void;
  };
  githubAuth: {
    login: () => Promise<string>;
  };
  projects: {
    getRecent: () => Promise<ProjectInfo[]>;
    open: (path: string) => Promise<ProjectInfo>;
    create: (path: string, config?: ProjectConfig) => Promise<ProjectInfo>;
    selectDirectory: () => Promise<string | null>;
  };
  git: {
    isInstalled: () => Promise<boolean>;
    getInfo: (path: string) => Promise<GitInfo>;
    getStatus: (path: string) => Promise<GitStatus>;
    stage: (path: string, files: string[]) => Promise<void>;
    unstage: (path: string, files: string[]) => Promise<void>;
    commit: (path: string, message: string) => Promise<void>;
    getBranches: (path: string) => Promise<GitBranch[]>;
    createBranch: (path: string, name: string) => Promise<void>;
    checkout: (path: string, branch: string) => Promise<void>;
    getCommitHistory: (path: string, count?: number) => Promise<GitCommitInfo[]>;
    getDiff: (path: string, file: string) => Promise<string>;
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

declare global {
  interface Window {
    electron: WindowElectronAPI;
  }
}

contextBridge.exposeInMainWorld('electron', {
  window: {
    close: () => ipcRenderer.send('window-close'),
    minimize: () => ipcRenderer.send('window-minimize'),
    maximize: () => ipcRenderer.send('window-maximize')
  },

  githubAuth: {
    login: () => ipcRenderer.invoke('github-auth-login')
  },

  projects: {
    getRecent: () => ipcRenderer.invoke('get-recent-projects'),
    open: (path: string) => ipcRenderer.invoke('open-project', path),
    create: (path: string, config?: ProjectConfig) => 
      ipcRenderer.invoke('create-project', { path, config }),
    selectDirectory: () => ipcRenderer.invoke('select-directory')
  },

  git: {
    isInstalled: () => ipcRenderer.invoke('git-is-installed'),
    getInfo: (path: string) => ipcRenderer.invoke('git-info', path),
    getStatus: (path: string) => ipcRenderer.invoke('git-status', path),
    stage: (path: string, files: string[]) => 
      ipcRenderer.invoke('git-stage', path, files),
    unstage: (path: string, files: string[]) => 
      ipcRenderer.invoke('git-unstage', path, files),
    commit: (path: string, message: string) => 
      ipcRenderer.invoke('git-commit', path, message),
    getBranches: (path: string) => 
      ipcRenderer.invoke('git-branches', path),
    createBranch: (path: string, name: string) => 
      ipcRenderer.invoke('git-create-branch', path, name),
    checkout: (path: string, branch: string) => 
      ipcRenderer.invoke('git-checkout', path, branch),
    getCommitHistory: (path: string, count?: number) => 
      ipcRenderer.invoke('git-history', path, count),
    getDiff: (path: string, file: string) => 
      ipcRenderer.invoke('git-diff', path, file)
  },

  files: {
    list: (path: string) => 
      ipcRenderer.invoke('list-files', path),
    read: (path: string) => 
      ipcRenderer.invoke('read-file', path),
    write: (path: string, content: string) => 
      ipcRenderer.invoke('write-file', path, content),
    createFile: (path: string) => 
      ipcRenderer.invoke('create-file', path),
    createDirectory: (path: string) => 
      ipcRenderer.invoke('create-directory', path),
    rename: (oldPath: string, newPath: string) => 
      ipcRenderer.invoke('rename-file', oldPath, newPath),
    delete: (path: string) => 
      ipcRenderer.invoke('delete-file', path)
  }
});