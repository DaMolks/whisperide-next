import { contextBridge, ipcRenderer } from 'electron';
import type { ProjectInfo, ProjectConfig } from '@shared/types';
import type { GitInfo, GitStatus, GitBranch, GitCommitInfo } from '@shared/types/git';
import type { FileEntry } from '@shared/types';

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
